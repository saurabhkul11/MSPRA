/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../utils/CustomHeader';

// ---- TEMP DATA (replace with API response) ----
const DISTRICT_NAME = 'Palghar';

const TALUKAS = [
  { id: 1, name: 'Palghar' },
  { id: 2, name: 'Dahanu' },
  { id: 3, name: 'Vasai' },
  { id: 4, name: 'Wada' },
];

// stats per taluka (replace with API call on taluka change)
const STATS: Record<
  number,
  { total: number; completed: number; pre: number; main: number }
> = {
  1: { total: 27, completed: 0, pre: 0, main: 0 },
  2: { total: 0, completed: 0, pre: 0, main: 0 },
  3: { total: 0, completed: 0, pre: 0, main: 0 },
  4: { total: 0, completed: 0, pre: 0, main: 0 },
};

const CEODashboard = () => {
  const navigation = useNavigation<any>();

  const [selectedTaluka, setSelectedTaluka] = useState(TALUKAS[0]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const stats = STATS[selectedTaluka.id] ?? {
    total: 0,
    completed: 0,
    pre: 0,
    main: 0,
  };

  const remaining = stats.total - stats.completed;
  const progress =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      id: 1,
      title: 'एकूण ग्रामपंचायत',
      value: stats.total,
      backgroundColor: '#1E73F8',
    },
    {
      id: 2,
      title: 'प्रोफाईल पूर्ण',
      value: stats.completed,
      backgroundColor: '#19864B',
    },
    {
      id: 3,
      title: 'प्रोफाईल शिल्लक',
      value: remaining,
      backgroundColor: '#FFBA08',
    },
    // progress card is rendered as 4th item (see below)
    {
      id: 5,
      title: 'पूर्व प्रश्नावली',
      value: stats.pre,
      backgroundColor: '#4C49A8',
    },
    {
      id: 6,
      title: 'मूळ प्रश्नावली',
      value: stats.main,
      backgroundColor: '#7B79E8',
    },
  ];

  const renderCard = (card: (typeof cards)[0]) => (
    <TouchableOpacity
      key={card.id}
      activeOpacity={0.85}
      style={[styles.dashboardCard, { backgroundColor: card.backgroundColor }]}>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <Text style={styles.cardValue}>{card.value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <CustomHeader title="डॅशबोर्ड" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* DISTRICT + TALUKA DROPDOWN */}
        <View style={styles.filterCard}>
          <View style={styles.districtRow}>
            <Text style={styles.districtLabel}>जिल्हा :</Text>
            <Text style={styles.districtName}>{DISTRICT_NAME}</Text>
          </View>

          <View style={styles.talukaLabelRow}>
            <Text style={styles.talukaLabel}>तालुका</Text>
            <Text style={styles.required}> *</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}>
            <Text style={styles.dropdownText}>{selectedTaluka.name}</Text>
            <Icon name="chevron-down" size={24} color="#555555" />
          </TouchableOpacity>
        </View>

        {/* DASHBOARD CARDS */}
        <View style={styles.cardsContainer}>
          {/* 1, 2, 3 */}
          {cards.slice(0, 3).map(renderCard)}

          {/* 4 - PROGRESS CARD (inside grid like web layout) */}
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>प्रगती %</Text>

            <Text style={styles.progressPercentage}>{progress}%</Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBar, { width: `${progress}%` }]}
              />
            </View>

            <View style={styles.progressBottom}>
              <Text style={styles.progressText}>
                प्रोफाईल पूर्ण : {stats.completed}
              </Text>
              <Text style={styles.progressText}>एकूण : {stats.total}</Text>
            </View>
          </View>

          {/* 5, 6 */}
          {cards.slice(3).map(renderCard)}
        </View>
      </ScrollView>

      {/* TALUKA DROPDOWN MODAL */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>तालुका निवडा</Text>

            <FlatList
              data={TALUKAS}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedTaluka.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedTaluka(item);
                      setDropdownVisible(false);
                      // TODO: call API here to fetch stats for item.id
                    }}>
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,
                      ]}>
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={20} color="#0B4FA3" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CEODashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DCEAF3',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  /* FILTER CARD */
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    elevation: 2,
    marginBottom: 16,
  },

  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  districtLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },

  districtName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B4FA3',
    marginLeft: 5,
  },

  talukaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  talukaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
  },

  required: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53935',
  },

  dropdown: {
    height: 46,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  dropdownText: {
    fontSize: 15,
    color: '#222222',
    fontWeight: '500',
  },

  /* CARDS */
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dashboardCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: 14,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 3,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  cardValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  /* PROGRESS CARD (grid cell) */
  progressCard: {
    width: '48%',
    minHeight: 120,
    backgroundColor: '#BDBDBD',
    borderRadius: 14,
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
    elevation: 3,
  },

  progressTitle: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '700',
  },

  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#19864B',
    borderRadius: 10,
  },

  progressBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressText: {
    fontSize: 11,
    color: '#222222',
    fontWeight: '600',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    maxHeight: '60%',
    elevation: 6,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B4FA3',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  modalItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalItemSelected: {
    backgroundColor: '#EAF2FC',
  },

  modalItemText: {
    fontSize: 16,
    color: '#222222',
  },

  modalItemTextSelected: {
    color: '#0B4FA3',
    fontWeight: '700',
  },
});
