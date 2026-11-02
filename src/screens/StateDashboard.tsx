/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const divisions = ['Nashik', 'Pune', 'Amaravati', 'Kokan'];

const districtData: Record<string, string[]> = {
  Nashik: ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon', 'Ahilyanagar'],
  Pune: ['Pune', 'Satara', 'Sangli', 'Solapur', 'Kolhapur'],
  Amaravati: ['Amravati', 'Akola', 'Buldhana', 'Yavatmal', 'Washim'],
  Kokan: ['Mumbai', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg'],
};

const talukaData: Record<string, string[]> = {
  Nashik: ['Nashik', 'Sinnar', 'Igatpuri', 'Dindori', 'Niphad'],
  Dhule: ['Dhule', 'Sakri', 'Shirpur', 'Sindkheda'],
  Nandurbar: ['Nandurbar', 'Shahada', 'Taloda', 'Akkalkuwa'],
  Jalgaon: ['Jalgaon', 'Bhusawal', 'Amalner', 'Chopda'],
  Pune: ['Haveli', 'Baramati', 'Junnar', 'Indapur', 'Maval'],
  Satara: ['Satara', 'Karad', 'Wai', 'Phaltan'],
  Sangli: ['Miraj', 'Tasgaon', 'Jat', 'Kavathe Mahankal'],
  Solapur: ['Solapur North', 'Solapur South', 'Pandharpur', 'Barshi'],
  Kolhapur: ['Karvir', 'Panhala', 'Hatkanangale', 'Ajara'],
  Amravati: ['Amravati', 'Daryapur', 'Achalpur', 'Chandur'],
  Akola: ['Akola', 'Akot', 'Balapur', 'Telhara'],
  Buldhana: ['Buldhana', 'Khamgaon', 'Chikhli', 'Malkapur'],
  Yavatmal: ['Yavatmal', 'Pusad', 'Digras', 'Darwha'],
  Washim: ['Washim', 'Risod', 'Karanja'],
  Mumbai: ['Mumbai City', 'Mumbai Suburban'],
  Thane: ['Thane', 'Kalyan', 'Bhiwandi', 'Murbad', 'Shahapur'],
  Palghar: ['Palghar', 'Vasai', 'Dahanu', 'Talasari'],
  Raigad: ['Alibag', 'Panvel', 'Uran', 'Karjat'],
  Ratnagiri: ['Ratnagiri', 'Chiplun', 'Dapoli', 'Rajapur'],
  Sindhudurg: ['Kudal', 'Sawantwadi', 'Malvan', 'Devgad'],
};

const topPerformers = [
  ['Eradgaon', 'Amravati', '85.9300', 'NA', 'NA', 'NA', 'NA'],
  ['Karanjgaon', 'Pune', '77.6900', '4.3818', 'NA', 'NA', 'NA'],
  ['Kanhewadi T. Chakan', 'Pune', '72.4600', 'NA', 'NA', 'NA', 'NA'],
  ['Bhabalpur', 'Nandurbar', '69.8200', '69.8198', '59.2784', 'NA', 'NA'],
  ['Kherda Bk.', 'Akola', '66.9200', 'NA', 'NA', 'NA', 'NA'],
  ['Savalde', 'Dhule', '65.6600', 'NA', 'NA', 'NA', 'NA'],
  ['Asangaon', 'Thane', '63.7600', '54.5776', '47.7003', '47.7751', 'NA'],
  ['Kon', 'Thane', '61.1100', '75.9337', '2.8420', 'NA', 'NA'],
  ['Pipalkhuta', 'Nandurbar', '48.9800', 'NA', 'NA', 'NA', 'NA'],
  ['Dhamane', 'Kolhapur', '46.0400', '51.8604', 'NA', 'NA', 'NA'],
];

const bottomPerformers = [
  ['Bhagdari', 'Nandurbar', '0.0000', 'NA', 'NA', 'NA', 'NA'],
  ['Bahirewadi', 'Kolhapur', '32.6800', '38.1279', 'NA', 'NA', 'NA'],
  ['Saravali', 'Thane', '38.6400', '13.5687', 'NA', 'NA', 'NA'],
  ['Dhamane', 'Kolhapur', '46.0400', '51.8604', 'NA', 'NA', 'NA'],
  ['Pipalkhuta', 'Nandurbar', '48.9800', 'NA', 'NA', 'NA', 'NA'],
  ['Kon', 'Thane', '61.1100', '75.9337', '2.8420', 'NA', 'NA'],
  ['Asangaon', 'Thane', '63.7600', '54.5776', '47.7003', '47.7751', 'NA'],
  ['Savalde', 'Dhule', '65.6600', 'NA', 'NA', 'NA', 'NA'],
  ['Kherda Bk.', 'Akola', '66.9200', 'NA', 'NA', 'NA', 'NA'],
  ['Bhabalpur', 'Nandurbar', '69.8200', '69.8198', '59.2784', 'NA', 'NA'],
];

const stats = [
  {title: 'Total Gram Panchayats', value: '27960', icon: '👥', color: '#0879df', bg: '#eaf5ff'},
  {title: 'Participating GPs', value: '5816', icon: '👥', color: '#008c59', bg: '#eafaf4'},
  {title: 'Total Submission GP', value: '19', icon: '📄', color: '#f28a00', bg: '#fff6e8', change: '↑ -98.3 %'},
  {title: 'Pending GP', value: '61', icon: '✓', color: '#0879df', bg: '#edf6ff', change: '↓ 1.05 %'},
  {title: 'Profile Not Completed', value: '5736', icon: '!', color: '#ed1745', bg: '#fff0f3', change: '↓ 98.62 %'},
];

const COLUMNS = [
  {title: 'Rank', width: 55},
  {title: 'GP Name', width: 130},
  {title: 'District', width: 100},
  {title: 'GP Self\nEvaluation', width: 95},
  {title: 'Block\nEvaluation', width: 95},
  {title: 'District\nEvaluation', width: 95},
  {title: 'Division\nEvaluation', width: 95},
  {title: 'State\nEvaluation', width: 95},
];
const TABLE_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const BORDER = '#d5e0e8';

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const Dropdown = ({label, value, options, onChange}: DropdownProps) => (
  <View style={styles.dropdownBox}>
    <Text style={styles.dropdownLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={styles.picker}
        dropdownIconColor="#444">
        <Picker.Item label={`Select ${label}`} value="" color="#777" />
        {options.map(item => (
          <Picker.Item key={item} label={item} value={item} color="#222" />
        ))}
      </Picker>
    </View>
  </View>
);

const PerformanceTable = ({
  title,
  data,
  positive,
}: {
  title: string;
  data: string[][];
  positive: boolean;
}) => {
  return (
    <View style={styles.tableCard}>
      <View
        style={[
          styles.tableTitle,
          {backgroundColor: positive ? '#00876d' : '#bd0b80'},
        ]}>
        <Text style={styles.trophy}>{positive ? '🏆' : 'ⓧ'}</Text>
        <View style={{flex: 1}}>
          <Text style={styles.tableTitleText}>{title}</Text>
          <Text style={styles.tableSubtitle}>(Division Level)</Text>
          <Text style={styles.betterText}>
            {positive
              ? '↗ Higher values are better'
              : '↘ Lower values are better'}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={[styles.table, {width: TABLE_WIDTH}]}>
          <View style={styles.tableHeader}>
            {COLUMNS.map((col, i) => (
              <View
                key={col.title}
                style={[
                  styles.cell,
                  {width: col.width},
                  i === COLUMNS.length - 1 && styles.lastCell,
                ]}>
                <Text style={styles.headerText}>{col.title}</Text>
              </View>
            ))}
          </View>

          {data.map((item, index) => {
            const isLastRow = index === data.length - 1;
            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && {backgroundColor: '#f8fbfd'},
                  isLastRow && {borderBottomWidth: 0},
                ]}>
                <View style={[styles.cell, {width: COLUMNS[0].width}]}>
                  <View
                    style={[
                      styles.rankCircle,
                      {backgroundColor: positive ? '#00985e' : '#52739c'},
                    ]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                </View>

                {item.map((value, i) => {
                  const col = COLUMNS[i + 1];
                  const isLast = i + 1 === COLUMNS.length - 1;
                  const isNA = value === 'NA';
                  return (
                    <View
                      key={i}
                      style={[
                        styles.cell,
                        {width: col.width},
                        isLast && styles.lastCell,
                      ]}>
                      {i >= 2 ? (
                        <View
                          style={[
                            styles.valuePill,
                            {
                              backgroundColor: isNA
                                ? '#eef2f5'
                                : positive
                                ? '#d8f5e9'
                                : '#ffe1eb',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.valueText,
                              {
                                color: isNA
                                  ? '#8a98a5'
                                  : positive
                                  ? '#00875a'
                                  : '#e33c62',
                              },
                            ]}>
                            {value}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.cellText}>{value}</Text>
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

const DashboardScreen = () => {
  const [role, setRole] = useState('GP');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');

  const resetFilters = () => {
    setRole('GP');
    setDivision('');
    setDistrict('');
    setTaluka('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 30}}>
      <View style={styles.filterCard}>
        <Text style={styles.dashboardTitle}>CMSPRA Dashboard</Text>

        <Dropdown
          label="Role"
          value={role}
          options={['GP', 'BDO', 'CEO', 'Division']}
          onChange={setRole}
        />

        <Dropdown
          label="Division"
          value={division}
          options={divisions}
          onChange={value => {
            setDivision(value);
            setDistrict('');
            setTaluka('');
          }}
        />

        <Dropdown
          label="District"
          value={district}
          options={division ? districtData[division] || [] : []}
          onChange={value => {
            setDistrict(value);
            setTaluka('');
          }}
        />

        <Dropdown
          label="Taluka"
          value={taluka}
          options={district ? talukaData[district] || [] : []}
          onChange={setTaluka}
        />

        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetText}>⟳ Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((item, index) => {
          const isLastOdd = stats.length % 2 === 1 && index === stats.length - 1;
          return (
            <View
              key={index}
              style={[
                styles.statCard,
                {backgroundColor: item.bg, borderColor: item.color + '55'},
                isLastOdd && styles.statCardFull,
              ]}>
              <View style={styles.statTop}>
                <View style={[styles.statIcon, {backgroundColor: item.color}]}>
                  <Text style={styles.statIconText}>{item.icon}</Text>
                </View>
                <Text
                  style={[styles.statTitle, {color: item.color}]}
                  numberOfLines={2}>
                  {item.title}
                </Text>
              </View>

              <Text
                style={[styles.statValue, {color: item.color}]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {item.value}
              </Text>

              <View style={styles.changeBadgeWrap}>
                {item.change ? (
                  <View
                    style={[
                      styles.changeBadge,
                      {backgroundColor: item.color + '1A'},
                    ]}>
                    <Text style={[styles.changeText, {color: item.color}]}>
                      {item.change}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <PerformanceTable
        title="Top 10 Performing Gram Panchayats"
        data={topPerformers}
        positive={true}
      />
      <PerformanceTable
        title="Bottom 10 Performing Gram Panchayats"
        data={bottomPerformers}
        positive={false}
      />
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cbdde6',
    padding: 15,
  },

  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  dropdownBox: {
    width: '100%',
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d0d7dd',
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#e8eff7',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#222',
  },
  resetButton: {
    backgroundColor: '#fae0e0',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d7dd',
    width: 100,
    alignSelf: 'flex-end',
  },
  resetText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  statCardFull: {
    width: '100%',
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },
  changeBadgeWrap: {
    minHeight: 24,
    marginTop: 6,
    alignItems: 'flex-start',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 18,
  },
  tableTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  trophy: {
    fontSize: 28,
    color: '#fff',
  },
  tableTitleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tableSubtitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 2,
  },
  betterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    margin: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eaf3fb',
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 46,
    borderBottomWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  cell: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: BORDER,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  headerText: {
    color: '#0750a3',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    color: '#00418b',
    fontSize: 11,
    textAlign: 'center',
  },
  rankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  valuePill: {
    minWidth: 62,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});