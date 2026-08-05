/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';

type SectionType = 'stage1' | 'stage2';

interface TableRow {
  id: number;
  activityName: string;
  count: string;
  documentName: string;
}

const FORM_STEPS = [
  { id: 1, title: '1' },
  { id: 2, title: '2' },
  { id: 3, title: '3' },
  { id: 4, title: '4' },
  { id: 5, title: '5' },
  { id: 6, title: '6' },
  { id: 7, title: '7' },
  { id: 8, title: '8' },
];

const dropdownOptions = [
  { label: 'ग्रामपंचायत', value: '1' },
  { label: 'नगरपंचायत', value: '2' },
  { label: 'महानगरपालिका', value: '3' },
];

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

const StageForm2 = () => {
  const [activeForm, setActiveForm] = useState(1);
  const [activeSection, setActiveSection] =
    useState<SectionType>('stage1');

  const [editedData, setEditedData] = useState({
    villageName: 'नाहूर',
    localBody: '1',
    population: '12500',
    selectedFacilities: ['1', '3'],
    fileName: '',
  });

  const [tableRows, setTableRows] = useState<TableRow[]>([
    {
      id: 1,
      activityName: 'स्वच्छता अभियान',
      count: '120',
      documentName: 'activity_photo.jpg',
    },
    {
      id: 2,
      activityName: 'वृक्षारोपण',
      count: '75',
      documentName: '',
    },
  ]);

  const stage1Data = {
    villageName: 'नाहूर',
    localBody: 'ग्रामपंचायत',
    population: '12000',
    selectedFacilities: ['पिण्याचे पाणी', 'आरोग्य केंद्र'],
    fileName: 'stage1_document.pdf',
    tableRows: [
      {
        id: 1,
        activityName: 'स्वच्छता अभियान',
        count: '100',
        documentName: 'old_activity_photo.jpg',
      },
      {
        id: 2,
        activityName: 'वृक्षारोपण',
        count: '50',
        documentName: 'plantation.pdf',
      },
    ],
  };

  const toggleCheckbox = (value: string) => {
    setEditedData(previous => {
      const selected = previous.selectedFacilities;

      return {
        ...previous,
        selectedFacilities: selected.includes(value)
          ? selected.filter(item => item !== value)
          : [...selected, value],
      };
    });
  };

  const updateTableValue = (
    rowIndex: number,
    key: 'activityName' | 'count',
    value: string,
  ) => {
    setTableRows(previous =>
      previous.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]: value,
            }
          : row,
      ),
    );
  };

  
  


  const handleSaveDraft = () => {
    Alert.alert('Success', 'Stage 2 data saved as draft.');
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Stage 2 data submitted successfully.');
  };

  const renderStageSelector = (label1: string, label2: string) => {
    return (
      <View style={styles.sectionSelector}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.sectionSelectorButton,
            activeSection === 'stage1' &&
              styles.activeSectionSelectorButton,
          ]}
          onPress={() => setActiveSection('stage1')}
        >
          <Icon
            name="database-eye-outline"
            size={20}
            color={activeSection === 'stage1' ? '#FFFFFF' : COLORS.primary}
          />

          <View style={styles.sectionSelectorTextContainer}>
            <Text
              style={[
                styles.sectionSelectorTitle,
                activeSection === 'stage1' &&
                  styles.activeSectionSelectorText,
              ]}
            >
             {label1}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.sectionSelectorButton,
            activeSection === 'stage2' &&
              styles.activeSectionSelectorButton,
          ]}
          onPress={() => setActiveSection('stage2')}
        >
          <Icon
            name="file-edit-outline"
            size={20}
            color={activeSection === 'stage2' ? '#FFFFFF' : COLORS.primary}
          />

          <View style={styles.sectionSelectorTextContainer}>
            <Text
              style={[
                styles.sectionSelectorTitle,
                activeSection === 'stage2' &&
                  styles.activeSectionSelectorText,
              ]}
            >
              {label2}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReadOnlyValue = (value: string) => {
    return (
      <View style={styles.readOnlyInput}>
        <Text style={styles.readOnlyValue}>
          {value || 'Not provided'}
        </Text>
        </View>
    );
  };

   const viewDocument = (): void => {
      Alert.alert('Document Viewer', 'This would open the document viewer.');
    }

  const renderStage1Section = (mainlabel:String,formname:String) => {
   

    return (
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Icon name="history" size={22} color="#0B63B6" />
          </View>

          <View style={styles.cardHeaderTextContainer}>
            <Text style={styles.cardTitle}>
              {mainlabel}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle1}>
              {formname}
            </Text>

        <Text style={styles.fieldLabel}>
          1. गावाचे / शहराचे नाव
        </Text>
        {renderReadOnlyValue(stage1Data.villageName)}

        <Text style={styles.fieldLabel}>
          2. स्थानिक स्वराज्य संस्थेचा प्रकार
        </Text>
        {renderReadOnlyValue(stage1Data.localBody)}

        <Text style={styles.fieldLabel}>
          3. एकूण लोकसंख्या
        </Text>
        {renderReadOnlyValue(stage1Data.population)}

        <Text style={styles.fieldLabel}>
          4. उपलब्ध सुविधा
        </Text>

        <View style={styles.readOnlyCheckboxContainer}>
          {stage1Data.selectedFacilities.map(item => (
            <View key={item} style={styles.readOnlyCheckboxRow}>
              <Icon
                name="checkbox-marked"
                size={22}
                color="#0B63B6"
              />
              <Text style={styles.readOnlyCheckboxText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.fieldLabel}>
          5. अपलोड केलेले कागदपत्र
        </Text>

        <View style={styles.documentCard}>

          <View style={styles.documentDetails}>
            <Text style={styles.documentName} numberOfLines={1}>
              {stage1Data.fileName}
            </Text>
          </View>

          <TouchableOpacity onPress={viewDocument} style={styles.previewIconButton}>
            <Icon name="eye-outline" size={21} color="#0B63B6" />
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>
          6. उपक्रमांचा तपशील
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.tableScrollContent}
        >
          <View>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.srNoCell]}>
                अ. क्र.
              </Text>
              <Text style={[styles.tableHeaderCell, styles.activityCell]}>
                उपक्रमाचे नाव
              </Text>
              <Text style={[styles.tableHeaderCell, styles.countCell]}>
                नागरिक संख्या
              </Text>
              <Text style={[styles.tableHeaderCell, styles.fileCell]}>
                कागदपत्र
              </Text>
            </View>

            {stage1Data.tableRows.map((row, index) => (
              <View key={row.id} style={styles.readOnlyTableRow}>
                <Text style={[styles.tableValueCell, styles.srNoCell]}>
                  {index + 1}
                </Text>

                <Text
                  style={[
                    styles.tableValueCell,
                    styles.activityCell,
                  ]}
                >
                  {row.activityName}
                </Text>

                <Text
                  style={[styles.tableValueCell, styles.countCell]}
                >
                  {row.count}
                </Text>

                <View
                  style={[
                    styles.tableValueCellContainer,
                    styles.fileCell,
                  ]}
                >
                  <Text
                    style={styles.tableFileName}
                    numberOfLines={1}
                  >
                    {row.documentName}
                  </Text>

                  <Icon name="eye-outline" size={21} color="#0B63B6" />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderStage2Section = (mainlabel:String,formname:String) => {
    return (
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <View style={styles.editCardHeaderIcon}>
            <Icon name="pencil-outline" size={22} color="#FFFFFF" />
          </View>

          <View style={styles.cardHeaderTextContainer}>
            <Text style={styles.cardTitle}>
              {mainlabel}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle1}>
             {formname}
            </Text>
        <Text style={styles.fieldLabel}>
          1. गावाचे / शहराचे नाव
          <Text style={styles.requiredMark}> *</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="गावाचे / शहराचे नाव"
          placeholderTextColor="#8A918E"
          value={editedData.villageName}
          onChangeText={text =>
            setEditedData(previous => ({
              ...previous,
              villageName: text,
            }))
          }
        />

        <Text style={styles.fieldLabel}>
          2. स्थानिक स्वराज्य संस्थेचा प्रकार
          <Text style={styles.requiredMark}> *</Text>
        </Text>

        <Dropdown
          style={styles.dropdown}
          data={dropdownOptions}
          labelField="label"
          valueField="value"
          value={editedData.localBody}
          placeholder="निवडा"
          onChange={item =>
            setEditedData(previous => ({
              ...previous,
              localBody: item.value,
            }))
          }
        />

        <Text style={styles.fieldLabel}>
          3. एकूण लोकसंख्या
          <Text style={styles.requiredMark}> *</Text>
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="लोकसंख्या प्रविष्ट करा"
          placeholderTextColor="#8A918E"
          value={editedData.population}
          onChangeText={text =>
            setEditedData(previous => ({
              ...previous,
              population: text.replace(/[^0-9]/g, ''),
            }))
          }
        />

        <Text style={styles.fieldLabel}>
          4. उपलब्ध सुविधा
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleCheckbox('1')}
        >
          <Icon
            name={
              editedData.selectedFacilities.includes('1')
                ? 'checkbox-marked'
                : 'checkbox-blank-outline'
            }
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.checkboxLabel}>पिण्याचे पाणी</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleCheckbox('2')}
        >
          <Icon
            name={
              editedData.selectedFacilities.includes('2')
                ? 'checkbox-marked'
                : 'checkbox-blank-outline'
            }
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.checkboxLabel}>शाळा</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleCheckbox('3')}
        >
          <Icon
            name={
              editedData.selectedFacilities.includes('3')
                ? 'checkbox-marked'
                : 'checkbox-blank-outline'
            }
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.checkboxLabel}>आरोग्य केंद्र</Text>
        </TouchableOpacity>

        <View style={styles.tableTitleRow}>
          <Text style={styles.fieldLabel}>
            5. उपक्रमांचा सुधारित तपशील
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.tableScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.srNoCell]}>
                अ. क्र.
              </Text>
              <Text style={[styles.tableHeaderCell, styles.activityCell]}>
                उपक्रमाचे नाव
              </Text>
              <Text style={[styles.tableHeaderCell, styles.countCell]}>
                नागरिक संख्या
              </Text>
            </View>

            {tableRows.map((row, rowIndex) => (
              <View key={row.id} style={styles.editableTableRow}>
                <View
                  style={[
                    styles.tableInputCellContainer,
                    styles.srNoCell,
                  ]}
                >
                  <Text style={styles.rowNumber}>{rowIndex + 1}</Text>
                </View>

                <View
                  style={[
                    styles.tableInputCellContainer,
                    styles.activityCell,
                  ]}
                >
                  <TextInput
                    style={styles.tableInput}
                    value={row.activityName}
                    placeholder="उपक्रम"
                    placeholderTextColor="#929894"
                    onChangeText={text =>
                      updateTableValue(
                        rowIndex,
                        'activityName',
                        text,
                      )
                    }
                  />
                </View>

                <View
                  style={[
                    styles.tableInputCellContainer,
                    styles.countCell,
                  ]}
                >
                  <TextInput
                    style={styles.tableInput}
                    value={row.count}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#929894"
                    onChangeText={text =>
                      updateTableValue(
                        rowIndex,
                        'count',
                        text.replace(/[^0-9]/g, ''),
                      )
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.draftButton}
            onPress={handleSaveDraft}
          >
            <Icon
              name="content-save-outline"
              size={20}
              color="#A35A00"
            />
            <Text style={styles.draftButtonText}>BDO Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              BDO Submit
            </Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>FORM 2 : सक्षम पंचायत (स्वनिधी व लोकवर्गणी)</Text>
          <Text style={styles.headerSubtitle}>
            Good Governance
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Form Progress
            </Text>

            <Text style={styles.progressCount}>
              {activeForm}/8
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepsContainer}
          >
            {FORM_STEPS.map(step => {
              const isActive = activeForm === step.id;
              const isCompleted = step.id < activeForm;

              return (
                <TouchableOpacity
                  key={step.id}
                  style={styles.stepWrapper}
                  onPress={() => setActiveForm(step.id)}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.activeStepCircle,
                      isCompleted && styles.completedStepCircle,
                    ]}
                  >
                    {isCompleted ? (
                      <Icon
                        name="check"
                        size={17}
                        color="#FFFFFF"
                      />
                    ) : (
                      <Text
                        style={[
                          styles.stepText,
                          isActive && styles.activeStepText,
                        ]}
                      >
                        {step.title}
                      </Text>
                    )}
                  </View>

                  {step.id !== FORM_STEPS.length && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.completedStepLine,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.questionHeader}>
         
        </View>

        {renderStageSelector('ग्रामपंचायतीने भरलेली माहिती फॉर्म','तालुका स्तरीय तपासणी समितीने भरावयाचा फॉर्म')}

        {activeSection === 'stage1'
          ? renderStage1Section('ग्रामपंचायतीने भरलेली माहिती फॉर्म','2.1) : कर व पाणीपट्टी वसुली - Marks - : 6.0375 / 7 ')
          : renderStage2Section('तालुका स्तरीय तपासणी समितीने भरलेली माहिती फॉर्म(BDO)','2.1) : कर व पाणीपट्टी वसुली - Marks - : 6.0375 / 7')}
      </ScrollView>
    </View>
  );
};

export default StageForm2;

const styles = StyleSheet.create({
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
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#DCEBFA',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },

  mainScroll: {
    flex: 1,
  },

  mainContent: {
    padding: 14,
    paddingBottom: 40,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

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
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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

  sectionSelector: {
    flexDirection: 'row',
    backgroundColor: '#E8F1FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },

  sectionSelectorButton: {
    flex: 1,
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activeSectionSelectorButton: {
    backgroundColor: COLORS.primary,
  },

  sectionSelectorTextContainer: {
    flex: 1,
    marginLeft: 7,
  },

  sectionSelectorTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  sectionSelectorSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },

  activeSectionSelectorText: {
    color: '#FFFFFF',
  },

  activeSectionSelectorSubtitle: {
    color: '#DCEBFA',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    paddingTop:12
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

  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 9,
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
    minHeight: 47,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: '#3F7DB7',
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

  tableFileName: {
    flex: 1,
    color: '#41505D',
    fontSize: 11,
    marginLeft: 4,
  },

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

  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 24,
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
});