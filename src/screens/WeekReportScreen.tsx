import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  primary: '#0B4FA3',
  primaryLight: '#E7F0FB',

  background: '#F3F6FA',
  card: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#64748B',

  border: '#CBD5E1',

  danger: '#C62828',
  dangerLight: '#FFF1F1',

  infoBackground: '#E8F6FA',
  infoBorder: '#25A7BD',
};

type VisitRecord = {
  id: number;
  week: string;
  villageVisitCount: number;
  webLink: string;
};

const WeekReportScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [visitDone, setVisitDone] = useState('');
  const [grampanchayat, setGrampanchayat] = useState('');

  const [villageVisitCount, setVillageVisitCount] =
    useState('');

  const [webLink, setWebLink] = useState('');

  const [selectedFile, setSelectedFile] =
    useState<string | null>(null);

  const [searchText, setSearchText] = useState('');

  const [records] = useState<VisitRecord[]>([]);

  const handleChooseFile = () => {
    // integrate document/image picker here
    setSelectedFile('weekly_visit_photo.jpg');
  };

  const handleSubmit = () => {
    if (!selectedWeek) {
      Alert.alert(
        'सूचना',
        'कृपया आठवडा निवडा.',
      );
      return;
    }

    if (!visitDone) {
      Alert.alert(
        'सूचना',
        'या आठवड्यात गावाला भेट दिली आहे का ते निवडा.',
      );
      return;
    }

    if (!grampanchayat) {
      Alert.alert(
        'सूचना',
        'कृपया ग्रामपंचायत निवडा.',
      );
      return;
    }

    if (!selectedFile) {
      Alert.alert(
        'सूचना',
        'कृपया फोटो अपलोड करा.',
      );
      return;
    }

    if (!villageVisitCount.trim()) {
      Alert.alert(
        'सूचना',
        'गाव भेटींची संख्या प्रविष्ट करा.',
      );
      return;
    }

    console.log({
      selectedWeek,
      visitDone,
      grampanchayat,
      villageVisitCount,
      webLink,
      selectedFile,
    });

    // API call here

    Alert.alert(
      'यशस्वी',
      'माहिती यशस्वीरित्या जतन झाली.',
    );
  };

  const handleClear = () => {
    setSelectedWeek('');
    setVisitDone('');
    setGrampanchayat('');
    setVillageVisitCount('');
    setWebLink('');
    setSelectedFile(null);
  };

  const filteredRecords = useMemo(() => {
    if (!searchText.trim()) {
      return records;
    }

    const search = searchText.toLowerCase();

    return records.filter(
      item =>
        item.week.toLowerCase().includes(search) ||
        item.webLink.toLowerCase().includes(search),
    );
  }, [records, searchText]);

  const renderRecord = ({
    item,
  }: {
    item: VisitRecord;
  }) => {
    return (
      <View style={styles.recordCard}>

        <View style={styles.recordHeader}>
          <View>
            <Text style={styles.recordTitle}>
              {item.week}
            </Text>

            <Text style={styles.recordSubTitle}>
              Weekly Visit
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {item.villageVisitCount}
            </Text>
          </View>
        </View>

        <View style={styles.recordDivider} />

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>
            Village Visit Count
          </Text>

          <Text style={styles.recordValue}>
            {item.villageVisitCount}
          </Text>
        </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>
            Web Link
          </Text>

          <Text
            style={[
              styles.recordValue,
              styles.linkText,
            ]}>
            {item.webLink || '-'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewButton}>

            <Icon
              name="eye-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.viewButtonText}>
              View
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            साप्ताहिक गाव भेट
          </Text>

          <Text style={styles.headerSubtitle}>
            आठवड्यात केलेल्या गावभेटींचा तपशील भरा
          </Text>
        </View>

        {/* FORM */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            गावभेट तपशील
          </Text>

          {/* WEEK */}

          <Text style={styles.label}>
            आठवडा निवडा
            <Text style={styles.required}>
              {' '}*
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              // replace with dropdown
              setSelectedWeek('Week 1');
            }}>

            <Text
              style={
                selectedWeek
                  ? styles.selectValue
                  : styles.placeholderText
              }>
              {selectedWeek || 'Select Week'}
            </Text>

            <Icon
              name="chevron-down"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* VISIT DONE */}

          <Text style={styles.label}>
            या आठवड्यात आपण कोणत्याही गावाला भेट दिली आहे का?
            <Text style={styles.required}>
              {' '}*
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              setVisitDone(
                visitDone === 'हो'
                  ? 'नाही'
                  : 'हो',
              );
            }}>

            <Text
              style={
                visitDone
                  ? styles.selectValue
                  : styles.placeholderText
              }>
              {visitDone || 'Select Week visits'}
            </Text>

            <Icon
              name="chevron-down"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* GRAMPANCHAYAT */}

          <Text style={styles.label}>
            ग्रामपंचायत निवडा
            <Text style={styles.required}>
              {' '}*
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              setGrampanchayat('Anjale');
            }}>

            <Text
              style={
                grampanchayat
                  ? styles.selectValue
                  : styles.placeholderText
              }>
              {grampanchayat ||
                'Select Grampanchayat'}
            </Text>

            <Icon
              name="chevron-down"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* FILE */}

          <Text style={styles.label}>
            फोटो अपलोड करा
            <Text style={styles.required}>
              {' '}*
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.fileBox}
            onPress={handleChooseFile}>

            <View style={styles.fileIconContainer}>
              <Icon
                name="image-plus"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.fileTitle}>
                फोटो निवडा
              </Text>

              <Text
                style={styles.fileName}
                numberOfLines={1}>
                {selectedFile ||
                  'No file chosen'}
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={22}
              color="#94A3B8"
            />
          </TouchableOpacity>

          {/* COUNT */}

          <Text style={styles.label}>
            आठवड्यात भेट दिलेल्या गावांची संख्या
            <Text style={styles.required}>
              {' '}*
            </Text>
          </Text>

          <View style={styles.inputContainer}>
            <Icon
              name="counter"
              size={21}
              color={COLORS.textSecondary}
            />

            <TextInput
              value={villageVisitCount}
              onChangeText={setVillageVisitCount}
              style={styles.input}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* WEB LINK */}

          <Text style={styles.label}>
            Weblink
          </Text>

          <View style={styles.inputContainer}>
            <Icon
              name="link-variant"
              size={21}
              color={COLORS.textSecondary}
            />

            <TextInput
              value={webLink}
              onChangeText={setWebLink}
              style={styles.input}
              placeholder="https://www.example.com"
              autoCapitalize="none"
              keyboardType="url"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* BUTTONS */}

          <View style={styles.buttonRow}>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>

              <Icon
                name="check"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.submitButtonText}>
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}>

              <Icon
                name="refresh"
                size={19}
                color={COLORS.primary}
              />

              <Text style={styles.clearButtonText}>
                Clear
              </Text>
            </TouchableOpacity>

          </View>

        </View>

        {/* TIPS */}

        <View style={styles.tipCard}>

          <View style={styles.tipHeader}>
            <Icon
              name="information-outline"
              size={21}
              color={COLORS.primary}
            />

            <Text style={styles.tipTitle}>
              टीप
            </Text>
          </View>

          <Text style={styles.tipText}>
            • प्रत्येक गावासाठी केवळ एक फोटो अपलोड करा.
          </Text>

          <Text style={styles.tipText}>
            • एकापेक्षा अधिक फोटो असल्यास ते PDF स्वरूपात एकत्र करून अपलोड करा.
          </Text>

          <Text style={styles.tipText}>
            • अपलोड फाईलची कमाल साईज 15 MB आहे.
          </Text>

          <Text style={styles.tipText}>
            • संबंधित गाव निवडा आणि त्यानंतर फोटो अपलोड करा.
          </Text>

        </View>

        {/* REPORT LIST */}

        <View style={styles.reportSection}>

          <Text style={styles.sectionTitle}>
            साप्ताहिक भेट नोंदी
          </Text>

          <View style={styles.searchBox}>

            <Icon
              name="magnify"
              size={21}
              color={COLORS.textSecondary}
            />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              placeholder="Search by Taluka / Grampanchayat"
              placeholderTextColor="#94A3B8"
            />

            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  setSearchText('')
                }>
                <Icon
                  name="close-circle"
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            )}

          </View>

          {filteredRecords.length > 0 ? (

            <FlatList
              data={filteredRecords}
              keyExtractor={item =>
                item.id.toString()
              }
              renderItem={renderRecord}
              scrollEnabled={false}
            />

          ) : (

            <View style={styles.emptyContainer}>

              <Icon
                name="clipboard-text-search-outline"
                size={44}
                color="#94A3B8"
              />

              <Text style={styles.emptyTitle}>
                No records found
              </Text>

              <Text style={styles.emptySubtitle}>
                साप्ताहिक भेट नोंदी उपलब्ध नाहीत.
              </Text>

            </View>

          )}

        </View>

      </ScrollView>

    </View>
  );
};

