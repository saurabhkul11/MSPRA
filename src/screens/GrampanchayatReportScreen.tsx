// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-native/no-inline-styles */

// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Alert,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// type GPItem = {
//   id: number;
//   district: string;
//   taluka: string;
//   village: string;
//   grampanchayatName: string;
//   category: string;
//   mobile: string;
//   email: string;
//   profileStatus: string;
//   preQuestionStatus: string;
// };

// const PAGE_SIZE = 10;

// const GrampanchayatReportScreen = () => {
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const data: GPItem[] = [
//     {
//       id: 1,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Anjale',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 2,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Borkheda Kh',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 3,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Amoda',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 4,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Adgaon',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 5,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Atrawal',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 6,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Borkhede Bru.',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 7,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Bhalshiv',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 8,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Borale',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 9,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Bamnod',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//     {
//       id: 10,
//       district: 'Jalgaon',
//       taluka: 'Yawal',
//       village: '-',
//       grampanchayatName: 'Chikhali Bru.',
//       category: '-',
//       mobile: '-',
//       email: '-',
//       profileStatus: 'No',
//       preQuestionStatus: 'No',
//     },
//   ];

//   const filteredData = useMemo(() => {
//     if (!searchText.trim()) {
//       return data;
//     }

//     const search = searchText.toLowerCase();

//     return data.filter(
//       item =>
//         item.grampanchayatName.toLowerCase().includes(search) ||
//         item.district.toLowerCase().includes(search) ||
//         item.taluka.toLowerCase().includes(search) ||
//         item.village.toLowerCase().includes(search),
//     );
//   }, [searchText]);

//   const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * PAGE_SIZE;

//     return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
//   }, [filteredData, currentPage]);

//   const handleSearch = (text: string) => {
//     setSearchText(text);
//     setCurrentPage(1);
//   };

//   const handleDownloadExcel = () => {
//     // Add Excel download API here

//     console.log('Download Grampanchayat Report Excel');

//     Alert.alert('Download Excel', 'Excel download API can be called here.');
//   };

//   const renderStatus = (status: string) => {
//     const isYes = status.toLowerCase() === 'yes';

//     return (
//       <View
//         style={[styles.statusBadge, isYes ? styles.yesBadge : styles.noBadge]}
//       >
//         <Icon
//           name={isYes ? 'check-circle-outline' : 'close-circle-outline'}
//           size={15}
//           color={isYes ? '#18864B' : '#B42318'}
//         />

//         <Text
//           style={[
//             styles.statusText,
//             {
//               color: isYes ? '#18864B' : '#B42318',
//             },
//           ]}
//         >
//           {status}
//         </Text>
//       </View>
//     );
//   };

//   // const renderItem = ({
//   //   item,
//   // }: {
//   //   item: GPItem;
//   // }) => {
//   //   return (
//   //     <View style={styles.card}>

//   //       {/* CARD HEADER */}

//   //       <View style={styles.cardHeader}>

//   //         <View style={styles.serialContainer}>
//   //           <Text style={styles.serialText}>
//   //             {item.id}
//   //           </Text>
//   //         </View>

//   //         <View style={styles.cardHeaderContent}>

//   //           <Text style={styles.gpName}>
//   //             {item.grampanchayatName}
//   //           </Text>

//   //           <View style={styles.locationRow}>

//   //             <Icon
//   //               name="map-marker-outline"
//   //               size={14}
//   //               color="#64748B"
//   //             />

//   //             <Text style={styles.locationText}>
//   //               {item.taluka}, {item.district}
//   //             </Text>

//   //           </View>

//   //         </View>

//   //       </View>

//   //       <View style={styles.divider} />

//   //       {/* DETAILS */}

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           District
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.district}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           Taluka
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.taluka}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           Village
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.village}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           लोकसंख्या श्रेणी
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.category}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           Mobile Number
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.mobile}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.row}>
//   //         <Text style={styles.label}>
//   //           Email ID
//   //         </Text>

