/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Pdf from 'react-native-pdf';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_BASE_URL} from '../utils/api';

const COLORS = {
  primary: '#0B5FB3',
  primaryDark: '#084A8C',
  primaryLight: '#EAF3FC',
  completed: '#63B65D',
  disabledBackground: '#EFF2F4',

  accent: '#138ACB',
  green: '#33B86B',
  greenLight: '#EAF8F0',

  ceoHeader: '#6c7681',

  background: '#F4F6F8',
  card: '#FFFFFF',

  textPrimary: '#1F2937',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  border: '#D9E0E7',
  tableHeader: '#3F4A54',
  tableAlternate: '#F8FAFC',

  warning: '#E65100',
  danger: '#D32F2F',

  inputBackground: '#FFFFFF',
};

type TableRow = {
  id: number;
  title: string;
  approved: string;
  actual: string;
};

type PreviewFormQuestion = {
  rdFormQuestionID: string;
  rdFormQuestionName: string;
  rdFormElementNo: string;
  rdFormLableName: string;
  rdFormElementId: string;
  elementmstid: string;
  loadSubMenu: any;
};

type PreviewFormQuestionID = {
  questionID: number;
  ansSum: string;
  isFromFinalSubmitFlag: string;
  formName?: string;
};

type PreviewTextBox = {
  textBoxName: string;
  textBoxVal: string;
  validationType: string;
  formNo: string;
  questionId: string;
  elementMstId: string;
};

type PreviewDropDown = {
  ddId: string;
  ddText: string;
  ddVal: string | null;
  formNo: string;
  questionId: string;
  elementMstId: string;
};

type PreviewCheckList = {
  chkID: string;
  chkText: string;
  chkVal: boolean;
  formNo: string;
  questionId: string;
  elementMstId: string;
};

type PreviewDocument = {
  userDocumentID: string | null;
  formNo: string;
  questionId: string;
  elementMstId: string;
  docKey: string;
  fileUrl: string;
};

type PreviewTable = {
  quesionID: string;
  elementmstid: string;
  rdtblElementId: string;
  rdtblTotalTableRowsNum: string;
  rdtblTotalTableColumnsNum: string;
  rdtblTableRowsNum: string;
  rdtblTableColumnsNum: string;
  rdtblInputType: string;
  rdtblTableFieldName: string;
  rdtblElementVal: string | null;
  rdtblDocumentLink: string | null;
};

type PreviewFormResponse = {
  formQuestionID: PreviewFormQuestionID[];
  filteredFormQuestionID?: PreviewFormQuestionID[];

  previewFormQuestionLst: PreviewFormQuestion[];
  previewForm_CheckList: PreviewCheckList[];
  previewForm_TextBoxList: PreviewTextBox[];
  previewForm_DropDownList: PreviewDropDown[];
  previewForm_DocumentList?: PreviewDocument[];
  previewForm_TableList?: PreviewTable[];
  bdoSheraVal?: string;
};
interface Step {
  srNo: number;
  questionid: number;
  anssum: number;
}

interface QuestionItem {
  questionID: string;
  ansSum: string;
  isFromFinalSubmitFlag: string;
  formName: string;
  tooltip: string;
  formNo: string;
  lgdCode: string;
  panchayatUserId: string;
  currentUserID: string;
  peoplegrade: string;
  bdoUserId: string;
  panchayatUserTaluka: string;
  isSubmitButtonDisable: string | null;
}

const BDO_ELEMENT = {
  TEXTBOX: '1',
  DROPDOWN: '2',
  CHECKBOX: '3',
  DOCUMENT: '4',
  TABLE: '5',
  LABEL: '6',
  DATEPICKER: '7',
};

