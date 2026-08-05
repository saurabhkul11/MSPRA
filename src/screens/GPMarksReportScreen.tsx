/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';

const GPMarksReportScreen = () => {
  const [selectedGP, setSelectedGP] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');

  // Static options for UI.
  // Replace these with API response later.
  const gramPanchayatList = [
    {label: 'Anjale', value: 'anjale'},
    {label: 'Borkheda Kh', value: 'borkheda'},
    {label: 'Amoda', value: 'amoda'},
    {label: 'Adgaon', value: 'adgaon'},
  ];

  const formList = [
    {label: 'Form 1', value: '1'},
    {label: 'Form 2', value: '2'},
    {label: 'Form 3', value: '3'},
    {label: 'Form 4', value: '4'},
    {label: 'Form 5', value: '5'},
    {label: 'Form 6', value: '6'},
    {label: 'Form 7', value: '7'},
    {label: 'Form 8', value: '8'},
  ];

  const questionList = [
    {label: 'Question 1', value: '1'},
    {label: 'Question 2', value: '2'},
    {label: 'Question 3', value: '3'},
  ];

  // Replace with API result later.
  const reportData: any[] = [];

  const handleDownloadExcel = () => {
    console.log('Download Excel', {
      selectedGP,
      selectedForm,
      selectedQuestion,
    });

    // Add Excel download API here.

    Alert.alert(
      'Download Excel',
      'Excel download API can be called here.',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* FILTER CARD */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardTitle}>
                GP Marks Report
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            ग्रामपंचायतीचे नाव
          </Text>

          <View style={styles.pickerContainer}>
            <Icon
              name="office-building-outline"
              size={21}
              color="#64748B"
              style={styles.leftIcon}
            />

            <Picker
              selectedValue={selectedGP}
              onValueChange={value => {
                setSelectedGP(value);

                // Reset child dropdowns
                setSelectedForm('');
                setSelectedQuestion('');

                // Fetch form list based on GP here
              }}
              style={styles.picker}
              dropdownIconColor="#64748B">

              <Picker.Item
                label="Select Grampanchayat"
                value=""
                color="#94A3B8"
              />

              {gramPanchayatList.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          {/* Form */}
          <Text style={styles.label}>
            घटकाचा प्रकार
          </Text>

          <View
            style={[
              styles.pickerContainer,
              !selectedGP && styles.disabledContainer,
            ]}>

            <Icon
              name="file-document-outline"
              size={21}
              color={
                selectedGP
                  ? '#64748B'
                  : '#AAB4C0'
              }
              style={styles.leftIcon}
            />

            <Picker
              enabled={!!selectedGP}
              selectedValue={selectedForm}
              onValueChange={value => {
                setSelectedForm(value);
                setSelectedQuestion('');

                // Fetch questions here
              }}
              style={styles.picker}
              dropdownIconColor="#64748B">

              <Picker.Item
                label="Select Form"
                value=""
                color="#94A3B8"
              />

              {formList.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          {/* Question */}
          <Text style={styles.label}>
            प्रश्न
          </Text>

          <View
            style={[
              styles.pickerContainer,
              !selectedForm &&
                styles.disabledContainer,
            ]}>

            <Icon
              name="help-circle-outline"
              size={21}
              color={
                selectedForm
                  ? '#64748B'
                  : '#AAB4C0'
              }
              style={styles.leftIcon}
            />

            <Picker
              enabled={!!selectedForm}
              selectedValue={selectedQuestion}
              onValueChange={value => {
                setSelectedQuestion(value);

                // Call report API here
              }}
              style={styles.picker}
              dropdownIconColor="#64748B">

              <Picker.Item
                label="Select Question"
                value=""
                color="#94A3B8"
              />

              {questionList.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          {/* Download */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.downloadButton}
            onPress={handleDownloadExcel}>

            <Icon
              name="microsoft-excel"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.downloadButtonText}>
              Download Excel
            </Text>
          </TouchableOpacity>
        </View>

        {/* RESULT */}
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultHeaderLeft}>
              <Icon
                name="chart-bar"
                size={22}
                color="#0B4FA3"
              />

              <Text style={styles.resultTitle}>
                अहवाल
              </Text>
            </View>

            {reportData.length > 0 && (
              <View style={styles.recordBadge}>
                <Text style={styles.recordBadgeText}>
                  {reportData.length}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {reportData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Icon
                  name="file-chart-outline"
                  size={38}
                  color="#8AA7C7"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No records found
              </Text>

              <Text style={styles.emptySubtitle}>
                अहवाल पाहण्यासाठी ग्रामपंचायत, फॉर्म
                आणि प्रश्न निवडा.
              </Text>
            </View>
          ) : (
            <View>
              {reportData.map((item, index) => (
                <View
                  key={index.toString()}
                  style={styles.reportRow}>

                  <Text style={styles.reportLabel}>
                    {item.question}
                  </Text>

                  <Text style={styles.reportValue}>
                    {item.marks}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

export default GPMarksReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  header: {
    minHeight: 75,
    backgroundColor: '#0B4FA3',
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#DCEAFB',
    fontSize: 12,
    marginTop: 3,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E7F0FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
     color: '#0B63B6',
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 7,
  },

  pickerContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },

  disabledContainer: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },

  leftIcon: {
    marginLeft: 13,
  },

  picker: {
    flex: 1,
    height: 52,
    color: '#0F172A',
  },

  downloadButton: {
    height: 49,
    backgroundColor: '#0B4FA3',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  recordBadge: {
    minWidth: 30,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E7F0FB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  recordBadgeText: {
    color: '#0B4FA3',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    paddingHorizontal: 25,
  },

  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },

  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },

  reportRow: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  reportLabel: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
  },

  reportValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B4FA3',
  },
});