//   //         <Text style={styles.value}>
//   //           {item.email}
//   //         </Text>
//   //       </View>

//   //       <View style={styles.divider} />

//   //       {/* STATUS */}

//   //       <View style={styles.statusRow}>

//   //         <View style={styles.statusItem}>

//   //           <Text style={styles.statusLabel}>
//   //             Profile Status
//   //           </Text>

//   //           {renderStatus(item.profileStatus)}

//   //         </View>

//   //         <View style={styles.statusItem}>

//   //           <Text style={styles.statusLabel}>
//   //             PreQuestion Status
//   //           </Text>

//   //           {renderStatus(
//   //             item.preQuestionStatus,
//   //           )}

//   //         </View>

//   //       </View>

//   //     </View>
//   //   );
//   // };

//   const renderItem = ({ item }: { item: GPItem }) => {
//     return (
//       <View style={styles.card}>
//         {/* HEADER */}
//         <View style={styles.cardHeader}>
//           <View style={styles.serialContainer}>
//             <Text style={styles.serialText}>{item.id}</Text>
//           </View>

//           <View style={styles.cardHeaderContent}>
//             <Text style={styles.gpName}>{item.grampanchayatName}</Text>

//             <View style={styles.locationRow}>
//               <Icon name="map-marker-outline" size={14} color="#64748B" />

//               <Text style={styles.locationText}>
//                 {item.taluka}, {item.district}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         {/* ROW 1 */}
//         <View style={styles.detailsGrid}>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>District</Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.district}
//             </Text>
//           </View>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Taluka</Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.taluka}
//             </Text>
//           </View>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Village</Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.village}
//             </Text>
//           </View>
//         </View>

//         {/* ROW 2 */}
//         <View style={styles.detailsGrid}>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel} numberOfLines={1}>
//               लोकसंख्या श्रेणी
//             </Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.category}
//             </Text>
//           </View>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Mobile</Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.mobile}
//             </Text>
//           </View>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Email</Text>

//             <Text style={styles.detailValue} numberOfLines={1}>
//               {item.email}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.dividerSmall} />

//         {/* STATUS */}
//         <View style={styles.statusRow}>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Profile Status</Text>

//             {renderStatus(item.profileStatus)}
//           </View>

//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>PreQuestion Status</Text>

//             {renderStatus(item.preQuestionStatus)}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* PAGE HEADER */}

//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>Grampanchayat Details</Text>

//           <Text style={styles.headerSubtitle}>ग्रामपंचायत माहिती अहवाल</Text>
//         </View>

//         <Icon name="office-building-outline" size={27} color="#FFFFFF" />
//       </View>

//       {/* SEARCH / ACTION SECTION */}

//       <View style={styles.searchSection}>
//         <View style={styles.actionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>ग्रामपंचायत तपशील</Text>

//             <Text style={styles.sectionSubtitle}>
//               Search and view Grampanchayat records
//             </Text>
//           </View>

//           <TouchableOpacity
//             activeOpacity={0.8}
//             style={styles.excelButton}
//             onPress={handleDownloadExcel}
//           >
//             <Icon name="microsoft-excel" size={19} color="#FFFFFF" />

//             <Text style={styles.excelButtonText}>Excel</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search */}

//         <Text style={styles.searchLabel}>शोधा:</Text>

//         <View style={styles.searchBox}>
//           <Icon name="magnify" size={21} color="#64748B" />

//           <TextInput
//             style={styles.searchInput}
//             value={searchText}
//             onChangeText={handleSearch}
//             placeholder="Search Grampanchayat..."
//             placeholderTextColor="#94A3B8"
//           />

//           {searchText.length > 0 && (
//             <TouchableOpacity onPress={() => handleSearch('')}>
//               <Icon name="close-circle" size={20} color="#94A3B8" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* SUMMARY */}

//         <View style={styles.summaryRow}>
//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Total Records</Text>

//             <Text style={styles.summaryValue}>{filteredData.length}</Text>
//           </View>

