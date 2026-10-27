/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props: any) => {
  const { navigation, handleLogout } = props;

  const [reportExpanded, setReportExpanded] = useState(false);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={drawerStyles.container}
    >
      {/* MAIN */}
      <DrawerItem
        label="मुख्यपृष्ठ"
        icon={({ size }) => (
          <Icon name="home-outline" size={size} color="#64748B" />
        )}
        onPress={() => navigation.navigate('मुख्यपृष्ठ')}
      />

     
      {/* <DrawerItem
        label="डॅशबोर्ड"
        icon={({ size }) => (
          <Icon name="view-dashboard-outline" size={size} color="#64748B" />
        )}
        onPress={() => navigation.navigate('डॅशबोर्ड')}
      /> */}

      {/* PROFILE */}
      <DrawerItem
        label="प्रोफाइल"
        icon={({ size }) => (
          <Icon name="account-outline" size={size} color="#64748B" />
        )}
        onPress={() => navigation.navigate('प्रोफाइल')}
      />

      {/* CHANGE PASSWORD */}
      <DrawerItem
        label="पासवर्ड बदला"
        icon={({ size }) => (
          <Icon name="lock-outline" size={size} color="#64748B" />
        )}
        onPress={() => navigation.navigate('पासवर्ड बदला')}
      />

      {/* <TouchableOpacity
        style={drawerStyles.reportMenu}
        activeOpacity={0.7}
        onPress={() => setReportExpanded(prev => !prev)}
      >
        <View style={drawerStyles.reportLeft}>
          <Icon name="file-chart-outline" size={23} color="#64748B" />

          <Text style={drawerStyles.reportText}>Report</Text>
        </View>

        <Icon
          name={reportExpanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#64748B"
        />
      </TouchableOpacity> */}

      {reportExpanded && (
        <View style={drawerStyles.subMenuContainer}>
          <TouchableOpacity
            style={drawerStyles.subMenuItem}
            onPress={() => {
              navigation.navigate('GrampanchayatReport');
              navigation.closeDrawer();
            }}
          >
            <View style={drawerStyles.dot} />

            <Text style={drawerStyles.subMenuText}>Grampanchayat Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={drawerStyles.subMenuItem}
            onPress={() => {
              navigation.navigate('WeeklyVisitReport');
              navigation.closeDrawer();
            }}
          >
            <View style={drawerStyles.dot} />

            <Text style={drawerStyles.subMenuText}>Weekly Visit Report</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={drawerStyles.subMenuItem}
            onPress={() => {
              navigation.navigate('LDMSReport');
              navigation.closeDrawer();
            }}
          >
            <View style={drawerStyles.dot} />

            <Text style={drawerStyles.subMenuText}>LDMS Report</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={drawerStyles.subMenuItem}
            onPress={() => {
              navigation.navigate('GPMarksReport');
              navigation.closeDrawer();
            }}
          >
            <View style={drawerStyles.dot} />

            <Text style={drawerStyles.subMenuText}>GP Marks Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={drawerStyles.subMenuItem}
            onPress={() => {
              navigation.navigate('ScrutinyReport');
              navigation.closeDrawer();
            }}
          >
            <View style={drawerStyles.dot} />

            <Text style={drawerStyles.subMenuText}>Scrutiny Report</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <DrawerItem
        label="साप्ताहिक अहवाल"
        icon={({ size }) => (
          <Icon name="file-document-edit-outline" size={size} color="#64748B" />
        )}
        onPress={() => navigation.navigate('साप्ताहिक अहवाल')}
      /> */}

      {/* LOGOUT */}
      <DrawerItem
        label="लॉग आऊट"
        icon={({ size }) => <Icon name="logout" size={size} color="#64748B" />}
        onPress={() => {
          navigation.closeDrawer();
          handleLogout();
        }}
      />
    </DrawerContentScrollView>
  );
};
export default CustomDrawerContent;

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },

  reportMenu: {
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reportText: {
    marginLeft: 28,
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },

  subMenuContainer: {
    marginLeft: 29,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#D6E7FA',
  },

  subMenuItem: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 12,
  },

  subMenuText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#475569',
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#0B4FA3',
  },
});
