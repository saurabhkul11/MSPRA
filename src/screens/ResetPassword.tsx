/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import md5 from "react-native-md5";

const ResetPassword = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // ✅ Username comes from ForgotPassword screen
  const username: string = route.params?.username;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =======================
     RESET PASSWORD
  ======================= */
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("⚠️ सूचना", "कृपया सर्व फील्ड भरा");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("❌ त्रुटी", "दोन्ही पासवर्ड जुळत नाहीत");
      return;
    }

    if (!username) {
      Alert.alert("❌ त्रुटी", "वापरकर्त्याचे नाव उपलब्ध नाही");
      return;
    }

    try {
      setLoading(true);

      const hashedPassword = md5.hex_md5(newPassword);

      const payload = {
        username: username,
        userpassword: hashedPassword,
      };

      console.log("📤 Reset Password Payload:", payload);

      const response = await axios.post(
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/ResetUserPassword",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Reset Password Response:", response.data);

      if (response.data.responseCode === 1001) {
        Alert.alert("✅ यशस्वी", "पासवर्ड यशस्वीपणे बदलला!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]);
      } else {
        Alert.alert(
          "❌ अयशस्वी",
          response.data.responseMessage || "पुन्हा प्रयत्न करा"
        );
      }
    } catch (error) {
      console.error("❌ Reset Password Error:", error);
      Alert.alert("⚠️ त्रुटी", "काहीतरी चूक झाली, पुन्हा प्रयत्न करा");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login_bg2.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.formBox}>
          <Text style={styles.title}>नवीन पासवर्ड सेट करा</Text>

          <Text style={styles.label}>
            नवीन पासवर्ड <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="नवीन पासवर्ड"
              placeholderTextColor="#999"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showNewPassword ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            पासवर्डची पुष्टी <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="पासवर्ड पुन्हा टाका"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>अपडेट</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
export default ResetPassword;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
    marginTop: -20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
    fontWeight: '700',
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    backgroundColor: '#1c8a3f',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