export default WeekReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#DCEAFB',
    fontSize: 13,
    marginTop: 4,
  },

  card: {
    margin: 14,
    backgroundColor: COLORS.card,
    padding: 17,
    borderRadius: 14,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    lineHeight: 20,
  },

  required: {
    color: '#D32F2F',
  },

  selectBox: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 13,
    marginBottom: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#FFFFFF',
  },

  placeholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  selectValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
  },

  inputContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 13,
    marginBottom: 18,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingLeft: 10,
    paddingVertical: 0,
  },

  fileBox: {
    minHeight: 65,
    borderWidth: 1,
    borderColor: '#BBD1EB',
    borderRadius: 10,
    backgroundColor: '#F8FBFF',

    paddingHorizontal: 12,
    marginBottom: 18,

    flexDirection: 'row',
    alignItems: 'center',
  },

  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 9,

    backgroundColor: COLORS.primaryLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
  },

  fileTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  fileName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  submitButton: {
    flex: 1,
    height: 49,

    backgroundColor: COLORS.primary,
    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  clearButton: {
    flex: 1,
    height: 49,

    borderWidth: 1,
    borderColor: '#B9D3F3',
    backgroundColor: '#F6FAFF',
    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  clearButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  tipCard: {
    marginHorizontal: 14,
    marginBottom: 14,

    borderRadius: 12,

    backgroundColor: COLORS.infoBackground,

    borderLeftWidth: 4,
    borderLeftColor: COLORS.infoBorder,

    padding: 15,
  },

  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },

  tipTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },

  tipText: {
    color: '#355468',
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 3,
  },

  reportSection: {
    marginHorizontal: 14,
    marginBottom: 25,

    padding: 16,

    borderRadius: 14,

    backgroundColor: COLORS.card,

    elevation: 2,
  },

  searchBox: {
    minHeight: 48,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,

    backgroundColor: '#F8FAFC',

    paddingHorizontal: 12,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,

    fontSize: 14,
    color: COLORS.textPrimary,

    paddingVertical: 0,
  },

  recordCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',

    borderRadius: 11,

    padding: 14,

    marginBottom: 12,

    backgroundColor: '#FFFFFF',
  },

  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  recordTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  recordSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 38,
    height: 32,
    borderRadius: 16,

    backgroundColor: COLORS.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
  },

  countBadgeText: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  recordDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },

  recordRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  recordLabel: {
    width: '45%',
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  recordValue: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },

  linkText: {
    color: COLORS.primary,
  },

  actionRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  viewButton: {
    minHeight: 38,

    paddingHorizontal: 14,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: '#B9D3F3',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },

  viewButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },

  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});