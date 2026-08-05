/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ReportItem = {
  id: number;
  lgdCode: string;
  districtId: string;
  talukaId: string;
  loginUserName: string;
};

const PAGE_SIZE = 10;

const ScrutinyReportScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const data: ReportItem[] = [
    {
      id: 1,
      lgdCode: '191856',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 2,
      lgdCode: '191864',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 3,
      lgdCode: '191871',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 4,
      lgdCode: '191872',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 5,
      lgdCode: '191876',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 6,
      lgdCode: '191888',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 7,
      lgdCode: '191899',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 8,
      lgdCode: '191891',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 9,
      lgdCode: '191907',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
    {
      id: 10,
      lgdCode: '191913',
      districtId: '499',
      talukaId: '3961',
      loginUserName: '4410',
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchText.trim()) {
      return data;
    }

    const value = searchText.toLowerCase();

    return data.filter(
      item =>
        item.lgdCode.toLowerCase().includes(value) ||
        item.districtId.toLowerCase().includes(value) ||
        item.talukaId.toLowerCase().includes(value) ||
        item.loginUserName.toLowerCase().includes(value),
    );
  }, [searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / PAGE_SIZE),
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredData.slice(
      start,
      start + PAGE_SIZE,
    );
  }, [filteredData, currentPage]);

  const goToPage = (page: number) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages,
    );

    setCurrentPage(safePage);
    setPageInput(String(safePage));
  };

  const handleSearch = () => {
    setSearchText(searchInput);
    goToPage(1);
  };

  const handleDownloadExcel = () => {
    console.log('Download Excel');
    // Call your Excel download API here
  };

  const renderRow = ({
    item,
  }: {
    item: ReportItem;
  }) => {
    return (
      <View style={styles.tableRow}>
        <View style={[styles.cell, styles.srCell]}>
          <Text style={styles.cellText}>
            {item.id}
          </Text>
        </View>

        <View style={[styles.cell, styles.lgdCell]}>
          <Text style={styles.cellText}>
            {item.lgdCode}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.districtCell,
          ]}>
          <Text style={styles.cellText}>
            {item.districtId}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.talukaCell,
          ]}>
          <Text style={styles.cellText}>
            {item.talukaId}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.userCell,
          ]}>
          <Text style={styles.cellText}>
            {item.loginUserName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}>

        {/* REPORT CARD */}
        <View style={styles.reportCard}>

          {/* TITLE */}
          <Text style={styles.pageTitle}>
            Scrutiny Report Details
          </Text>

          {/* DOWNLOAD BUTTON */}
          <View style={styles.downloadContainer}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadExcel}>
              <Icon
                name="file-excel"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.downloadText}>
                Download Excel
              </Text>
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <Text style={styles.searchLabel}>
            शोधा:
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search"
              placeholderTextColor="#8A8A8A"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}>
              <Text style={styles.searchButtonText}>
                Search
              </Text>
            </TouchableOpacity>
          </View>

          {/* TABLE */}
          <View style={styles.tableContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator>

              <View style={styles.table}>

                {/* TABLE HEADER */}
                <View style={styles.tableHeader}>
                  <View
                    style={[
                      styles.headerCell,
                      styles.srCell,
                    ]}>
                    <Text
                      style={
                        styles.headerText
                      }>
                      Sr No.
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.lgdCell,
                    ]}>
                    <Text
                      style={
                        styles.headerText
                      }>
                      LGDCode
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.districtCell,
                    ]}>
                    <Text
                      style={
                        styles.headerText
                      }>
                      Map_DistrictId
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.talukaCell,
                    ]}>
                    <Text
                      style={
                        styles.headerText
                      }>
                      Map_TalukaId
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.userCell,
                    ]}>
                    <Text
                      style={
                        styles.headerText
                      }>
                      Login User Name
                    </Text>
                  </View>
                </View>

                {/* TABLE DATA */}
                <FlatList
                  data={paginatedData}
                  renderItem={renderRow}
                  keyExtractor={item =>
                    item.id.toString()
                  }
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View
                      style={
                        styles.emptyRow
                      }>
                      <Text
                        style={
                          styles.emptyText
                        }>
                        No records found
                      </Text>
                    </View>
                  }
                />
              </View>
            </ScrollView>
          </View>

          {/* RECORD DETAILS */}
          <View style={styles.recordsContainer}>
            <View style={styles.recordBox}>
              <Text style={styles.recordLabel}>
                Total Records :
              </Text>

              <Text style={styles.recordValue}>
                {filteredData.length}
              </Text>
            </View>

            <View style={styles.recordBox}>
              <Text style={styles.recordLabel}>
                Current Page :
              </Text>

              <Text style={styles.recordValue}>
                {currentPage}
              </Text>
            </View>

            <View style={styles.recordBox}>
              <Text style={styles.recordLabel}>
                Total Pages :
              </Text>

              <Text style={styles.recordValue}>
                {totalPages}
              </Text>
            </View>
          </View>

          {/* PAGINATION */}
          <View style={styles.paginationWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.pagination
              }>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  styles.firstButton,
                  currentPage === 1 &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() => goToPage(1)}>
                <Text
                  style={
                    styles.paginationText
                  }>
                  First
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  styles.previousButton,
                  currentPage === 1 &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() =>
                  goToPage(currentPage - 1)
                }>
                <Text
                  style={
                    styles.paginationText
                  }>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  styles.nextButton,
                  currentPage === totalPages &&
                    styles.disabledButton,
                ]}
                disabled={
                  currentPage === totalPages
                }
                onPress={() =>
                  goToPage(currentPage + 1)
                }>
                <Text
                  style={
                    styles.paginationText
                  }>
                  Next
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  styles.lastButton,
                  currentPage === totalPages &&
                    styles.disabledButton,
                ]}
                disabled={
                  currentPage === totalPages
                }
                onPress={() =>
                  goToPage(totalPages)
                }>
                <Text
                  style={
                    styles.paginationText
                  }>
                  Last
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* PAGE INPUT */}
            <View style={styles.pageInputContainer}>
              <Text style={styles.pageInputLabel}>
                Go to Page
              </Text>

              <View style={styles.goToPageRow}>
                <TextInput
                  value={pageInput}
                  onChangeText={setPageInput}
                  keyboardType="number-pad"
                  style={styles.pageInput}
                />

                <TouchableOpacity
                  style={styles.goButton}
                  onPress={() => {
                    const page =
                      Number(pageInput);

                    if (!Number.isNaN(page)) {
                      goToPage(page);
                    }
                  }}>
                  <Text style={styles.goButtonText}>
                    Go
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScrutinyReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEAF2',
  },

  mainContent: {
    padding: 14,
    paddingBottom: 30,
  },

  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
     color: '#0B63B6',
    marginBottom: 18,
  },

  downloadContainer: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },

  downloadButton: {
    minHeight: 40,
    backgroundColor: '#14864D',
    borderRadius: 4,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  downloadText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 7,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    height: 43,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B7B7B7',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },

  searchButton: {
    height: 43,
    backgroundColor: '#17864D',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 3,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },

  table: {
    minWidth: 820,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3E464D',
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  headerCell: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRightWidth: 1,
    borderRightColor: '#AAB0B5',
  },

  cell: {
    minHeight: 43,
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },

  headerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  cellText: {
    color: '#272727',
    fontSize: 12,
  },

  srCell: {
    width: 90,
  },

  lgdCell: {
    width: 145,
  },

  districtCell: {
    width: 190,
  },

  talukaCell: {
    width: 185,
  },

  userCell: {
    width: 210,
  },

  emptyRow: {
    width: 820,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },

  emptyText: {
    fontSize: 13,
    color: '#777777',
  },

  recordsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  recordBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordLabel: {
    fontSize: 13,
    color: '#181818',
    fontWeight: '700',
  },

  recordValue: {
    fontSize: 13,
    color: '#181818',
    marginLeft: 5,
  },

  paginationWrapper: {
    marginTop: 22,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 8,
  },

  paginationButton: {
    minWidth: 58,
    height: 38,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  firstButton: {
    backgroundColor: '#14864D',
  },

  previousButton: {
    backgroundColor: '#0877E8',
  },

  nextButton: {
    backgroundColor: '#14864D',
  },

  lastButton: {
    backgroundColor: '#F4B400',
  },

  paginationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.45,
  },

  pageInputContainer: {
    marginTop: 18,
  },

  pageInputLabel: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 6,
  },

  goToPageRow: {
    flexDirection: 'row',
  },

  pageInput: {
    flex: 1,
    maxWidth: 150,
    height: 39,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    color: '#222222',
  },

  goButton: {
    height: 39,
    paddingHorizontal: 18,
    marginLeft: 8,
    backgroundColor: '#0B4FA3',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },

  goButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});