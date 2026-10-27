/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import Pdf from 'react-native-pdf';

import CustomAlert, { AlertType } from '../utils/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_BASE_URL} from '../utils/api';

interface QuestionItem {
  srNo: number;
  questionID: string;
  questionName: string;
  ansSum: string;
  isFromFinalSubmitFlag: string;
  formName: string;
  tooltip: string;
  formNo: string;
  lgdCode: string;
  panchayatUserId: string;
  currentUserID: string;
  peoplegrade: string;
  totalMarks: string;
  totalOutOfMarks: string;
  percentage: string;
  panchayatUserTalukaName: string;
  panchayatUserDistrictName: string;
  panchayatName: string;
}

const COLORS = {
  primary: '#0B63B6',
  primaryDark: '#084A8A',
  primaryLight: '#E6F1FB',
  completed: '#63B65D',

  background: '#F3F5F7',
  card: '#FFFFFF',

  textPrimary: '#202A33',
  textSecondary: '#687683',
  textMuted: '#8A959E',

  border: '#CDD6DE',
  inputBackground: '#FFFFFF',
  disabledBackground: '#EFF2F4',

  danger: '#D64545',
  dangerLight: '#FCEAEA',

  warning: '#A76500',
  warningLight: '#FFF3DD',
};
interface Step {
  srNo: number;
  questionid: number;
  anssum: number;
}

