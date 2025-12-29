import React from "react";
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
// import DynamicForm from "../screens/components/DynamicForm";
// import FormLayout from "../screens/FormLayout";

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
 // DynamicForm: { formNo: number };
  FormLayout: { formNo: number };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { loading, token, userID } = useAuth(); // ✅ USE CONTEXT

  // 🔄 While checking auth → show Splash
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔐 NOT LOGGED IN */}
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
          </>
        ) : (
          <>
            {/* ✅ LOGGED IN FLOW */}
            <Stack.Screen name="Home">
              {() => (
                <DrawerNavigator
                  userID={userID!}
                  bearerToken={token!}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="Mul_Prashnavali" component={Mul_Prashnavali} />

            <Stack.Screen name="Form1" component={Form1} />
            <Stack.Screen name="Form2" component={Form2} />
            <Stack.Screen name="Form3" component={Form3} />
            <Stack.Screen name="Form4" component={Form4} />
            <Stack.Screen name="Form5" component={Form5} />
            <Stack.Screen name="Form6" component={Form6} />
            <Stack.Screen name="Form7" component={Form7} />
            <Stack.Screen name="Form8" component={Form8} />
            {/* <Stack.Screen name="DynamicForm" component={DynamicForm} /> */}
       

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
