/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type GPItem = {
  id: number;
  district: string;
  taluka: string;
  village: string;
  grampanchayatName: string;
  category: string;
  mobile: string;
  email: string;
  profileStatus: string;
  preQuestionStatus: string;
};

const PAGE_SIZE = 10;

const LDMSReportScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const data: GPItem[] = [
    {
      id: 1,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Anjale',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 2,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Borkheda Kh',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 3,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Amoda',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 4,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Adgaon',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 5,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Atrawal',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 6,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Borkhede Bru.',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 7,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Bhalshiv',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 8,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Borale',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 9,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Bamnod',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
    {
      id: 10,
      district: 'Jalgaon',
      taluka: 'Yawal',
      village: '-',
      grampanchayatName: 'Chikhali Bru.',
      category: '-',
      mobile: '-',
      email: '-',
      profileStatus: 'No',
      preQuestionStatus: 'No',
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchText.trim()) {
      return data;
    }

    const search = searchText.toLowerCase();

    return data.filter(
      item =>
        item.grampanchayatName.toLowerCase().includes(search) ||
        item.district.toLowerCase().includes(search) ||
        item.taluka.toLowerCase().includes(search) ||
        item.village.toLowerCase().includes(search),
    );
  }, [searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / PAGE_SIZE),
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const renderStatus = (status: string) => {
    const isYes = status.toLowerCase() === 'yes';

    return (
      <View
        style={[
          styles.statusBadge,
          isYes ? styles.yesBadge : styles.noBadge,
        ]}>
        <Icon
          name={isYes ? 'check-circle-outline' : 'close-circle-outline'}
          size={15}
          color={isYes ? '#18864B' : '#B42318'}
        />

        <Text
          style={[
            styles.statusText,
            {
              color: isYes ? '#18864B' : '#B42318',
            },
          ]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderItem = ({item}: {item: GPItem}) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.serialContainer}>
            <Text style={styles.serialText}>{item.id}</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.gpName}>
              {item.grampanchayatName}
            </Text>

            <Text style={styles.locationText}>
              {item.taluka}, {item.district}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>District</Text>
          <Text style={styles.value}>{item.district}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Taluka</Text>
          <Text style={styles.value}>{item.taluka}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Village</Text>
          <Text style={styles.value}>{item.village}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>लोकसंख्या श्रेणी</Text>
          <Text style={styles.value}>{item.category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>{item.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email ID</Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Profile Status</Text>
            {renderStatus(item.profileStatus)}
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>
              PreQuestion Status
            </Text>
            {renderStatus(item.preQuestionStatus)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Grampanchayat Details
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Icon
            name="magnify"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search Gram Panchayat..."
            placeholderTextColor="#94A3B8"
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}>
              <Icon
                name="close-circle"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>
              Total Records
            </Text>

            <Text style={styles.summaryValue}>
              {filteredData.length}
            </Text>
          </View>

          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>
              Page {currentPage} / {totalPages}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={paginatedData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="file-search-outline"
              size={45}
              color="#94A3B8"
            />

            <Text style={styles.emptyText}>
              No records found
            </Text>
          </View>
        }
        ListFooterComponent={
          filteredData.length > 0 ? (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() =>
                  setCurrentPage(prev =>
                    Math.max(1, prev - 1),
                  )
                }>
                <Icon
                  name="chevron-left"
                  size={21}
                  color={
                    currentPage === 1
                      ? '#94A3B8'
                      : '#0B4FA3'
                  }
                />

                <Text
                  style={[
                    styles.paginationText,
                    currentPage === 1 &&
                      styles.disabledText,
                  ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <View style={styles.currentPageButton}>
                <Text style={styles.currentPageText}>
                  {currentPage}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === totalPages}
                onPress={() =>
                  setCurrentPage(prev =>
                    Math.min(totalPages, prev + 1),
                  )
                }>
                <Text
                  style={[
                    styles.paginationText,
                    currentPage === totalPages &&
                      styles.disabledText,
                  ]}>
                  Next
                </Text>

                <Icon
                  name="chevron-right"
                  size={21}
                  color={
                    currentPage === totalPages
                      ? '#94A3B8'
                      : '#0B4FA3'
                  }
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default LDMSReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  header: {
    backgroundColor: '#0B4FA3',
    paddingHorizontal: 18,
    paddingVertical: 17,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  searchSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  searchBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 0,
  },

  summaryRow: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B4FA3',
    marginTop: 2,
  },

  pageBadge: {
    backgroundColor: '#E7F0FB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  pageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B4FA3',
  },

  listContent: {
    padding: 14,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  serialContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E7F0FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  serialText: {
    color: '#0B4FA3',
    fontWeight: '700',
    fontSize: 14,
  },

  gpName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },

  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  label: {
    width: '44%',
    fontSize: 13,
    color: '#64748B',
  },

  value: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },

  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statusItem: {
    flex: 1,
  },

  statusLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 7,
  },

  statusBadge: {
    minHeight: 31,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  yesBadge: {
    backgroundColor: '#E8F7EF',
  },

  noBadge: {
    backgroundColor: '#FDECEC',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  pagination: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  paginationButton: {
    minWidth: 105,
    height: 43,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#B9D3F3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B4FA3',
  },

  currentPageButton: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: '#0B4FA3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  currentPageText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  disabledButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },

  disabledText: {
    color: '#94A3B8',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 10,
  },
});