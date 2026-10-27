/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useLayoutEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pick } from '@react-native-documents/picker';
import FileViewer from 'react-native-file-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Linking } from 'react-native';
import Pdf from 'react-native-pdf';
import { Modal, Dimensions } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../utils/CustomHeader';
import {API_BASE_URL} from '../utils/api';

interface ProfileData {
  userName?: string;
  district?: string;
  taluka?: string;
  village?: string;
  gramPanchayanName?: string;
  peopleGrade?: string;
  mobileNumber?: string;
  emailId?: string;
  villagePeopleCount?: string;
  femalCount?: string;
  maleCount?: string;
  familyCount?: string;
  voterCount?: string;
  farmerCount?: string;
  addvillage?: string;
  othervillageName?: string;
  isMobileOtpVerified?: string;
  roleId?: string;
  lgdCode?: string;
}
interface DropdownItem {
  value: string;
  label: string;
}

const ProfileScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { userID, bearerToken } = route.params;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({});
  const [peopleGradeList, setPeopleGradeList] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedPeopleGrade, setSelectedPeopleGrade] = useState('');
  const [selectedVillageIncluded, setSelectedVillageIncluded] = useState('');
  const [village, setVillage] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [villagePeopleCount, setVillagePeopleCount] = useState('');
  const [femaleCount, setFemaleCount] = useState('');
  const [maleCount, setMaleCount] = useState('');
  const [familyCount, setFamilyCount] = useState('');
  const [voterCount, setVoterCount] = useState('');
  const [farmerCount, setFarmerCount] = useState('');
  const [lgdCode, setlgdCode] = useState('');
  const [otherVillageName, setOtherVillageName] = useState('');
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpVerifySection, setShowOtpVerifySection] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const { updateCounts } = useAuth();

  const [transgenderCount, setTransgenderCount] = useState('');
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [base64File, setBase64File] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');


  useFocusEffect(
  useCallback(() => {
    console.log('Profile Screen Focused');
    fetchProfile();
    fetchDropdownList();
  }, [])
);

  useEffect(() => {
    if (profile) {
      updateCounts(
        profile.voterCount || '0',
        profile.villagePeopleCount || '0',
        profile.familyCount || '0',
        profile.farmerCount || '0',
      );
    }
  }, [profile]);

  const fetchDropdownList = async () => {
    try {

      const url = `${API_BASE_URL}/User/GetCommonDDList`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({}), // ✅ Empty body
        },
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Dropdown API HTTP Error:', response.status, text);
        return;
      }

      const json = await response.json();
      console.log('✅ Dropdown Response:', json);

      // ✅ Correct structure
      if (
        json.responseCode === 2000 &&
        json.items &&
        json.items.length > 0 &&
        json.items[0].peopleGradesList
      ) {
        const dropdownData = json.items[0].peopleGradesList.map(
          (item: any) => ({
            value: String(item.value),
            label: item.text,
          }),
        );

        setPeopleGradeList(dropdownData);
        console.log('✅ Parsed Dropdown:', dropdownData);
      } else {
        console.warn('⚠️ No data found for dropdown:', json.responseMessage);
      }
    } catch (err) {
      console.error('❌ Dropdown fetch error:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const url = `${API_BASE_URL}/User/GetUserProfile`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ userid: userID }),
        },
      );

      const json = await response.json();
      console.log('✅ Profile Response:', json);

      if (json.responseCode === 2000 && json.items?.length > 0) {
        const userProfile = json.items[0];
        setProfile(userProfile);

        // ✅ SAVE FILE URL
        setPdfUrl(userProfile.fileUrl || '');

        console.log('PDF URL:', userProfile.fileUrl);
        console.log(
  'API Mobile Number:',
  JSON.stringify(userProfile.mobileNumber),
);

        // ✅ SAFE VERSION
        setTransgenderCount(
          (userProfile.Transgender ?? userProfile.transgender ?? '').toString(),
        );

        // ✅ SAVE TO ASYNC STORAGE
        await AsyncStorage.setItem('voterCount', userProfile.voterCount ?? '');

        await AsyncStorage.setItem(
          'villagePeopleCount',
          userProfile.villagePeopleCount ?? '',
        );

        await AsyncStorage.setItem(
          'familyCount',
          userProfile.familyCount ?? '',
        );
        await AsyncStorage.setItem(
          'farmerCount',
          userProfile.farmerCount ?? '',
        );

        console.log('✅ Saved to AsyncStorage:', {
          voterCount: userProfile.voterCount,
          villagePeopleCount: userProfile.villagePeopleCount,
          familyCount: userProfile.familyCount,
          farmerCount: userProfile.farmerCount,
        });

        setSelectedPeopleGrade(String(userProfile.peopleGrade || ''));
        setSelectedVillageIncluded(String(userProfile.addvillage || ''));

        if (
          !userProfile.mobileNumber ||
          userProfile.mobileNumber.trim() === ''
        ) {
          setShowOtpButton(true);
        } else {
          setShowOtpButton(false);
        }
      } else {
        Alert.alert('Error', json.responseMessage || 'No profile data found');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while fetching profile');
    } finally {
      setLoading(false);
    }
  };


  const pickPdf = async () => {
    try {
      const res = await pick({
        type: ['application/pdf'],
      });

      const file = res[0];

      console.log('ORIGINAL FILE:', file);

      // 🔥 create new path
      const destPath = `${RNFS.DocumentDirectoryPath}/${file.name}`;

      // 🔥 copy file from content:// → file://
      await RNFS.copyFile(file.uri, destPath);

      const newFile = {
        ...file,
        fileCopyUri: `file://${destPath}`,
      };

      console.log('FINAL FILE PATH:', newFile.fileCopyUri);

      setPdfFile(newFile);
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const convertToBase64 = async () => {
    try {
      if (pdfFile?.fileCopyUri) {
        const path = pdfFile.fileCopyUri.replace('file://', '');

        const base64 = await RNFS.readFile(path, 'base64');

        console.log('BASE64 GENERATED ✅');

        return base64; // 🔥 return instead of setState
      }
      return '';
    } catch (e) {
      console.log('Base64 error:', e);
      return '';
    }
  };

  const handleSubmit = async () => {
    if (!bearerToken) {
      Alert.alert('Error', 'Authentication token missing');
      return;
    }
    try {
      setLoading(true);

      // 🔥 STEP 1: get base64 here
      const base64 = await convertToBase64();

      const payload = {
        RoleId: 1,
        UserName: profile.userName || '',
        Village: profile.village || '',
        PeopleGrade: parseInt(selectedPeopleGrade || '0'),
        MobileNumber: profile.mobileNumber || '',
        EmailId: profile.emailId || '',
        VillagePeopleCount: parseInt(profile.villagePeopleCount || '0'),
        FemaleCount: parseInt(profile.femalCount || '0'),
        MaleCount: parseInt(profile.maleCount || '0'),
        FamilyCount: parseInt(profile.familyCount || '0'),
        VoterCount: parseInt(profile.voterCount || '0'),
        FarmerCount: parseInt(profile.farmerCount || '0'),
        CreatedBy: profile.userName || '',
        LSGCode: profile.lgdCode || '',
        Addvillage: selectedVillageIncluded, // "Yes" or "No" from dropdown
        othervillageName: profile.othervillageName || '',
        Transgender: parseInt(transgenderCount || '0'),
        jsonDocumentPayload: pdfFile
          ? [
              {
                FileName: pdfFile.name,
                FileType: pdfFile.type,
                FileSize: pdfFile.size,
                FileContent: base64, // ✅ IMPORTANT
                FilePath: '',
                _fileIndex: 0,
                Metadata: null,
                UserId: userID.toString(),
                RoleId: '1',
              },
            ]
          : [],
      };
      console.log('selectedPeopleGrade', selectedPeopleGrade);
      console.log('📤 Update Payload:', payload);

      const url = `${API_BASE_URL}/User/UpdateUserProfile`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      // const json = await response.json();
      // console.log('✅ Update Response:', json);

      // if (json.responseCode === 1001) {

      //   await AsyncStorage.setItem(
      //     'voterCount',
      //     profile.voterCount ?? ''
      //   );

      //   await AsyncStorage.setItem(
      //     'villagePeopleCount',
      //     profile.villagePeopleCount ?? ''
      //   );
      //   await AsyncStorage.setItem(
      //     'familyCount',
      //     profile.familyCount ?? ''
      //   );
      //   await AsyncStorage.setItem(
      //     'farmerCount',
      //     profile.farmerCount ?? ''
      //   );

      //   console.log('🔄 AsyncStorage updated after profile submit');

      //   Alert.alert('✅ यशस्वी', json.responseMessage || 'Profile updated successfully!');
      // } else {
      //   Alert.alert('⚠️ अयशस्वी', json.responseMessage || 'Failed to update profile');
      // }

      const json = await response.json();
      console.log('✅ Update Response:', json);
      console.log('TYPE:', typeof json.responseCode);

      if (String(json.responseCode).trim() === '1001') {
        await AsyncStorage.setItem('voterCount', profile.voterCount ?? '');
        await AsyncStorage.setItem(
          'villagePeopleCount',
          profile.villagePeopleCount ?? '',
        );
        await AsyncStorage.setItem('familyCount', profile.familyCount ?? '');
        await AsyncStorage.setItem('farmerCount', profile.farmerCount ?? '');

        console.log('🔄 AsyncStorage updated after profile submit');

        Alert.alert(
          '✅ यशस्वी',
          json.responseMessage || 'Profile updated successfully!',
        );
      } else {
        console.log('❌ Failed condition, responseCode:', json.responseCode);
        Alert.alert(
          '⚠️ अयशस्वी',
          json.responseMessage || 'Failed to update profile',
        );
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      Alert.alert('Error', 'Something went wrong while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtp = async (mobileNumber: string) => {
    if (!mobileNumber || mobileNumber.trim().length !== 10) {
      Alert.alert('त्रुटी', 'कृपया वैध मोबाईल नंबर प्रविष्ट करा');
      return;
    }

    try {
      const url = `${API_BASE_URL}/User/GetMobileOTPRegistration`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            MobileNumber: mobileNumber,
          }),
        },
      );

      const json = await response.json();
      console.log('📲 OTP Response:', json);

      if (json.responseCode === 2000 && json.items?.length > 0) {
        const otpInfo = json.items[0];
        Alert.alert('✅ यशस्वी', otpInfo.message || 'OTP पाठविण्यात आला आहे');
        setOtpSent(true);
        setShowOtpVerifySection(true); // ✅ Show OTP verify section
      } else {
        Alert.alert('त्रुटी', json.responseMessage || 'OTP पाठविण्यात अयशस्वी');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      Alert.alert('त्रुटी', 'OTP पाठविताना काहीतरी समस्या आली');
    }
  };

  const handleVerifyOtp = async (mobileNumber: string, otpValue: string) => {
    if (!otpValue || otpValue.trim().length === 0) {
      Alert.alert('त्रुटी', 'कृपया OTP प्रविष्ट करा');
      return;
    }

    try {

      const url = `${API_BASE_URL}/User/VerifyMobileOTP`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            MobileNo: mobileNumber,
            MobileOTP: otpValue,
          }),
        },
      );

      const json = await response.json();
      console.log('✅ Verify OTP Response:', json);

      if (json.responseCode === 2000 && json.items?.length > 0) {
        const result = json.items[0];
        if (result.flag === 1) {
          Alert.alert('✅ यशस्वी', 'OTP पडताळणी यशस्वी झाली!');
          setOtpVerified(true);
          setShowOtpVerifySection(false); // ✅ Hide verification section
          setShowOtpButton(false); // ✅ Hide Get OTP button after success
        } else {
          Alert.alert('❌ अयशस्वी', result.message);
        }
      } else {
        Alert.alert(
          '❌ अयशस्वी',
          json.responseMessage || 'OTP पडताळणी अयशस्वी',
        );
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('त्रुटी', 'OTP पडताळताना काहीतरी समस्या आली');
    }
  };

 

  return (
    
    <View style={styles.container}>
      {/* Scrollable Form */}

      <CustomHeader title="वापरकर्ता तपशील" />
      <ScrollView  
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <LabelValue
            label="जिल्हा :"
            value={profile.district}
            editable={false}
          />
          <LabelValue
            label="तालुका :"
            value={profile.taluka}
            editable={false}
          />
          <LabelValue
            label="गाव :"
            value={profile.village}
            placeholder="Enter village name"
            editable
            onChangeText={text => setProfile({ ...profile, village: text })}
          />

          <LabelValue
            label="ग्रामपंचायतीचे नाव :"
            value={profile.gramPanchayanName}
            editable={false}
          />
          <LabelValue
            label="ग्रामपंचायचा LGD कोड* :"
            value={profile.lgdCode}
            editable={false}
          />

          <Text style={styles.fieldLabel}>लोकसंख्या श्रेणी निवडा*</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPeopleGrade}
              onValueChange={itemValue => setSelectedPeopleGrade(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="लोकसंख्या श्रेणी निवडा" value="" />
              {peopleGradeList.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          <LabelValue
            label="मोबाईल नंबर* :"
            value={profile.mobileNumber}
            placeholder="Enter mobile number"
            keyboardType="numeric"
            editable={!otpVerified}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9]/g, '');
              setProfile({ ...profile, mobileNumber: text });

              setOtpVerified(false);
              setShowOtpButton(true);
              setShowOtpButton(numericText.length === 10);
              // Show OTP button if number is newly entered or empty
              if (!text || text.trim() === '') {
                setShowOtpButton(true);
              } else {
                setShowOtpButton(true); // always allow OTP button for fresh number
              }
            }}
          />
          {/* ✅ Show verified icon only after successful OTP */}
          {otpVerified && (
            <Text style={{ color: 'green', marginLeft: 10, fontSize: 16 }}>
              ✅ Verified
            </Text>
          )}

          {/* ✅ Only show button when mobile number is missing or newly entered */}
          {!otpVerified &&
            showOtpButton &&
            profile.mobileNumber?.length === 10 && (
              <TouchableOpacity
                style={styles.otpButton}
                onPress={() => handleGetOtp(profile.mobileNumber ?? '')}
              >
                <Text style={styles.otpButtonText}>
                  {otpSent ? 'OTP Sent ✅' : 'Get OTP'}
                </Text>
              </TouchableOpacity>
            )}

          {showOtpVerifySection && !otpVerified && (
            <>
              <LabelValue
                label="ओ टी पी पडताळणी करा :"
                value={otp}
                placeholder="Enter OTP"
                editable
                onChangeText={setOtp}
              />

              <TouchableOpacity
                style={styles.otpButton}
                onPress={() => handleVerifyOtp(profile.mobileNumber ?? '', otp)}
              >
                <Text style={styles.otpButtonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}

          <LabelValue
            label="ईमेल आयडी*"
            value={profile.emailId}
            placeholder="Enter EmailID"
            editable
            onChangeText={text => setProfile({ ...profile, emailId: text })}
          />
          <LabelValue1
            label="गावाची लोकसंख्या*"
            value={profile.villagePeopleCount}
            placeholder="गावाची लोकसंख्या"
            keyboardType="numeric"
            editable
            infoMessage="ग्रामपंचायत अंतर्गत लोकसंख्या बाबत दि.31 मार्च 2025 ची माहीती आरोग्य (उपकेंद्र) विभाग कडून घेऊन पोर्टल वर भरावी..."
            showInfo
            onChangeText={text =>
              setProfile({ ...profile, villagePeopleCount: text })
            }
          />

          <LabelValue
            label="महिला लोकसंख्या*"
            value={profile.femalCount}
            placeholder="महिला लोकसंख्या"
            keyboardType="numeric"
            editable
            onChangeText={text => {
              const female = Number(text);
              const total = Number(profile.villagePeopleCount);

              if (female > total) {
                Alert.alert(
                  'त्रुटी',
                  'महिला लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही',
                );
                return;
              }
              setProfile({ ...profile, femalCount: text });
            }}
          />

          <LabelValue
            label="पुरुष लोकसंख्या*"
            value={profile.maleCount}
            keyboardType="numeric"
            placeholder="पुरुष लोकसंख्या"
            editable
            onChangeText={text => {
              const male = Number(text);
              const total = Number(profile.villagePeopleCount);

              if (male > total) {
                Alert.alert(
                  'त्रुटी',
                  'पुरुष लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही',
                );
                return;
              }
              setProfile({ ...profile, maleCount: text });
            }}
          />

          <LabelValue
            label="तृतीयपंथी संख्या*"
            keyboardType="numeric"
            value={transgenderCount}
            placeholder="तृतीयपंथी संख्या"
            editable
            onChangeText={text => setTransgenderCount(text)}
          />

          <LabelValue
            label="कुटुंब संख्या*"
            keyboardType="numeric"
            value={profile.familyCount}
            placeholder="कुटुंब संख्या"
            editable
            onChangeText={text => {
              const family = Number(text);
              const total = Number(profile.villagePeopleCount);

              if (family > total) {
                Alert.alert(
                  'त्रुटी',
                  'कुटुंब लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही',
                );
                return;
              }
              setProfile({ ...profile, familyCount: text });
            }}
            
          />

          <LabelValue
            label="शेतकरी संख्या*"
            keyboardType="numeric"
            value={profile.farmerCount}
            placeholder="शेतकरी संख्या"
            editable
            onChangeText={text => {
              const farmer = Number(text);
              const total = Number(profile.villagePeopleCount);

              if (farmer > total) {
                Alert.alert(
                  'त्रुटी',
                  'शेतकरी लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही',
                );
                return;
              }
              setProfile({ ...profile, farmerCount: text });
            }}
          />

          <LabelValue
            label="मतदारांची लोकसंख्या*"
            value={profile.voterCount}
            keyboardType="numeric"
            placeholder="मतदारांची लोकसंख्या"
            editable
            onChangeText={text => {
              const voter = Number(text);
              const total = Number(profile.villagePeopleCount);

              if (voter > total) {
                Alert.alert(
                  'त्रुटी',
                  'मतदारांची लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही',
                );
                return;
              }
              setProfile({ ...profile, voterCount: text });
            }}
          />

          <Text style={styles.fieldLabel}>
            ग्रामपंचायतीमध्ये अन्य गावे समाविष्ट आहेत का?*
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVillageIncluded}
              onValueChange={itemValue => setSelectedVillageIncluded(itemValue)}
              style={styles.picker}
            >
             
              <Picker.Item label="कृपया निवडा" value={profile.addvillage} />
              <Picker.Item label="होय" value="होय" />
              <Picker.Item label="नाही" value="नाही" />
            </Picker>
          </View>

          {/* ✅ Show this field only when user selects "होय" */}
          {selectedVillageIncluded === 'होय' && (
            <LabelValue
              label="असल्यास, कृपया गावांची नावे लिहा*"
              value={profile.othervillageName}
              placeholder="गावांची नावे"
              editable
              onChangeText={text =>
                setProfile({ ...profile, othervillageName: text })
              }
            />
          )}

          <Text style={styles.fieldLabel}>
            लोकसंख्येबाबतची माहिती – आरोग्य विभागाचे प्रमाणपत्र (प्रत) अपलोड करा
            *
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickPdf}>
              <Text style={styles.uploadBtnText}>Choose File</Text>
            </TouchableOpacity>

            {(pdfFile || pdfUrl) && (
              <View style={{ marginLeft: 15 }}>
                <TouchableOpacity onPress={() => setShowPdf(true)}>
                  <MaterialIcons name="picture-as-pdf" size={30} color="red" />
                </TouchableOpacity>

                {/* ✅ File name */}
                <Text style={{ fontSize: 12, marginTop: 4 }}>
                  {pdfFile?.name || 'View uploaded file'}
                </Text>
              </View>
            )}
          </View>

          {/* <LabelValue
          label="असल्यास, कृपया गावांची नावे लिहा*"
          value={profile.othervillageName}
          placeholder="ABCD"
          editable
          onChangeText={(text) => setProfile({ ...profile, othervillageName: text })}
          /> */}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>सादर करा</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={showPdf} animationType="slide">
        <View style={{ flex: 1 }}>
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setShowPdf(false)}
            style={{
              padding: 15,
              backgroundColor: '#0B4FA3',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Close PDF</Text>
          </TouchableOpacity>

          {/* PDF Viewer */}
          {(pdfFile || pdfUrl) && (
            <Pdf
              source={{
                uri: pdfFile?.fileCopyUri || pdfUrl,
              }}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </Modal>

      {loading && (
            <View style={styles.loaderOverlay}>
              <View style={styles.loaderCard}>
                <ActivityIndicator
                  size="large"
                  color="#0B63B6"
                />
      
                <Text style={styles.loaderText}>
                  Loading...
                </Text>
              </View>
            </View>
          )}
    </View>
  );
};

export default ProfileScreen;

const LabelValue = ({
  label,
  value,
  placeholder,
  editable,
  keyboardType = 'default',
  onChangeText,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType ?: 'default' | 'numeric' | 'email-address' | 'phone-pad',
  onChangeText?: (text: string) => void;
}) => (
  <View style={{ marginVertical: 6 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && { backgroundColor: '#f3f4f6' }]}
      value={value || ''}
      placeholder={placeholder}
      editable={editable}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor="#999"
    />
  </View>
);


const LabelValue1 = ({
  label,
  value,
  placeholder,
  editable,
  keyboardType = 'default',
  onChangeText,
  showInfo = false,
  infoMessage = '',
}: {
  label: string;
  value?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onChangeText?: (text: string) => void;
  showInfo?: boolean;
  infoMessage?: string;
}) => (
  <View style={{ marginVertical: 6 }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        //marginBottom: 4,
      }}>
      <Text style={styles.label}>{label}</Text>

      {showInfo && (
        <TouchableOpacity
          onPress={() => Alert.alert('माहिती', infoMessage)}
          style={{ marginLeft: 5 ,marginBottom: 5}}>
          <Ionicons
            name="information-circle"
            size={22}
            color="#2F80ED"
          />
        </TouchableOpacity>
      )}
    </View>

    <TextInput
      style={[styles.input, !editable && { backgroundColor: '#f3f4f6' }]}
      value={value || ''}
      placeholder={placeholder}
      editable={editable}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor="#999"
    />
  </View>
);

const styles = StyleSheet.create({

    loaderOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(24,36,30,0.42)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
  
    loaderCard: {
      width: 135,
      minHeight: 115,
      borderRadius: 17,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
    },
  
    loaderText: {
      color:'#202A33',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 11,
    },
  container: {
    flex: 1,
   // backgroundColor: '#E8EEF3',
  },
  toolbarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 15,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#E8EEF3',
    padding: 16,
    //paddingTop: 8,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#000',
  },
  value: {
    fontWeight: 'bold',
  },
  fieldLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0A8754',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  otpButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  otpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadBtn: {
    backgroundColor: '#0A8754',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
function setPeopleGradeList(dropdownData: any) {
  throw new Error('Function not implemented.');
}
