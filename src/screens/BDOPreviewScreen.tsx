/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import CustomAlert, { AlertType } from '../utils/CustomAlert';
import {API_BASE_URL} from '../utils/api';

interface FormBasicInfo {
  questionID: number;
  ansSum: string;
  isFromFinalSubmitFlag: number;
  formName: string;
  peoplegrade: string;
  panchayatUserTalukaName: string;
  panchayatUserDistrictName: string;
  panchayatName: string;
}

interface PreviewQuestion {
  rdFormQuestionID: string;
  rdFormQuestionName: string;
  rdFormElementNo: string;
  rdFormLableName: string;
  rdFormElementId: string;
  elementmstid: string;
  loadSubMenu: any;
}

interface TextBoxItem {
  textBoxName: string;
  textBoxVal: string;
  validationType: string;
  formNo: string;
  questionId: string;
  elementMstId: string;
}

interface DropDownItem {
  ddId: string;
  ddText: string;
  ddVal: string | null;
  formNo: string;
  questionId: string;
  elementMstId: string;
}

interface TableListItem {
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
}

interface CheckListItem {
  chkID: string;
  chkText: string;
  chkVal: boolean;
  formNo: string;
  questionId: string;
  elementMstId: string;
}

interface PreviewResponse {
  formQuestionID: FormBasicInfo[];
  previewFormQuestionLst: PreviewQuestion[];
  previewForm_TextBoxList: TextBoxItem[];
  previewForm_DropDownList: DropDownItem[];
  previewForm_CheckList: CheckListItem[];
  previewForm_TableList: TableListItem[];
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

const BDOPreviewScreen = ({ route, navigation }: any) => {
  const { userID, token } = useAuth();
  const { villageName, villageId, formNo } = route.params;

  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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

  const fetchPreviewBDOForm = async () => {
    try {
      setLoading(true);

      console.log(token);

      const requestBody = {
        LGDCode: String(villageName ?? ''),
        PanchayatUserId: String(villageId ?? ''),
        FormNo: String(formNo ?? '1'),
        CurrentUseriD: String(userID ?? ''),
        RoleId: '3',
      };

      console.log('Preview BDO Form Request:', requestBody);

      const url = `${API_BASE_URL}/BDOActions/PreviewBDOForm`;

      const response = await fetch(
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

      const result = await response.json();

      console.log('Preview BDO Form Response:', result);

      if (!response.ok) {
        throw new Error(
          result?.responseMessage || 'Unable to fetch preview form',
        );
      }

      if (
        !result ||
        !Array.isArray(result.formQuestionID) ||
        !Array.isArray(result.previewFormQuestionLst)
      ) {
        Alert.alert(
          'Error',
          'Invalid preview form response received from server.',
        );
        // showCustomAlert(
        //   'error',
        //   'Invalid preview form response received from server.',
        // );
        setPreviewData(null);
        return;
      }

      setPreviewData({
        formQuestionID: result.formQuestionID || [],
        previewFormQuestionLst: result.previewFormQuestionLst || [],
        previewForm_TextBoxList: result.previewForm_TextBoxList || [],
        previewForm_DropDownList: result.previewForm_DropDownList || [],
        previewForm_CheckList: result.previewForm_CheckList || [],
        previewForm_TableList: result.previewForm_TableList || [],
      });

      setIsCompleted(
        String(result?.formQuestionID?.[0]?.isFromFinalSubmitFlag ?? '0') ===
          '1',
      );
    } catch (error: any) {
      console.log('Preview BDO Form API Error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Unable to load BDO preview form.',
      );

      // showCustomAlert(
      //   'error',
      //   error?.message || 'Unable to load BDO preview form.',
      // );

      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID && token) {
      fetchPreviewBDOForm();
    }
  }, [userID, token]);

  const basicInfo = previewData?.formQuestionID?.[0];

  const groupedQuestions = useMemo(() => {
    if (!previewData?.previewFormQuestionLst) {
      return [];
    }

    const groups: {
      questionId: string;
      questionName: string;
      questions: PreviewQuestion[];
    }[] = [];

    previewData.previewFormQuestionLst.forEach(item => {
      const existingGroup = groups.find(
        group => group.questionId === item.rdFormQuestionID,
      );

      if (existingGroup) {
        // Prevent duplicate elementmstid
        const alreadyExists = existingGroup.questions.some(
          question => question.elementmstid === item.elementmstid,
        );

        if (!alreadyExists) {
          existingGroup.questions.push(item);
        }
      } else {
        groups.push({
          questionId: item.rdFormQuestionID,
          questionName: item.rdFormQuestionName,
          questions: [item],
        });
      }
    });

    return groups;
  }, [previewData]);

  const getTextBoxValue = (item: PreviewQuestion) => {
    const textbox = previewData?.previewForm_TextBoxList?.find(
      text =>
        String(text.elementMstId) === String(item.elementmstid) &&
        String(text.questionId) === String(item.rdFormQuestionID),
    );

    return textbox?.textBoxVal ?? '-';
  };

  const getDropDownValue = (item: PreviewQuestion) => {
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

  const getCheckBoxValues = (item: PreviewQuestion) => {
    return (
      previewData?.previewForm_CheckList?.filter(
        checkbox =>
          String(checkbox.elementMstId) === String(item.elementmstid) &&
          String(checkbox.questionId) === String(item.rdFormQuestionID) &&
          checkbox.chkVal === true,
      ) || []
    );
  };

  const getMarks = (questionName: string) => {
    if (!questionName) {
      return '-';
    }

    const match = questionName.match(/Marks\s*-\s*:\s*(.*)$/i);

    if (match?.[1]) {
      return match[1].trim();
    }

    return '-';
  };

  const getSectionTitle = (questionName: string) => {
    if (!questionName) {
      return '';
    }

    return questionName.replace(/\s*-\s*Marks\s*-\s*:.*$/i, '').trim();
  };

  const renderTextBox = (item: PreviewQuestion) => {
    const value = getTextBoxValue(item);

    return (
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.readOnlyValueBox}>
          <Text style={styles.readOnlyValueText}>{value}</Text>
        </View>
      </View>
    );
  };

  const renderDropDown = (item: PreviewQuestion) => {
    const value = getDropDownValue(item);

    return (
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.readOnlyValueBox1}>
          <Text style={styles.readOnlyValueText}>{value}</Text>

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
  const renderCheckBox = (item: PreviewQuestion) => {
    const checkedItems = getCheckBoxValues(item);

    return (
      <View style={styles.answerContainer1}>
        <Text style={styles.answerLabel}>उत्तर :-</Text>

        <View style={styles.checkboxPreviewContainer}>
          {checkedItems.length > 0 ? (
            checkedItems.map(check => (
              <View
                key={`${item.elementmstid}_${check.chkID}`}
                style={styles.checkboxRow}
              >
                <Icon
                  name="checkbox-marked"
                  size={22}
                  color={COLORS.textSecondary}
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

  const renderTable = (item: PreviewQuestion) => {
    // Get table data for current question + element
    const tableData = previewData?.previewForm_TableList?.filter(
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

    // Group cells by row number
    const rows: { [key: string]: typeof tableData } = {};

    tableData.forEach(cell => {
      const rowNo = String(cell.rdtblTableRowsNum);

      if (!rows[rowNo]) {
        rows[rowNo] = [];
      }

      rows[rowNo].push(cell);
    });

    // Sort rows numerically
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.tableScroll}
        >
          <View style={styles.previewTable}>
            {sortedRows.map((row, rowIndex) => {
              const isHeader = rowIndex === 0;

              return (
                <View
                  key={`row-${rowIndex}`}
                  style={[
                    styles.previewTableRow,
                    isHeader && styles.previewTableHeaderRow,
                  ]}
                >
                  {row.map((cell, columnIndex) => {
                    //  const value =
                    //     cell.rdtblElementVal !== null &&
                    //     cell.rdtblElementVal !== undefined &&
                    //     String(cell.rdtblElementVal).trim() !== ''
                    //       ? String(cell.rdtblElementVal)
                    //       : cell.rdtblTableFieldName || '-';
                    const value =
                      cell.rdtblElementVal !== null &&
                      cell.rdtblElementVal !== undefined &&
                      String(cell.rdtblElementVal).trim() !== ''
                        ? String(cell.rdtblElementVal)
                        : String(cell.rdtblInputType) === '4'
                        ? '-'
                        : cell.rdtblTableFieldName || '-';

                    return (
                      <View
                        key={`cell-${rowIndex}-${columnIndex}`}
                        style={[
                          styles.previewTableCell,
                          isHeader && styles.previewTableHeaderCell,
                        ]}
                      >
                        <Text
                          style={[
                            styles.previewTableCellText,
                            isHeader && styles.previewTableHeaderText,
                          ]}
                        >
                          {value}
                        </Text>
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

  const renderQuestion = (item: PreviewQuestion) => {
    const elementType = String(item.rdFormElementId);

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
          <Text style={styles.questionNumber}>{item.rdFormElementNo}.</Text>

          <Text style={styles.questionText}>{item.rdFormLableName}</Text>
        </View>

        {elementType === BDO_ELEMENT.TEXTBOX && renderTextBox(item)}

        {elementType === BDO_ELEMENT.DROPDOWN && renderDropDown(item)}

        {elementType === BDO_ELEMENT.CHECKBOX && renderCheckBox(item)}

        {elementType === BDO_ELEMENT.TABLE && renderTable(item)}

        {elementType !== BDO_ELEMENT.TEXTBOX &&
          elementType !== BDO_ELEMENT.DROPDOWN &&
          elementType !== BDO_ELEMENT.CHECKBOX &&
          elementType !== BDO_ELEMENT.LABEL &&
          elementType !== BDO_ELEMENT.TABLE && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerLabel}>उत्तर :-</Text>
              <Text style={styles.noAnswerText}>NA</Text>
            </View>
          )}
      </View>
    );
  };

  const handleFinalPreviewSubmit = async () => {
    try {
      setLoading(true);

      const requestBody = {
        PanchayatUserId: String(villageId ?? ''),
        FormNo: String(formNo ?? '1'),
        CurrentUseriD: String(userID ?? ''),
        RoleID: '3',
      };

      console.log('Final BDO Submit Request:', requestBody);

      const url = `${API_BASE_URL}/BDOActions/BDOFormFinalSubmit`;

      const response = await fetch(
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

      const result = await response.json();

      console.log('Final BDO Submit Response:', result);

      if (result?.success === true && result?.status === 1) {
        Alert.alert(
          'Success',
          result?.message || 'Form submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'BDOHome' }],
                });
              },
            },
          ],
        );
        // showCustomAlert(
        //   'success',
        //   result?.message || 'Form submitted successfully.',
        // );
        // setTimeout(() => {
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'BDOHome' }],
        //   });
        // }, 2000);
      } else {
        Alert.alert('Error', result?.message || 'Unable to submit the form.');
        // showCustomAlert(
        //   'error',
        //   result?.message || 'Unable to submit the form.',
        // );
      }
    } catch (error: any) {
      console.log('Final BDO Submit Error:', error);

      Alert.alert('Error', 'Something went wrong while submitting the form.');
      // showCustomAlert(
      //   'error',
      //   'Something went wrong while submitting the form.',
      // );
    } finally {
      setLoading(false);
    }
  };

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

  if (!previewData || !basicInfo) {
    return (
      <View style={styles.loaderContainer}>
        <Icon name="alert-circle-outline" size={50} color="#777" />

        <Text style={styles.noDataText}>No preview data available</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchPreviewBDOForm()}
        >
          <Text style={styles.retryButtonText}>RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>BDO FORM PREVIEW</Text>

          {/* <Text style={styles.headerSubtitle}>
            {' '}
            ग्रामपंचायत : {basicInfo?.panchayatName || '-'} | तालुका :{' '}
            {basicInfo?.panchayatUserTalukaName || '-'} | जिल्हा :{' '}
            {basicInfo?.panchayatUserDistrictName || '-'}{' '}
          </Text> */}

          <Text style={styles.headerSubtitle}>
            LGD Code : {villageName} | लोक श्रेणी :{' '}
            {basicInfo?.peoplegrade || ''}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {groupedQuestions.map(section => (
          <View key={section.questionId} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>
                  {section.questionId}
                </Text>
              </View>

              <View style={styles.sectionHeaderContent}>
                <Text style={styles.sectionTitle}>
                  {getSectionTitle(section.questionName)}
                </Text>

                <Text style={styles.sectionMarks}>
                  Marks : {getMarks(section.questionName)}
                </Text>
              </View>
            </View>
            {section.questions.map(item => renderQuestion(item))}
          </View>
        ))}

        {isCompleted ? (
          <View style={styles.submittedContainer}>
            <Icon name="check-circle" size={24} color="#2E7D32" />

            <Text style={styles.submittedText}>Form has been submitted</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.acceptRow}
              activeOpacity={0.8}
              onPress={() => setIsAccepted(previous => !previous)}
            >
              <Icon
                name={isAccepted ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={isAccepted ? COLORS.primary : '#777'}
              />

              <Text style={styles.acceptText}>
                स्वीकार (Disclaimer): सदर फॉर्ममधील भरलेली माहिती काळजीपूर्वक
                तपासून, माहिती योग्य असल्याची खात्री झाल्यानंतरच ‘Final Preview
                Submit’ बटणावर क्लिक करावे. ‘Final Preview Submit’ केल्यानंतर
                माहितीमध्ये कोणताही बदल करता येणार नाही, याची नोंद घ्यावी.
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.finalSubmitButton,
                  !isAccepted && styles.finalSubmitButtonDisabled,
                ]}
                disabled={!isAccepted}
                onPress={handleFinalPreviewSubmit}
                activeOpacity={0.8}
              >
                <Icon name="check-circle-outline" size={18} color="#FFFFFF" />

                <Text style={styles.finalSubmitText}>FINAL PREVIEW SUBMIT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToFormButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Icon name="arrow-left" size={18} color="#FFFFFF" />

                <Text style={styles.backToFormText}>BACK TO MAIN FORM</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

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

export default BDOPreviewScreen;

const styles = StyleSheet.create({
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
    paddingBottom: 40,
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

  sectionHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 9,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
    width: 30,
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },

  questionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '400',
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
    color: '#1E293B',
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

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  checkboxText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: '#000',
    lineHeight: 20,
    fontWeight: '600',
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
    color: '#334155',
    lineHeight: 21,
  },

  actionButtonsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 16,
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

  // finalSubmitButton: {
  //   marginTop: 16,
  //   backgroundColor: '#2E7D32',
  //   minHeight: 48,
  //   borderRadius: 9,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 18,
  //   elevation: 3,
  //   shadowColor: '#2E7D32',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  // },

  // finalSubmitButtonDisabled: {
  //   backgroundColor: '#AEB4BB',
  //   elevation: 0,
  //   shadowOpacity: 0,
  // },

  // finalSubmitText: {
  //   marginLeft: 8,
  //   color: '#FFFFFF',
  //   fontSize: 14,
  //   fontWeight: '600',
  //   letterSpacing: 0.2,
  // },

  /* ==============================================================
     BACK
  ============================================================== */

  // backToFormButton: {
  //   marginTop: 10,
  //   minHeight: 48,
  //   borderRadius: 9,
  //   borderWidth: 1,
  //   borderColor: '#1565C0',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#FFFFFF',
  //   elevation: 1,
  // },

  // backToFormText: {
  //   marginLeft: 8,
  //   color: '#1565C0',
  //   fontSize: 12,
  //   fontWeight: '600',
  // },
});
