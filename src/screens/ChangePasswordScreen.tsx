/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../utils/CustomHeader';

const ChangePasswordScreen = ({navigation}: any) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChangePassword = () => {
    if (!newPassword.trim()) {
      Alert.alert('सूचना', 'नवीन पासवर्ड प्रविष्ट करा.');
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('सूचना', 'पासवर्ड पुन्हा प्रविष्ट करा.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('सूचना', 'दोन्ही पासवर्ड जुळत नाहीत.');
      return;
    }

    // Call Change Password API here
    console.log({
      newPassword,
      confirmPassword,
    });

    Alert.alert('यशस्वी', 'पासवर्ड यशस्वीरित्या बदलला.');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <CustomHeader title="पासवर्ड बदला" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.titleIcon}>
              <Icon name="lock-reset" size={23} color="#0B4FA3" />
            </View>

            <View>
              <Text style={styles.title}>पासवर्ड बदला</Text>
              <Text style={styles.subtitle}>
                नवीन पासवर्ड सेट करा
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* New Password */}
          <Text style={styles.label}>
            नवीन पासवर्ड <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={21}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="नवीन पासवर्ड प्रविष्ट करा"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showNewPassword}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(prev => !prev)}>
              <Icon
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>
            पासवर्डची पुष्टी करा <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-check-outline"
              size={21}
              color="#64748B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="पासवर्ड पुन्हा प्रविष्ट करा"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showConfirmPassword}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(prev => !prev)}>
              <Icon
                name={
                  showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                }
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.changeButton}
              onPress={handleChangePassword}>
              <Icon name="check" size={20} color="#FFFFFF" />

              <Text style={styles.changeButtonText}>
                पासवर्ड बदला
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Icon name="close" size={20} color="#C62828" />

              <Text style={styles.cancelButtonText}>
                रद्द करा
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,

    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleIcon: {
    height: 44,
    width: 44,
    borderRadius: 10,
    backgroundColor: '#E7F0FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  required: {
    color: '#DC2626',
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },

  inputIcon: {
    marginLeft: 14,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 0,
  },

  eyeButton: {
    height: '100%',
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },

  changeButton: {
    flex: 1,
    height: 50,
    borderRadius: 9,
    backgroundColor: '#0B4FA3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#F3B4B4',
    backgroundColor: '#FFF5F5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  cancelButtonText: {
    color: '#C62828',
    fontSize: 15,
    fontWeight: '700',
  },
});

