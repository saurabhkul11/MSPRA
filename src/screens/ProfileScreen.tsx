import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useLayoutEffect } from 'react';


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
const [peopleGradeList, setPeopleGradeList] = useState<{ label: string; value: string }[]>([]);
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


useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <Icon
        name="menu"
        size={28}
        color="#fff"
        style={{ marginLeft: 15 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    ),
    headerStyle: { backgroundColor: '#0B4FA3' },
    headerTintColor: '#fff',
    headerTitle: 'वापरकर्ता तपशील',
    headerTitleAlign: 'center',
  });
}, [navigation]);


  useEffect(() => {
    fetchProfile();
      fetchDropdownList();
  }, []);

   const fetchDropdownList = async () => {
  try {
    const response = await fetch(
      'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetCommonDDList',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({}), // ✅ Empty body
      }
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
          value: item.value,
          label: item.text,
        })
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
      const response = await fetch(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetUserProfile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ userid: userID }),
        }
      );

      const json = await response.json();
      console.log('✅ Profile Response:', json);

      if (json.responseCode === 2000 && json.items?.length > 0) {
        const userProfile = json.items[0];
        setProfile(userProfile); 
        setSelectedPeopleGrade(userProfile.peopleGrade || '');

      if (!userProfile.mobileNumber || userProfile.mobileNumber.trim() === '') {
        setShowOtpButton(true);
      } else {
        setShowOtpButton(false);
      }
        
      } 
      else 
        {
        Alert.alert('Error', json.responseMessage || 'No profile data found');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
      </View>
    );
  }

const handleSubmit = async () => {

  if (!bearerToken) {
    Alert.alert('Error', 'Authentication token missing');
    return;
  }
  try {
    setLoading(true);

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
      LSGCode: profile.lgdCode|| '',
      Addvillage: selectedVillageIncluded, // "Yes" or "No" from dropdown
      othervillageName: profile.othervillageName || '',
    };
console.log('selectedPeopleGrade',selectedPeopleGrade);
    console.log('📤 Update Payload:', payload);

    const response = await fetch(
      'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/UpdateUserProfile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await response.json();
    console.log('✅ Update Response:', json);

    if (json.responseCode === 1001) {
      Alert.alert('✅ यशस्वी', json.responseMessage || 'Profile updated successfully!');
    } else {
      Alert.alert('⚠️ अयशस्वी', json.responseMessage || 'Failed to update profile');
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
    const response = await fetch(
      'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/GetMobileOTPRegistration',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          MobileNumber: mobileNumber,
        }),
      }
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
    const response = await fetch(
      'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/User/VerifyMobileOTP',
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
      }
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
      Alert.alert('❌ अयशस्वी', json.responseMessage || 'OTP पडताळणी अयशस्वी');
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    Alert.alert('त्रुटी', 'OTP पडताळताना काहीतरी समस्या आली');
  }
};

