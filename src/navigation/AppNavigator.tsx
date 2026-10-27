/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigator from "./DrawerNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPassword from "../screens/ResetPassword";
import FormScreen from "../screens/FormScreen";
import Mul_Prashnavali from "../screens/Mul_Prashnavali";
import Form1 from "../screens/Form1";
import Form2 from "../screens/Form2";
import Form3 from "../screens/Form3";
import Form4 from "../screens/Form4";
import Form5 from "../screens/Form5";
import Form6 from "../screens/Form6";
import Form7 from "../screens/Form7";
import Form8 from "../screens/Form8";
import { useAuth } from "../context/AuthContext"; // ✅ ADD
import BDODrawerNavigator from "./BDODrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import BDODashboardHome from "../screens/BDODashboardHome";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import GrampanchayatReportScreen from "../screens/GrampanchayatReportScreen";
import LDMSReportScreen from "../screens/LDMSReportScreen";
import ScrutinyReportScreen from "../screens/ScrutinyReportScreen";
import GPMarksReportScreen from "../screens/GPMarksReportScreen";
import WeeklyVisitReportScreen from "../screens/WeeklyVisitReportScreen";
import WeekReportScreen from "../screens/WeekReportScreen";
import NewsFieldScreen from "../screens/NewsFieldScreen";
import BDOPreviewScreen from "../screens/BDOPreviewScreen";
import BDOForm from "../screens/BDOForm";
import CEOPreviewScreen from "../screens/CEOPreviewScreen";
import CEOForm from "../screens/CEOForm";
import DivisionForm from "../screens/DivisionForm";
import DivPreviewScreen from "../screens/DivPreviewScreen";
import StateForm from "../screens/StateForm";
import StatePreviewScreen from "../screens/StatePreviewScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: { userID: string; bearerToken: string };
  Profile: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  FormScreen: undefined;
  Mul_Prashnavali: undefined;
  Form1: undefined;
  Form2: undefined;
  Form3: undefined;
  Form4: undefined;
  Form5: undefined;
  Form6: undefined;
  Form7: undefined;
  Form8: undefined;
  BDODashboard: undefined;
  BDODashboardHome:undefined;
  FormLayout: { formNo: number };
  BDOForm : undefined
  BDOHome: { userID: string; bearerToken: string };
  ChangePasswordScreen: undefined;
  GrampanchayatReportScreen: undefined;
  LDMSReportScreen: undefined;
  ScrutinyReportScreen: undefined;
  GPMarksReportScreen: undefined;
  WeeklyVisitReportScreen: undefined;
  WeekReportScreen: undefined;
  NewsFieldScreen: undefined;
  BDOPreviewScreen: undefined;
  CEOPreviewScreen :undefined
  CEOForm: undefined;
  DivisionForm:undefined
  DivPreviewScreen:undefined
  StateForm:undefined
  StatePreviewScreen:undefined


};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { loading, token, userID } = useAuth();
  const [isBDO, setIsBDO] = useState<boolean | null>(null);
  const [isCEO, setIsCEO] = useState<boolean | null>(null);
  const [isDIV, setIsDIV] = useState<boolean | null>(null);
  const [isSTA, setIsSTA] = useState<boolean | null>(null);

  const [loadingRole, setLoadingRole] = useState(true);