//           <View style={styles.summarySeparator} />

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Current Page</Text>

//             <Text style={styles.summaryValue}>{currentPage}</Text>
//           </View>

//           <View style={styles.summarySeparator} />

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Total Pages</Text>

//             <Text style={styles.summaryValue}>{totalPages}</Text>
//           </View>
//         </View>
//       </View>

//       {/* LIST */}

//       <FlatList
//         data={paginatedData}
//         keyExtractor={item => item.id.toString()}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <View style={styles.emptyIcon}>
//               <Icon name="file-search-outline" size={38} color="#8AA7C7" />
//             </View>

//             <Text style={styles.emptyTitle}>No records found</Text>

//             <Text style={styles.emptyText}>
//               Try searching with another Grampanchayat name.
//             </Text>
//           </View>
//         }
//         ListFooterComponent={
//           filteredData.length > 0 ? (
//             <View style={styles.paginationContainer}>
//               <View style={styles.paginationInfo}>
//                 <Text style={styles.paginationInfoText}>
//                   Page {currentPage} of {totalPages}
//                 </Text>
//               </View>

//               <View style={styles.pagination}>
//                 {/* FIRST */}

//                 <TouchableOpacity
//                   style={[
//                     styles.smallPageButton,
//                     currentPage === 1 && styles.disabledButton,
//                   ]}
//                   disabled={currentPage === 1}
//                   onPress={() => setCurrentPage(1)}
//                 >
//                   <Icon
//                     name="page-first"
//                     size={21}
//                     color={currentPage === 1 ? '#94A3B8' : '#0B4FA3'}
//                   />
//                 </TouchableOpacity>

//                 {/* PREVIOUS */}

//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === 1 && styles.disabledButton,
//                   ]}
//                   disabled={currentPage === 1}
//                   onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 >
//                   <Icon
//                     name="chevron-left"
//                     size={20}
//                     color={currentPage === 1 ? '#94A3B8' : '#0B4FA3'}
//                   />

//                   <Text
//                     style={[
//                       styles.paginationText,
//                       currentPage === 1 && styles.disabledText,
//                     ]}
//                   >
//                     Previous
//                   </Text>
//                 </TouchableOpacity>

//                 {/* CURRENT */}

//                 <View style={styles.currentPageButton}>
//                   <Text style={styles.currentPageText}>{currentPage}</Text>
//                 </View>

//                 {/* NEXT */}

//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === totalPages && styles.disabledButton,
//                   ]}
//                   disabled={currentPage === totalPages}
//                   onPress={() =>
//                     setCurrentPage(prev => Math.min(totalPages, prev + 1))
//                   }
//                 >
//                   <Text
//                     style={[
//                       styles.paginationText,
//                       currentPage === totalPages && styles.disabledText,
//                     ]}
//                   >
//                     Next
//                   </Text>

//                   <Icon
//                     name="chevron-right"
//                     size={20}
//                     color={currentPage === totalPages ? '#94A3B8' : '#0B4FA3'}
//                   />
//                 </TouchableOpacity>

//                 {/* LAST */}

//                 <TouchableOpacity
//                   style={[
//                     styles.smallPageButton,
//                     currentPage === totalPages && styles.disabledButton,
//                   ]}
//                   disabled={currentPage === totalPages}
//                   onPress={() => setCurrentPage(totalPages)}
//                 >
//                   <Icon
//                     name="page-last"
//                     size={21}
//                     color={currentPage === totalPages ? '#94A3B8' : '#0B4FA3'}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// };

// export default GrampanchayatReportScreen;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 13,
//     marginBottom: 10,

//     elevation: 2,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },

//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   cardHeaderContent: {
//     flex: 1,
//   },

//   serialContainer: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: '#E7F0FB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },

//   serialText: {
//     color: '#0B4FA3',
//     fontWeight: '700',
//     fontSize: 13,
//   },

//   gpName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#0F172A',
//   },

