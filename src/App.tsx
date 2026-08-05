import { enableScreens } from "react-native-screens";
import React from "react";

import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext"; // 👈 ADD THIS

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: ...',
  'Non-serializable values were found in the navigation state',
]);

enableScreens(); // ✅ keep it OUTSIDE component (best practice)

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
