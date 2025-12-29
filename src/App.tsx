// import { enableScreens } from 'react-native-screens';



// import React from 'react';
// import AppNavigator from './navigation/AppNavigator';

// const App = () => {
//   enableScreens();
//   return <AppNavigator />;
// };

// export default App;


import { enableScreens } from "react-native-screens";
import React from "react";

import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext"; // 👈 ADD THIS

enableScreens(); // ✅ keep it OUTSIDE component (best practice)

const App = () => {
  return (
    <AuthProvider>
      
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