//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     marginTop: 2,
//   },

//   locationText: {
//     fontSize: 11,
//     color: '#64748B',
//   },

//   divider: {
//     height: 1,
//     backgroundColor: '#E2E8F0',
//     marginVertical: 10,
//   },

//   dividerSmall: {
//     height: 1,
//     backgroundColor: '#E2E8F0',
//     marginTop: 6,
//     marginBottom: 10,
//   },

//   detailsGrid: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },

//   detailItem: {
//     flex: 1,
//     paddingRight: 6,
//   },

//   detailLabel: {
//     fontSize: 10,
//     color: '#64748B',
//     marginBottom: 3,
//   },

//   detailValue: {
//     fontSize: 12,
//     color: '#1E293B',
//     fontWeight: '600',
//   },

//   statusRow: {
//     flexDirection: 'row',
//     gap: 10,
//   },

//   statusItem: {
//     flex: 1,
//   },

//   statusLabel: {
//     fontSize: 10,
//     color: '#64748B',
//     marginBottom: 5,
//   },

//   statusBadge: {
//     minHeight: 26,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     borderRadius: 13,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },

//   statusText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },

//   container: {
//     flex: 1,
//     backgroundColor: '#F3F6FA',
//   },

//   header: {
//     minHeight: 74,
//     backgroundColor: '#0B4FA3',
//     paddingHorizontal: 18,
//     paddingVertical: 14,

//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   headerTitle: {
//     fontSize: 19,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },

//   headerSubtitle: {
//     fontSize: 12,
//     color: '#DCEAFB',
//     marginTop: 3,
//   },

//   searchSection: {
//     backgroundColor: '#FFFFFF',

//     margin: 14,
//     marginBottom: 5,

//     padding: 16,

//     borderRadius: 14,

//     elevation: 2,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//   },

//   actionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 18,
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#0F172A',
//   },

//   sectionSubtitle: {
//     fontSize: 11,
//     color: '#64748B',
//     marginTop: 3,
//   },

//   excelButton: {
//     minHeight: 40,
//     paddingHorizontal: 13,

//     borderRadius: 8,

//     backgroundColor: '#0B4FA3',

//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',

//     gap: 5,
//   },

//   excelButtonText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   searchLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#334155',
//     marginBottom: 7,
//   },

//   searchBox: {
//     height: 48,

//     borderRadius: 9,
//     borderWidth: 1,
//     borderColor: '#CBD5E1',

//     backgroundColor: '#F8FAFC',

//     flexDirection: 'row',
//     alignItems: 'center',

//     paddingHorizontal: 13,
//   },

//   searchInput: {
//     flex: 1,

//     marginLeft: 9,

//     fontSize: 14,
//     color: '#0F172A',

//     paddingVertical: 0,
//   },

//   summaryRow: {
//     marginTop: 17,

//     backgroundColor: '#F8FAFC',

//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',

//     flexDirection: 'row',

//     paddingVertical: 12,
//   },

//   summaryItem: {
//     flex: 1,
//     alignItems: 'center',
//   },

//   summarySeparator: {
//     width: 1,
//     backgroundColor: '#E2E8F0',
//   },

//   summaryLabel: {
//     fontSize: 10,
//     color: '#64748B',
//   },

//   summaryValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#0B4FA3',
//     marginTop: 3,
//   },

//   listContent: {
//     padding: 14,
//     paddingTop: 9,
//     paddingBottom: 30,
//   },

//   // card: {
//   //   backgroundColor: '#FFFFFF',

//   //   borderRadius: 14,

//   //   padding: 16,

//   //   marginBottom: 13,

//   //   elevation: 2,

//   //   shadowColor: '#000',
//   //   shadowOffset: {
//   //     width: 0,
//   //     height: 2,
//   //   },
//   //   shadowOpacity: 0.05,
//   //   shadowRadius: 4,
//   // },

//   // cardHeader: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   // },

