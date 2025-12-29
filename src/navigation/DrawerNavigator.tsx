// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import FormScreen from '../screens/FormScreen';
import Mul_Prashnavali from '../screens/Mul_Prashnavali';
import ProfileScreen from '../screens/ProfileScreen';
import { Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface DrawerNavigatorProps {
  userID: string;
  bearerToken: string;
}

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ userID, bearerToken }) => {
 type RootNav = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<RootNav>();

  const { logout } = useAuth();
  
 const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
            onPress: () => {
            logout();               
            navigation.replace('Login'); 
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <Drawer.Navigator
      initialRouteName="मुख्यपृष्ठ"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}
    >
      {/* मुख्यपृष्ठ */}
      <Drawer.Screen
        name="मुख्यपृष्ठ"
        component={BottomTabs}
        initialParams={{ userID, bearerToken }}
      />

      {/* पूर्व प्रश्नावली */}
      <Drawer.Screen
        name="पूर्व प्रश्नावली"
        component={FormScreen}
        initialParams={{ userID, bearerToken }}
      />

      {/* मूळ प्रश्नावली */}
      <Drawer.Screen
        name="मूळ प्रश्नावली"
        component={Mul_Prashnavali}
        initialParams={{ userID, bearerToken }}
      />

      {/* Profile */}
      <Drawer.Screen
        name="प्रोफाइल"
        component={ProfileScreen}
        initialParams={{ userID, bearerToken }}
      />

      {/* Privacy Policy */}
      {/* <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
      /> */}

      {/* Logout */}
      <Drawer.Screen
        name="लॉग आऊट"
        component={() => null}
        listeners={{
          focus: () => handleLogout(),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
