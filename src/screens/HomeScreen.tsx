// src/screens/HomeScreen.tsx
import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DrawerNavigator from '../navigation/DrawerNavigator';
import { useLayoutEffect } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';


type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const route = useRoute<HomeRouteProp>();
  const { userID, bearerToken } = route.params;
  console.log('✅ HomeScreen params:', userID, bearerToken);
  const navigation = useNavigation();
  


useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <Icon
        name="menu"
        size={28}
        color="#fff"
        style={{ marginLeft: 15 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    ),
    headerStyle: { backgroundColor: '#0B4FA3' },
    headerTintColor: '#fff',
    headerTitle: 'Home', // ✅ or use Marathi if you want, e.g. 'मुख्यपृष्ठ'
    headerTitleAlign: 'center',
  });
}, [navigation]);



  // 🟢 Pass them as props to DrawerNavigator
  return <DrawerNavigator userID={userID} bearerToken={bearerToken} />;
};

export default HomeScreen;