//   // cardHeaderContent: {
//   //   flex: 1,
//   // },

//   // serialContainer: {
//   //   width: 40,
//   //   height: 40,

//   //   borderRadius: 20,

//   //   backgroundColor: '#E7F0FB',

//   //   alignItems: 'center',
//   //   justifyContent: 'center',

//   //   marginRight: 12,
//   // },

//   // serialText: {
//   //   fontSize: 14,
//   //   fontWeight: '700',
//   //   color: '#0B4FA3',
//   // },

//   // gpName: {
//   //   fontSize: 17,
//   //   fontWeight: '700',
//   //   color: '#0F172A',
//   // },

//   // locationRow: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',

//   //   marginTop: 4,

//   //   gap: 3,
//   // },

//   // locationText: {
//   //   fontSize: 12,
//   //   color: '#64748B',
//   // },

//   // divider: {
//   //   height: 1,
//   //   backgroundColor: '#E2E8F0',

//   //   marginVertical: 14,
//   // },

//   row: {
//     flexDirection: 'row',

//     marginBottom: 10,
//   },

//   label: {
//     width: '44%',

//     fontSize: 13,
//     color: '#64748B',
//   },

//   value: {
//     flex: 1,

//     fontSize: 13,
//     color: '#1E293B',

//     fontWeight: '500',
//   },

//   // statusRow: {
//   //   flexDirection: 'row',

//   //   gap: 12,
//   // },

//   // statusItem: {
//   //   flex: 1,
//   // },

//   // statusLabel: {
//   //   fontSize: 11,
//   //   color: '#64748B',
//   //   marginBottom: 7,
//   // },

//   // statusBadge: {
//   //   minHeight: 30,

//   //   alignSelf: 'flex-start',

//   //   paddingHorizontal: 10,

//   //   borderRadius: 15,

//   //   flexDirection: 'row',
//   //   alignItems: 'center',

//   //   gap: 5,
//   // },

//   yesBadge: {
//     backgroundColor: '#E8F7EF',
//   },

//   noBadge: {
//     backgroundColor: '#FDECEC',
//   },

//   // statusText: {
//   //   fontSize: 12,
//   //   fontWeight: '600',
//   // },

//   paginationContainer: {
//     marginTop: 4,
//     paddingBottom: 15,
//   },

