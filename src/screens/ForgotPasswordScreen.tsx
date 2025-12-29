// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const ForgotPasswordScreen = ({ navigation, route }: any) => {
//   const [username, setUsername] = useState('');
//   const [otp, setOtp] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [loading, setLoading] = useState(false);

//   // === GET OTP ===
//   const handleGetOTP = async () => {
//     if (!username?.trim()) {
//       Alert.alert('त्रुटी', 'कृपया वापरकर्त्याचे नाव प्रविष्ट करा');
//       return;
//     }

//     setLoading(true);
//     try {
//       const routeToken = (route?.params as any)?.bearerToken;
//       const stored = await AsyncStorage.getItem('bearerToken');
//       const token = routeToken || stored || '';

//       if (!token) {
//         Alert.alert('त्रुटी', 'प्रमाणीकरण टोकन सापडले नाही. कृपया पुन्हा लॉगिन करा.');
//         setLoading(false);
//         return;
//       }

//       const apiUrl = 'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetForgotPasswordMobileOTP';
//       const body = { UserName: username.trim() };

//       const response = await axios.post(apiUrl, body, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('OTP API Response:', response.data);

//       if (response.data?.responseCode === 2000) {
//         const item = response.data.items?.[0];
//         Alert.alert('✅ यशस्वी', item?.message || 'OTP पाठवला गेला आहे');
//         setOtp(item?.mobileOTP || '');
//         setMobileNo(item?.mobileNo || '');
//       } else {
//         Alert.alert('त्रुटी', response.data?.responseMessage || 'OTP मिळाला नाही');
//       }
//     } catch (err: any) {
//       console.error('OTP API error:', err);
//       Alert.alert('त्रुटी', 'काहीतरी चूक झाली, पुन्हा प्रयत्न करा');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === VERIFY OTP ===
//   const handleVerifyOTP = async () => {
//     if (!otp?.trim()) {
//       Alert.alert('त्रुटी', 'कृपया ओटीपी प्रविष्ट करा');
//       return;
//     }

//     if (!mobileNo) {
//       Alert.alert('त्रुटी', 'मोबाईल नंबर सापडला नाही. कृपया पुन्हा प्रयत्न करा.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const apiUrl = 'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/VerifyMobileOTP';
//       const body = {
//         MobileNo: mobileNo,
//         MobileOTP: otp.trim(),
//       };

//       const response = await axios.post(apiUrl, body, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       console.log('Verify OTP Response:', response.data);

//       if (response.data?.responseCode === 2000) {
//         const item = response.data.items?.[0];
//         if (item?.flag === 1) {
//           Alert.alert('✅ OTP पडताळला गेला', 'कृपया नवीन पासवर्ड सेट करा');
//           navigation.navigate('ResetPasswordScreen', { mobileNo });
//         } else {
//           Alert.alert('त्रुटी', item?.message || 'OTP चुकीचा आहे');
//         }
//       } else {
//         Alert.alert('त्रुटी', response.data?.responseMessage || 'OTP पडताळणी अयशस्वी');
//       }
//     } catch (error) {
//       console.error('Verify OTP Error:', error);
//       Alert.alert('त्रुटी', 'OTP पडताळणी करताना काही समस्या आली');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/images/login_bg2.png')}
//       style={styles.background}
//       resizeMode="cover">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>पासवर्ड विसरलात?</Text>

//             {/* Username */}
//             <Text style={styles.label}>
//               वापरकर्त्याचे नाव<Text style={{ color: 'red' }}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="-"
//               value={username}
//               onChangeText={setUsername}
//             />

//             {/* Buttons */}
//             <View style={styles.row}>
//               <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP}>
//                 <Text style={styles.otpText}>
//                   {loading ? 'कृपया थांबा...' : 'ओटीपी मिळवा'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.loginButton}
//                 onPress={() => navigation.goBack()}>
//                 <Text style={styles.loginText}>लॉगिनसाठी जा</Text>
//               </TouchableOpacity>
//             </View>

//             {/* OTP Input */}
//             <Text style={styles.label}>
//               ओ टी पी प्रविष्ट करा<Text style={{ color: 'red' }}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="-"
//               value={otp}
//               onChangeText={setOtp}
//               keyboardType="number-pad"
//             />