useEffect(() => {
  const loadBDOFlag = async () => {
    if (!token) {
      setIsBDO(null);
      setIsCEO(null);
      setIsDIV(null);
      setIsSTA(null);
      return;
    }

    try {
      const storedBDO = await AsyncStorage.getItem('isBDO');
      const storedCEO = await AsyncStorage.getItem('isCEO');
      const storedDIV = await AsyncStorage.getItem('isDIV');
      const storedSTA = await AsyncStorage.getItem('isSTA');

      setIsBDO(storedBDO === 'true');
      setIsCEO(storedCEO === 'true');
      setIsDIV(storedDIV === 'true');
      setIsSTA(storedSTA === 'true');
    } catch (error) {
      console.log('Error getting BDO flag:', error);
      setIsBDO(false);
      setIsCEO(false);
      setIsDIV(false);
      setIsSTA(false);
    }
  };

  loadBDOFlag();
}, [token]);

 // 🔄 While checking auth → show Splash
  if (loading) {
    return <SplashScreen />;
  }

  if (token && isBDO   === null) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#0B4FA3" />
    </View>
  );
}

  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       {!token ? (
  //         <>
  //           <Stack.Screen name="Login" component={LoginScreen} />
  //           <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  //           <Stack.Screen name="ResetPassword" component={ResetPassword} />
            
  //         </>
  //       ) : (
  //         <>
  //           {/* ✅ LOGGED IN FLOW */}
  //           <Stack.Screen name="Home">
  //             {() => (
  //               <DrawerNavigator
  //                 userID={userID!}
  //                 bearerToken={token!}
  //               />
  //             )}
  //           </Stack.Screen>

  //           <Stack.Screen name="Profile" component={ProfileScreen} />
  //           <Stack.Screen name="FormScreen" component={FormScreen} />
  //           <Stack.Screen name="Mul_Prashnavali" component={Mul_Prashnavali} />

  //           <Stack.Screen name="Form1" component={Form1} />
  //           <Stack.Screen name="Form2" component={Form2} />
  //           <Stack.Screen name="Form3" component={Form3} />
  //           <Stack.Screen name="Form4" component={Form4} />
  //           <Stack.Screen name="Form5" component={Form5} />
  //           <Stack.Screen name="Form6" component={Form6} />
  //           <Stack.Screen name="Form7" component={Form7} />
  //           <Stack.Screen name="Form8" component={Form8} />
  //           <Stack.Screen name="PdfViewer" component={PdfViewer} />
  //           {/* <Stack.Screen name="BDODashboard" component ={BDODashboard} /> */}
  //            <Stack.Screen name="StageForm1" component={StageForm1} />
  //             <Stack.Screen name="StageForm2" component={StageForm2} />
           
  //         </>
  //       )}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );


  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
          />
        </>
      ) : isBDO || isCEO || isDIV  || isSTA? (
        <>
          {/* BDO USER */}

          <Stack.Screen name="BDOHome">
            {() => (
              <BDODrawerNavigator
                userID={userID!}
                bearerToken={token!}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="BDODashboardHome"
            component={BDODashboardHome}
          />

          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
          />

          <Stack.Screen
            name="BDOForm"
            component={BDOForm}
          />

          <Stack.Screen
            name="BDOPreviewScreen"
            component={BDOPreviewScreen}
          />

          <Stack.Screen
            name="CEOPreviewScreen"
            component = {CEOPreviewScreen}
          />
          
          <Stack.Screen
            name="GrampanchayatReportScreen"
            component={GrampanchayatReportScreen}
          />

          <Stack.Screen
            name="LDMSReportScreen"
            component={LDMSReportScreen}
          />
           <Stack.Screen
            name="WeeklyVisitReportScreen"
            component={WeeklyVisitReportScreen}
          />
           <Stack.Screen
            name="GPMarksReportScreen"
            component={GPMarksReportScreen}
          />
           <Stack.Screen
            name="ScrutinyReportScreen"
            component={ScrutinyReportScreen}
          />

          <Stack.Screen
            name="WeekReportScreen"
            component={WeekReportScreen}
          />

          <Stack.Screen
            name="NewsFieldScreen"
            component={NewsFieldScreen}
          />

          
           <Stack.Screen
            name="CEOForm"
            component={CEOForm}
          />

          <Stack.Screen
            name="DivisionForm"
            component={DivisionForm}
          />

           <Stack.Screen
            name="DivPreviewScreen"
            component={DivPreviewScreen}
          />

          <Stack.Screen
            name="StateForm"
            component={StateForm}
          />

           <Stack.Screen
            name="StatePreviewScreen"
            component={StatePreviewScreen}
          />

        </>
      ) : (
        <>
          {/* NORMAL USER */}

          <Stack.Screen name="Home">
            {() => (
              <DrawerNavigator
                userID={userID!}
                bearerToken={token!}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />

          <Stack.Screen
            name="FormScreen"
            component={FormScreen}
          />

          <Stack.Screen
            name="Mul_Prashnavali"
            component={Mul_Prashnavali}
          />

          <Stack.Screen name="Form1" component={Form1} />
          <Stack.Screen name="Form2" component={Form2} />
          <Stack.Screen name="Form3" component={Form3} />
          <Stack.Screen name="Form4" component={Form4} />
          <Stack.Screen name="Form5" component={Form5} />
          <Stack.Screen name="Form6" component={Form6} />
          <Stack.Screen name="Form7" component={Form7} />
          <Stack.Screen name="Form8" component={Form8} />
          <Stack.Screen name="NewsFieldScreen" component={NewsFieldScreen} />

        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
);


};

export default AppNavigator;