const BDOForm = ({ route, navigation }: any) => {
  const { userID, token, username } = useAuth();
  const { villageName, villageId, formNo } = route.params;
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [activeForm, setActiveForm] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [elementValues, setElementValues] = useState<any[]>([]);
  const [questionDetails, setQuestionDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [bdoElementValues, setBdoElementValues] = useState<any[]>([]);
  const [bdoRemark, setBdoRemark] = useState('');
  const [tableInputHeights, setTableInputHeights] = useState<{
    [key: string]: number;
  }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [isImage, setIsImage] = useState(false);

  type SectionType = 'stage1' | 'stage2' | null;
  const [activeSection, setActiveSection] = useState<SectionType>('stage1');

  const isBDO = activeSection === 'stage2';

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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

  const showCustomAlert = (
    type: AlertType,
    message: string,
    title?: string,
  ) => {
    setAlertType(type);
    setAlertTitle(title || '');
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (userID && token) {
      getBDOQuestionList();
    }
  }, [userID, token]);

  useEffect(() => {
    if (questionDetails?.length > 0) {
      fetchElementValues().then(values => {
        setElementValues(values);
      });
    }
  }, [questionDetails]);

  const safeJsonParse = (text: string) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const getBDOQuestionList = async () => {
    try {
      setLoading(true);

      const url = `${API_BASE_URL}/BDOActions/GetBDOQuestionList`;

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
            FormID: String(formNo),
            CurrentUserID: userID,
          }),
        },
      );

      const result = await response.json();

      console.log('BDO Question List Response:', result);

      if (result?.responseCode === 2000) {
        setQuestionList(result.items || []);
        if (result.items?.length > 0) {
          setActiveForm(1);
        }

        const stepsArray: Step[] = result.items.map((item: any) => ({
          srNo: item.srNo,
          questionid: item.questionid,
          anssum: Number(item.anssum) || 0,
        }));

        setSteps(stepsArray);

        console.log('🚀 Steps Array:', stepsArray);

        if (stepsArray.length > 0) {
          setActiveStepIndex(0);
          setActiveForm(1);

          if (activeSection === 'stage1') {
            fetchQuestionById(stepsArray[0].srNo, 1);
          } else if (activeSection === 'stage2') {
            fetchQuestionById(stepsArray[0].srNo, 3);
          }
        }
      } else {
        Alert.alert(
          'Error',
          result?.responseMessage || 'Unable to fetch question list',
        );
        // showCustomAlert(
        //   'error',
        //   result?.responseMessage || 'Unable to fetch question list',
        // );
      }
    } catch (error) {
      console.error('Get BDO Question List Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching questions.');
      // showCustomAlert(
      //   'error',
      //   'Something went wrong while fetching questions.',
      // );
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionById = async (questionId: number, roleID: number) => {
    setLoadingDetails(true);

    try {
      const requestBody = {
        LGDCode: villageName,
        QuesionID: String(questionId),
        CurrentUseriD: userID,
        PanchayatUserId: String(villageId),
        FormID: String(formNo),
        RoleId: String(roleID),
      };

      
      console.log('➡️ Request Body:', requestBody);

      const url = `${API_BASE_URL}/BDOActions/GetFormQuestionByID_Scrutiny`;

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
        // showCustomAlert(
        //   'info',
        //   data?.responseMessage || 'No question records found.',
        // );
      }
    } catch (err) {
      console.error('Error fetchQuestionById:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchElementValues = async () => {
    try {
      setLoadingDetails(true);
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

      const roleId = activeSection === 'stage2' ? '3' : '1';

      // const body = questionDetails.map((item: any) => {
      //   const tableMstID = String(item.tableMstId || 0);

      //   return {
      //     ElementMasterId: String(item.elementmstid),
      //     ElementId: tableMstID !== '0' ? '1' : String(item.rdFormElementId),
      //     QuestionId: String(item.rdFormQuestionID),
      //     FormNo: String(formNo),
      //     TableMstID: tableMstID,
      //     LGDCode: String(villageName),
      //     PanchayatUserid: String(villageId),
      //     RoleID: roleId,
      //     CurrentUserID: String(userID),
      //   };
      // });

      const body = questionDetails.map((item: any) => {
        const tableMstID = String(item.tableMstId || 0);
        const questionId = String(item.rdFormQuestionID);
        const currentFormNo = String(formNo);

        const isForm7Or8TableQuestion =
          (currentFormNo === '7' || currentFormNo === '8') &&
          questionId === '1' &&
          tableMstID !== '0';

        // const elementId = isForm7Or8TableQuestion
        //   ? String(item.rdTableElementId)
        //   : tableMstID !== '0'
        //   ? '1'
        //   : String(item.rdFormElementId);

        const elementId =
          tableMstID !== '0'
            ? String(item.rdTableElementId)
            : String(item.rdFormElementId);

        return {
          ElementMasterId: String(item.elementmstid),
          ElementId: elementId,
          QuestionId: questionId,
          FormNo: currentFormNo,
          TableMstID: tableMstID,
          LGDCode: String(villageName),
          PanchayatUserid: String(villageId),
          RoleID: roleId,
          CurrentUserID: String(userID),
        };
      });

      const url = `${API_BASE_URL}/BDOActions/GetFormsAllElements`;

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

      const scrutinyRemark = data.find(
        (item: any) => item?.scrutinyRemarks !== undefined,
      )?.scrutinyRemarks;

      //setBdoRemark(scrutinyRemark);

      setBdoRemark(scrutinyRemark ?? '');

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
      setLoadingDetails(false);
    }
  };

  const handleBDOPreview = () => {
    navigation.navigate('BDOPreviewScreen', {
      villageId: route.params?.villageId,
      villageName: route.params?.villageName,
      formNo: route.params?.formNo,
      status: route.params?.status,
    });
  };

  const handleBackToPanchayatList = () => {
    navigation.goBack();
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
          FormNoVal: String(formNo),
          ElementMasterId: String(item.elementmstid),
          QuestionId: String(questionId),
          dateValue: String(formatedValue || 'dd-mm-yyyy'),
          LGDCodeVal: String(villageName ?? ''),
          PanchayatUserIdVal: String(villageId ?? ''),
          TableMstID: String(item.tableMstId ?? '0'),
          IsFromMobileApp: '1',
        };
      })
      .filter((item: any) => item.dateValue);
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
      // Only textbox
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

    // if (greaterValue !== null) {
    //   for (const lesser of lesserFields) {

    //     if (lesser.value > greaterValue) {
    //       return {
    //         valid: false,
    //         invalidElementMasterId: lesser.elementMasterId,
    //         message:
    //           `${lesser.label} (${lesser.value}) ही संख्या ` +
    //           `${greaterLabel} (${greaterValue}) पेक्षा जास्त नसावी.`,
    //       };
    //     }
    //   }
    // }

    //new added

    if (greaterValue !== null) {
      let lesserTotal = 0;

      for (const lesser of lesserFields) {
        // Individual lesser cannot exceed greater
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

      // Combined lesser values cannot exceed greater
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

      if (!questionId) {
        Alert.alert('Error', 'Invalid question');
        //showCustomAlert('error', 'Invalid question');
        return;
      }

      //textbox

      if (isBDO) {
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
            value === undefined ||
            value === null ||
            String(value).trim() === '';

          if (isEmpty) {
            // showCustomAlert(
            //   'error',
            //   `Please fill the textbox for \n${item.rdFormLableName}`,
            // );
            Alert.alert(
              'Error',
              `Please fill the textbox for \n${item.rdFormLableName}`,
            );

            return;
          }
        }
      }

      if (isBDO) {
        const validationResult = validateGreaterLesserTextbox(
          questionDetails,
          bdoElementValues,
        );

        if (!validationResult.valid) {
          Alert.alert(
            'Error',
            validationResult.message || 'Please enter valid values.',
          );

          // showCustomAlert(
          //   'error',
          //   validationResult.message || 'Please enter valid values.',
          // );

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
      }

      //dropdown

      if (isBDO) {
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

          // If user has not manually selected anything,
          // check the API dropdown list
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
      }

      //Reamrk
      if (isBDO && !bdoRemark.trim()) {
        Alert.alert('Error', 'कृपया शेरा प्रविष्ट करा');
        //showCustomAlert('error', 'कृपया शेरा प्रविष्ट करा');
        return;
      }

      setLoading(true);

      const jsontextboxpayload = getTextBoxPayload(questionId);
      const jsoncheckboxpayload = getCheckboxPayload(questionId);
      const jsondropdownPayload = getDropdownPayload(questionId);
      const Jsondocumentpayload = getDocumentPayload(questionId);
      const dateList = getDatePayload(questionId);

      const payload = {
        roleid: '3',
        panchayatuserid: String(villageId ?? ''),
        panchayatusername: String(villageName ?? ''),
        bdoUsername: String(username ?? ''),
        bdoUserid: String(userID ?? ''),
        jsontextboxpayload,
        jsoncheckboxpayload,
        jsondropdownPayload,
        Jsondocumentpayload,
        dateList,
        scrutinyRemarkList: [
          {
            GrampanchyatUserId: String(villageId ?? ''),
            FormId: String(formNo),
            QuestionId: String(activeStepIndex + 1),
            Remark: String(bdoRemark ?? ''),
            IsFromMobileApp: '1',
          },
        ],
      };

      console.log('BDOScrutinySave REQUEST:', JSON.stringify(payload, null, 2));

      const url = `${API_BASE_URL}/BDOActions/BDOScrutinySave`;

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

      console.log('BDOScrutinySave RESPONSE:', JSON.stringify(result, null, 2));
      if (!response.ok) {
        Alert.alert(
          'Error',
          result?.responseMessage || 'Unable to submit Stage 2 data.',
        );

        // showCustomAlert(
        //   'error',
        //   result?.responseMessage || 'Unable to submit Stage 2 data.',
        // );

        return;
      }

      Alert.alert(
        'Success',
        result?.responseMessage || 'Stage 2 data submitted successfully.',
      );

      // showCustomAlert(
      //   'success',
      //   result?.responseMessage || 'Stage 2 data submitted successfully.',
      // );

      setBdoRemark('');
      navigation.goBack();
      // setTimeout(() => {
      //   navigation.goBack();
      // }, 2000);
    } catch (error: any) {
      console.error('BDOScrutinySave ERROR:', error);

      Alert.alert(
        'Error',
        error?.message || 'Something went wrong while submitting data.',
      );

      // showCustomAlert(
      //   'error',
      //   error?.message || 'Something went wrong while submitting data.',
      // );
    } finally {
      setLoading(false);
    }
  };

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
                };

                console.log(
                  'BDODeleteTableRow REQUEST:',
                  JSON.stringify(payload, null, 2),
                );

                try {
                  const url = `${API_BASE_URL}/BDOActions/BDODeleteTableRow`;

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

  const renderSectionHeader = (
    code: 'GP' | 'BDO',
    title: string,
    section: SectionType,
  ) => {
    const isActive = activeSection === section;

    const handleSectionPress = () => {
      if (isActive) {
        setActiveSection(null);
        return;
      }

      setActiveSection(section);

      if (selectedQuestion) {
        if (section === 'stage1') {
          fetchQuestionById(activeStepIndex + 1, 1);
        } else if (section === 'stage2') {
          fetchQuestionById(activeStepIndex + 1, 3);
        }
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSectionPress}
        style={[
          styles.verticalSectionHeader,
          section === 'stage2' && styles.bdoSectionHeader,
        ]}
      >
        <View style={styles.sectionCodeBox}>
          <Text style={styles.sectionCodeText}>{code}</Text>
        </View>

        <View style={styles.verticalSectionTitleContainer}>
          <Text style={styles.verticalSectionTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>

        <Icon
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={25}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    );
  };

  const renderTextBox = (item: any) => {
    const apiValue = item.apiValue?.value;

    const bdoElement = bdoElementValues.find(
      x => String(x.elementMasterId) === String(item.elementmstid),
    );

    const bdoValue = bdoElement?.value;
    const txtBoxReadOnlyFlag = bdoElement?.txtBoxReadOnlyFlag;
    const isReadOnlyForBDO = isBDO && txtBoxReadOnlyFlag === '1';
    const value = isBDO ? bdoValue ?? apiValue ?? '' : apiValue ?? '';
    const validationType = String(bdoElement?.validationType ?? '');
    const isNumericValidation =
      validationType === '2' || validationType === '4';

    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

        <TextInput
          style={
            isReadOnlyForBDO
              ? styles.readOnlyInput
              : isBDO
              ? styles.editableInput
              : styles.readOnlyInput
          }
          value={String(value)}
          editable={isBDO && !isReadOnlyForBDO}
          placeholder={isNumericValidation ? 'Enter number' : 'Enter text only'}
          keyboardType={isNumericValidation ? 'numeric' : 'default'}
          maxLength={
            validationType === '2' ? 5 : validationType === '4' ? 10 : undefined
          }
          onChangeText={text => {
            if (!isBDO || isReadOnlyForBDO) {
              return;
            }

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
                  elementId: item.rdFormElementId ?? item.rdFormElementId,
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

  const renderDropDown = (item: any) => {
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

    const selectedValue = isBDO
      ? hasBdoSelection
        ? bdoElement.value
        : initialSelectedOption?.ddId ?? ''
      : initialSelectedOption?.ddText ??
        item.rdFormTextBoxSubmitVal ??
        'Not provided';

    const selectedOption = finalDropDownList.find(
      (option: any) => String(option.ddId) === String(selectedValue),
    );

    const selectedText = isBDO
      ? selectedOption?.ddText ?? 'Select'
      : selectedValue;

    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!isBDO}
          style={isBDO ? styles.editableInput : styles.readOnlyInput}
          onPress={() => {
            if (!isBDO) return;

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

        {isBDO && openDropdownId === String(item.elementmstid) && (
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

  const renderCheckBox = (item: any) => {
    const checkBoxList = item.apiValue?.checkBoxList || [];

    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

        <View style={styles.readOnlyCheckboxContainer}>
          {checkBoxList.map((check: any) => {
            const bdoValue = bdoElementValues.find(
              x =>
                String(x.elementMasterId) === String(item.elementmstid) &&
                String(x.chkID) === String(check.chkID),
            );

            const isChecked = bdoValue
              ? bdoValue.chkVal === '1'
              : check.chkVal === '1';

            return (
              <TouchableOpacity
                key={String(check.chkID)}
                style={styles.readOnlyCheckboxRow}
                activeOpacity={0.7}
                disabled={!isBDO}
                onPress={() => {
                  if (!isBDO) {
                    return;
                  }

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
                      elementId: String(item.elementId),
                      questionId: String(item.questionId),
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

  const renderDocumentUpload = (item: any) => {
    const documentKey = item.apiValue?.dockey;
    const fileUrl = item.apiValue?.fileURL;

    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

        {item.rdFormDocNameToolTp && (
          <Text style={styles.documentNote}>{item.rdFormDocNameToolTp}</Text>
        )}

        <View style={styles.documentCard}>
          <View style={styles.documentDetails}>
            <Text style={styles.documentName} numberOfLines={1}>
              {documentKey
                ? documentKey.split('/').pop()
                : item.downloadFileName || 'No document uploaded'}
            </Text>
          </View>

          {fileUrl && (
            <TouchableOpacity
              style={styles.previewIconButton}
              onPress={() => handleDocumentPreview(item)}
            >
              <Icon name="eye-outline" size={21} color="#0B63B6" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split(/[-/]/);

    if (!year || !month || !day) return dateString;

    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  const renderTable = (item: any) => {
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
      activeSection === 'stage2' &&
      tableItems.some((x: any) => String(x.elementmstid) === '211' || String(x.elementmstid) === '241');

    const hideLastColumnForBDO =
      activeSection === 'stage2' &&
      tableItems.some(x =>
        ['176', '179', '206', '216', '234', '241'].includes(
          String(x.elementmstid),
        ),
      );

    // Number of actual table columns to render
    const visibleDataColumns =
      hideLastColumnForBDO || showActionColumn ? totalCols - 1 : totalCols;

    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

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
                  {Array.from(
                    {
                      //length: showActionColumn ? totalCols - 1 : totalCols,
                      length: visibleDataColumns,
                    },
                    (_, colIndex) => {
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
                          ) : activeSection === 'stage2' &&
                            elementType === 'textbox' ? (
                            <TextInput
                              value={String(currentValue)}
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
                          ) : activeSection === 'stage1' &&
                            elementType === 'textbox' ? (
                            <TextInput
                              value={currentValue ? String(currentValue) : '-'}
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
                                styles.tableInput1,
                                {
                                  height: tableInputHeights[key] || 43,
                                },
                                isReadOnly && styles.tableInputReadOnly,
                              ]}
                              editable={false}
                            />
                          ) : activeSection === 'stage2' &&
                            elementType === 'date' ? (
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
                          ) : activeSection === 'stage1' &&
                            elementType === 'date' ? (
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
                          ) : activeSection === 'stage1' &&
                            elementType === 'file' ? (
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
                                  onPress={() =>
                                    handleDocumentPreview1(cellValue)
                                  }
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

                          {activeSection === 'stage2' &&
                            elementType === 'date' &&
                            datePickerCell === key && (
                              <DateTimePicker
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
                    },
                  )}

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

  const renderLabel = (item: any) => {
    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>{item.rdFormLableName}</Text>
      </View>
    );
  };

  const renderDatePicker = (item: any) => {
    return (
      <View style={styles.dynamicField}>
        <Text style={styles.fieldLabel}>
          {item.rdFormElementNo}. {item.rdFormLableName}
        </Text>

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
        return renderTextBox(item);

      case 2:
        return renderDropDown(item);

      case 3:
        return renderCheckBox(item);

      case 4:
        return renderDocumentUpload(item);

      case 5:
        return renderTable(item);

      case 6:
        return renderLabel(item);

      case 7:
        return renderDatePicker(item);

      default:
        return null;
    }
  };

  const handleDocumentPreview = (item: any) => {
    const fileUrl = item.apiValue?.fileURL;
    const documentKey = item.apiValue?.dockey;

    if (!fileUrl) {
      Alert.alert('Error', 'Document URL not available.');
      // showCustomAlert('error', 'Document URL not available.');
      return;
    }

    const fileName =
      documentKey?.split('/').pop() || item.downloadFileName || 'Document';

    const extension = fileName.split('.').pop()?.toLowerCase();

    setPreviewUrl(fileUrl);
    setPreviewFileName(fileName);

    setIsPdf(extension === 'pdf');

    setIsImage(
      extension === 'jpg' ||
        extension === 'jpeg' ||
        extension === 'png' ||
        extension === 'gif' ||
        extension === 'webp',
    );

    setPreviewVisible(true);
  };

  const handleDocumentPreview1 = (item: any) => {
    const fileUrl = item?.fileURL;
    const documentKey = item?.dockey;

    if (!fileUrl) {
      Alert.alert('Error', 'Document URL not available.');
      return;
    }

    const fileName = documentKey?.split('/').pop() || 'Document';

    const extension = fileName.split('.').pop()?.toLowerCase();

    setPreviewUrl(fileUrl);
    setPreviewFileName(fileName);

    setIsPdf(extension === 'pdf');

    setIsImage(['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || ''));

    setPreviewVisible(true);
  };

  const renderGPQuestion = () => {
    if (!questionDetails || questionDetails.length === 0) {
      return null;
    }

    const sortedItems = [...questionDetails]
      .sort((a, b) => Number(a.rdFormElementNo) - Number(b.rdFormElementNo))
      .map(item => {
        const apiValue = elementValues.find(
          value => String(value.elementMasterId) === String(item.elementmstid),
        );

        return {
          ...item,
          apiValue,
        };
      })
      .filter((item, index, array) => {
        if (Number(item.rdFormElementId) === 5) {
          return (
            index ===
            array.findIndex(
              x =>
                Number(x.rdFormElementId) === 5 &&
                String(x.elementmstid) === String(item.elementmstid),
            )
          );
        }

        return true;
      });

    return (
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Icon name="history" size={22} color="#0B63B6" />
          </View>

          <View style={styles.cardHeaderTextContainer}>
            <Text style={styles.cardTitle}>
              ग्रामपंचायतीने भरलेली माहिती फॉर्म
            </Text>
          </View>
        </View>

        {sortedItems.length > 0 && (
          <Text style={styles.cardTitle1}>
            {formNo}.{activeStepIndex + 1}) :{' '}
            {sortedItems[0].rdFormQuestionName}
          </Text>
        )}

        {sortedItems.map((item, index) => (
          <View
            key={`${item.rdFormQuestionID}-${item.rdFormElementNo}-${item.elementmstid}`}
          >
            {renderDynamicElement(item)}
          </View>
        ))}
      </View>
    );
  };

  const renderBDOQuestion = () => {
    if (!questionDetails || questionDetails.length === 0) {
      return null;
    }

    const sortedItems = [...questionDetails]
      .sort((a, b) => Number(a.rdFormElementNo) - Number(b.rdFormElementNo))
      .map(item => {
        const apiValue = elementValues.find(
          value => String(value.elementMasterId) === String(item.elementmstid),
        );

        return {
          ...item,
          apiValue,
        };
      })
      .filter((item, index, array) => {
        if (Number(item.rdFormElementId) === 5) {
          return (
            index ===
            array.findIndex(
              x =>
                Number(x.rdFormElementId) === 5 &&
                String(x.elementmstid) === String(item.elementmstid),
            )
          );
        }

        return true;
      });

    return (
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Icon name="history" size={22} color="#0B63B6" />
          </View>

          <View style={styles.cardHeaderTextContainer}>
            <Text style={styles.cardTitle}>
              तालुका स्तरीय तपासणी समितीने भरावयाचा फॉर्म
            </Text>
          </View>
        </View>

        {sortedItems.length > 0 && (
          <Text style={styles.cardTitle1}>
            {formNo}.{activeStepIndex + 1}) :{' '}
            {sortedItems[0].rdFormQuestionName}
          </Text>
        )}

        {sortedItems.map((item, index) => (
          <View
            key={`${item.rdFormQuestionID}-${item.rdFormElementNo}-${item.elementmstid}`}
          >
            {renderDynamicElement(item)}
          </View>
        ))}

        <View style={styles.dynamicField}>
          <Text style={styles.fieldLabel}>Remarks (शेरा)</Text>

          <TextInput
            style={isBDO ? styles.editableInput : styles.readOnlyInput}
            value={bdoRemark}
            editable={isBDO}
            placeholder="Enter remark"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={text => {
              if (isBDO) {
                setBdoRemark(text);
              }
            }}
          />
        </View>

        <View>
          <Text style={styles.remarkNote}>
            टीप: प्रश्नाला पुरक पुरावे तपासताना ज्या अभिलेखावरुन तपासणी केली
            त्या अभिलेखाचे नाव व प्रत्यक्ष पाहणी केली असलेस तसे नमुद करावे.
          </Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <View style={styles.topActionRow}>
            {!isBDOFormFinalSubmitted && (
              <TouchableOpacity
                style={[styles.horizontalActionButton, styles.bdoSubmitButton]}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Icon name="check-circle-outline" size={18} color="#FFFFFF" />

                <Text style={styles.horizontalButtonText} numberOfLines={1}>
                  SUBMIT
                </Text>
              </TouchableOpacity>
            )}

            {areAllStepsCompleted && (
              <TouchableOpacity
                style={[styles.horizontalActionButton, styles.bdoPreviewButton]}
                onPress={handleBDOPreview}
                activeOpacity={0.8}
              >
                <Icon name="eye-outline" size={18} color="#FFFFFF" />

                <Text style={styles.horizontalButtonText} numberOfLines={1}>
                  PREVIEW
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.horizontalActionButton, styles.bdoBackButton]}
              onPress={handleBackToPanchayatList}
              activeOpacity={0.8}
            >
              <Icon name="arrow-left" size={18} color="#FFFFFF" />

              <Text style={styles.horizontalButtonText} numberOfLines={1}>
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  
const renderProgress = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.progressContainer}
    >
      {questionList.map((item, index) => {
        const step = index + 1;

        const active = index === activeStepIndex;
        const completed = Number(item.ansSum || 0) > 0;

        const previousCompleted =
          index > 0 &&
          Number(questionList[index - 1]?.ansSum || 0) > 0;

        return (
          <React.Fragment key={item.questionID ?? item.srNo ?? index}>
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
                setActiveForm(step);
                setActiveStepIndex(index);
                setActiveSection('stage1');
                fetchQuestionById(item.srNo, 1);
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


  const selectedQuestion = questionList[activeForm - 1];
  const isFinalSubmitted = selectedQuestion?.isFromFinalSubmitFlag === '1';
  const isBDOFormFinalSubmitted = questionDetails.some(
    (item: any) => String(item.rDisBDOFormFinalSubmit) === '1',
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              FORM {selectedQuestion?.formNo || '1'} :{' '}
              {selectedQuestion?.formName || ''}
            </Text>

            {/* <Text style={styles.headerSubtitle}>
              {selectedQuestion?.tooltip || ''}
            </Text> */}

            <Text style={styles.headerSubtitle}>
              LGD Code : {selectedQuestion?.lgdCode || ''} | लोक श्रेणी :{' '}
              {selectedQuestion?.peoplegrade || ''}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={[styles.mainContent, { paddingBottom: 120 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Form Progress</Text>

              <Text style={styles.progressCount}>
                {questionList.length > 0
                  ? `${activeForm}/${questionList.length}`
                  : '0/0'}
              </Text>
            </View>

            {loading ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stepsContainer}
              >
                {questionList.map((question, index) => {
                  const stepNumber = index + 1;

                  const isActive = activeForm === stepNumber;

                  const isCompleted = Number(question.ansSum || 0) > 0;

                  return (
                    <TouchableOpacity
                      key={question.questionID}
                      style={styles.stepWrapper}
                      onPress={() => {
                        setActiveForm(stepNumber);
                        setActiveStepIndex(index);
                        setActiveSection('stage1');
                        fetchQuestionById(question.srNo, 1);
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.stepCircle,
                          isCompleted
                            ? styles.completedStepCircle
                            : styles.stepCircle,
                          isActive && styles.currentStepBorder,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepText,
                            isCompleted && styles.completedStepText,
                          ]}
                        >
                          {stepNumber}
                        </Text>
                      </View>

                      {index !== questionList.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            isCompleted &&
                              !isActive &&
                              styles.completedStepLine,
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View> */}

          <View style={styles.progressCard}>{renderProgress()}</View>

          <View style={styles.questionHeader}></View>

          <View style={styles.verticalSectionCard}>
            {renderSectionHeader(
              'GP',
              'ग्रामपंचायतीने भरलेली माहिती फॉर्म',
              'stage1',
            )}

            {activeSection === 'stage1' && selectedQuestion && (
              <View style={styles.verticalSectionContent}>
                {loadingDetails ? (
                  <View style={styles.questionLoaderContainer}>
                    <ActivityIndicator size="large" color="#0B63B6" />

                    <Text style={styles.questionLoaderText}>
                      प्रश्नाची माहिती लोड होत आहे...
                    </Text>
                  </View>
                ) : (
                  renderGPQuestion()
                )}
              </View>
            )}
          </View>

          <View style={styles.verticalSectionCard}>
            {renderSectionHeader(
              'BDO',
              'तालुका स्तरीय तपासणी समितीने भरावयाचा फॉर्म',
              'stage2',
            )}

            {activeSection === 'stage2' && selectedQuestion && (
              <View style={styles.verticalSectionContent}>
                {loadingDetails ? (
                  <View style={styles.questionLoaderContainer}>
                    <ActivityIndicator size="large" color="#0B63B6" />

                    <Text style={styles.questionLoaderText}>
                      प्रश्नाची माहिती लोड होत आहे...
                    </Text>
                  </View>
                ) : (
                  renderBDOQuestion()
                )}
              </View>
            )}
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

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
                source={{ uri: previewUrl }}
                style={{ flex: 1 }}
                trustAllCerts={false}
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default BDOForm;

const styles = StyleSheet.create({

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
  currentStepBorder: {
    borderWidth: 2,
    borderColor: COLORS.primary,
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
  remarkNote: {
    color: '#cf2828',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
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
  questionLoaderContainer: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionLoaderText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  tableCellText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },

  dynamicField: {
    marginTop: 14,
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

  actionButtonsContainer: {
    marginTop: 24,
    marginBottom: 20,
  },

  topActionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  horizontalActionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  bdoSubmitButton: {
    backgroundColor: '#2E7D32',
  },

  bdoPreviewButton: {
    backgroundColor: '#0B4FA3',
  },

  bdoBackButton: {
    backgroundColor: '#C62828',
  },

  horizontalButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
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

  mainScroll: {
    flex: 1,
  },

  mainContent: {
    padding: 14,
    paddingBottom: 40,
  },

  // progressCard: {
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 16,
  //   padding: 15,
  //   elevation: 2,
  //   shadowColor: '#000000',
  //   shadowOpacity: 0.06,
  //   shadowRadius: 6,
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  // },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  progressCount: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  stepsContainer: {
    paddingTop: 16,
    paddingRight: 10,
  },

  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5EAE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD6E0',
  },

  activeStepCircle: {
    //backgroundColor: COLORS.primary,
    //borderColor: COLORS.primary,
  },

  completedStepCircle: {
    backgroundColor: COLORS.completed,
    borderColor: COLORS.completed,
  },

  stepText: {
    color: '#65716B',
    fontSize: 13,
    fontWeight: '600',
  },

  activeStepText: {
    color: '#FFFFFF',
  },

  stepLine: {
    width: 19,
    height: 2,
    backgroundColor: '#D7E0E8',
  },

  completedStepLine: {
    backgroundColor: COLORS.completed,
  },
  completedStepText: {
    color: '#FFFFFF',
  },
  questionHeader: {
    marginTop: 10,
    marginBottom: 10,
  },

  questionNumber: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  questionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 25,
  },

  verticalSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCE4EB',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  verticalSectionHeader: {
    minHeight: 56,
    backgroundColor: '#0B8FCB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 13,
  },

  bdoSectionHeader: {
    backgroundColor: '#0B8FCB',
  },

  sectionCodeBox: {
    width: 55,
    alignSelf: 'stretch',
    backgroundColor: '#35B968',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionCodeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  verticalSectionTitleContainer: {
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
    justifyContent: 'center',
  },

  verticalSectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },

  verticalSectionContent: {
    backgroundColor: '#FFFFFF',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editCardHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardHeaderTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  cardTitle1: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingTop: 12,
  },

  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  readOnlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFF4C9',
    flexDirection: 'row',
    alignItems: 'center',
  },

  readOnlyBadgeText: {
    color: '#6B5B00',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },

  editableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: COLORS.completed,
    flexDirection: 'row',
    alignItems: 'center',
  },

  editableBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E9E7',
    marginVertical: 15,
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

  previousValueText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 5,
  },

  changedValueMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#FFF5DD',
  },

  changedValueText: {
    flex: 1,
    color: '#76520C',
    fontSize: 11,
    marginLeft: 6,
  },

  checkboxRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
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
    color: '#4A5966',
    fontSize: 14,
    marginLeft: 8,
  },

  documentCard: {
    minHeight: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7DFE7',
    backgroundColor: '#F8FAF9',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 7,
    backgroundColor: '#F8E7E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  documentDetails: {
    flex: 1,
    marginLeft: 10,
  },

  documentName: {
    color: '#303D37',
    fontSize: 13,
    fontWeight: '600',
  },

  documentStatus: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  previewIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fileUploadContainer: {
    minHeight: 120,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#7AA6CF',
    borderRadius: 10,
    backgroundColor: '#F7FAFD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },

  fileUploadTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 7,
  },

  fileUploadSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  selectedFileCard: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: 7,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedFileName: {
    flex: 1,
    color: '#40505D',
    fontSize: 12,
    marginHorizontal: 8,
  },

  tableTitleRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addRowButton: {
    marginTop: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },

  addRowButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
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

  readOnlyTableRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F7F6',
    borderBottomWidth: 1,
    borderBottomColor: '#DCE3EA',
  },

  editableTableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCE3EA',
  },

  tableValueCell: {
    minHeight: 52,
    paddingHorizontal: 7,
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: '#DCE3EA',
    color: '#41505D',
    fontSize: 12,
    textAlignVertical: 'center',
  },

  tableValueCellContainer: {
    minHeight: 52,
    paddingHorizontal: 7,
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: '#DCE3EA',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // tableFileName: {
  //   flex: 1,
  //   color: '#41505D',
  //   fontSize: 11,
  //   marginLeft: 4,
  // },

  tableInputCellContainer: {
    minHeight: 58,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#DCE3EA',
    justifyContent: 'center',
  },

  tableInput: {
    minHeight: 43,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    backgroundColor: '#FFFFFF',
    fontSize: 12,
    minWidth: 120,
    textAlignVertical: 'top',
  },

  tableInput1: {
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
    textAlignVertical: 'top',
  },

  tableFileButton: {
    minHeight: 43,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableFileButtonText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 11,
    marginLeft: 5,
  },

  rowNumber: {
    color: '#364552',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  deleteRowButton: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  srNoCell: {
    width: 58,
  },

  activityCell: {
    width: 180,
  },

  countCell: {
    width: 120,
  },

  fileCell: {
    width: 175,
  },

  actionCell: {
    width: 65,
  },

  bdoSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  bdoPreviewButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  bdoBackButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  draftButton: {
    flex: 1,
    minHeight: 48,
    marginRight: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D28A29',
    backgroundColor: COLORS.warningLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  draftButtonText: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

  submitButton: {
    flex: 1,
    minHeight: 48,
    marginLeft: 7,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
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
});
