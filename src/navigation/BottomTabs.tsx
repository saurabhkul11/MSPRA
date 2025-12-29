import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Mul_Prashnavali from '../screens/Mul_Prashnavali';
import FormScreen from '../screens/FormScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ route }: any) => {
  const navigation = useNavigation();

  const userID = route?.params?.userID ?? '';
  const bearerToken = route?.params?.bearerToken ?? '';

  console.log('🟢 BottomTabs userID:', userID);
  console.log('🟢 BottomTabs bearerToken:', bearerToken);

  const [currentTab, setCurrentTab] = React.useState('DashboardTab');

  const getHeaderTitle = (): string => {
    switch (currentTab) {
      case 'DashboardTab':
        return 'मुख्यपृष्ठ';
         case 'FormTab':
        return 'पूर्व प्रश्नावली';
      case 'MulPrashnavaliTab':
        return 'मूळ प्रश्नावली';
      case 'ProfileTab':
        return 'वापरकर्ता तपशील';
      default:
        return 'CMSP';
    }
  };

  const HeaderBar = () => (
    <View
      style={{
        backgroundColor: '#0B4FA3',
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
      }}
    >
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Ionicons name="menu" size={26} color="#fff" />
      </TouchableOpacity>
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
          marginLeft: 16,
        }}
      >
        {getHeaderTitle()}
      </Text>
    </View>
  );

  return (
    <>
      <HeaderBar />

      <Tab.Navigator
        screenListeners={{
          state: (e) => {
            const index = e.data.state.index;
            const routeName = e.data.state.routeNames[index];
            setCurrentTab(routeName);
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconSource;

            if (route.name === 'DashboardTab') {
              iconSource = focused
                ? require('../assets/icons/home1.png')
                : require('../assets/icons/home1.png');

            } else if (route.name === 'FormTab') {
              iconSource = focused
                ? require('../assets/icons/formicon.png')
                : require('../assets/icons/formicon.png');

            } else if (route.name === 'MulPrashnavaliTab') {
              iconSource = focused
                ? require('../assets/icons/formicon.png')
                : require('../assets/icons/formicon.png');

            } else if (route.name === 'ProfileTab') {
              iconSource = focused
                ? require('../assets/icons/profile1.png')
                : require('../assets/icons/profile1.png');
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#007bff' : '#808080',
                }}
                resizeMode="contain"
              />
            );
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="DashboardTab"
          component={DashboardScreen}
          options={{ title: 'मुख्यपृष्ठ' }}
          initialParams={{ userID, bearerToken }}
        />
        <Tab.Screen
          name="FormTab"
          component={FormScreen}
          options={{ title: 'पूर्व प्रश्नावली' }}
          initialParams={{ userID, bearerToken }}
        />
        <Tab.Screen
          name="MulPrashnavaliTab"
          component={Mul_Prashnavali}
          options={{ title: 'मूळ प्रश्नावली' }}
          initialParams={{ userID, bearerToken }}
        />

        

        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{ title: 'प्रोफाइल' }}
          initialParams={{ userID, bearerToken }}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabs;
