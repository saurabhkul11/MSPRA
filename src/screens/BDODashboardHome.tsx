/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { DrawerActions, useNavigation} from '@react-navigation/native';
// import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLayoutEffect } from 'react';
import CustomHeader from '../utils/CustomHeader';

const BDODashboardHome = () => {
  const navigation = useNavigation<any>();


  const cards = [
    {
      id: 1,
      title: 'एकूण ग्रामपंचायत',
      value: '0',
      backgroundColor: '#1E73F8',
    },
    {
      id: 2,
      title: 'प्रोफाईल पूर्ण',
      value: '0',
      backgroundColor: '#19864B',
    },
    {
      id: 3,
      title: 'प्रोफाईल शिल्लक',
      value: '0',
      backgroundColor: '#FFBA08',
    },
    {
      id: 4,
      title: 'पूर्व प्रश्नावली',
      value: '0',
      backgroundColor: '#4C49A8',
    },
    {
      id: 5,
      title: 'मूळ प्रश्नावली',
      value: '0',
      backgroundColor: '#e572c8',
    },
  ];

  return (
    <View
      style={styles.safeArea}>

        <CustomHeader title="डॅशबोर्ड" />
    
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* TALUKA */}
        <View style={styles.talukaCard}>
          <Text style={styles.talukaLabel}>
            तालुका :
          </Text>

          <Text style={styles.talukaName}>
            Yawal
          </Text>
        </View>

        {/* DASHBOARD CARDS */}
        <View style={styles.cardsContainer}>
          {cards.map(card => (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.85}
              style={[
                styles.dashboardCard,
                {
                  backgroundColor: card.backgroundColor,
                },
              ]}>
              
              <Text style={styles.cardTitle}>
                {card.title}
              </Text>

              <Text style={styles.cardValue}>
                {card.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PROGRESS */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            प्रगती %
          </Text>

          <Text style={styles.progressPercentage}>
            0%
          </Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: '0%',
                },
              ]}
            />
          </View>

          <View style={styles.progressBottom}>
            <Text style={styles.progressText}>
              प्रोफाईल पूर्ण : 0
            </Text>

            <Text style={styles.progressText}>
              एकूण : 0
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default BDODashboardHome;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DCEAF3',
  },

  header: {
    backgroundColor: '#0B4FA3',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  talukaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 2,
    marginBottom: 16,
  },

  talukaLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },

  talukaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B4FA3',
    marginLeft: 5,
  },

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

  progressCard: {
    backgroundColor: '#BDBDBD',
    borderRadius: 14,
    padding: 16,
    marginTop: 2,
    elevation: 3,
  },

  progressTitle: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '700',
  },

  progressPercentage: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginTop: 5,
  },

  progressBarBackground: {
    height: 14,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 12,
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#19864B',
    borderRadius: 10,
  },

  progressBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  progressText: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
  },
});