const CEOForm = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { userID, token, username } = useAuth();
  const { villageId, villageName, formNo, bdoUserName, bdouserid } =
    route.params || {};

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [gpExpanded, setGpExpanded] = useState(false);
  const [bdoExpanded, setBdoExpanded] = useState(false);
  const [ceoExpanded, setCeoExpanded] = useState(false);
  const [questionDetails, setQuestionDetails] = useState<any[]>([]);
  const [copyBDOData, setCopyBDOData] = useState(false);

  const [bdoremarks, setBDORemarks] = useState('');
  const [remarks, setRemarks] = useState('');
  const [originalRemarks, setOriginalRemarks] = useState('');
  const [elementValues, setElementValues] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeForm, setActiveForm] = useState(1);

  const [gpFormData, setGpFormData] = useState<PreviewFormResponse | null>(
    null,
  );
  const [bdoFormData, setBdoFormData] = useState<PreviewFormResponse | null>(
    null,
  );
  const [previewData, setPreviewData] = useState<PreviewFormResponse | null>(
    null,
  );

  const [bdoshera, setbdoshera] = useState('');

  const [gpLoading, setGpLoading] = useState(false);
  const [bdoLoading, setBdoLoading] = useState(false);
  const [ceoLoading, setCeoLoading] = useState(false);

  const [bdoElementValues, setBdoElementValues] = useState<any[]>([]);

  const [originalBdoElementValues, setOriginalBdoElementValues] = useState<
    any[]
  >([]);

  const [tableInputHeights, setTableInputHeights] = useState<{
    [key: string]: number;
  }>({});

  const [tableCellValues, setTableCellValues] = useState<{
    [key: string]: string;
  }>({});

  const [datePickerCell, setDatePickerCell] = useState<string | null>(null);

  const getTableCellKey = (cell: any) => {
    return `${cell?.tableMstId}_${cell?.rdTableRowsNum}_${cell?.rdTableColumnsNum}`;
  };

  const updateTableCellValue = (cell: any, value: string) => {
    const key = getTableCellKey(cell);

    setTableCellValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const safeJsonParse = (text: string) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const fetchQuestionById = async () => {
    setCeoLoading(true);

    try {
      const requestBody = {
        LGDCode: villageName,
        QuestionID: String(activeStepIndex + 1),
        CurrentUseriD: userID,
        PanchayatUserId: String(villageId),
        FormNo: String(formNo),
        RoleId: '4',
        BDOUserName: String(bdoUserName),
      };

      console.log('➡️ Request Body:', requestBody);

      const url = `${API_BASE_URL}/CEOAction/GetFormQuestionByID_Scrutiny`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log('⬅️ Response Status:', res.status);

      const raw = await res.text();
      const data = safeJsonParse(raw);
      console.log('🚀 fetchQuestionById called', data);

      if (data?.responseCode === 2000 && Array.isArray(data.items)) {
        setQuestionDetails(data.items);
      } else {
        setQuestionDetails([]);

        Alert.alert(
          'No Records',
          data?.responseMessage || 'No question records found.',
        );
      }
    } catch (err) {
      console.error('Error fetchQuestionById:', err);
    } finally {
      setCeoLoading(false);
    }
  };

  const getCEOQuestionList = async () => {
    try {
      setLoading(true);

      const url = `${API_BASE_URL}/CEOAction/LoadCEOQuestionList`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            LGDCode: villageName,
            FormNo: String(formNo),
            CurrentUseriD: userID,
            BDOUserName: bdoUserName,
          }),
        },
      );

      const result = await response.json();

      console.log('CEO Question List Response:', result);

      if (result?.responseCode === 2000) {
        setQuestionList(result.items || []);
        if (result.items?.length > 0) {
          setActiveForm(1);
        }

        const stepsArray: Step[] = result.items.map((item: any) => ({
          srNo: item.formNo,
          questionid: item.questionID,
          anssum: Number(item.ansSum) || 0,
        }));

        setSteps(stepsArray);

        console.log('🚀 Steps Array:', stepsArray);

        if (stepsArray.length > 0) {
          setActiveStepIndex(0);
          setActiveForm(1);
          //fetchQuestionById();
        }
      } else {
        Alert.alert(
          'Error',
          result?.responseMessage || 'Unable to fetch question list',
        );
      }
    } catch (error) {
      console.error('Get CEO Question List Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!villageName || !villageId || !token) {
      return;
    }

    getCEOQuestionList();
  }, [villageName, villageId, token]);

  useEffect(() => {
    if (!villageName || !villageId || !token) {
      return;
    }

    if (gpExpanded) {
      fetchGPForm(activeStepIndex + 1);
    }

    if (bdoExpanded) {
      fetchBDOForm(activeStepIndex + 1);
    }

    if (ceoExpanded) {
      fetchQuestionById();
    }
  }, [
    activeStepIndex,
    gpExpanded,
    bdoExpanded,
    ceoExpanded,
    villageName,
    villageId,
    token,
  ]);

  useEffect(() => {
    if (questionDetails?.length > 0 && ceoExpanded) {
      fetchElementValues().then(values => {
        setElementValues(values);
      });
    }
  }, [questionDetails, ceoExpanded]);

  const fetchGPForm = async (questionID: number) => {
    try {
      setGpLoading(true);

      const payload = {
        LGDCode: String(villageName || ''),
        FormNo: String(formNo),
        PanchayatUserId: String(villageId || ''),
        QuestionID: String(questionID),
      };

      console.log('GP API PAYLOAD:', payload);
      console.log(token);

      const url = `${API_BASE_URL}/CEOAction/PreviewPanchayatForm`;

      const response = await fetch(
       url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`GP API Error: ${response.status}`);
      }

      const result: PreviewFormResponse = await response.json();

      console.log('GP API RESPONSE:', result);

      setPreviewData({
        formQuestionID: result.formQuestionID || [],
        previewFormQuestionLst: result.previewFormQuestionLst || [],
        previewForm_TextBoxList: result.previewForm_TextBoxList || [],
        previewForm_DropDownList: result.previewForm_DropDownList || [],
        previewForm_CheckList: result.previewForm_CheckList || [],
        previewForm_TableList: result.previewForm_TableList || [],
        previewForm_DocumentList: result.previewForm_DocumentList || [],
      });

      setGpFormData(result);
    } catch (error) {
      console.error('fetchGPForm error:', error);
      setPreviewData(null);
      Alert.alert('Error', 'ग्रामपंचायत फॉर्म माहिती मिळवता आली नाही.');
    } finally {
      setGpLoading(false);
    }
  };

  const fetchBDOForm = async (questionID: number) => {
    try {
      setBdoLoading(true);

      const payload = {
        BDOUserName: String(bdoUserName || ''),
        LGDCode: String(villageName || ''),
        FormNo: String(formNo),
        QuestionID: String(questionID),
        PanchayatUserId: String(villageId || ''),
        CurrentUseriD: String(userID || ''),
      };

      console.log('BDO API PAYLOAD:', payload);

      const url = `${API_BASE_URL}/CEOAction/PreviewBDOForm`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`BDO API Error: ${response.status}`);
      }

      const result: PreviewFormResponse = await response.json();

      console.log('BDO API RESPONSE:', result);

      setPreviewData({
        formQuestionID: result.formQuestionID || [],
        previewFormQuestionLst: result.previewFormQuestionLst || [],
        previewForm_TextBoxList: result.previewForm_TextBoxList || [],
        previewForm_DropDownList: result.previewForm_DropDownList || [],
        previewForm_CheckList: result.previewForm_CheckList || [],
        previewForm_TableList: result.previewForm_TableList || [],
        previewForm_DocumentList: result.previewForm_DocumentList || [],
      });

      setBdoFormData(result);
      setbdoshera(result.bdoSheraVal || '-');
    } catch (error) {
      console.error('fetchBDOForm error:', error);
      setPreviewData(null);
      // Alert.alert('Error', 'BDO फॉर्म माहिती मिळवता आली नाही.');
    } finally {
      setBdoLoading(false);
    }
  };

  const fetchElementValues = async () => {
    try {
      setCeoLoading(true);
      if (!questionDetails || questionDetails.length === 0) {
        return;
      }

      console.log('token:', token);

      const uniqueElements = questionDetails.filter(
        (item: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (x: any) =>
              String(x.elementmstid) === String(item.elementmstid) &&
              String(x.rdFormElementId) === String(item.rdFormElementId) &&
              String(x.rdFormQuestionID) === String(item.rdFormQuestionID) &&
              String(x.tableMstID || 0) === String(item.tableMstID || 0),
          ),
      );

      const body = questionDetails.map((item: any) => {
        const tableMstID = String(item.tableMstId || 0);
        const questionId = String(item.rdFormQuestionID);
        const currentFormNo = String(formNo);

        const isForm7Or8TableQuestion =
          (currentFormNo === '7' || currentFormNo === '8') &&
          questionId === '1' &&
          tableMstID !== '0';

        const elementId =
          tableMstID !== '0'
            ? String(item.rdTableElementId)
            : String(item.rdFormElementId);

        return {
          ElementMasterId: String(item.elementmstid),
          ElementId: elementId,
          QuestionId: String(activeStepIndex + 1),
          FormNo: currentFormNo,
          TableMstID: tableMstID,
          LGDCode: String(villageName),
          PanchayatUserid: String(villageId),
          RoleID: '4',
          CurrentUserID: String(userID),
          BDOUserID: String(bdouserid),
          BDOUsername: String(bdoUserName),
          isBDOLoadFlag: null,
        };
      });

      console.log('➡️ GetFormsAllElements Request Body:', body);

      const url = `${API_BASE_URL}/CEOAction/GetFormsAllElements`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const result = await response.json();

      const data = result?.data || [];
      setBdoElementValues(data);
      setOriginalBdoElementValues(data);

      const scrutinyRemark = data.find(
        (item: any) => item?.scrutinyRemarks !== undefined,
      )?.scrutinyRemarks;

      setRemarks(scrutinyRemark ?? '');
      setOriginalRemarks(scrutinyRemark || '');

      console.log(
        'GetFormsAllElements RESPONSE:',
        JSON.stringify(result, null, 2),
      );

      return result?.data || [];
    } catch (error) {
      console.error('GetFormsAllElements Error:', error);
      setBdoElementValues([]);
      return [];
    } finally {
      setCeoLoading(false);
    }
  };

  const fetchBDOCopy = async (questionID: number) => {
    try {
      setBdoLoading(true);

      const payload = {
        BDOUserName: String(bdoUserName || ''),
        LGDCode: String(villageName || ''),
        FormNo: String(formNo),
        QuestionID: String(questionID),
        PanchayatUserId: String(villageId || ''),
        CurrentUseriD: String(userID || ''),
      };

      console.log('BDO API PAYLOAD:', payload);

      const url = `${API_BASE_URL}/CEOAction/PreviewBDOForm`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`BDO API Error: ${response.status}`);
      }

      const result: PreviewFormResponse = await response.json();

      console.log('BDO API RESPONSE:', result);
      setBdoFormData(result);
      const mappedData = mapBDOResponseToElementValues(result);
      setBdoElementValues(mappedData);

      setPreviewData({
        formQuestionID: result.formQuestionID || [],
        previewFormQuestionLst: result.previewFormQuestionLst || [],
        previewForm_TextBoxList: result.previewForm_TextBoxList || [],
        previewForm_DropDownList: result.previewForm_DropDownList || [],
        previewForm_CheckList: result.previewForm_CheckList || [],
        previewForm_TableList: result.previewForm_TableList || [],
        previewForm_DocumentList: result.previewForm_DocumentList || [],
      });
      return mappedData;
    } catch (error) {
      console.error('fetchBDOForm error:', error);
      setPreviewData(null);
    } finally {
      setBdoLoading(false);
    }
  };

  const mapBDOResponseToElementValues = (result: any) => {
    const values: any[] = [];

    // DROPDOWNS
    const dropdownMap = new Map<string, any>();

    (result.previewForm_DropDownList || []).forEach((item: any) => {
      const key = `${item.questionId}_${item.elementMstId}`;

      if (!dropdownMap.has(key)) {
        dropdownMap.set(key, {
          elementMasterId: item.elementMstId,
          elementId: '2',
          questionId: item.questionId,
          dropDownList: [],
          txtTableMstID: '',
        });
      }

      dropdownMap.get(key).dropDownList.push({
        ddId: item.ddId,
        ddText: item.ddText,
        ddVal: item.ddVal,
      });
    });

    values.push(...Array.from(dropdownMap.values()));

    // CHECKBOXES
    const checkboxMap = new Map<string, any>();

    (result.previewForm_CheckList || []).forEach((item: any) => {
      const key = `${item.questionId}_${item.elementMstId}`;

      if (!checkboxMap.has(key)) {
        checkboxMap.set(key, {
          elementMasterId: item.elementMstId,
          elementId: '3',
          questionId: item.questionId,
          checkBoxList: [],
        });
      }

      checkboxMap.get(key).checkBoxList.push({
        chkID: item.chkID,
        chkText: item.chkText,
        chkVal: item.chkVal ? '1' : '0',
      });
    });

    values.push(...Array.from(checkboxMap.values()));

    (result.previewForm_TextBoxList || []).forEach((item: any) => {
      values.push({
        elementMasterId: item.elementMstId,
        elementId: '1',
        questionId: item.questionId,
        value: item.textBoxVal ?? '',
        validationType: item.validationType,
        txtBoxReadOnlyFlag: '0',
        txtTableMstID: null,
      });
    });

    return values;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split(/[-/]/);

    if (!year || !month || !day) return dateString;

    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  const handleCopyBDO = async (checked: boolean) => {
    try {
      setCopyLoading(true);
      setCopyBDOData(checked);

      if (checked) {
        const bdoData = await fetchBDOCopy(activeStepIndex + 1);
        if (bdoData && bdoData.length > 0) {
          setBdoElementValues(
            bdoData.map((item: any) => ({
              ...item,
            })),
          );
          setRemarks(bdoshera || '');
        } else {
          setBdoElementValues([]);
          setRemarks('');
        }
      } else {
        setBdoElementValues(originalBdoElementValues);
        setRemarks(originalRemarks);
      }
    } catch (error) {
      console.error('Error occurred while copying BDO data:', error);
    } finally {
      setCopyLoading(false);
      setCopyBDOData(checked);
    }
  };

  const handlePreview = () => {
    navigation.navigate('CEOPreviewScreen', {
      villageId,
      villageName,
      formNo,
      bdouserid,
      bdoUserName,
    });
  };

  const getTextBoxPayload = (questionId: string) => {
    return questionDetails
      .filter(
        (item: any) =>
          Number(item.rdFormElementId) === 1 ||
          (Number(item.rdFormElementId) === 5 &&
            Number(item.rdTableElementId) === 1),
      )
      .map((item: any) => {
        const isTableTextBox =
          Number(item.rdFormElementId) === 5 &&
          Number(item.rdTableElementId) === 1;

        let value = '';

        if (isTableTextBox) {
          const key = getTableCellKey(item);

          const localValue = tableCellValues[key];

          const bdoValue = bdoElementValues.find(
            x =>
              String(x.elementMasterId) === String(item.elementmstid) &&
              String(x.txtTableMstID) === String(item.tableMstId),
          );

          const apiValue =
            bdoValue?.value ??
            bdoValue?.Value ??
            bdoValue?.apiValue?.value ??
            bdoValue?.rdFormTextBoxSubmitVal ??
            '';

          value = localValue !== undefined ? localValue : apiValue;
        } else {
          const bdoValue = bdoElementValues.find(
            x =>
              String(x.elementMasterId) === String(item.elementmstid) &&
              x.chkID === undefined,
          );

          value =
            bdoValue?.value ??
            item.apiValue?.value ??
            item.rdFormTextBoxSubmitVal ??
            '';
        }

        return {
          BDOUserIDVal: String(bdouserid ?? ''),
          FormNoVal: String(formNo),
          ElementMasterId: String(item.elementmstid),
          TableMstID: isTableTextBox ? String(item.tableMstId) : '0',
          QuestionId: String(questionId),
          textboxValue: String(value),
          LGDCodeVal: String(villageName ?? ''),
          PanchayatUserIdVal: String(villageId ?? ''),
          IsFromMobileApp: '1',
        };
      })
      .filter((item: any) => item.textboxValue.trim() !== '');
  };

  const getDropdownPayload = (questionId: string) => {
    return questionDetails
      .filter((item: any) => Number(item.rdFormElementId) === 2)
      .map((item: any) => {
        const bdoValue = bdoElementValues.find(
          x =>
            String(x.elementMasterId) === String(item.elementmstid) &&
            x.chkID === undefined,
        );

        let value = bdoValue?.value;
        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ''
        ) {
          const dropDownList =
            bdoValue?.dropDownList || item.apiValue?.dropDownList || [];

          const initialSelectedOption = dropDownList.find(
            (option: any) =>
              option.ddVal !== null &&
              option.ddVal !== undefined &&
              String(option.ddVal).trim() !== '',
          );

          value = initialSelectedOption?.ddId ?? '';
        }

        return {
          BDOUserIDVal: String(bdouserid ?? ''),
          FormNoVal: String(formNo),
          QuestionId: String(questionId),
          ElementMasterId: String(item.elementmstid),
          TableMstID: '',
          dropdownValue: String(value),
          LGDCodeVal: String(villageName ?? ''),
          PanchayatUserIdVal: String(villageId ?? ''),
          IsFromMobileApp: '1',
        };
      });
  };

  const getCheckboxPayload = (questionId: string) => {
    const payload = bdoElementValues
      .filter(
        (item: any) =>
          item.chkID !== undefined &&
          item.chkID !== null &&
          String(item.chkVal) === '1',
      )
      .map((item: any) => ({
        BDOUserIDVal: String(bdouserid ?? ''),
        FormNoVal: String(formNo),
        ElementMasterId: String(item.elementMasterId),
        QuestionId: String(questionId),
        ChkID: String(item.chkID),
        Value: String(item.chkVal),
        LGDCodeVal: String(villageName ?? ''),
        PanchayatUserIdVal: String(villageId ?? ''),
        IsFromMobileApp: '1',
      }));

    console.log('FINAL CHECKBOX PAYLOAD:', JSON.stringify(payload, null, 2));

    return payload;
  };

  const getDocumentPayload = (questionId: string) => {
    return questionDetails
      .filter((item: any) => Number(item.rdFormElementId) === 4)
      .map((item: any) => {
        return {
          BDOUserIDVal: String(bdouserid ?? ''),
          FormNoVal: String(formNo),
          ElementMasterId: String(item.elementmstid),
          QuestionId: String(questionId),
          DocumentKey: item.apiValue?.dockey ?? '',
          FileURL: item.apiValue?.fileURL ?? '',
          LGDCodeVal: String(villageName ?? ''),
          PanchayatUserIdVal: String(villageId ?? ''),
          IsFromMobileApp: '1',
        };
      })
      .filter((item: any) => item.DocumentKey || item.FileURL);
  };

  const getDatePayload = (questionId: string) => {
    return questionDetails
      .filter((item: any) => Number(item.rdTableElementId) === 7)
      .map((item: any) => {
        const tableMstId = String(item.tableMstId ?? '0');

        const bdoValue = bdoElementValues.find(
          (x: any) =>
            String(x.elementMasterId) === String(item.elementmstid) &&
            String(x.questionId) === String(questionId) &&
            String(x.txtTableMstID) === tableMstId,
        );

        // Find the latest selected value from table state
        const tableCellKey = getTableCellKey(item);
        const selectedValue = tableCellValues[tableCellKey];

        const value =
          selectedValue ??
          bdoValue?.value ??
          item.apiValue?.value ??
          item.rdFormTextBoxSubmitVal ??
          '';

        const formatedValue = formatDate(value);

        return {
          BDOUserIDVal: String(bdouserid ?? ''),
          FormNoVal: String(formNo),
          ElementMasterId: String(item.elementmstid),
          QuestionId: String(questionId),
          dateValue: String(formatedValue ?? ''),
          LGDCodeVal: String(villageName ?? ''),
          PanchayatUserIdVal: String(villageId ?? ''),
          TableMstID: tableMstId,
          IsFromMobileApp: '1',
        };
      })
      .filter((item: any) => item.dateValue.trim() !== '');
  };

  const validateGreaterLesserTextbox = (
    questionDetails: any[],
    bdoElementValues: any[],
  ): {
    valid: boolean;
    message?: string;
    invalidElementMasterId?: string;
  } => {
    let greaterValue: number | null = null;
    let greaterLabel = '';

    const lesserFields: {
      elementMasterId: string;
      value: number;
      label: string;
    }[] = [];

    for (const q of questionDetails) {
      if (Number(q.rdFormElementId ?? q.rdformelementid) !== 1) {
        continue;
      }

      const submitVal = q.rdFormTextBoxSubmitVal ?? q.rdformtextboxsubmitval;
      const elementMasterId = String(q.elementmstid ?? q.elementMasterId);
      const label = q.rdFormLableName ?? q.rdformlablename ?? '';
      const bdoElement = bdoElementValues.find(
        x =>
          String(x.elementMasterId) === elementMasterId &&
          String(x.questionId) ===
            String(q.rdFormQuestionID ?? q.rdformquestionid),
      );

      const value = bdoElement?.value;

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
      ) {
        continue;
      }

      const numericValue = Number(value);

      if (Number.isNaN(numericValue)) {
        return {
          valid: false,
          invalidElementMasterId: elementMasterId,
          message: `${label} मध्ये योग्य संख्या भरा.`,
        };
      }

      if (submitVal === 'Greater-1') {
        greaterValue = numericValue;
        greaterLabel = label;
      }

      if (submitVal === 'Lesser-1') {
        lesserFields.push({
          elementMasterId,
          value: numericValue,
          label,
        });
      }
    }

    if (greaterValue !== null) {
      let lesserTotal = 0;

      for (const lesser of lesserFields) {
        if (lesser.value > greaterValue) {
          return {
            valid: false,
            invalidElementMasterId: lesser.elementMasterId,
            message:
              `${lesser.label} (${lesser.value}) ही संख्या ` +
              `${greaterLabel} (${greaterValue}) पेक्षा जास्त नसावी.`,
          };
        }

        lesserTotal += lesser.value;
      }

      if (lesserTotal > greaterValue) {
        const invalidField = lesserFields[lesserFields.length - 1];

        return {
          valid: false,
          invalidElementMasterId: invalidField?.elementMasterId,
          message:
            `${lesserFields.map(item => item.label).join(' + ')} ` +
            `(${lesserTotal}) ही एकूण संख्या ` +
            `${greaterLabel} (${greaterValue}) पेक्षा जास्त नसावी.`,
        };
      }
    }

    return {
      valid: true,
    };
  };

  const handleSubmit = async () => {
    try {
      const activeQuestion = questionList[activeStepIndex];
      const questionId = activeQuestion?.questionID;

      //const activeQuestion = questionDetails[0];
      //const questionId = activeQuestion?.rdFormQuestionID;

      if (!questionId) {
        Alert.alert('Error', 'Invalid question');
        return;
      }

      for (const item of questionDetails) {
        if (Number(item.rdFormElementId ?? item.rdformelementid) !== 1) {
          continue;
        }

        const elementMasterId = String(item.elementmstid);
        const bdoElement = bdoElementValues.find(
          x =>
            String(x.elementMasterId) === elementMasterId &&
            String(x.questionId) === String(item.rdFormQuestionID),
        );

        const value = bdoElement?.value;

        const isEmpty =
          value === undefined || value === null || String(value).trim() === '';

        if (isEmpty) {
          Alert.alert(
            'Error',
            `Please fill the textbox for \n${item.rdFormLableName}`,
          );

          return;
        }
      }

      const validationResult = validateGreaterLesserTextbox(
        questionDetails,
        bdoElementValues,
      );

      if (!validationResult.valid) {
        Alert.alert(
          'Error',
          validationResult.message || 'Please enter valid values.',
        );

        if (validationResult.invalidElementMasterId) {
          setBdoElementValues(prev =>
            prev.map(item =>
              String(item.elementMasterId) ===
              String(validationResult.invalidElementMasterId)
                ? {
                    ...item,
                    value: '',
                  }
                : item,
            ),
          );
        }

        return;
      }

      for (const item of questionDetails) {
        if (Number(item.rdFormElementId) !== 2) {
          continue;
        }

        const elementMasterId = String(item.elementmstid);

        const bdoValue = bdoElementValues.find(
          x =>
            String(x.elementMasterId) === elementMasterId &&
            x.chkID === undefined,
        );

        let selectedValue = bdoValue?.value;

        if (
          selectedValue === undefined ||
          selectedValue === null ||
          String(selectedValue).trim() === ''
        ) {
          const dropDownList = bdoValue?.dropDownList || [];

          const initialSelectedOption = dropDownList.find(
            (option: any) =>
              option.ddVal !== null &&
              option.ddVal !== undefined &&
              String(option.ddVal).trim() !== '',
          );

          selectedValue = initialSelectedOption?.ddId;
        }

        const isEmpty =
          selectedValue === undefined ||
          selectedValue === null ||
          String(selectedValue).trim() === '' ||
          String(selectedValue).trim() === '0';

        if (isEmpty) {
          Alert.alert(
            'Error',
            `कृपया ${item.rdFormLableName || 'या प्रश्नाचे उत्तर'} निवडा`,
          );

          return;
        }
      }

      const trimmedRemarks = (remarks ?? '').trim();

      if (!trimmedRemarks) {
        Alert.alert('Error', 'कृपया शेरा प्रविष्ट करा');
        return;
      }


      setLoading(true);

      const jsontextboxpayload = getTextBoxPayload(questionId);
      const jsoncheckboxpayload = getCheckboxPayload(questionId);
      const jsondropdownPayload = getDropdownPayload(questionId);
      const Jsondocumentpayload = getDocumentPayload(questionId);
      const dateList = getDatePayload(questionId);

      const scrutinyRemarkList = [
        {
          BDOUserID: String(bdouserid ?? ''),
          GrampanchyatUserId: String(villageId ?? ''),
          FormId: String(formNo),
          QuestionId: String(questionId),
          Remark: String(remarks ?? ''),
          IsFromMobileApp: '1',
        },
      ];

      const payload = {
        RoleID: '4',
        panchayatuserid: String(villageId ?? ''),
        bdoUserid: String(bdouserid ?? ''),
        CEOUserID: String(userID ?? ''),
        IsTextboxPayloadDataFlag: jsontextboxpayload?.length > 0 ? '1' : null,
        IsDropdownPayloadDataFlag: jsondropdownPayload?.length > 0 ? '1' : null,
        IsCheckboxPayloadDataFlag: jsoncheckboxpayload?.length > 0 ? '1' : null,
        IsSheraPayloadDataFlag: scrutinyRemarkList?.length > 0 ? '1' : null,
        IsDatePayloadDataFlag: dateList?.length > 0 ? '1' : null,
        IsDocPayloadDataFlag: Jsondocumentpayload?.length > 0 ? '1' : null,
        jsontextboxpayload,
        jsoncheckboxpayload,
        jsondropdownPayload,
        Jsondocumentpayload,
        dateList,
        scrutinyRemarkList,
      };

      console.log('CEOScrutinySave REQUEST:', JSON.stringify(payload, null, 2));

      const url = `${API_BASE_URL}/CEOAction/CEOScrutinySave`;

      const response = await fetch(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      console.log('CEOScrutinySave RESPONSE:', JSON.stringify(result, null, 2));
      if (!response.ok) {
        Alert.alert(
          'Error',
          result?.responseMessage || 'Unable to submit Stage 3 data.',
        );
        return;
      }

      Alert.alert(
        'Success',
        result?.responseMessage || 'Stage 3 data submitted successfully.',
      );

      setRemarks('');
      navigation.goBack();
    } catch (error: any) {
      console.error('CEOScrutinySave ERROR:', error);

      Alert.alert(
        'Error',
        error?.message || 'Something went wrong while submitting data.',
      );
    } finally {
      setLoading(false);
    }
  };

  const getTextBoxValue = (item: PreviewFormQuestion) => {
    const textbox = previewData?.previewForm_TextBoxList?.find(
      text =>
        String(text.elementMstId) === String(item.elementmstid) &&
        String(text.questionId) === String(item.rdFormQuestionID),
    );

    return textbox?.textBoxVal ?? '-';
  };

  const getDropDownValue = (item: PreviewFormQuestion) => {
    const selectedDropdown = previewData?.previewForm_DropDownList?.find(
      dropdown =>
        String(dropdown.elementMstId) === String(item.elementmstid) &&
        String(dropdown.questionId) === String(item.rdFormQuestionID) &&
        dropdown.ddVal !== null &&
        dropdown.ddVal !== undefined &&
        String(dropdown.ddVal).trim() !== '',
    );

    return selectedDropdown?.ddText ?? '-';
  };

  const getCheckBoxValues = (item: PreviewFormQuestion) => {
    return (
      previewData?.previewForm_CheckList?.filter(
        checkbox =>
          String(checkbox.elementMstId) === String(item.elementmstid) &&
          String(checkbox.questionId) === String(item.rdFormQuestionID),
      ) || []
    );
  };

  const renderProgress = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.progressContainer}
      >
        {steps.map((item, index) => {
          const step = index + 1;

          const active = index === activeStepIndex;
          const completed = Number(item.anssum) > 0;

          const previousCompleted =
            index > 0 && Number(steps[index - 1]?.anssum) > 0;

          return (
            <React.Fragment key={item.questionid ?? item.srNo ?? index}>
              {index !== 0 && (
                <View
                  style={[
                    styles.progressLine,
                    previousCompleted && styles.progressLineCompleted,
                  ]}
                />
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setActiveStepIndex(index);
                }}
              >
                <View
                  style={[
                    styles.progressCircle,
                    completed && styles.progressCircleCompleted,
                    active && styles.progressCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.progressText,
                      completed && styles.progressTextCompleted,
                      active && styles.progressTextActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </ScrollView>
    );
  };

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };
  const renderSectionHeader = (
    code: string,
    title: string,
    expanded: boolean,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[
          styles.sectionHeader,
          code === 'CEO' && styles.ceoSectionHeader,
        ]}
      >
        <View style={styles.sectionCode}>
          <Text style={styles.sectionCodeText}>{code}</Text>
        </View>

        <Text numberOfLines={2} style={styles.sectionHeaderTitle}>
          {title}
        </Text>

        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={26}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    );
  };

  const renderTextBox = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
  ) => {
    const value = getTextBoxValue(item);

    return (
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.readOnlyValueBox}>
          <Text style={styles.readOnlyValueText}>{value || '-'}</Text>
        </View>
      </View>
    );
  };

  const renderDropDown = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
  ) => {
    const value = getDropDownValue(item);

    return (
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.readOnlyValueBox1}>
          <Text style={styles.readOnlyValueText}>{value || '-'}</Text>

          <Icon
            style={{ paddingLeft: 10 }}
            name="chevron-down"
            size={22}
            color="#000"
          />
        </View>
      </View>
    );
  };

  const renderCheckBox = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
  ) => {
    const checkboxItems = getCheckBoxValues(item);

    return (
      <View style={styles.answerContainer1}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.checkboxPreviewContainer}>
          {checkboxItems.length > 0 ? (
            checkboxItems.map(check => (
              <View
                key={`${item.elementmstid}_${check.chkID}`}
                style={styles.checkboxRow}
              >
                <Icon
                  name={
                    check.chkVal ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={22}
                  color={check.chkVal ? COLORS.textSecondary : '#9E9E9E'}
                />

                <Text style={styles.checkboxText}>{check.chkText}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noAnswerText}>-</Text>
          )}
        </View>
      </View>
    );
  };

  const renderTable = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
  ) => {
    const tableData = formData?.previewForm_TableList?.filter(
      table =>
        String(table.quesionID) === String(item.rdFormQuestionID) &&
        String(table.elementmstid) === String(item.elementmstid),
    );

    if (!tableData || tableData.length === 0) {
      return (
        <View style={styles.answerContainer1}>
          <Text style={styles.answerLabel}>उत्तर :-</Text>
          <Text style={styles.noAnswerText}>-</Text>
        </View>
      );
    }

    const rows: {
      [key: string]: typeof tableData;
    } = {};

    tableData.forEach(cell => {
      const rowNo = String(cell.rdtblTableRowsNum);

      if (!rows[rowNo]) {
        rows[rowNo] = [];
      }

      rows[rowNo].push(cell);
    });

    const sortedRows = Object.keys(rows)
      .sort((a, b) => Number(a) - Number(b))
      .map(rowNo =>
        rows[rowNo].sort(
          (a, b) =>
            Number(a.rdtblTableColumnsNum) - Number(b.rdtblTableColumnsNum),
        ),
      );

    return (
      <View style={styles.answerContainer1}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.tableScroll}
        >
          <View style={styles.previewTable}>
            {sortedRows.map((row, rowIndex) => {
              const isHeader = rowIndex === 0;

              const elementId = String(item.elementmstid);

              const shouldSkipLastColumn =
                bdoExpanded &&
                [
                  '211',
                  '176',
                  '177',
                  '179',
                  '206',
                  '216',
                  '234',
                  '241',
                ].includes(elementId);

              const lastColumnNumber = Math.max(
                ...tableData.map(cell => Number(cell.rdtblTableColumnsNum)),
              );

              const visibleRow = shouldSkipLastColumn
                ? row.filter(
                    cell =>
                      Number(cell.rdtblTableColumnsNum) !== lastColumnNumber,
                  )
                : row;

              return (
                <View
                  key={`row-${rowIndex}`}
                  style={[
                    styles.previewTableRow,
                    isHeader && styles.previewTableHeaderRow,
                  ]}
                >
                  {visibleRow.map((cell, columnIndex) => {
                    const isDocument = String(cell.rdtblInputType) === '4';

                    const value =
                      cell.rdtblElementVal !== null &&
                      cell.rdtblElementVal !== undefined &&
                      String(cell.rdtblElementVal).trim() !== ''
                        ? String(cell.rdtblElementVal)
                        : isDocument
                        ? '-'
                        : cell.rdtblTableFieldName || '-';

                    const fileUrl = cell.rdtblDocumentLink || '';

                    const fileName = value.includes('/')
                      ? value.split('/').pop() || 'Document'
                      : value;

                    const isPdfFile = fileName.toLowerCase().endsWith('.pdf');

                    const handleDocumentPreview = () => {
                      if (!fileUrl) {
                        return;
                      }

                      setPreviewUrl(fileUrl);
                      setPreviewFileName(fileName);
                      setIsPdf(isPdfFile);
                      setPreviewVisible(true);
                    };

                    return (
                      <View
                        key={`cell-${rowIndex}-${columnIndex}`}
                        style={[
                          styles.previewTableCell,
                          isHeader && styles.previewTableHeaderCell,
                        ]}
                      >
                        {isDocument && fileUrl ? (
                          <TouchableOpacity onPress={handleDocumentPreview}>
                          <View style={styles.documentPreviewContainer}>
                            <Icon
                              name="file-pdf-box"
                              size={20}
                              color="#1976D2"
                            />
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="middle"
                              style={[
                                styles.documentFileName1,
                                isHeader && styles.previewTableHeaderText,
                              ]}
                            >
                              {fileName}
                            </Text>
                          <Icon name="eye" size={18} color="#1976D2" />
                          </View>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={[
                              styles.previewTableCellText,
                              isHeader && styles.previewTableHeaderText,
                            ]}
                          >
                            {value}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderDynamicQuestion = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
    isReadOnly: boolean = true,
  ) => {
    const elementType = String(item.rdFormElementId);

    // LABEL
    if (elementType === BDO_ELEMENT.LABEL) {
      return (
        <View key={item.elementmstid} style={styles.labelCard}>
          <Text style={styles.labelText}>{item.rdFormLableName}</Text>
        </View>
      );
    }

    return (
      <View key={item.elementmstid} style={styles.questionCard}>
        <View style={styles.questionRow}>
          <Text style={styles.questionNumber}>
            <Text style={styles.pinkText}>प्रश्न :</Text> {item.rdFormElementNo}{' '}
            :{' '}
          </Text>
          <Text style={styles.questionText}>{item.rdFormLableName}</Text>
        </View>
        {elementType === BDO_ELEMENT.TEXTBOX && renderTextBox(item, formData)}

        {elementType === BDO_ELEMENT.DROPDOWN && renderDropDown(item, formData)}

        {elementType === BDO_ELEMENT.CHECKBOX && renderCheckBox(item, formData)}

        {elementType === BDO_ELEMENT.TABLE && renderTable(item, formData)}

        {elementType === BDO_ELEMENT.DOCUMENT && renderDocument(item, formData)}

        {elementType !== BDO_ELEMENT.TEXTBOX &&
          elementType !== BDO_ELEMENT.DROPDOWN &&
          elementType !== BDO_ELEMENT.CHECKBOX &&
          elementType !== BDO_ELEMENT.LABEL &&
          elementType !== BDO_ELEMENT.TABLE &&
          elementType !== BDO_ELEMENT.DOCUMENT && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerLabel}>उत्तर :-</Text>

              <Text style={styles.noAnswerText}>NA</Text>
            </View>
          )}
      </View>
    );
  };

  const renderDocument = (
    item: PreviewFormQuestion,
    formData: PreviewFormResponse,
  ) => {
    const documents = formData?.previewForm_DocumentList || [];

    const document = documents.find(
      doc =>
        String(doc.questionId) === String(item.rdFormQuestionID) &&
        String(doc.elementMstId) === String(item.elementmstid),
    );

    if (!document?.fileUrl) {
      return (
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>उत्तर :-</Text>
          <Text style={styles.nodocText}>लागू नाही </Text>
        </View>
      );
    }

    const fileUrl = document.fileUrl;

    const fileName = document.docKey?.split('/').pop() || 'Document';

    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    const pdf = extension === 'pdf' || fileUrl.toLowerCase().includes('.pdf');

    const image = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

    const openDocument = () => {
      setPreviewUrl(fileUrl);
      setPreviewFileName(fileName);
      setIsPdf(pdf);
      setIsImage(image);
      setPreviewVisible(true);
    };

    return (
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>उत्तर :- </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openDocument}
          style={styles.documentPreviewButton}
        >
          <Icon
            name={pdf ? 'file-pdf-box' : 'file-document-outline'}
            size={24}
            color={COLORS.primary}
          />

          <Text style={styles.documentFileName} numberOfLines={1}>
            {fileName}
          </Text>

          <Icon name="eye-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const uniqueGPQuestions =
    gpFormData?.previewFormQuestionLst?.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          q =>
            String(q.rdFormQuestionID) === String(item.rdFormQuestionID) &&
            String(q.elementmstid) === String(item.elementmstid),
        ),
    ) || [];

  const uniqueBDOQuestions =
    bdoFormData?.previewFormQuestionLst?.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          q =>
            String(q.rdFormQuestionID) === String(item.rdFormQuestionID) &&
            String(q.elementmstid) === String(item.elementmstid),
        ),
    ) || [];

  const getApiRowValues = (rowNumber: number, tableItems: any[]) => {
    const rowItems = tableItems.filter(
      (cell: any) => Number(cell.rdTableRowsNum) === rowNumber,
    );

    return rowItems
      .map((cell: any) => {
        const apiItem = bdoElementValues.find(
          (x: any) => String(x.txtTableMstID) === String(cell.tableMstId),
        );

        return {
          cell,
          apiItem,
        };
      })
      .filter(x => x.apiItem);
  };

  const handleDeleteTableRow = async (rowNumber: number, tableItems: any[]) => {
    try {
      const rowItems = tableItems.filter(
        (x: any) => Number(x.rdTableRowsNum) === rowNumber,
      );

      if (!rowItems.length) {
        Alert.alert('Information', 'Row not found.');
        return;
      }

      const apiRowValues = getApiRowValues(rowNumber, tableItems);

      const hasApiData = apiRowValues.some(({ apiItem }) => {
        const value =
          apiItem?.value ??
          apiItem?.Value ??
          apiItem?.apiValue?.value ??
          apiItem?.rdFormTextBoxSubmitVal;

        return (
          value !== undefined && value !== null && String(value).trim() !== ''
        );
      });

      if (hasApiData) {
        Alert.alert(
          'Confirm Delete',
          `तुम्हाला श्रमदिन आठवडा क्रमांक:${
            rowNumber - 1
          } ही ओळ नक्कीच हटवायची आहे का?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: async () => {
                const txtboxId = rowItems
                  .filter((cell: any) => Number(cell?.rdTableColumnsNum) !== 1)
                  .map((cell: any) => cell?.tableMstId)
                  .filter(
                    (id: any) =>
                      id !== null &&
                      id !== undefined &&
                      String(id).trim() !== '',
                  )
                  .map((id: any) => String(id));

                console.log('DELETE TXTBOX IDS:', txtboxId);

                if (txtboxId.length === 0) {
                  Alert.alert(
                    'Information',
                    'Textbox IDs not found for this row.',
                  );
                  return;
                }

                const payload = {
                  txtboxId,
                  elementMasterId: String(rowItems[0]?.elementmstid ?? ''),
                  QuestionId: String(activeStepIndex + 1),
                  FormNo: String(formNo),
                  PanchayatUserId: String(villageId ?? ''),
                  currentUserId: String(userID ?? ''),
                  RoleId: '4',
                  BDOUserID: String(bdouserid ?? ''),
                };

                console.log(
                  'BDODeleteTableRow REQUEST:',
                  JSON.stringify(payload, null, 2),
                );

                try {

                  const url = `${API_BASE_URL}/CEOAction/CEODeleteTableRow`;

                  const response = await fetch(
                    url,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(payload),
                    },
                  );

                  const result = await response.json();

                  console.log(
                    'BDODeleteTableRow RESPONSE:',
                    JSON.stringify(result, null, 2),
                  );

                  if (
                    result?.success === true &&
                    (result?.status === 1 ||
                      result?.status === 2 ||
                      result?.status === 3)
                  ) {
                    Alert.alert(
                      'Success',
                      result?.message || 'Row deleted successfully.',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            navigation.goBack();
                          },
                        },
                      ],
                    );
                  } else {
                    Alert.alert(
                      'Error',
                      result?.message || 'Unable to delete row.',
                    );
                  }
                } catch (error: any) {
                  console.error('BDODeleteTableRow ERROR:', error);

                  Alert.alert(
                    'Error',
                    'Something went wrong while deleting the row.',
                  );
                }
              },
            },
          ],
        );

        return;
      }

      const localValues = rowItems
        .map((cell: any) => {
          const key = getTableCellKey(cell);

          return {
            cell,
            key,
            value: tableCellValues[key],
          };
        })
        .filter(
          x =>
            x.value !== undefined &&
            x.value !== null &&
            String(x.value).trim() !== '',
        );

      const hasLocalValue = localValues.length > 0;

      if (!hasLocalValue) {
        Alert.alert(
          'Information',
          `श्रमदिन आठवडा क्रमांक ${
            rowNumber - 1
          } मध्ये डिलीट करण्यासाठी कोणताही डेटा नाही.`,
        );

        return;
      }

      const dateCell = rowItems.find(
        (x: any) => Number(x.rdTableElementId) === 7,
      );

      const dateKey = dateCell ? getTableCellKey(dateCell) : null;

      const dateValue = dateKey !== null ? tableCellValues[dateKey] : '';

      if (!String(dateValue ?? '').trim()) {
        Alert.alert(
          'Information',
          `श्रमदिन आठवडा क्रमांक: ${
            rowNumber - 1
          } साठी श्रमदिनी उपस्थिती संख्या रिकामे आहेत. डिलीट करण्यासाठी काहीही नाही.`,
          [{ text: 'OK' }],
        );

        return;
      }

      Alert.alert(
        'Confirm Delete',
        `तुम्हाला श्रमदिन आठवडा क्रमांक:${
          rowNumber - 1
        } ही ओळ नक्कीच हटवायची आहे का?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              setTableCellValues(prev => {
                const updated = { ...prev };

                rowItems.forEach((cell: any) => {
                  const key = getTableCellKey(cell);

                  if (key in updated) {
                    delete updated[key];
                  }
                });

                return updated;
              });

              Alert.alert('Success', 'Record deleted successfully');
            },
          },
        ],
      );
    } catch (error) {
      console.error('DELETE ROW ERROR:', error);
    }
  };

  const ceoTextBox = (item: any) => {
    const bdoElement = bdoElementValues.find(
      x => String(x.elementMasterId) === String(item.elementmstid),
    );

    const value = bdoElement?.value ?? '';
    const validationType = String(bdoElement?.validationType ?? '');
    const txtBoxReadOnlyFlag = bdoElement?.txtBoxReadOnlyFlag ?? '0';
    const isNumericValidation =
      validationType === '2' || validationType === '4';

    return (
      <View style={styles.dynamicField}>
        <TextInput
          style={styles.editableInput}
          value={String(value)}
          placeholder={isNumericValidation ? 'Enter number' : 'Enter text only'}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={isNumericValidation ? 'numeric' : 'default'}
          maxLength={
            validationType === '2' ? 5 : validationType === '4' ? 10 : undefined
          }
          editable={txtBoxReadOnlyFlag !== '1'}
          onChangeText={text => {
            setBdoElementValues(prev => {
              const existingIndex = prev.findIndex(
                x => String(x.elementMasterId) === String(item.elementmstid),
              );

              if (existingIndex !== -1) {
                const updated = [...prev];

                updated[existingIndex] = {
                  ...updated[existingIndex],
                  value: text,
                };

                return updated;
              }

              return [
                ...prev,
                {
                  elementMasterId: item.elementmstid,
                  elementId: item.rdFormElementId,
                  questionId: item.rdFormQuestionID,
                  value: text,
                  txtBoxReadOnlyFlag: '0',
                },
              ];
            });
          }}
        />
      </View>
    );
  };

  const ceoDropDown = (item: any) => {
    const dropDownList = item.apiValue?.dropDownList || [];

    const bdoElement = bdoElementValues.find(
      x => String(x.elementMasterId) === String(item.elementmstid),
    );

    const finalDropDownList =
      bdoElement?.dropDownList?.length > 0
        ? bdoElement.dropDownList
        : dropDownList;

    const hasBdoSelection =
      bdoElement && Object.prototype.hasOwnProperty.call(bdoElement, 'value');

    const initialSelectedOption = finalDropDownList.find(
      (option: any) =>
        option.ddVal !== null &&
        option.ddVal !== undefined &&
        String(option.ddVal).trim() !== '',
    );

    const selectedValue = hasBdoSelection
      ? bdoElement.value
      : initialSelectedOption?.ddId ?? '';
    ('Not provided');

    const selectedOption = finalDropDownList.find(
      (option: any) => String(option.ddId) === String(selectedValue),
    );

    const selectedText = selectedOption?.ddText ?? 'Select';

    return (
      <View style={styles.dynamicField}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.editableInput}
          onPress={() => {
            setOpenDropdownId(prev =>
              prev === String(item.elementmstid)
                ? null
                : String(item.elementmstid),
            );
          }}
        >
          <Text style={[styles.readOnlyValue, { flex: 1 }]} numberOfLines={1}>
            {selectedText || 'Select'}
          </Text>

          <Icon
            name={
              openDropdownId === String(item.elementmstid)
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={22}
            color="#65716B"
          />
        </TouchableOpacity>

        {openDropdownId === String(item.elementmstid) && (
          <View style={styles.dropdownOptionsContainer}>
            {finalDropDownList.map((option: any) => (
              <TouchableOpacity
                key={String(option.ddId)}
                style={styles.dropdownOption}
                onPress={() => {
                  setBdoElementValues(prev => {
                    const existingIndex = prev.findIndex(
                      x =>
                        String(x.elementMasterId) === String(item.elementmstid),
                    );

                    const newValue = {
                      ...(bdoElement || {}),
                      elementMasterId: item.elementmstid,
                      elementId: item.rdFormElementId,
                      questionId: item.rdFormQuestionID,
                      value: option.ddId,
                      text: option.ddText,
                      ddVal: option.ddVal,
                      dropDownList: finalDropDownList,
                    };

                    if (existingIndex !== -1) {
                      const updated = [...prev];

                      updated[existingIndex] = {
                        ...updated[existingIndex],
                        ...newValue,
                      };

                      return updated;
                    }

                    return [...prev, newValue];
                  });

                  setOpenDropdownId(null);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option.ddText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const ceoCheckBox = (item: any) => {
    const bdoElement = bdoElementValues.find(
      x =>
        String(x.elementMasterId) === String(item.elementmstid) &&
        String(x.elementId) === String(item.rdFormElementId),
    );

    const checkBoxList = bdoElement?.checkBoxList || [];

    return (
      <View style={styles.dynamicField}>
        <View style={styles.readOnlyCheckboxContainer}>
          {checkBoxList.map((check: any) => {
            const updatedValue = bdoElementValues.find(
              x =>
                String(x.elementMasterId) === String(item.elementmstid) &&
                String(x.chkID) === String(check.chkID) &&
                x.chkVal !== undefined,
            );

            const isChecked = updatedValue
              ? String(updatedValue.chkVal) === '1'
              : String(check.chkVal) === '1';

            return (
              <TouchableOpacity
                key={String(check.chkID)}
                style={styles.readOnlyCheckboxRow}
                activeOpacity={0.7}
                onPress={() => {
                  const newChkVal = isChecked ? '0' : '1';

                  setBdoElementValues(prev => {
                    const existingIndex = prev.findIndex(
                      x =>
                        String(x.elementMasterId) ===
                          String(item.elementmstid) &&
                        String(x.chkID) === String(check.chkID),
                    );

                    const newValue = {
                      elementMasterId: String(item.elementmstid),
                      elementId: String(item.rdFormElementId),
                      questionId: String(item.rdFormQuestionID),
                      chkID: String(check.chkID),
                      chkVal: newChkVal,
                    };

                    console.log('CHECKBOX UPDATE:', newValue);

                    if (existingIndex !== -1) {
                      const updated = [...prev];

                      updated[existingIndex] = {
                        ...updated[existingIndex],
                        ...newValue,
                      };

                      return updated;
                    }

                    return [...prev, newValue];
                  });
                }}
              >
                <Icon
                  name={
                    isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={22}
                  color="#0B63B6"
                />

                <Text style={styles.readOnlyCheckboxText}>{check.chkText}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const ceoTable = (item: any) => {
    const tableItems = questionDetails.filter(
      (x: any) =>
        Number(x.rdFormElementId) === 5 &&
        String(x.rdFormElementNo) === String(item.rdFormElementNo),
    );

    if (tableItems.length === 0) {
      return null;
    }

    const totalRows = Math.max(
      ...tableItems.map((x: any) => Number(x.rdTotalTableRowsNum ?? 1)),
    );

    const totalCols = Math.max(
      ...tableItems.map((x: any) => Number(x.rdTotalTableColumnsNum ?? 1)),
    );

    const showActionColumn =
      ceoExpanded &&
      tableItems.some(
        (x: any) =>
          String(x.elementmstid) === '211' || String(x.elementmstid) === '241',
      );

    const hideLastColumnForBDO =
      ceoExpanded &&
      tableItems.some((x: any) =>
        ['176', '179', '206', '216', '234', '241'].includes(
          String(x.elementmstid),
        ),
      );

    const visibleDataColumns =
      hideLastColumnForBDO || showActionColumn ? totalCols - 1 : totalCols;

    return (
      <View style={styles.dynamicField}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.tableScrollContent}
        >
          <View>
            {Array.from({ length: totalRows }, (_, rowIndex) => {
              const rowNumber = rowIndex + 1;

              return (
                <View
                  key={`table-row-${rowNumber}`}
                  style={
                    rowNumber === 1 ? styles.tableHeaderRow : styles.tableRow
                  }
                >
                  {Array.from({ length: visibleDataColumns }, (_, colIndex) => {
                    const columnNumber = colIndex + 1;

                    const cell = tableItems.find(
                      (x: any) =>
                        Number(x.rdTableRowsNum) === rowNumber &&
                        Number(x.rdTableColumnsNum) === columnNumber,
                    );

                    const cellValue = bdoElementValues.find(
                      (x: any) =>
                        String(x.elementMasterId) ===
                          String(cell?.elementmstid) &&
                        String(x.txtTableMstID ?? x.tableMstID ?? 0) ===
                          String(cell?.tableMstId ?? 0),
                    );

                    const isReadOnly =
                      String(cellValue?.txtBoxReadOnlyFlag) === '1';

                    const validationType = String(
                      cellValue?.validationType ?? '',
                    );

                    const apiValue =
                      cellValue?.value ??
                      cellValue?.Value ??
                      cellValue?.apiValue?.value ??
                      cellValue?.rdFormTextBoxSubmitVal;

                    const key = getTableCellKey(cell);

                    const isFileCell = Number(cell?.rdTableElementId) === 4;

                    const currentValue = isFileCell
                      ? tableCellValues[key] ?? cellValue?.dockey ?? ''
                      : tableCellValues[key] ??
                        apiValue ??
                        cell?.rdTableFieldName ??
                        '';

                    const elementType =
                      Number(cell?.rdTableElementId) === 1
                        ? 'textbox'
                        : Number(cell?.rdTableElementId) === 2
                        ? 'dropdown'
                        : Number(cell?.rdTableElementId) === 4
                        ? 'file'
                        : Number(cell?.rdTableElementId) === 7
                        ? 'date'
                        : 'label';

                    return (
                      <View
                        key={`table-cell-${rowNumber}-${columnNumber}`}
                        style={styles.tableCell}
                      >
                        {rowNumber === 1 ? (
                          <Text style={styles.tableHeaderCell}>
                            {cell?.rdTableFieldName ?? '-'}
                          </Text>
                        ) : elementType === 'textbox' ? (
                          <TextInput
                            value={
                              currentValue !== null &&
                              currentValue !== undefined
                                ? String(currentValue)
                                : ''
                            }
                            onChangeText={value =>
                              updateTableCellValue(cell, value)
                            }
                            multiline
                            textAlignVertical="top"
                            onContentSizeChange={event => {
                              const height = Math.max(
                                43,
                                event.nativeEvent.contentSize.height + 12,
                              );

                              setTableInputHeights(prev => ({
                                ...prev,
                                [key]: height,
                              }));
                            }}
                            style={[
                              styles.tableInput,
                              {
                                height: tableInputHeights[key] || 43,
                              },
                              isReadOnly && styles.tableInputReadOnly,
                            ]}
                            placeholderTextColor="#999"
                            editable={!isReadOnly}
                            placeholder={
                              validationType === '2' || validationType === '4'
                                ? 'Enter number'
                                : 'Enter text only'
                            }
                            keyboardType={
                              validationType === '2' || validationType === '4'
                                ? 'numeric'
                                : 'default'
                            }
                            maxLength={
                              validationType === '2'
                                ? 5
                                : validationType === '4'
                                ? 10
                                : undefined
                            }
                          />
                        ) : elementType === 'dropdown' ? (
                          <Text style={styles.tableCellText}>
                            {currentValue || '-'}
                          </Text>
                        ) : elementType === 'date' ? (
                          isReadOnly ? (
                            <View style={styles.tableDateInput1}>
                              <Icon
                                name="calendar-outline"
                                size={18}
                                color="#999"
                              />

                              <Text
                                style={
                                  currentValue
                                    ? styles.tableDateText
                                    : styles.tableDatePlaceholder
                                }
                              >
                                {formatDate(currentValue) || 'dd-mm-yyyy'}
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.tableDateInput}
                              activeOpacity={0.8}
                              onPress={() => {
                                setDatePickerCell(key);
                              }}
                            >
                              <Icon
                                name="calendar-outline"
                                size={18}
                                color="#555"
                              />

                              <Text
                                style={
                                  currentValue
                                    ? styles.tableDateText
                                    : styles.tableDatePlaceholder
                                }
                              >
                                {formatDate(currentValue) || 'dd-mm-yyyy'}
                              </Text>
                            </TouchableOpacity>
                          )
                        ) : elementType === 'file' ? (
                          <View style={styles.tableFileContainer}>
                            <Text
                              style={styles.tableFileName}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                            >
                              {cellValue?.dockey
                                ? String(cellValue.dockey).split('/').pop()
                                : cellValue?.fileURL
                                ? String(cellValue.fileURL)
                                    .split('/')
                                    .pop()
                                    ?.split('?')[0]
                                : '-'}
                            </Text>

                            {cellValue?.fileURL ? (
                              <TouchableOpacity
                                style={styles.tableFilePreviewButton}
                                activeOpacity={0.7}
                                onPress={() => {}}
                              >
                                <Icon
                                  name="eye-outline"
                                  size={20}
                                  color="#1976D2"
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        ) : (
                          <Text style={styles.tableCellText}>
                            {currentValue || '-'}
                          </Text>
                        )}

                        {elementType === 'date' &&
                          !isReadOnly &&
                          datePickerCell === key && (
                            <DateTimePicker
                              // value={
                              //   currentValue
                              //     ? new Date(currentValue)
                              //     : new Date()
                              // }
                              value={
                                currentValue
                                  ? (() => {
                                      const [year, month, day] =
                                        currentValue.split(/[-/]/);
                                      return new Date(
                                        Number(year),
                                        Number(month) - 1,
                                        Number(day),
                                      );
                                    })()
                                  : new Date()
                              }
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) => {
                                setDatePickerCell(null);
                                if (event.type === 'dismissed') {
                                  return;
                                }

                                if (selectedDate) {
                                  const day = String(
                                    selectedDate.getDate(),
                                  ).padStart(2, '0');
                                  const month = String(
                                    selectedDate.getMonth() + 1,
                                  ).padStart(2, '0');
                                  const year = selectedDate.getFullYear();
                                  const formattedDate = `${day}-${month}-${year}`;
                                  updateTableCellValue(cell, formattedDate);
                                }
                              }}
                            />
                          )}
                      </View>
                    );
                  })}

                  {showActionColumn && (
                    <View style={styles.tableCell}>
                      {rowNumber === 1 ? (
                        <Text style={styles.tableHeaderCell}>Action</Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            handleDeleteTableRow(rowNumber, tableItems);
                          }}
                          activeOpacity={0.8}
                        >
                          <Icon
                            name="delete-outline"
                            size={16}
                            color="#FFFFFF"
                          />

                          <Text style={styles.deleteButtonText}>DELETE</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const ceoLabel = (item: any) => {
    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>{item.rdFormLableName}</Text>
      </View>
    );
  };

  const ceoDatePicker = (item: any) => {
    return (
      <View style={styles.dynamicField}>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyValue}>
            {item.rdFormTextBoxSubmitVal || 'Not provided'}
          </Text>

          <Icon name="calendar" size={20} color="#65716B" />
        </View>
      </View>
    );
  };

  const renderDynamicElement = (item: any) => {
    const elementType = Number(item.rdFormElementId);

    switch (elementType) {
      case 1:
        return ceoTextBox(item);

      case 2:
        return ceoDropDown(item);

      case 3:
        return ceoCheckBox(item);

      case 5:
        return ceoTable(item);

      case 6:
        return ceoLabel(item);

      case 7:
        return ceoDatePicker(item);

      default:
        return null;
    }
  };

  const renderCEOQuestions = () => {
    const questionName = questionDetails[0]?.rdFormQuestionName;

    const renderedTables = new Set<string>();

    return (
      <View>
        {questionName && (
          <View style={styles.ceoQuestionHeading}>
            <Text style={styles.ceoQuestionTitle}>
              {formNo}.{activeStepIndex + 1}) : {questionName}
            </Text>
          </View>
        )}

        {questionDetails.map((item: any, index: number) => {
          const elementType = Number(item.rdFormElementId);

          // TABLE
          if (elementType === 5) {
            const tableKey = String(item.elementmstid);

            // Same elementmstid = same table
            if (renderedTables.has(tableKey)) {
              return null;
            }

            renderedTables.add(tableKey);

            return (
              <View
                key={`table_${tableKey}`}
                style={styles.dynamicQuestionContainer}
              >
                {item.rdFormLableName && (
                  <Text style={styles.questionTitle}>
                    {index + 1}. {item.rdFormLableName}
                  </Text>
                )}

                {ceoTable(item)}
              </View>
            );
          }

          // NORMAL ELEMENTS
          return (
            <View
              key={`${item.rdFormQuestionID}_${item.rdFormElementNo}_${index}`}
              style={styles.dynamicQuestionContainer}
            >
              {item.rdFormLableName && (
                <Text style={styles.questionTitle}>
                  {index + 1}. {item.rdFormLableName}
                </Text>
              )}

              {renderDynamicElement(item)}
            </View>
          );
        })}
      </View>
    );
  };

  const selectedQuestion = questionList?.[0];

  const isCEOFormFinalSubmitted = questionDetails.some(
    (item: any) => String(item.rDisCEOFormFinalSubmit) === '1',
  );

  const isBDOCopyFlag = questionDetails.some(
    (item: any) => String(item.copyBtnFlagForCEO) === '1',
  );

  const areAllStepsCompleted =
    questionList.length > 0 &&
    questionList.every((question: any) => Number(question.ansSum || 0) > 0);

  if (loading) {
    return (
      <View style={styles.loaderOverlay}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#0B63B6" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>
                {selectedQuestion?.formNo}) {selectedQuestion?.formName}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>LGD CODE:</Text>

              <Text style={styles.infoValue}>{selectedQuestion?.lgdCode}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>BDO USERNAME:</Text>

              <Text style={styles.infoValue}>
                {String(bdoUserName)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>PEOPLE GRADE:</Text>
              <Text style={styles.infoValue}>
                {selectedQuestion?.peoplegrade}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressCard}>{renderProgress()}</View>

        <View style={styles.sectionCard}>
          {renderSectionHeader(
            'GP',
            'ग्रामपंचायतीने भरलेली माहिती फॉर्म',
            gpExpanded,
            () => {
              setGpExpanded(prev => {
                const newValue = !prev;

                if (newValue) {
                  setBdoExpanded(false);
                  setCeoExpanded(false);
                }

                return newValue;
              });
            },
          )}

          {gpExpanded && (
            <View style={styles.sectionContent}>
              {gpLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.questionTitle}>GP माहिती loading...</Text>
                </View>
              ) : !gpFormData ? (
                <Text style={styles.questionTitle}>GP माहिती उपलब्ध नाही.</Text>
              ) : (
                <>
                  {uniqueGPQuestions.map((question, index) => (
                    <View
                      key={`gp_${question.rdFormQuestionID}_${question.rdFormElementNo}_${index}`}
                    >
                      {index === 0 && (
                        <View style={styles.labelcontainer}>
                          <Text style={styles.questionTitle1}>
                            {activeStepIndex + 1}: {question.rdFormQuestionName}
                          </Text>
                        </View>
                      )}

                      {renderDynamicQuestion(question, gpFormData, true)}
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          {renderSectionHeader(
            'BDO',
            'तालुका स्तरीय तपासणी समितीने भरलेली माहिती फॉर्म',
            bdoExpanded,
            () => {
              setBdoExpanded(prev => {
                const newValue = !prev;

                if (newValue) {
                  setGpExpanded(false);
                  setCeoExpanded(false);
                }

                return newValue;
              });
            },
          )}

          {bdoExpanded && (
            <View style={styles.sectionContent}>
              {bdoLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.questionTitle}>
                    BDO माहिती loading...
                  </Text>
                </View>
              ) : !bdoFormData ? (
                <Text style={styles.questionTitle}>
                  BDO माहिती उपलब्ध नाही.
                </Text>
              ) : (
                <>
                  {uniqueBDOQuestions.map((question, index) => (
                    <View
                      key={`bdo_${question.rdFormQuestionID}_${question.rdFormElementNo}_${index}`}
                    >
                      {index === 0 && (
                        <View style={styles.labelcontainer}>
                          <Text style={styles.questionTitle1}>
                            {activeStepIndex + 1}: {question.rdFormQuestionName}
                          </Text>
                        </View>
                      )}

                      {renderDynamicQuestion(question, bdoFormData, true)}
                    </View>
                  ))}
                  <View style={styles.remarkContainer1}>
                    <Text style={styles.remarkLabel1}>
                      BDO SHERA:-{' '}
                      <Text style={styles.remarkvalue1}>{bdoshera}</Text>
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          {renderSectionHeader(
            'CEO',
            'जिल्हा स्तरीय तपासणी समितीने भरावयाचा फॉर्म',
            ceoExpanded,
            () => {
              setCeoExpanded(prev => {
                const newValue = !prev;

                if (newValue) {
                  setGpExpanded(false);
                  setBdoExpanded(false);
                  setCopyBDOData(false);
                }

                return newValue;
              });
            },
          )}

          {ceoExpanded && (
            <View style={styles.sectionContent}>
              {ceoLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.questionTitle}>
                    CEO माहिती loading...
                  </Text>
                </View>
              ) : (
                <>
                  {isBDOCopyFlag && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.checkboxContainer}
                      onPress={() => handleCopyBDO(!copyBDOData)}
                    >
                      <View
                        style={[
                          styles.customCheckbox,
                          copyBDOData && styles.customCheckboxChecked,
                        ]}
                      >
                        {copyBDOData && (
                          <Icon name="check" size={17} color="#FFFFFF" />
                        )}
                      </View>

                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.checkboxText1}>
                          बीडीओ फॉर्ममधील माहिती कॉपी करा
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {copyLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#007AFF" />

                      <Text style={styles.questionTitle}>
                        Loading copying BDO data...
                      </Text>
                    </View>
                  ) : (
                    <>
                      {renderCEOQuestions()}
                      <View style={styles.remarkContainer}>
                        <Text style={styles.remarkLabel}>Remarks (शेरा)</Text>

                        <TextInput
                          value={remarks}
                          onChangeText={setRemarks}
                          placeholder="शेरा लिहा..."
                          placeholderTextColor={COLORS.textMuted}
                          style={styles.remarkInput}
                          multiline
                        />
                      </View>
                    </>
                  )}
                  <View>
                    <Text style={styles.noteText}>
                      टीप: प्रश्नाला पुरक पुरावे तपासताना ज्या अभिलेखावरुन तपासणी केली त्या अभिलेखाचे नाव व प्रत्यक्ष पाहणी केली असलेस तसे नमुद करावे.
                    </Text>
                  </View>

                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      disabled={activeStepIndex === 0}
                      style={[
                        styles.navButton,
                        styles.previousButton,
                        activeStepIndex === 0 && styles.disabledButton,
                      ]}
                      onPress={handlePrevious}
                    >
                      <Icon name="arrow-left" size={21} color="#FFFFFF" />
                      <Text style={styles.navButtonText}>PREVIOUS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={
                        steps.length === 0 ||
                        activeStepIndex === steps.length - 1
                      }
                      style={[
                        styles.navButton,
                        styles.nextButton,
                        (steps.length === 0 ||
                          activeStepIndex === steps.length - 1) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleNext}
                    >
                      <Text style={styles.navButtonText}>NEXT</Text>
                      <Icon name="arrow-right" size={21} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    {areAllStepsCompleted && (
                      <TouchableOpacity
                        style={styles.previewButton}
                        activeOpacity={0.85}
                        onPress={handlePreview}
                      >
                        <Icon name="eye-outline" size={21} color="#FFFFFF" />
                        <Text style={styles.previewButtonText}>PREVIEW</Text>
                      </TouchableOpacity>
                    )}

                    {!isCEOFormFinalSubmitted && (
                      <TouchableOpacity
                        style={styles.submitButton}
                        activeOpacity={0.85}
                        onPress={handleSubmit}
                      >
                        <Icon
                          name="check-circle-outline"
                          size={21}
                          color="#FFFFFF"
                        />
                        <Text style={styles.previewButtonText}>SUBMIT</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={previewVisible}
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 15,
              backgroundColor: '#fff',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {previewFileName}
            </Text>

            <TouchableOpacity onPress={() => setPreviewVisible(false)}>
              <Text style={{ color: 'red' }}>Close</Text>
            </TouchableOpacity>
          </View>

          {isPdf ? (
            <Pdf
              source={{
                uri: previewUrl,
                cache: true,
              }}
              style={{ flex: 1 }}
              trustAllCerts={false}
              onError={error => {
                console.log('PDF preview error:', error);
              }}
            />
          ) : isImage ? (
            <Image
              source={{ uri: previewUrl }}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Preview not available.</Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CEOForm;

const styles = StyleSheet.create({
  questionTitle1: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  pinkText: {
    width: 'auto',
    fontSize: 14,
    fontWeight: '500',
    color: '#f75e91',
  },
  labelcontainer: {
    backgroundColor: '#e3e6ee',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#b9b5b5',
  },
  documentPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    backgroundColor: '#EDEDED',
    borderWidth: 1,
    borderColor: '#e2dcdc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 4,
  },

  documentFileName1: {
    flex: 1,
    fontSize: 13,
    color: '#363535',
    marginRight: 10,
  },

  documentEyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  dynamicQuestionContainer: {
    marginBottom: 20,
    paddingBottom: 4,
  },
  deleteButton: {
    backgroundColor: '#e95151',
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 90,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  tableCellStage1: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  tableFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',

    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    borderColor: '#D1D5DB',
    minHeight: 43,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 12,
    minWidth: 120,
  },

  dropdownOptionsContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#D0D5D2',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },

  dropdownOption: {
    minHeight: 45,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  dropdownOptionText: {
    fontSize: 14,
    color: '#333333',
  },

  tableFileName: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginRight: 6,
  },

  tableFilePreviewButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  tableInputReadOnly: {
    backgroundColor: '#EDEDED',
    color: '#666',
  },

  tableDateInput: {
    minWidth: 120,
    height: 42,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  tableDateInput1: {
    minWidth: 120,
    height: 42,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
  },

  tableDateText: {
    color: '#222222',
    fontSize: 13,
  },

  tableDatePlaceholder: {
    color: '#999999',
    fontSize: 13,
  },
  //   dropdownOptionText: {
  //   fontSize: 14,
  //   color: '#333333',
  // },

  editableInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#0B63B6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },

  checkboxLabel: {
    flex: 1,
    color: '#364552',
    fontSize: 14,
    marginLeft: 9,
  },

  readOnlyCheckboxContainer: {
    backgroundColor: COLORS.disabledBackground,
    borderWidth: 1,
    borderColor: '#DCE3EA',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  readOnlyCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
  },

  readOnlyCheckboxText: {
    color: '#000',
    fontSize: 14,
    marginLeft: 8,
  },

  infoMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 11,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 4,
  },

  infoMessageText: {
    flex: 1,
    color: '#40505D',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },

  requiredMark: {
    color: COLORS.danger,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },

  dropdown: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },

  readOnlyInput: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.disabledBackground,
    borderWidth: 1,
    borderColor: '#DCE3EA',
    flexDirection: 'row',
    alignItems: 'center',
  },

  readOnlyValue: {
    flex: 1,
    color: '#4A5966',
    fontSize: 14,
  },

  tableScrollContent: {
    paddingBottom: 5,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
  },

  tableHeaderCell: {
    minHeight: 40,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

  tableRow: {
    flexDirection: 'row',
  },

  tableCell: {
    width: 160,
    minHeight: 55,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  tableCellText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },

  dynamicField: {
    //marginTop: 10,
  },
  documentNote: {
    fontSize: 12,
    //color: '#65716B',
    color: '#cf2828',
    marginBottom: 8,
    fontWeight: '500',
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 8,
  },

  documentPreviewButton: {
    width: '80%',
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5DDE5',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFB',
  },

  documentFileName: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 12,
    color: '#222222',
    fontWeight: '500',
  },

  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5EAE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD6E0',
  },

  progressCircleCompleted: {
    backgroundColor: COLORS.completed,
    borderColor: COLORS.completed,
  },

  progressCircleActive: {
    borderColor: '#1976D2',
    borderWidth: 2,
  },

  progressText: {
    color: '#65716B',
    fontSize: 13,
    fontWeight: '600',
  },

  progressTextCompleted: {
    color: '#FFFFFF',
  },

  progressLine: {
    width: 19,
    height: 2,
    backgroundColor: '#D7E0E8',
  },

  progressLineCompleted: {
    backgroundColor: COLORS.completed,
  },

  progressTextActive: {
    color: '#FFFFFF',
  },

  previewTable: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    minWidth: '100%',
  },
  previewTableRow: {
    flexDirection: 'row',
  },
  previewTableHeaderRow: {
    backgroundColor: '#5f6164',
  },
  previewTableCell: {
    width: 180,
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
  },
  previewTableHeaderCell: {
    backgroundColor: '#757677',
  },
  previewTableCellText: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  previewTableHeaderText: {
    fontWeight: '700',
    color: '#fff',
  },
  tableScroll: {
    marginTop: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    //lineHeight: 27,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
    fontWeight: '500',
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 140,
  },

  header: {
    minHeight: 92,
    paddingTop: 34,
    paddingBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },

  loaderText: {
    color: '#0B63B6',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 11,
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24,36,30,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  loaderCard: {
    width: 135,
    minHeight: 115,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  noDataText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: '#1565C0',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  formInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#1F2937',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  sectionContainer: {
    marginBottom: 18,
  },

  // sectionHeader: {
  //   flexDirection: 'row',
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 10,
  //   paddingVertical: 11,
  //   paddingHorizontal: 12,
  //   marginBottom: 9,
  //   alignItems: 'center',
  //   borderLeftWidth: 4,
  //   borderLeftColor: COLORS.primary,
  // },

  sectionHeader: {
    minHeight: 55,
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },

  sectionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
    elevation: 2,
  },

  sectionNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  sectionHeaderContent: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
    lineHeight: 21,
  },

  sectionMarks: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    elevation: 1,
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  questionNumber: {
    width: 'auto',
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },

  questionText: {
    flex: 1,
    fontSize: 14,
    //lineHeight: 22,
    color: '#000',
    fontWeight: '500',
  },

  answerContainer: {
    marginTop: 13,
    // borderTopWidth: 1,
    // borderTopColor: '#EDF0F4',
    // paddingTop: 4,
    flexDirection: 'row',
  },

  answerContainer1: {
    marginTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#EDF0F4',
    paddingTop: 4,
    //flexDirection:'row'
  },

  answerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  readOnlyValueBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  readOnlyValueBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // minHeight:30,
    borderRadius: 4,
    backgroundColor: '#e8f5f8',
    marginLeft: 10,
  },

  readOnlyValueText: {
    fontSize: 13,
    //color: '#393b3d',
    // lineHeight: 20,
    color: '#5a5e63',
    fontWeight: '500',
    paddingLeft: 12,
  },
  nodocText: {
    fontSize: 13,
    color: '#f35757',
    // lineHeight: 20,
    fontWeight: '600',
    paddingLeft: 12,
  },

  noAnswerText: {
    fontSize: 13,
    color: '#94A3B8',
    // lineHeight: 20,
    fontWeight: '600',
    paddingLeft: 12,
  },

  checkboxPreviewContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E1E7EF',
    borderRadius: 8,
    padding: 10,
  },

  checkboxText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    //color: '#000',
    color: '#5a5e63',
    lineHeight: 20,
    fontWeight: '600',
  },
  checkboxText1: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: '#5a5e63',
    //lineHeight: 20,
    fontWeight: '600',
    marginTop: 3,
  },

  labelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    elevation: 1,
  },

  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a5e63',
    lineHeight: 21,
  },

  finalSubmitButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 9,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    elevation: 1,
    width: '100%',
  },

  finalSubmitButtonDisabled: {
    backgroundColor: '#AEB4BB',
    elevation: 0,
  },

  finalSubmitText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  backToFormButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 9,
    backgroundColor: '#C62828',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    elevation: 1,
    width: '100%',
  },

  backToFormText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  submittedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F7EF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#C5E4CF',
  },

  submittedText: {
    marginLeft: 8,
    color: '#237A3B',
    fontSize: 14,
    fontWeight: '600',
  },

  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E7',
    borderRadius: 9,
    padding: 13,
    marginTop: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F1DDAE',
  },

  disclaimerText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: '#6B5A2A',
    lineHeight: 19,
  },

  acceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  acceptText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: '#000000',
    lineHeight: 18,
    fontWeight: '600',
  },

  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },

  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  previousButton: {
    backgroundColor: '#6C757D',
  },

  nextButton: {
    backgroundColor: '#007BFF',
  },

  ceoSubmitButton: {
    backgroundColor: '#28A745',
  },

  disabledButton: {
    opacity: 0.5,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },

  previewButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f5ae52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#64748B',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },

  customCheckboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ================= INFO =================

  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },

  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  infoSubTitle: {
    color: '#DCEEFF',
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },

  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },

  infoGrid: {
    flexDirection: 'row',
  },

  infoItem: {
    flex: 1,
    paddingHorizontal: 4,
  },

  infoLabel: {
    //color: '#BFDDF7',
    color: '#fff',
    fontSize: 12,
    // lineHeight: 18,
    marginTop: 5,
    fontWeight: '600',
  },

  infoValue: {
    color: '#e4e9ec',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
    fontWeight: '600',
  },

  villageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },

  villageText: {
    color: '#FFFFFF',
    marginLeft: 5,
    flex: 1,
    fontWeight: '600',
  },

  // ================= PROGRESS =================

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 17,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  progressContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  questionHeader: {
    backgroundColor: '#FFFFFF',
    marginTop: 14,
    borderRadius: 14,
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  questionNumberText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 16,
  },

  questionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 21,
  },

  marksText: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },

  // ================= SECTION =================

  sectionCard: {
    backgroundColor: COLORS.card,
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',

     elevation: 1,

    // shadowColor: '#000',
     shadowOpacity: 0.06,
     shadowRadius: 4,
  },

  ceoSectionHeader: {
    backgroundColor: COLORS.ceoHeader,
  },

  sectionCode: {
    alignSelf: 'stretch',
    width: 54,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionCodeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  sectionHeaderTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 11,
    lineHeight: 20,
  },

  sectionContent: {
    padding: 14,
  },

  readOnlyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 14,
  },

  readOnlyText: {
    marginLeft: 5,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  questionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    // lineHeight: 21,
    marginBottom: 12,
  },

  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 7,
    overflow: 'hidden',
    minWidth: 700,
  },

  // tableHeaderRow: {
  //   flexDirection: 'row',
  //   backgroundColor: COLORS.tableHeader,
  // },

  // tableRow: {
  //   flexDirection: 'row',
  //   backgroundColor: '#FFFFFF',
  // },

  alternateRow: {
    backgroundColor: COLORS.tableAlternate,
  },

  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 11,
    justifyContent: 'center',
  },

  srCell: {
    width: 60,
  },

  titleCell: {
    width: 330,
  },

  valueCell: {
    width: 150,
  },

  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // tableCellText: {
  //   color: COLORS.textPrimary,
  //   fontSize: 12,
  //   lineHeight: 18,
  // },

  tableValueText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  tableInput: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,

    color: COLORS.textPrimary,
    fontSize: 14,
  },

  answerQuestion: {
    marginTop: 5,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontSize: 13,
  },

  pdfButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF4F4',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    borderRadius: 8,

    paddingVertical: 8,
    paddingHorizontal: 11,
  },

  pdfText: {
    color: COLORS.danger,
    marginLeft: 5,
    fontWeight: '700',
  },

  // ================= SHERA =================

  sheraBox: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: '#FFF4F7',
    padding: 12,
    borderRadius: 8,
  },

  sheraLabel: {
    color: '#D74F75',
    fontWeight: '800',
  },

  sheraValue: {
    color: COLORS.textPrimary,
    marginLeft: 6,
    fontWeight: '700',
  },

  // ================= CHECKBOX =================

  checkboxContainer: {
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    padding: 10,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 17,

    borderWidth: 1,
    borderColor: '#CDE1F6',
  },

  checkboxSubText: {
    color: COLORS.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },

  ceoQuestionHeading: {
    marginBottom: 15,
  },

  ceoQuestionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '900',
  },

  marksBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  marksBadgeText: {
    color: '#21884D',
    fontSize: 12,
    fontWeight: '800',
  },

  // ================= REMARK =================

  remarkContainer: {
    // flex:1,
    // padding: 10,
  },

  remarkContainer1: {
    flex: 1,
    padding: 10,
  },

  remarkLabel: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 7,
  },

  remarkLabel1: {
    color: '#f75e91',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 7,
  },

  remarkvalue1: {
    color: '#1a1919',
    fontWeight: '500',
    fontSize: 13,
    marginBottom: 7,
  },

  remarkInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#0B63B6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ================= NOTE =================

  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF4F4',

    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#FFD6D6',

    padding: 11,
    marginTop: 14,
  },

  noteText: {
    color: '#cf2828',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});