const validateProfile = () => {
   
  if (!selectedPeopleGrade || selectedPeopleGrade.trim() === '') {
    Alert.alert('त्रुटी', 'कृपया लोकांचा दर्जा निवडा');
    return false;
  }
  // if (!mobileNumber || mobileNumber.trim().length !== 10) {
  //   Alert.alert('त्रुटी', 'कृपया वैध मोबाईल नंबर प्रविष्ट करा');
  //   return false;
  // }

  // if (!otpVerified) {
  //   Alert.alert('त्रुटी', 'कृपया ओटीपी पडताळणी करा');
  //   return false;
  // }

  if (!emailId || emailId.trim() === '') {
    Alert.alert('त्रुटी', 'कृपया ई-मेल आयडी प्रविष्ट करा');
    return false;
  }
  if (!villagePeopleCount || isNaN(Number(villagePeopleCount))) {
    Alert.alert('त्रुटी', 'कृपया वैध लोकसंख्या प्रविष्ट करा');
    return false;
  }
 if (!femaleCount || isNaN(Number(femaleCount))) {
    Alert.alert('त्रुटी', 'कृपया स्त्रियांची संख्या प्रविष्ट करा');
    return false;
  }

  if (!maleCount || isNaN(Number(maleCount))) {
    Alert.alert('त्रुटी', 'कृपया पुरुषांची संख्या प्रविष्ट करा');
    return false;
  }

  if (!familyCount || isNaN(Number(familyCount))) {
    Alert.alert('त्रुटी', 'कृपया कुटुंबांची संख्या प्रविष्ट करा');
    return false;
  }
  if (!farmerCount || isNaN(Number(farmerCount))) {
    Alert.alert('त्रुटी', 'कृपया शेतकऱ्यांची संख्या प्रविष्ट करा');
    return false;
  }
if (!voterCount || isNaN(Number(voterCount))) {
    Alert.alert('त्रुटी', 'कृपया मतदारांची संख्या प्रविष्ट करा');
    return false;
  }
 

  if (!selectedVillageIncluded || selectedVillageIncluded.trim() === '') {
    Alert.alert('त्रुटी', 'कृपया गाव समाविष्ट आहे का ते निवडा');
    return false;
  }

  if (!village || village.trim() === '') {
    Alert.alert('त्रुटी', 'कृपया गावाचे नाव प्रविष्ट करा');
    return false;
  }

  // if (!lgdCode || lgdCode.trim() === '') {
  //   Alert.alert('त्रुटी', 'कृपया LGD कोड प्रविष्ट करा');
  //   return false;
  // }

  if (selectedVillageIncluded === 'होय' && (!otherVillageName || otherVillageName.trim() === '')) {
    Alert.alert('त्रुटी', 'कृपया इतर गावांची नावे प्रविष्ट करा');
    return false;
  }

  return true; // ✅ All validations passed
};

  return (
    <View style={styles.container}>
  
      {/* Scrollable Form */}
      <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
        <View style={styles.formCard}>

        <LabelValue label="जिल्हा :" value={profile.district} editable={false} />
          <LabelValue label="तालुका :" value={profile.taluka} editable={false} />
            <LabelValue label="गाव :" value={profile.village} editable={false} />
              <LabelValue label="ग्रामपंचायतीचे नाव :" value={profile.gramPanchayanName} editable={false} />
                <LabelValue label="ग्रामपंचायचा LGD कोड :" value={profile.lgdCode} editable={false} />

          <Text style={styles.fieldLabel}>लोकसंख्या श्रेणी निवडा*</Text>

         <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPeopleGrade}
          onValueChange={(itemValue) => setSelectedPeopleGrade(itemValue)} style={styles.picker}>
          <Picker.Item label="लोकसंख्या श्रेणी निवडा" value="" />
          {peopleGradeList.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
          </Picker>
        </View>

       <LabelValue
            label="मोबाईल नंबर :"
            value={profile.mobileNumber}
            placeholder="Enter mobile number"
           editable={!otpVerified} 
            onChangeText={(text) => {
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
       {!otpVerified && showOtpButton && profile.mobileNumber?.length === 10 && (
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
          onChangeText={(text) => setProfile({ ...profile, emailId: text })}
        />
         <LabelValue
          label="गावाची लोकसंख्या*"
          value={profile.villagePeopleCount}
          placeholder="गावाची लोकसंख्या"
          editable
          onChangeText={(text) => setProfile({ ...profile, villagePeopleCount: text })}
          />
      

        <LabelValue
          label="महिला लोकसंख्या*"
          value={profile.femalCount}
          placeholder="महिला लोकसंख्या"
          editable
          onChangeText={(text) => {
            const female = Number(text);
            const total = Number(profile.villagePeopleCount);

            if (female > total) {
              Alert.alert("त्रुटी", "महिला लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही");
              return;
            }
            setProfile({ ...profile, femalCount: text });
          }}
        />

          <LabelValue
          label="पुरुष लोकसंख्या*"
          value={profile.maleCount}
          placeholder="पुरुष लोकसंख्या"
          editable
         onChangeText={(text) => {
            const male = Number(text);
            const total = Number(profile.villagePeopleCount);

            if (male > total) {
              Alert.alert("त्रुटी", "पुरुष लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही");
              return;
            }
            setProfile({ ...profile, maleCount: text });
          }}
        />

          <LabelValue
          label="कुटुंब संख्या*"
          value={profile.familyCount}
          placeholder="कुटुंब संख्या"
          editable
        onChangeText={(text) => {
            const family = Number(text);
            const total = Number(profile.villagePeopleCount);

            if (family > total) {
              Alert.alert("त्रुटी", "कुटुंब लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही");
              return;
            }
            setProfile({ ...profile, familyCount: text });
          }}
        />



          <LabelValue
          label="शेतकरी संख्या*"
          value={profile.farmerCount}
          placeholder="शेतकरी संख्या"
          editable
          onChangeText={(text) => {
            const farmer = Number(text);
            const total = Number(profile.villagePeopleCount);

            if (farmer > total) {
              Alert.alert("त्रुटी", "शेतकरी लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही");
              return;
            }
            setProfile({ ...profile, farmerCount: text });
          }}
        />

          <LabelValue
          label="मतदारांची लोकसंख्या*"
          value={profile.voterCount}
          placeholder="मतदारांची लोकसंख्या"
          editable
          onChangeText={(text) => {
            const voter = Number(text);
            const total = Number(profile.villagePeopleCount);

            if (voter > total) {
              Alert.alert("त्रुटी", "मतदारांची लोकसंख्या एकूण लोकसंख्येपेक्षा जास्त असू शकत नाही");
              return;
            }
            setProfile({ ...profile, voterCount: text });
          }}
        />


                  <Text style={styles.fieldLabel}>ग्रामपंचायतीमध्ये अन्य गावे समाविष्ट आहेत का?*</Text>
                  <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVillageIncluded}
            onValueChange={(itemValue) => setSelectedVillageIncluded(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="कृपया निवडा" value={profile.addvillage} />
            <Picker.Item label="होय" value="होय" />
            <Picker.Item label="नाही" value="नाही" />
          </Picker>

        </View>

        {/* <LabelValue
          label="असल्यास, कृपया गावांची नावे लिहा*"
          value={profile.othervillageName}
          placeholder="ABCD"
          editable
          onChangeText={(text) => setProfile({ ...profile, othervillageName: text })}
          /> */}

          {/* ✅ Show this field only when user selects "होय" */}
{selectedVillageIncluded === "होय" && (
  <LabelValue
    label="असल्यास, कृपया गावांची नावे लिहा*"
    value={profile.othervillageName}
    placeholder="गावांची नावे"
    editable
    onChangeText={(text) =>
      setProfile({ ...profile, othervillageName: text })
    }
  />
)}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>सादर करा</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const LabelValue = ({
  label,
  value,
  placeholder,
  editable,
  onChangeText,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  editable?: boolean;
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
      placeholderTextColor="#999"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004A99',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  toolbar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#004A99',
  paddingVertical: 14,
  paddingHorizontal: 16,
  elevation: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#003B7A',
  marginTop: 35,
  zIndex: 10,
},
menuButton: {
  padding: 5,
},
toolbarTitle: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '700',
  marginLeft: 15,
},
 scrollContent: {
  flexGrow: 1,
  backgroundColor: '#004A99',
  padding: 16,
  paddingTop: 8,
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

});
function setPeopleGradeList(dropdownData: any) {
  throw new Error('Function not implemented.');
}

