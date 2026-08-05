/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerNew = (props: any) => {
  const {
    navigation,
    handleLogout,
  } = props;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={drawerStyles.container}>

      {/* मुख्यपृष्ठ */}
      <DrawerItem
        label="मुख्यपृष्ठ"
        icon={({size}) => (
          <Icon
            name="home-outline"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.navigate('मुख्यपृष्ठ');
          navigation.closeDrawer();
        }}
      />

      {/* पूर्व प्रश्नावली */}
      <DrawerItem
        label="पूर्व प्रश्नावली"
        icon={({size}) => (
          <Icon
            name="clipboard-text-outline"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.navigate('पूर्व प्रश्नावली');
          navigation.closeDrawer();
        }}
      />

      {/* मूळ प्रश्नावली */}
      <DrawerItem
        label="मूळ प्रश्नावली"
        icon={({size}) => (
          <Icon
            name="file-document-edit-outline"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.navigate('मूळ प्रश्नावली');
          navigation.closeDrawer();
        }}
      />

      {/* <DrawerItem
        label="News Fields"
        icon={({size}) => (
          <Icon
            name="newspaper-variant-outline"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.navigate('News Fields');
          navigation.closeDrawer();
        }}
      /> */}

      {/* प्रोफाइल */}
      <DrawerItem
        label="प्रोफाइल"
        icon={({size}) => (
          <Icon
            name="account-outline"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.navigate('प्रोफाइल');
          navigation.closeDrawer();
        }}
      />

      {/* Logout */}
      <DrawerItem
        label="लॉग आऊट"
        icon={({size}) => (
          <Icon
            name="logout"
            size={size}
            color="#64748B"
          />
        )}
        labelStyle={drawerStyles.drawerLabel}
        style={drawerStyles.drawerItem}
        onPress={() => {
          navigation.closeDrawer();

          setTimeout(() => {
            handleLogout();
          }, 200);
        }}
      />

    </DrawerContentScrollView>
  );
};

export default CustomDrawerNew;

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },

  drawerItem: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 3,
  },

  drawerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginLeft: -8,
  },
});