/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
// src/navigation/DrawerNavigator.tsx
import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import FormScreen from '../screens/FormScreen';
//import Mul_Prashnavali from '../screens/Mul_Prashnavali';
import ProfileScreen from '../screens/ProfileScreen';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BDODashboard from '../screens/BDODashboard';
import Mul_Prashnavali from '../screens/Mul_Prashnavali';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawerContent from './CustomDrawerContent';
import CustomDrawerNew from './CustomDrawerNew';
import NewsFieldScreen from '../screens/NewsFieldScreen';

interface DrawerNavigatorProps {
  userID: string;
  bearerToken: string;
}

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({
  userID,
  bearerToken,
}) => {
  type RootNav = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<RootNav>();

  const { logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);


  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);

    //navigation.replace('Home',{userID,bearerToken});
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);

    logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Drawer.Navigator
        initialRouteName="मुख्यपृष्ठ"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
        }}
         drawerContent={props => (
        <CustomDrawerNew
          {...props}
          handleLogout={handleLogout}
        />
      )}
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

        <Drawer.Screen
          name="मूळ प्रश्नावली"
          component={Mul_Prashnavali}
          initialParams={{ userID, bearerToken }}
        />

        {/* <Drawer.Screen
          name="News Fields"
          component={NewsFieldScreen}
          initialParams={{ userID, bearerToken }}
        /> */}

        {/* Profile */}
        <Drawer.Screen
          name="प्रोफाइल"
          component={ProfileScreen}
          initialParams={{ userID, bearerToken }}
        />

        {/* Logout */}
        <Drawer.Screen
          name="लॉग आऊट"
          component={() => null}
          listeners={{
            focus: () => handleLogout(),
          }}
        />
      </Drawer.Navigator>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutCard}>
            <View style={styles.logoutIconContainer}>
              <Icon name="logout" size={30} color="#0B4FA3" />
            </View>

            <Text style={styles.logoutTitle}>लॉग आऊट</Text>

            <Text style={styles.logoutMessage}>
              तुम्हाला खात्रीने लॉग आऊट करायचे आहे का?
            </Text>

            <View style={styles.logoutButtonRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cancelButton}
                onPress={handleCancelLogout}
              >
                <Text style={styles.cancelButtonText}>रद्द करा</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.logoutButton}
                onPress={handleConfirmLogout}
              >
                <Icon name="logout" size={18} color="#FFFFFF" />

                <Text style={styles.logoutButtonText}>लॉग आऊट</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoutIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E7F0FB', // light blue
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoutButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0B4FA3', // theme blue
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logoutCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  logoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },

  logoutMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  logoutButtonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DrawerNavigator;
