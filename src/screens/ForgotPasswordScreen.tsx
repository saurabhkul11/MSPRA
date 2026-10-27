/* eslint-disable react-native/no-inline-styles */

import React, { useState } from 'react';
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
} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../utils/api';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  console.log('username', username);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  /* =======================
     GET OTP
  ======================= */
  const handleGetOTP = async () => {
    if (!username.trim()) {
      Alert.alert('त्रुटी', 'कृपया वापरकर्त्याचे नाव प्रविष्ट करा');
      return;
    }

    setLoading(true);
    try {

      const url = `${API_BASE_URL}/User/GetForgotPasswordMobileOTP`;
      // const apiUrl =
      //   'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetForgotPasswordMobileOTP';

      const response = await axios.post(
        url,
        { UserName: username.trim() },
        { headers: { 'Content-Type': 'application/json' } },
      );
      console.log('username1', username);
      if (
        response.data?.responseCode === 2000 &&
        response.data.items?.length > 0
      ) {
        const item = response.data.items[0];

        setMobileNumber(item.mobileNumber || '');
        setOtp('');

        console.log('item', item);

        Alert.alert('✅ यशस्वी', item.message || 'OTP पाठवला गेला आहे');
      } else {
        Alert.alert(
          'त्रुटी',
          response.data?.responseMessage || 'OTP मिळाला नाही',
        );
      }
    } catch (error) {
      console.error('OTP API error:', error);
      Alert.alert('त्रुटी', 'OTP पाठवताना समस्या आली');
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     VERIFY OTP
  ======================= */
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('त्रुटी', 'कृपया ओटीपी प्रविष्ट करा');
      return;
    }

    setLoading(true);
    try {

      const url = `${API_BASE_URL}/User/VerifyMobileOTP`;
      // const apiUrl =
      //   'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/VerifyMobileOTP';

      const response = await axios.post(
        url,
        {
          MobileNo: mobileNumber,
          MobileOTP: otp.trim(),
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const item = response.data.items?.[0];

      if (response.data.responseCode === 2000 && item?.flag === 1) {
        Alert.alert('✅ यशस्वी', 'OTP पडताळणी यशस्वी!');

        navigation.navigate('ResetPassword', {
          username: username.trim(), // ✅ SAFE PARAM PASS
        });
      } else {
        Alert.alert('❌ अयशस्वी', item?.message || 'OTP चुकीचा आहे');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('त्रुटी', 'OTP पडताळताना काहीतरी चूक झाली');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login_bg2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>पासवर्ड विसरलात?</Text>

            <Text style={styles.label}>
              वापरकर्त्याचे नाव<Text style={{ color: 'red' }}>*</Text>
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
              ओ टी पी प्रविष्ट करा<Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="ओ टी पी प्रविष्ट करा"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
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