//             {/* Verify */}
//             <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
//               <Text style={styles.verifyText}>
//                 {loading ? 'पडताळणी सुरू आहे...' : 'पडताळणी करा'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 250,
//   },
//   formContainer: {
//     backgroundColor: 'white',
//     width: '85%',
//     borderRadius: 20,
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 5,
//     marginTop: -40,
//   },
//   title: {
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 15,
//     color: '#000',
//   },
//   label: {
//     color: '#000',
//     marginBottom: 5,
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   otpButton: {
//     flex: 0.48,
//     backgroundColor: '#1c8a3f',
//     borderRadius: 30,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   otpText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   loginButton: {
//     flex: 0.48,
//     backgroundColor: '#d9534f',
//     borderRadius: 30,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   loginText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   verifyButton: {
//     backgroundColor: '#1c8a3f',
//     borderRadius: 30,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   verifyText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default ForgotPasswordScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const ForgotPasswordScreen = ({ navigation }: any) => {
//   const [username, setUsername] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [mobileNumber, setMobileNumber] = useState('');

//   // --- Get OTP ---
//  const handleGetOTP = async () => {
//   if (!username?.trim()) {
//     Alert.alert('त्रुटी', 'कृपया वापरकर्त्याचे नाव प्रविष्ट करा');
//     return;
//   }

//   setLoading(true);
//   try {
//     const apiUrl = 'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetForgotPasswordMobileOTP';
//     const body = { UserName: username.trim() };

//     const response = await axios.post(apiUrl, body, {
//       headers: { 'Content-Type': 'application/json' },
//     });

//     console.log('OTP API Response:', response.data);

//     if (response.data?.responseCode === 2000 && response.data.items?.length > 0) {
//       const item = response.data.items[0];
//       Alert.alert('✅ यशस्वी', item?.message || 'OTP पाठवला गेला आहे');

//       setOtp(''); // clear any old OTP entry
//       setMobileNumber(item.mobileNumber || ''); // ✅ save mobile number here
//     } else {
//       Alert.alert('त्रुटी', response.data?.responseMessage || 'OTP मिळाला नाही');
//     }
//   } catch (err) {
//     console.error('OTP API error:', err);
//     Alert.alert('त्रुटी', 'काहीतरी चूक झाली, पुन्हा प्रयत्न करा');
//   } finally {
//     setLoading(false);
//   }
// };

//   // --- Verify OTP ---
//   const handleVerifyOTP = async () => {
//   if (!otp.trim()) {
//     Alert.alert('त्रुटी', 'कृपया ओटीपी प्रविष्ट करा');
//     return;
//   }

//   try {
//     const apiUrl = 'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/VerifyMobileOTP';
//     const body = {
//       MobileNo: mobileNumber, // ✅ use saved number here
//       MobileOTP: otp.trim(),
//     };

//     const response = await axios.post(apiUrl, body, {
//       headers: { 'Content-Type': 'application/json' },
//     });

//     console.log('Verify OTP Response:', response.data);

//     const item = response.data.items?.[0];
//     if (response.data.responseCode === 2000 && item?.flag === 1) {
//       Alert.alert('✅ यशस्वी', 'OTP पडताळणी यशस्वी!');
//       // e.g. navigate to ResetPassword page:

//       await AsyncStorage.setItem('username', username.trim());
//        navigation.navigate('ResetPassword');
//     } else {
//       Alert.alert('❌ अयशस्वी', item?.message || 'OTP चुकीचा आहे');
//     }
//   } catch (err) {
//     console.error('Verify OTP Error:', err);
//     Alert.alert('त्रुटी', 'OTP पडताळताना काहीतरी चूक झाली');
//   }
// };


//   return (
//     <ImageBackground
//       source={require('../assets/images/login_bg2.jpg')}
//       style={styles.background}
//       resizeMode="cover">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>पासवर्ड विसरलात?</Text>

//             {/* Username */}
//             <Text style={styles.label}>
//               वापरकर्त्याचे नाव<Text style={{ color: 'red' }}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="-"
//               value={username}
//               onChangeText={setUsername}
//             />

//             {/* Buttons row */}
//             <View style={styles.row}>
//               <TouchableOpacity
//                 style={styles.otpButton}
//                 onPress={handleGetOTP}
//                 disabled={loading}>
//                 <Text style={styles.otpText}>ओटीपी मिळवा</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.loginButton}
//                 onPress={() => navigation.goBack()}>
//                 <Text style={styles.loginText}>लॉगिनसाठी जा</Text>
//               </TouchableOpacity>
//             </View>

//             {/* OTP field */}
//             <Text style={styles.label}>
//               ओ टी पी प्रविष्ट करा<Text style={{ color: 'red' }}>*</Text>
//             </Text>
          
//                     <TextInput
//                 style={styles.input}
//                 placeholder="ओ टी पी प्रविष्ट करा"
//                 placeholderTextColor="#888"
//                 keyboardType="number-pad"
//                 maxLength={6}                              // ✅ Only 6 digits
//                 value={otp}
//                 onChangeText={(text) => {
//                   // ✅ Allow only numbers
//                   const numericText = text.replace(/[^0-9]/g, '');
//                   setOtp(numericText);
//                 }}
//               />


//             {/* Verify button */}
//             <TouchableOpacity
//               style={styles.verifyButton}
//               onPress={handleVerifyOTP}
//               disabled={loading}>
//               <Text style={styles.verifyText}>पडताळणी करा</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  console.log('username',username);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  /* =======================
     GET OTP
  ======================= */
  const handleGetOTP = async () => {
    if (!username.trim()) {
      Alert.alert("त्रुटी", "कृपया वापरकर्त्याचे नाव प्रविष्ट करा");
      return;
    }

    setLoading(true);
    try {
      const apiUrl =
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetForgotPasswordMobileOTP";

      const response = await axios.post(
        apiUrl,
        { UserName: username.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
console.log('username1',username);
      if (
        response.data?.responseCode === 2000 &&
        response.data.items?.length > 0
      ) {
        const item = response.data.items[0];

        setMobileNumber(item.mobileNumber || "");
        setOtp("");

      console.log('item',item);

        Alert.alert("✅ यशस्वी", item.message || "OTP पाठवला गेला आहे");
      } else {
        Alert.alert(
          "त्रुटी",
          response.data?.responseMessage || "OTP मिळाला नाही"
        );
      }
    } catch (error) {
      console.error("OTP API error:", error);
      Alert.alert("त्रुटी", "OTP पाठवताना समस्या आली");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     VERIFY OTP
  ======================= */
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("त्रुटी", "कृपया ओटीपी प्रविष्ट करा");
      return;
    }

    setLoading(true);
    try {
      const apiUrl =
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/VerifyMobileOTP";

      const response = await axios.post(
        apiUrl,
        {
          MobileNo: mobileNumber,
          MobileOTP: otp.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const item = response.data.items?.[0];

      if (response.data.responseCode === 2000 && item?.flag === 1) {
        Alert.alert("✅ यशस्वी", "OTP पडताळणी यशस्वी!");

        navigation.navigate("ResetPassword", {
          username: username.trim(), // ✅ SAFE PARAM PASS
        });
      } else {
        Alert.alert("❌ अयशस्वी", item?.message || "OTP चुकीचा आहे");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      Alert.alert("त्रुटी", "OTP पडताळताना काहीतरी चूक झाली");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login_bg2.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>पासवर्ड विसरलात?</Text>

            <Text style={styles.label}>
              वापरकर्त्याचे नाव<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="-"
              autoCapitalize="none"
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.otpButton}
                onPress={handleGetOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.otpText}>ओटीपी मिळवा</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.loginText}>लॉगिनसाठी जा</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              ओ टी पी प्रविष्ट करा<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="ओ टी पी प्रविष्ट करा"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(text) =>
                setOtp(text.replace(/[^0-9]/g, ""))
              }
            />

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <Text style={styles.verifyText}>पडताळणी करा</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 250,
  },
  formContainer: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -40,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: '#000',
  },
  label: {
    color: '#000',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpButton: {
    flex: 0.48,
    backgroundColor: '#1c8a3f',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  otpText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    flex: 0.48,
    backgroundColor: '#d9534f',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#1c8a3f',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