//   paginationInfo: {
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   paginationInfoText: {
//     fontSize: 12,
//     color: '#64748B',
//   },

//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 6,
//   },

//   paginationButton: {
//     minWidth: 82,
//     height: 41,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#B9D3F3',
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 7,
//   },

//   smallPageButton: {
//     width: 41,
//     height: 41,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#B9D3F3',
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   paginationText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0B4FA3',
//   },

//   currentPageButton: {
//     width: 41,
//     height: 41,
//     borderRadius: 8,
//     backgroundColor: '#0B4FA3',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   currentPageText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '700',
//   },

//   disabledButton: {
//     backgroundColor: '#F1F5F9',
//     borderColor: '#E2E8F0',
//   },

//   disabledText: {
//     color: '#94A3B8',
//   },

//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',

//     paddingVertical: 70,
//     paddingHorizontal: 25,
//   },

//   emptyIcon: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: '#EDF4FC',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   emptyTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#334155',
//     marginTop: 12,
//   },

//   emptyText: {
//     fontSize: 12,
//     color: '#64748B',
//     textAlign: 'center',
//     marginTop: 5,
//   },
// });



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
  ScrollView,
  Alert,
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

const GrampanchayatReportScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

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
        item.village.toLowerCase().includes(search) ||
        item.mobile.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search),
    );
  }, [searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / PAGE_SIZE),
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredData.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [filteredData, currentPage]);

  const goToPage = (page: number) => {
    const safePage = Math.max(
      1,
      Math.min(page, totalPages),
    );

    setCurrentPage(safePage);
    setPageInput(String(safePage));
  };

  const handleSearch = () => {
    setSearchText(searchInput.trim());
    goToPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchText('');
    goToPage(1);
  };

  const handleDownloadExcel = () => {
    console.log(
      'Download Grampanchayat Report Excel',
    );

    Alert.alert(
      'Download Excel',
      'Excel download API can be called here.',
    );
  };

  const renderItem = ({item}: {item: GPItem}) => {
    return (
      <View style={styles.tableRow}>
        <View style={[styles.cell, styles.srCell]}>
          <Text style={styles.cellText}>
            {item.id}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.districtCell,
          ]}>
          <Text style={styles.cellText}>
            {item.district}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.talukaCell,
          ]}>
          <Text style={styles.cellText}>
            {item.taluka}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.villageCell,
          ]}>
          <Text style={styles.cellText}>
            {item.village}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.gpCell,
          ]}>
          <Text style={styles.cellText}>
            {item.grampanchayatName}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.categoryCell,
          ]}>
          <Text style={styles.cellText}>
            {item.category}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.mobileCell,
          ]}>
          <Text style={styles.cellText}>
            {item.mobile}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.emailCell,
          ]}>
          <Text style={styles.cellText}>
            {item.email}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.profileCell,
          ]}>
          <Text style={styles.cellText}>
            {item.profileStatus}
          </Text>
        </View>

        <View
          style={[
            styles.cell,
            styles.preQuestionCell,
          ]}>
          <Text style={styles.cellText}>
            {item.preQuestionStatus}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        <View style={styles.reportCard}>

          {/* TITLE */}
          <Text style={styles.title}>
            Grampanchayat Details
          </Text>

          {/* DOWNLOAD */}
          <View style={styles.downloadWrapper}>
            <TouchableOpacity
              style={styles.downloadButton}
              activeOpacity={0.8}
              onPress={handleDownloadExcel}>
              <Icon
                name="microsoft-excel"
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
            <View style={styles.searchInputWrapper}>
              <TextInput
                value={searchInput}
                onChangeText={setSearchInput}
                placeholder="Search"
                placeholderTextColor="#8A8A8A"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              {searchInput.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSearch}>
                  <Icon
                    name="close-circle"
                    size={19}
                    color="#8A8A8A"
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}>
              <Text style={styles.searchButtonText}>
                Search
              </Text>
            </TouchableOpacity>
          </View>

          {/* TABLE */}
          <View style={styles.tableOuter}>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator>

              <View style={styles.table}>

                {/* HEADER */}
                <View style={styles.tableHeader}>
                  <View
                    style={[
                      styles.headerCell,
                      styles.srCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Sr No.
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.districtCell,
                    ]}>
                    <Text style={styles.headerText}>
                      District
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.talukaCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Taluka
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.villageCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Village
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.gpCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Grampanchayat Name
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.categoryCell,
                    ]}>
                    <Text style={styles.headerText}>
                      लोकसंख्या श्रेणी
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.mobileCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Mobile Number
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.emailCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Email ID
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.profileCell,
                    ]}>
                    <Text style={styles.headerText}>
                      Profile Status
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerCell,
                      styles.preQuestionCell,
                    ]}>
                    <Text style={styles.headerText}>
                      PreQuestion Status
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={paginatedData}
                  renderItem={renderItem}
                  keyExtractor={item =>
                    item.id.toString()
                  }
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View style={styles.emptyRow}>
                      <Text style={styles.emptyText}>
                        No records found
                      </Text>
                    </View>
                  }
                />
              </View>
            </ScrollView>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                Total Records :
              </Text>

              <Text style={styles.summaryValue}>
                {filteredData.length}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                Current Page :
              </Text>

              <Text style={styles.summaryValue}>
                {currentPage}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                Total Pages :
              </Text>

              <Text style={styles.summaryValue}>
                {totalPages}
              </Text>
            </View>
          </View>

          {/* PAGINATION */}
          <View style={styles.paginationSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.pagination
              }>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  styles.firstButton,
                  currentPage === 1 &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() => goToPage(1)}>
                <Text style={styles.pageButtonText}>
                  First
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  styles.previousButton,
                  currentPage === 1 &&
                    styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() =>
                  goToPage(currentPage - 1)
                }>
                <Text style={styles.pageButtonText}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pageButton,
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
                <Text style={styles.pageButtonText}>
                  Next
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pageButton,
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
                <Text style={styles.pageButtonText}>
                  Last
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* PAGE NUMBER */}
            <View style={styles.pageJumpRow}>
              <TextInput
                value={pageInput}
                onChangeText={setPageInput}
                keyboardType="number-pad"
                style={styles.pageInput}
                onSubmitEditing={() => {
                  const page =
                    Number(pageInput);

                  if (!Number.isNaN(page)) {
                    goToPage(page);
                  }
                }}
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
                <Text style={styles.goText}>
                  Go
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GrampanchayatReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEAF2',
  },

  content: {
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
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B63B6',
    marginBottom: 16,
  },

  downloadWrapper: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },

  downloadButton: {
    minHeight: 39,
    paddingHorizontal: 13,
    borderRadius: 4,
    backgroundColor: '#14864D',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  downloadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 7,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  searchInputWrapper: {
    flex: 1,
    height: 43,
    borderWidth: 1,
    borderColor: '#B8B8B8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 11,
    paddingVertical: 0,
    fontSize: 13,
    color: '#202020',
  },

  clearButton: {
    paddingHorizontal: 9,
  },

  searchButton: {
    height: 43,
    paddingHorizontal: 18,
    backgroundColor: '#14864D',
    borderRadius: 3,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 10,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  tableOuter: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },

  table: {
    minWidth: 1420,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3E474E',
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  headerCell: {
    minHeight: 43,
    justifyContent: 'center',
    paddingHorizontal: 8,

    borderRightWidth: 1,
    borderRightColor: '#9FA5AA',
  },

  cell: {
    minHeight: 43,
    justifyContent: 'center',
    paddingHorizontal: 8,

    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',

    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },

  headerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cellText: {
    fontSize: 11,
    color: '#282828',
  },

  srCell: {
    width: 75,
  },

  districtCell: {
    width: 110,
  },

  talukaCell: {
    width: 105,
  },

  villageCell: {
    width: 105,
  },

  gpCell: {
    width: 200,
  },

  categoryCell: {
    width: 180,
  },

  mobileCell: {
    width: 155,
  },

  emailCell: {
    width: 165,
  },

  profileCell: {
    width: 155,
  },

  preQuestionCell: {
    width: 170,
  },

  emptyRow: {
    width: 1420,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },

  emptyText: {
    fontSize: 13,
    color: '#777777',
  },

  summaryContainer: {
    marginTop: 21,

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    gap: 12,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    color: '#1C1C1C',
    fontWeight: '700',
  },

  summaryValue: {
    fontSize: 12,
    color: '#1C1C1C',
    marginLeft: 4,
  },

  paginationSection: {
    marginTop: 22,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
    paddingHorizontal: 3,
  },

  pageButton: {
    minWidth: 58,
    height: 38,
    borderRadius: 3,

    paddingHorizontal: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  firstButton: {
    backgroundColor: '#14864D',
  },

  previousButton: {
    backgroundColor: '#1279E8',
  },

  nextButton: {
    backgroundColor: '#14864D',
  },

  lastButton: {
    backgroundColor: '#F4B400',
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.45,
  },

  pageJumpRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  pageInput: {
    width: 130,
    height: 39,

    borderWidth: 1,
    borderColor: '#B8B8B8',

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 10,
    paddingVertical: 0,

    fontSize: 13,
    color: '#202020',
  },

  goButton: {
    height: 39,
    paddingHorizontal: 18,

    marginLeft: 8,

    borderRadius: 3,
    backgroundColor: '#0B4FA3',

    alignItems: 'center',
    justifyContent: 'center',
  },

  goText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
