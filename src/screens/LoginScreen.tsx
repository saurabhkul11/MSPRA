/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../context/AuthContext'; // ✅ ADD CONTEXT
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert, { AlertType } from '../utils/CustomAlert';
import {API_BASE_URL} from '../utils/api';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, userID, token } = useAuth(); // ✅ CONTEXT

   const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>('info');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
  
    const showCustomAlert = (
      type: AlertType,
      message: string,
      title?: string,
    ) => {
      setAlertType(type);
      setAlertTitle(title || '');
      setAlertMessage(message);
      setAlertVisible(true);
    };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('त्रुटी', 'कृपया वापरकर्त्याचे नाव आणि पासवर्ड टाका');

     //showCustomAlert('error','कृपया वापरकर्त्याचे नाव आणि पासवर्ड टाका')
      return;
    }

    setLoading(true);

    //const apiUrl = 'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/Login';
    const apiUrl = `${API_BASE_URL}/User/Login`;
    const passwordHash = MD5(password).toString().toUpperCase();

    try {
      const response = await axios.post(
        apiUrl,
        {
          username: username.trim(),
          userpassword: passwordHash,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        },
      );
      console.log('Login response:', response.data);

      if (response.data?.responseCode === 2000) {
        const user = response.data.items[0];

        const isBDO = user.roleId === '3';
        const isCEO = user.roleId === '4';
        const isDIV = user.roleId === '6';
        const isSTA = user.roleId === '8';

        await AsyncStorage.setItem('username', username.trim());

        await AsyncStorage.setItem(
          'isBDO',
          isBDO ? 'true' : 'false',
        );
        await AsyncStorage.setItem(
          'isCEO',
          isCEO ? 'true' : 'false',
        );
         await AsyncStorage.setItem(
          'isDIV',
          isDIV ? 'true' : 'false',
        );
         await AsyncStorage.setItem(
          'isSTA',
          isSTA ? 'true' : 'false',
        );
        if (String(user.isProfileComplete) !== '1') {

          Alert.alert(
            'सूचना',
            'मुख्यमंत्री समृद्ध पंचायतराज अभियान माहिती वर्ष २०२५-२६ अंतर्गत आपली ग्रामपंचायत २०% सहभागीं ग्रामपंचायतीमध्ये समाविष्ट नाही. त्यामुळे या वर्षासाठी आपण पोर्टलवर माहिती भरण्याची आवश्यकता नाही.',
            [{ text: 'OK' }],
          );

          //showCustomAlert('info','मुख्यमंत्री समृद्ध पंचायतराज अभियान माहिती वर्ष २०२५-२६ अंतर्गत आपली ग्रामपंचायत २०% सहभागीं ग्रामपंचायतीमध्ये समाविष्ट नाही. त्यामुळे या वर्षासाठी आपण पोर्टलवर माहिती भरण्याची आवश्यकता नाही.')

          setLoading(false);
          return; // Stop here, no login, no navigation
        }

        login(
          user.userID,
          user.bearerToken,
          username.trim(),
          user.isProfileComplete,
        );


        console.log('isProfileComplete', user.isProfileComplete);
      }
       else {
        Alert.alert(
          '❌ अयशस्वी',
          response.data?.responseMessage ||
            'वापरकर्त्याचे नाव किंवा पासवर्ड चुकीचा आहे',
        );

        // showCustomAlert('error',response.data?.responseMessage ||
        //     'वापरकर्त्याचे नाव किंवा पासवर्ड चुकीचा आहे')
      }
    } catch (error) {
    //  console.error('Login error:', error);
      Alert.alert('त्रुटी', 'सर्व्हरशी संपर्क साधण्यात अडचण आली');

      //showCustomAlert('error','सर्व्हरशी संपर्क साधण्यात अडचण आली')
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        //style={{flex:1}}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/images/login_bg.jpg')}
          style={styles.bg}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <View style={styles.card}>
              {/* Username */}
              <Text style={styles.label}>
                वापरकर्त्याचे नाव<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="वापरकर्त्याचे नाव टाका"
                placeholderTextColor="#888"
                autoCapitalize="none"
                keyboardType="numeric"
              />

              {/* Password */}
              <Text style={styles.label}>
                पासवर्ड<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="पासवर्ड टाका"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember & Forgot */}
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember(!remember)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      remember && styles.checkboxChecked,
                    ]}
                  />
                  <Text style={styles.rememberText}>माझी आठवण ठेवा</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}

                  //onPress={() => navigation.navigate('BDODashboard')}
                >
                  <Text style={styles.forgotText}>पासवर्ड विसरलात?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>लॉगिन करा</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>

       <CustomAlert
          visible={alertVisible}
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    marginTop: 250,
  },
  label: { fontSize: 15, color: '#000', marginTop: 10 },
  required: { color: 'red' },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: '#000',
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 3,
    marginRight: 6,
  },
  checkboxChecked: { backgroundColor: '#008000', borderColor: '#008000' },
  rememberText: { color: '#333', fontSize: 13 },
  forgotText: { color: '#0066cc', fontSize: 13, fontWeight: '500' },
  loginButton: {
    backgroundColor: '#008000',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupText: { fontSize: 14, color: '#000' },
  signupLink: { color: '#0066cc', fontWeight: '600', fontSize: 14 },
});

export default LoginScreen;
