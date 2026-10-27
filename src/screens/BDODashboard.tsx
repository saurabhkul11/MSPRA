/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../utils/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import CustomAlert, { AlertType } from '../utils/CustomAlert';
import { downloadFile } from '../utils/downloadFile';
import LinearGradient from 'react-native-linear-gradient';
import {API_BASE_URL} from '../utils/api';

interface BDOApiVillage {
  panchayatUserId: string;
  villageName: string;
  lgdCode: string;
  districtname: string;
  talukaName: string;

  isProfileComplete: number | null;

  isForm1Complete: number;
  isForm2Complete: number;
  isForm3Complete: number;
  isForm4Complete: number;
  isForm5Complete: number;
  isForm6Complete: number;
  isForm7Complete: number;
  isForm8Complete: number;

  isForm1CompleteDesk: number;
  isForm2CompleteDesk: number;
  isForm3CompleteDesk: number;
  isForm4CompleteDesk: number;
  isForm5CompleteDesk: number;
  isForm6CompleteDesk: number;
  isForm7CompleteDesk: number;
  isForm8CompleteDesk: number;

  totalMarks: number | null;
  totalOutOfMarks: number | null;
  percentage: number | null;
}

interface CEOPanchayat {
  isTopTwoPanchayatRec: string;
  isBDOAllFormSubmit: string;

  panchayatUserName: string;
  panchayatUserID: string;

  ceoUserName: string;
  ceoUserID: string;

  bdoTaluka: string;
  bdoDistrict: string;
  villageName: string;

  bdoUserName: string;
  bdoUserID: string;

  // Panchayat marks
  totalMarks: string;
  totalOutOfMarks: string;
  percentage: string;

  // BDO marks
  bdoTotalMarks: string;
  bdoTotalOutOfMarks: string;
  bdoPercentage: string;
  bdoPercentageorder: string;

  // CEO marks
  ceoMarks: string;
  outOfMarksCEO: string;
  ceoPercentage: string | null;

  currentRoleID: string;

  // CEO scrutiny
  isForm1CompleteDesk: string;
  isForm2CompleteDesk: string;
  isForm3CompleteDesk: string;
  isForm4CompleteDesk: string;
  isForm5CompleteDesk: string;
  isForm6CompleteDesk: string;
  isForm7CompleteDesk: string;
  isForm8CompleteDesk: string;

  // Previous stage scrutiny
  isForm1Complete: string;
  isForm2Complete: string;
  isForm3Complete: string;
  isForm4Complete: string;
  isForm5Complete: string;
  isForm6Complete: string;
  isForm7Complete: string;
  isForm8Complete: string;
}

interface DIVPanchayat {
  ceoUserID: string;
  bdoUserID: string;

  ceoUserName: string;
  bdoUserName: string;

  panchayatUserName: string;
  panchayatUserId: string;

  bdoDistrict: string;
  bdoTaluka: string;
  villageName: string;

  formNo: string | null;

  // Form completion status
  isForm1Complete: string;
  isForm2Complete: string;
  isForm3Complete: string;
  isForm4Complete: string;
  isForm5Complete: string;
  isForm6Complete: string;
  isForm7Complete: string;
  isForm8Complete: string;

  // Desk scrutiny status
  isForm1CompleteDesk: string;
  isForm2CompleteDesk: string;
  isForm3CompleteDesk: string;
  isForm4CompleteDesk: string;
  isForm5CompleteDesk: string;
  isForm6CompleteDesk: string;
  isForm7CompleteDesk: string;
  isForm8CompleteDesk: string;

  // Panchayat marks
  totalMarks: string;
  totalOutOfMarks: string;
  percentage: string;

  // BDO marks
  bdoTotalMarks: string;
  bdoTotalOutOfMarks: string;
  bdoPercentage: string;

  // CEO marks
  ceoTotalMarks: string;
  ceoTotalOutOfMarks: string;
  ceoPercentage: string;

  // Division marks
  divionTotalMarks: string;
  divionTotalOutOfMarks: string;
  divionPercentage: string;

  // Scrutiny flags
  isTopTwoPanchayatRec: string;
  isCurrentDictScrutiny100PerDone: string;
  blockCurrentDict: string;
}

interface STAPanchayat {
  divUserid: string;
  divUserName: string;

  ceoUserID: string;
  bdoUserID: string;

  ceoUserName: string;
  bdoUserName: string;

  panchayatUserName: string;
  panchayatUserId: string;

  bdoDistrict: string;
  bdoTaluka: string;
  villageName: string;

  formNo: string | null;

  // Form completion status
  isForm1Complete: string;
  isForm2Complete: string;
  isForm3Complete: string;
  isForm4Complete: string;
  isForm5Complete: string;
  isForm6Complete: string;
  isForm7Complete: string;
  isForm8Complete: string;

  // Desk scrutiny status
  isForm1CompleteDesk: string;
  isForm2CompleteDesk: string;
  isForm3CompleteDesk: string;
  isForm4CompleteDesk: string;
  isForm5CompleteDesk: string;
  isForm6CompleteDesk: string;
  isForm7CompleteDesk: string;
  isForm8CompleteDesk: string;

  // Panchayat marks
  totalMarks: string;
  totalOutOfMarks: string;
  percentage: string;

  // BDO marks
  bdoTotalMarks: string;
  bdoTotalOutOfMarks: string;
  bdoPercentage: string;

  // CEO marks
  ceoTotalMarks: string;
  ceoTotalOutOfMarks: string;
  ceoPercentage: string;

  // Division marks
  divionTotalMarks: string;
  divionTotalOutOfMarks: string;
  divionPercentage: string;

  stateTotalMarks: string;
  stateTotalOutOfMarks: string;
  statePercentage: string;

  // Scrutiny flags
  isTopTwoPanchayatRec: string;
}

type RootStackParamList = {
  BDOForm: {
    villageId: string | number;
    villageName: string;
    formNo: number;
    status: string;
  };

  CEOForm: {
    villageId: string | number;
    villageName: string;
    formNo: number;
    bdoUserName: string;
    bdouserid: string;
  };

  DivisionForm: {
    villageId: string | number;
    villageName: string;
    formNo: number;
    bdoUserName: string;
    bdouserid: string;
    ceouserid: string;
    ceousername: string;
  };
  StateForm: {
    villageId: string | number;
    villageName: string;
    formNo: number;
    bdoUserName: string;
    bdouserid: string;
    ceouserid: string;
    ceousername: string;
    divuserid: string;
    divusername: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BDODashboard = () => {
  const { userID, token, username } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [searchResults, setSearchResults] = useState<BDOApiVillage[]>([]);
  const [isCEO, setIsCEO] = useState<boolean | undefined>(undefined);
  const [isBDO, setIsBDO] = useState<boolean | undefined>(undefined);
  const [isDIV, setIsDIV] = useState<boolean | undefined>(undefined);
  const [isSTA, setIsSTA] = useState<boolean | undefined>(undefined);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [panchayatList, setPanchayatList] = useState<CEOPanchayat[]>([]);
  const [divpanchayatList, setdivPanchayatList] = useState<DIVPanchayat[]>([]);
  const [stapanchayatList, setstaPanchayatList] = useState<STAPanchayat[]>([]);

  const [showTalukaDropdown, setShowTalukaDropdown] = useState(false);
  const [talukaList, setTalukaList] = useState<
    { value: string; text: string }[]
  >([]);
  const [selectedTalukaId, setSelectedTalukaId] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');

  const [showDivDropdown, setShowDivDropdown] = useState(false);
  const [selectedDivId, setSelectedDivId] = useState('');
  const [divList, setDivList] = useState<{ value: string; text: string }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [showSTADropdown, setShowSTADropdown] = useState(false);
  const [selectedSTAId, setSelectedSTAId] = useState('');
  const [staList, setStaList] = useState<{ value: string; text: string }[]>([]);
  const [selectedState, setSelectedState] = useState('');

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

  const fmt = (v: any) => Number(v || 0).toFixed(4);
  const clampPct = (v: any) => Math.max(0, Math.min(100, Number(v || 0)));

  type PerfCardProps = {
    title: string;
    marks: any;
    outOf: any;
    percentage: any;
  };

  const PerformanceCard = ({
    title,
    marks,
    outOf,
    percentage,
  }: PerfCardProps) => (
    <View style={styles.perfCard}>
      <View style={styles.perfCircle} />
      <Text style={styles.perfTitle}>{title}</Text>

      <Text style={styles.perfMarks}>
        {fmt(marks)} / {fmt(outOf)}
      </Text>
      <Text style={styles.perfPercent}>{fmt(percentage)} %</Text>

      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${clampPct(percentage)}%` }]}
        />
      </View>
    </View>
  );

  const staticCEOVillages: BDOApiVillage[] = [
    {
      panchayatUserId: '99901',
      villageName: 'Test Village 1',
      lgdCode: '100001',
      districtname: 'Test District',
      talukaName: 'Kalyan',

      isProfileComplete: 1,

      isForm1Complete: 1,
      isForm2Complete: 1,
      isForm3Complete: 0,
      isForm4Complete: 1,
      isForm5Complete: 0,
      isForm6Complete: 1,
      isForm7Complete: 0,
      isForm8Complete: 1,

      isForm1CompleteDesk: 1,
      isForm2CompleteDesk: 1,
      isForm3CompleteDesk: 0,
      isForm4CompleteDesk: 1,
      isForm5CompleteDesk: 0,
      isForm6CompleteDesk: 1,
      isForm7CompleteDesk: 0,
      isForm8CompleteDesk: 1,

      totalMarks: 80,
      totalOutOfMarks: 100,
      percentage: 80,
    },
    {
      panchayatUserId: '99902',
      villageName: 'Test Village 2',
      lgdCode: '100002',
      districtname: 'Test District',
      talukaName: 'Another Taluka',

      isProfileComplete: 1,

      isForm1Complete: 1,
      isForm2Complete: 1,
      isForm3Complete: 1,
      isForm4Complete: 0,
      isForm5Complete: 1,
      isForm6Complete: 0,
      isForm7Complete: 1,
      isForm8Complete: 0,

      isForm1CompleteDesk: 1,
      isForm2CompleteDesk: 1,
      isForm3CompleteDesk: 1,
      isForm4CompleteDesk: 0,
      isForm5CompleteDesk: 1,
      isForm6CompleteDesk: 0,
      isForm7CompleteDesk: 1,
      isForm8CompleteDesk: 0,

      totalMarks: 70,
      totalOutOfMarks: 100,
      percentage: 70,
    },
  ];

  const [loading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<BDOApiVillage[]>([]);
  const villageList = isCEO ? [...villages, ...staticCEOVillages] : villages;

  useEffect(() => {
    const getRoleFlags = async () => {
      try {
        const [storedIsCEO, storedIsBDO, storedIsDIV, storedIsSTA] =
          await Promise.all([
            AsyncStorage.getItem('isCEO'),
            AsyncStorage.getItem('isBDO'),
            AsyncStorage.getItem('isDIV'),
            AsyncStorage.getItem('isSTA'),
          ]);

        setIsCEO(storedIsCEO === 'true');
        setIsBDO(storedIsBDO === 'true');
        setIsDIV(storedIsDIV === 'true');
        setIsSTA(storedIsSTA === 'true');
      } catch (error) {
        console.error('Error fetching role flags:', error);
        setIsCEO(false);
        setIsBDO(false);
        setIsDIV(false);
        setIsSTA(false);
      }
    };

    getRoleFlags();
  }, []);

  useEffect(() => {
    if (
      !userID ||
      !token ||
      isCEO === undefined ||
      isBDO === undefined ||
      isDIV === undefined ||
      isSTA === undefined
    )
      return;

    if (isCEO) {
      fetchCEOTalukaList(userID, token);
    } else if (isDIV) {
      fetchDivDistrictList(userID, token);
    } else if (isSTA) {
      fetchStaDistrictList(userID, token);
    } else {
      //setdivPanchayatList(staticDIVPanchayatList);
      fetchBDOPanchayatList(userID, token);
    }
  }, [userID, token, isBDO, isCEO, isDIV, isSTA]);

  const fetchCEOTalukaList = async (userId: string, bearerToken: string) => {
    setLoading(true);
    try {

      const url = `${API_BASE_URL}/CEOAction/GetCEOTalukaList`;
      
      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            UserID: userId,
            RoleID: '4',
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('GetCEOTalukaList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        setTalukaList(data.items);
      } else {
        setTalukaList([]);
      }
    } catch (err) {
      console.error('Error fetching Taluka list:', err);
      setTalukaList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivDistrictList = async (userId: string, bearerToken: string) => {
    setLoading(true);
    try {

      const url = `${API_BASE_URL}/DIVAction/GetDIVDistrictList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            UserID: userId,
            RoleID: '6',
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('GetDIVDistrictList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        setDivList(data.items);
      } else {
        setDivList([]);
      }
    } catch (err) {
      console.error('Error fetching District list:', err);
      setDivList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaDistrictList = async (userId: string, bearerToken: string) => {
    setLoading(true);
    try {

      const url = `${API_BASE_URL}/StateAction/GetStateDivisionList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            CurrentUseriD: userId,
            RoleID: '8',
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('GetSTADivisionList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        setStaList(data.items);
      } else {
        setStaList([]);
      }
    } catch (err) {
      console.error('Error fetching State Division list:', err);
      setStaList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBDOPanchayatList = async (userId: string, bearerToken: string) => {
    setLoading(true);

    try {

      const url = `${API_BASE_URL}/BDOActions/GetBDOPanchayatList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            userid: userId,
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('GetBDOPanchayatList Response:', data);

      if (data && data.responseCode === 2000 && Array.isArray(data.items)) {
        setVillages(data.items);
      } else {
        //console.warn('GetBDOPanchayatList returned:', raw);

        // Alert.alert(
        //   'Error',
        //   'Something went wrong while fetching the Panchayat list. Please try again later.',
        // );

        showCustomAlert(
          'error',
          'Something went wrong while fetching the Panchayat list. Please try again later.',
        );

        setVillages([]);
      }
    } catch (err) {
      console.error('Error fetchBDOPanchayatList:', err);
      // Alert.alert('Error','An error occurred while fetching the Panchayat list. Please try again later.');
      showCustomAlert(
        'error',
        'An error occurred while fetching the Panchayat list. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  const safeJsonParse = (text: string) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const fetchCEOPanchayatList = async (
    talukaId: string,
    panchayatName: string = '',
  ) => {
    setLoading(true);

    try {
      const reqBody = {
        CurrentUseriD: userID,
        SelectedDDVal: talukaId,
        SelectedPanchayatName: panchayatName.trim(),
      };
      console.log('LoadCEOPanchayatList Request Body:', reqBody);

      const url = `${API_BASE_URL}/CEOAction/LoadCEOPanchayatList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reqBody),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('LoadCEOPanchayatList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        setPanchayatList(data?.items);
        setSearchResults(data.items);
      } else {
        setPanchayatList([]);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('LoadCEOPanchayatList Error:', error);
      setPanchayatList([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDIVPanchayatList = async (districtId: string) => {
    setLoading(true);

    try {
      const reqBody = {
        CurrentUseriD: userID,
        DistrictDDVal: districtId,
      };
      console.log('LoadDIVPanchayatList Request Body:', reqBody);

      const url = `${API_BASE_URL}/DIVAction/LoadDIVPanchayatList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reqBody),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('LoadDivPanchayatList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        //setPanchayatList(data?.items);
        setdivPanchayatList(data?.items);
      } else {
        setdivPanchayatList([]);
      }
    } catch (error) {
      console.error('LoadDivPanchayatList Error:', error);
      setdivPanchayatList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSTAPanchayatList = async (stateId: string) => {
    setLoading(true);

    try {
      const reqBody = {
        CurrentUseriD: userID,
        DivisionVal: stateId,
      };
      console.log('LoadSTAPanchayatList Request Body:', reqBody);

      const url = `${API_BASE_URL}/StateAction/LoadStatePanchayatList`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reqBody),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('LoadStaPanchayatList Response:', data);

      if (data?.responseCode === 2000 && Array.isArray(data?.items)) {
        //setdivPanchayatList(data?.items);
        setstaPanchayatList(data?.items);
      } else {
        setstaPanchayatList([]);
        setdivPanchayatList([]);
      }
    } catch (error) {
      console.error('LoadSTAPanchayatList Error:', error);
      //setdivPanchayatList([]);
      setdivPanchayatList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVillageList = villageList.filter(item =>
    item.villageName.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const handleCEOSearch = () => {
    Keyboard.dismiss();
    const search = searchText.trim();

    if (!selectedTaluka) {
      setSearchResults([]);
      return;
    }

    fetchCEOPanchayatList(selectedTalukaId, search);
    setIsSearchApplied(true);
  };

  const handleCEOClear = () => {
    //setSelectedTaluka('');
    setSearchText('');
    setSearchResults([]);
    setIsSearchApplied(false);
    fetchCEOPanchayatList(selectedTalukaId, '');
  };

  const navigation = useNavigation<NavigationProp>();

  const handleFormPress = (village: BDOApiVillage, formNo: number) => {
    const completeKey = `isForm${formNo}Complete` as keyof BDOApiVillage;

    const deskCompleteKey =
      `isForm${formNo}CompleteDesk` as keyof BDOApiVillage;

    const isCompleted =
      village[completeKey] === 1 && village[deskCompleteKey] === 1;

    const isPending =
      village[completeKey] === 0 && village[deskCompleteKey] === 0;

    const status = isCompleted ? 'completed' : isPending ? 'pending' : 'normal';

    navigation.navigate('BDOForm', {
      villageId: village.panchayatUserId,
      villageName: village.lgdCode,
      formNo: Number(formNo),
      status: status,
    });
  };

  const renderFormButton = (village: BDOApiVillage, formNo: number) => {
    const completeKey = `isForm${formNo}Complete` as keyof BDOApiVillage;

    const deskCompleteKey =
      `isForm${formNo}CompleteDesk` as keyof BDOApiVillage;

    const completeValue = Number(village[completeKey]);
    const deskCompleteValue = Number(village[deskCompleteKey]);
    const isCompleted =
      completeValue === formNo && deskCompleteValue === formNo;

    const isPending = completeValue === 0 && deskCompleteValue === 0;

    return (
      <TouchableOpacity
        key={`${village.panchayatUserId}_${formNo}`}
        disabled={isPending}
        activeOpacity={isPending ? 1 : 0.7}
        style={[
          styles.formButton,
          isCompleted && styles.completedFormButton,
          isPending && styles.pendingFormButton,
        ]}
        onPress={() => {
          if (isPending) return;

          handleFormPress(village, formNo);
        }}
      >
        <Text
          style={[
            styles.formButtonText,
            isCompleted && styles.completedFormText,
            isPending && styles.pendingFormText,
          ]}
        >
          Form {formNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCEOFormButton = (panchayat: CEOPanchayat, formNo: number) => {
    const completeKey = `isForm${formNo}Complete` as keyof CEOPanchayat;
    const deskCompleteKey = `isForm${formNo}CompleteDesk` as keyof CEOPanchayat;
    const completeValue = Number(panchayat[completeKey] ?? 0);
    const deskCompleteValue = Number(panchayat[deskCompleteKey] ?? 0);
    const isPreviousStageCompleted = completeValue !== 0;
    const isCEOCompleted = deskCompleteValue !== 0;

    const isPending = completeValue === 0;

    return (
      <TouchableOpacity
        key={`${panchayat.panchayatUserID}_${formNo}`}
        disabled={isPending}
        activeOpacity={isPending ? 1 : 0.7}
        style={[
          styles.formButton,
          isCEOCompleted && styles.completedFormButton,
          isPending && styles.pendingFormButton,
        ]}
        onPress={() => {
          if (isPending) {
            return;
          }

          console.log(
            `Navigating to CEOForm for Panchayat: ${panchayat.panchayatUserName}, Form No: ${formNo}`,
            panchayat.bdoUserName,
          );
          console.log('Panchayat Details:', panchayat);
          navigation.navigate('CEOForm', {
            villageId: panchayat.panchayatUserID,
            villageName: panchayat.panchayatUserName,
            formNo: Number(formNo),
            bdoUserName: panchayat.bdoUserName,
            bdouserid: panchayat.bdoUserID,
          });
        }}
      >
        <Text
          style={[
            styles.formButtonText,
            isCEOCompleted && styles.completedFormText,
            isPending && styles.pendingFormText,
          ]}
        >
          Form {formNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDIVFormButton = (
    panchayat: DIVPanchayat,
    formNo: number,
    index: number,
  ) => {
    const completeKey = `isForm${formNo}Complete` as keyof DIVPanchayat;
    const deskCompleteKey = `isForm${formNo}CompleteDesk` as keyof DIVPanchayat;
    const completeValue = Number(panchayat[completeKey] ?? 0);
    const deskCompleteValue = Number(panchayat[deskCompleteKey] ?? 0);
    const isPreviousStageCompleted = completeValue !== 0;
    const isCEOCompleted = deskCompleteValue !== 0;

    const isPending = completeValue === 0;

    return (
      <TouchableOpacity
        disabled={isPending}
        activeOpacity={isPending ? 1 : 0.7}
        style={[
          styles.formButton,
          isCEOCompleted && styles.completedFormButton,
          isPending && styles.pendingFormButton,
        ]}
        onPress={() => {
          if (isPending) {
            return;
          }

          navigation.navigate('DivisionForm', {
            villageId: panchayat.panchayatUserId,
            villageName: panchayat.panchayatUserName,
            formNo: Number(formNo),
            bdoUserName: panchayat.bdoUserName,
            bdouserid: panchayat.bdoUserID,
            ceouserid: panchayat.ceoUserID,
            ceousername: panchayat.ceoUserName,
          });
        }}
      >
        <Text
          style={[
            styles.formButtonText,
            isCEOCompleted && styles.completedFormText,
            isPending && styles.pendingFormText,
          ]}
        >
          Form {formNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSTAFormButton = (
    panchayat: STAPanchayat,
    formNo: number,
    index: number,
  ) => {
    const completeKey = `isForm${formNo}Complete` as keyof STAPanchayat;
    const deskCompleteKey = `isForm${formNo}CompleteDesk` as keyof STAPanchayat;
    const completeValue = Number(panchayat[completeKey] ?? 0);
    const deskCompleteValue = Number(panchayat[deskCompleteKey] ?? 0);
    const isPreviousStageCompleted = completeValue !== 0;
    const isCEOCompleted = deskCompleteValue !== 0;

    const isPending = completeValue === 0;

    return (
      <TouchableOpacity
        disabled={isPending}
        activeOpacity={isPending ? 1 : 0.7}
        style={[
          styles.staformButton,
          isCEOCompleted && styles.stacompletedFormButton,
          isPending && styles.stapendingFormButton,
        ]}
        onPress={() => {
          if (isPending) {
            return;
          }

          navigation.navigate('StateForm', {
            villageId: panchayat.panchayatUserId,
            villageName: panchayat.panchayatUserName,
            formNo: Number(formNo),
            bdoUserName: panchayat.bdoUserName,
            bdouserid: panchayat.bdoUserID,
            ceouserid: panchayat.ceoUserID,
            ceousername: panchayat.ceoUserName,
            divuserid: panchayat.divUserid,
            divusername: panchayat.divUserName,
          });
        }}
      >
        <Text
          style={[
            styles.formButtonText,
            isCEOCompleted && styles.completedFormText,
            isPending && styles.pendingFormText,
          ]}
        >
          Form {formNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleDownload = async () => {
    try {
      setLoading(true);

      const path = await downloadFile({
        url: 'https://example.com/sample.pdf',
        fileName: 'sample.pdf',
      });

      if (path) {
        Alert.alert('Success', `File downloaded successfully!\n${path}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to download the file.');
    } finally {
      setLoading(false);
    }
  };

  const renderVillageCard = (village: BDOApiVillage) => {
    return (
      <View key={village.panchayatUserId} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.villageName}>{village.villageName}</Text>

          {village.percentage !== null && (
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageBadgeText}>
                {village.percentage}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>LGD Code</Text>

            <Text style={styles.detailValue}>{village.lgdCode}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>District</Text>

            <Text style={styles.detailValue}>{village.districtname}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Taluka</Text>

            <Text style={styles.detailValue}>{village.talukaName}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Village Name</Text>

            <Text style={styles.detailValue}>{village.villageName}</Text>
          </View>
        </View>

        {village.totalMarks !== null && (
          <View style={styles.marksContainer}>
            <View style={styles.markItem}>
              <Text style={styles.detailLabel}>GP Marks</Text>

              <Text style={styles.detailValue}>
                {village.totalMarks} / {village.totalOutOfMarks}
              </Text>
            </View>

            <View style={styles.markItem}>
              <Text style={styles.detailLabel}>GP Percentage</Text>

              <Text style={styles.detailValue}>{village.percentage ?? 0}%</Text>
            </View>
          </View>
        )}

        <Text style={styles.formsTitle}>Available Forms</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formsContainer}
        >
          {Array.from({ length: 8 }, (_, index) =>
            renderFormButton(village, index + 1),
          )}
        </ScrollView>
      </View>
    );
  };

  const renderCEOCard = (panchayat: CEOPanchayat) => {
    return (
      <View key={panchayat.panchayatUserID} style={styles.ceoCard}>
        <View style={styles.ceoCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ceoVillageName}>{panchayat.villageName}</Text>
          </View>

          {(panchayat.isTopTwoPanchayatRec === '1' ||
            panchayat.isTopTwoPanchayatRec === '2') && (
            <View style={styles.rankBadge}>
              <Icon name="trophy" size={15} color="#f5f128" />

              <Text style={styles.rankText}>
                # {panchayat.isTopTwoPanchayatRec} Rank
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ceoInfoRow}>
          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>LGD Code</Text>

            <Text style={styles.ceoInfoValue}>
              {panchayat.panchayatUserName}
            </Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>District</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoDistrict}</Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>Taluka</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoTaluka}</Text>
          </View>
        </View>

        <View style={styles.ceoMarksBox}>
          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>GP Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.totalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.totalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>GP %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.percentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>BDO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.bdoTotalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.bdoTotalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>BDO %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.bdoPercentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>CEO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.ceoMarks || 0).toFixed(4)} / ${Number(
                  panchayat.outOfMarksCEO || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>CEO %</Text>

              <Text style={styles.ceoMarkValue}>
                {panchayat.ceoPercentage != null
                  ? `${Number(panchayat.ceoPercentage).toFixed(4)}%`
                  : '0.00%'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formsContainer}
        >
          {Array.from({ length: 8 }, (_, index) => {
            const formNo = index + 1;

            const previousStageKey =
              `isForm${formNo}Complete` as keyof CEOPanchayat;

            const ceoCompleteKey =
              `isForm${formNo}CompleteDesk` as keyof CEOPanchayat;

            const previousStageValue = String(
              panchayat[previousStageKey] ?? '0',
            );

            const ceoCompleteValue = String(panchayat[ceoCompleteKey] ?? '0');

            const previousStageCompleted = previousStageValue !== '0';
            const ceoCompleted = ceoCompleteValue !== '0';
            const isFormDisabled = previousStageValue === '0';

            return (
              <View
                key={`${panchayat.panchayatUserID}_${formNo}`}
                style={styles.ceoFormWrapper}
              >
                {renderCEOFormButton(panchayat, formNo)}

                {previousStageCompleted && (
                  <View style={styles.downloadRow}>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // GP Download
                      }}
                    >
                      <Icon name="download" size={21} color="#159447" />

                      <Text style={styles.downloadLabel}>GP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // BDO Download
                      }}
                    >
                      <Icon name="download" size={21} color="#E86A16" />
                      <Text style={styles.downloadLabel}>BDO</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderCEOSearch = () => {
    return (
      <View style={styles.ceoSearchCard}>
        <Text style={styles.searchFieldLabel}>तालुका निवडा</Text>

        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setShowTalukaDropdown(prev => !prev)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedTaluka && styles.placeholderText,
            ]}
          >
            {selectedTaluka || '-- Select Taluka --'}
          </Text>

          <Icon
            name={showTalukaDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {showTalukaDropdown && (
          <View style={styles.dropdownMenu}>
            {talukaList.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedTaluka(item.text);
                  setSelectedTalukaId(item.value);
                  setShowTalukaDropdown(false);
                  fetchCEOPanchayatList(item.value);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedTaluka === item.text && styles.selectedDropdownItem,
                  ]}
                >
                  {item.text}
                </Text>

                {selectedTaluka === item.text && (
                  <Icon name="check" size={18} color="#159447" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.searchFieldLabel, { marginTop: 14 }]}>
          ग्रामपंचायत युजरनेम (LGD Code) द्वारे शोधा
        </Text>

        <View style={styles.ceoSearchInput}>
          <Icon name="magnify" size={20} color="#64748B" />

          <TextInput
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              setIsSearchApplied(false);
            }}
            placeholder="LGD Code / Village Name"
            placeholderTextColor="#94A3B8"
            style={styles.ceoSearchTextInput}
          />

          {!!searchText && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={19} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchButtonsRow}>
          <TouchableOpacity
            style={styles.gpSearchButton}
            activeOpacity={0.8}
            onPress={handleCEOSearch}
          >
            <Icon name="magnify" size={18} color="#FFFFFF" />

            <Text style={styles.searchButtonText}>GP Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            activeOpacity={0.8}
            onPress={handleCEOClear}
          >
            <Icon name="close" size={18} color="#FFFFFF" />

            <Text style={styles.searchButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDIVCard = (panchayat: DIVPanchayat, index: number) => {
    return (
      <View
        key={`${panchayat.ceoUserID}_${panchayat.panchayatUserName}_${index}`}
        style={styles.ceoCard}
      >
        <View style={styles.ceoCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ceoVillageName}>{panchayat.villageName}</Text>
          </View>

          {(panchayat.isTopTwoPanchayatRec === '1' ||
            panchayat.isTopTwoPanchayatRec === '2') && (
            <View style={styles.rankBadge}>
              <Icon name="trophy" size={15} color="#f5f128" />

              <Text style={styles.rankText}>
                # {panchayat.isTopTwoPanchayatRec} Rank
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ceoInfoRow}>
          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>LGD Code</Text>

            <Text style={styles.ceoInfoValue}>
              {panchayat.panchayatUserName}
            </Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>District</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoDistrict}</Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>Taluka</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoTaluka}</Text>
          </View>
        </View>

        <View style={styles.ceoMarksBox}>
          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>GP Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.totalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.totalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>GP %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.percentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>BDO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.bdoTotalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.bdoTotalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>BDO %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.bdoPercentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>CEO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.ceoTotalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.ceoTotalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>CEO %</Text>

              <Text style={styles.ceoMarkValue}>
                {panchayat.ceoPercentage != null
                  ? `${Number(panchayat.ceoPercentage).toFixed(4)}%`
                  : '0.00%'}
              </Text>
            </View>
          </View>

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>Division Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.divionTotalMarks || 0).toFixed(
                  4,
                )} / ${Number(panchayat.divionTotalOutOfMarks || 0).toFixed(
                  4,
                )}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>Division %</Text>

              <Text style={styles.ceoMarkValue}>
                {panchayat.divionPercentage != null
                  ? `${Number(panchayat.divionPercentage).toFixed(4)}%`
                  : '0.00%'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formsContainer}
        >
          {Array.from({ length: 8 }, (_, formIndex) => {
            const formNo = formIndex + 1;

            const previousStageKey =
              `isForm${formNo}Complete` as keyof DIVPanchayat;

            const divCompleteKey =
              `isForm${formNo}CompleteDesk` as keyof DIVPanchayat;

            const previousStageValue = String(
              panchayat[previousStageKey] ?? '0',
            );

            const ceoCompleteValue = String(panchayat[divCompleteKey] ?? '0');

            const previousStageCompleted = previousStageValue !== '0';
            const ceoCompleted = ceoCompleteValue !== '0';
            const isFormDisabled = previousStageValue === '0';

            return (
              <View
                key={`div-form-${index}-${formNo}`}
                style={styles.ceoFormWrapper}
              >
                {renderDIVFormButton(panchayat, formNo, index)}

                {previousStageCompleted && (
                  <View style={styles.downloadRow}>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // GP Download
                      }}
                    >
                      <Icon name="download" size={20} color="#159447" />

                      <Text style={styles.downloadLabel}>GP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // BDO Download
                      }}
                    >
                      <Icon name="download" size={20} color="#E86A16" />
                      <Text style={styles.downloadLabel}>BDO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // GP Download
                      }}
                    >
                      <Icon name="download" size={20} color="#ec0739" />

                      <Text style={styles.downloadLabel}>CEO</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderSTACard = (panchayat: STAPanchayat, index: number) => {
    return (
      <View
        key={`${panchayat.ceoUserID}_${panchayat.panchayatUserName}_${index}`}
        style={styles.ceoCard}
      >
        <View style={styles.ceoCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ceoVillageName}>{panchayat.villageName}</Text>
          </View>

          {(panchayat.isTopTwoPanchayatRec === '1' ||
            panchayat.isTopTwoPanchayatRec === '2') && (
            <View style={styles.rankBadge}>
              <Icon name="trophy" size={15} color="#f5f128" />

              <Text style={styles.rankText}>
                # {panchayat.isTopTwoPanchayatRec} Rank
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ceoInfoRow}>
          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>LGD Code</Text>

            <Text style={styles.ceoInfoValue}>
              {panchayat.panchayatUserName}
            </Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>District</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoDistrict}</Text>
          </View>

          <View style={styles.ceoInfoItem}>
            <Text style={styles.ceoInfoLabel}>Taluka</Text>

            <Text style={styles.ceoInfoValue}>{panchayat.bdoTaluka}</Text>
          </View>
        </View>

        <View style={styles.ceoMarksBox}>
          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>GP Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.totalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.totalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>GP %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.percentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>BDO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.bdoTotalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.bdoTotalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>BDO %</Text>

              <Text style={styles.ceoMarkValue}>
                {Number(panchayat.bdoPercentage || 0).toFixed(4)}%
              </Text>
            </View>
          </View>

          <View style={styles.marksDivider} />

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>CEO Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.ceoTotalMarks || 0).toFixed(4)} / ${Number(
                  panchayat.ceoTotalOutOfMarks || 0,
                ).toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>CEO %</Text>

              <Text style={styles.ceoMarkValue}>
                {panchayat.ceoPercentage != null
                  ? `${Number(panchayat.ceoPercentage).toFixed(4)}%`
                  : '0.00%'}
              </Text>
            </View>
          </View>

          <View style={styles.ceoMarkRow}>
            <View style={styles.ceoMarkItem}>
              <Text style={styles.ceoMarkLabel}>Division Marks</Text>

              <Text style={styles.ceoMarkValue}>
                {`${Number(panchayat.divionTotalMarks || 0).toFixed(
                  4,
                )} / ${Number(panchayat.divionTotalOutOfMarks || 0).toFixed(
                  4,
                )}`}
              </Text>
            </View>

            <View style={styles.ceoPercentageItem}>
              <Text style={styles.ceoMarkLabel}>Division %</Text>

              <Text style={styles.ceoMarkValue}>
                {panchayat.divionPercentage != null
                  ? `${Number(panchayat.divionPercentage).toFixed(4)}%`
                  : '0.00%'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formsContainer}
        >
          {Array.from({ length: 8 }, (_, formIndex) => {
            const formNo = formIndex + 1;

            const previousStageKey =
              `isForm${formNo}Complete` as keyof STAPanchayat;

            const divCompleteKey =
              `isForm${formNo}CompleteDesk` as keyof STAPanchayat;

            const previousStageValue = String(
              panchayat[previousStageKey] ?? '0',
            );

            const previousStageCompleted = previousStageValue !== '0';
          

            return (
              <View
                key={`div-form-${index}-${formNo}`}
                style={styles.ceoFormWrapper}
              >
                {renderSTAFormButton(panchayat, formNo, index)}

                {previousStageCompleted && (
                  <View style={styles.downloadRow}>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // GP Download
                      }}
                    >
                      <Icon name="download" size={20} color="#159447" />

                      <Text style={styles.downloadLabel}>GP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // BDO Download
                      }}
                    >
                      <Icon name="download" size={20} color="#E86A16" />
                      <Text style={styles.downloadLabel}>BDO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        // GP Download
                      }}
                    >
                      <Icon name="download" size={20} color="#ec0739" />

                      <Text style={styles.downloadLabel}>CEO</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderSTACardV2 = (panchayat: STAPanchayat, index: number) => {
    const isTopTwo =
      panchayat.isTopTwoPanchayatRec === '1' ||
      panchayat.isTopTwoPanchayatRec === '2';

    const downloads = [
      { label: 'GP', bg: '#DCFCE7', color: '#159447', text: '#15803D' },
      { label: 'BDO', bg: '#FFEBD5', color: '#E86A16', text: '#C2410C' },
      { label: 'CEO', bg: '#E2F0A0', color: '#6B7A12', text: '#4D5A0A' },
      { label: 'DIV', bg: '#F0C79A', color: '#8A4B14', text: '#6B3A0E' },
    ];

    return (
      <View
        key={`${panchayat.ceoUserID}_${panchayat.panchayatUserName}_${index}`}
        style={styles.cardsta}
      >
        <LinearGradient
          colors={['#1473E6', '#2D9CDB', '#4DD6D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.villageNamesta}>{panchayat.villageName}</Text>

          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                LGD : {panchayat.panchayatUserName}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                District : {panchayat.bdoDistrict}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Taluka : {panchayat.bdoTaluka}
              </Text>
            </View>

            {isTopTwo && (
              <View style={styles.rankChip}>
                <Icon name="trophy" size={13} color="#7A4A00" />
                <Text style={styles.rankChipText}>
                  Rank # {panchayat.isTopTwoPanchayatRec}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.perfRow}
        >
          <PerformanceCard
            title="GP PERFORMANCE"
            marks={panchayat.totalMarks}
            outOf={panchayat.totalOutOfMarks}
            percentage={panchayat.percentage}
          />
          <PerformanceCard
            title="BDO PERFORMANCE"
            marks={panchayat.bdoTotalMarks}
            outOf={panchayat.bdoTotalOutOfMarks}
            percentage={panchayat.bdoPercentage}
          />
          <PerformanceCard
            title="CEO PERFORMANCE"
            marks={panchayat.ceoTotalMarks}
            outOf={panchayat.ceoTotalOutOfMarks}
            percentage={panchayat.ceoPercentage}
          />
          <PerformanceCard
            title="DIVISION PERFORMANCE"
            marks={panchayat.divionTotalMarks}
            outOf={panchayat.divionTotalOutOfMarks}
            percentage={panchayat.divionPercentage}
          />
          <PerformanceCard
            title="STATE PERFORMANCE"
            marks={panchayat.stateTotalMarks}
            outOf={panchayat.stateTotalOutOfMarks}
            percentage={panchayat.statePercentage}
          />
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formsRow}
        >
          {Array.from({ length: 8 }, (_, formIndex) => {
            const formNo = formIndex + 1;
            const previousStageKey =
              `isForm${formNo}Complete` as keyof STAPanchayat;
            const previousStageCompleted =
              String(panchayat[previousStageKey] ?? '0') !== '0';

            return (
              <View
                key={`sta-form-${index}-${formNo}`}
                style={styles.formWrapper}
              >
                {renderSTAFormButton(panchayat, formNo, index)}

                {previousStageCompleted && (
                  <View style={styles.downloadRowsta}>
                    {downloads.map(d => (
                      <TouchableOpacity
                        key={d.label}
                        activeOpacity={0.7}
                        style={[styles.downloadTile, { backgroundColor: d.bg }]}
                        onPress={() => {
                          // TODO: handle `${d.label}` download for formNo
                        }}
                      >
                        <Icon name="download" size={18} color={d.color} />
                        <Text style={[styles.downloadText, { color: d.text }]}>
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderDivDropdown = () => {
    return (
      <View style={styles.ceoSearchCard}>
        <Text style={styles.searchFieldLabel}>जिल्हा निवडा</Text>

        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setShowDivDropdown(prev => !prev)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedDivId && styles.placeholderText,
            ]}
          >
            {divList.find(item => item.value === selectedDivId)?.text ||
              '-- Select --'}
          </Text>

          <Icon
            name={showDivDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {showDivDropdown && (
          <View style={styles.dropdownMenu}>
            {divList.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedDistrict(item.text);
                  setSelectedDivId(item.value);
                  setShowDivDropdown(false);
                  fetchDIVPanchayatList(item.value);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedDistrict === item.text &&
                      styles.selectedDropdownItem,
                  ]}
                >
                  {item.text}
                </Text>

                {selectedDistrict === item.text && (
                  <Icon name="check" size={18} color="#159447" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStaDropdown = () => {
    return (
      <View style={styles.ceoSearchCard}>
        <Text style={styles.searchFieldLabel}>विभाग निवडा</Text>

        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setShowSTADropdown(prev => !prev)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedSTAId && styles.placeholderText,
            ]}
          >
            {staList.find(item => item.value === selectedSTAId)?.text ||
              '-- Select --'}
          </Text>

          <Icon
            name={showSTADropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {showSTADropdown && (
          <View style={styles.dropdownMenu}>
            {staList.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedState(item.text);
                  setSelectedSTAId(item.value);
                  setShowSTADropdown(false);
                  fetchSTAPanchayatList(item.value);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedState === item.text && styles.selectedDropdownItem,
                  ]}
                >
                  {item.text}
                </Text>

                {selectedState === item.text && (
                  <Icon name="check" size={18} color="#159447" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <CustomHeader title="मुख्यपृष्ठ" />

      {isSTA ? (
        <>
          {renderStaDropdown()}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ceoResultsContainer}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Gram Panchayat Results</Text>

              <View style={styles.resultCountBadge}>
                <Text style={styles.resultCountText}>
                  {stapanchayatList.length}
                </Text>
              </View>
            </View>

            {stapanchayatList.length > 0 ? (
              stapanchayatList.map(renderSTACardV2)
            ) : (
              <View style={styles.emptyContainer}>
                <Icon
                  name="database-search-outline"
                  size={46}
                  color="#94A3B8"
                />

                <Text style={styles.emptyTitle}>No Gram Panchayat Found</Text>

                <Text style={styles.emptySubTitle}>No records available</Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : isDIV ? (
        <>
          {renderDivDropdown()}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ceoResultsContainer}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Gram Panchayat Results</Text>

              <View style={styles.resultCountBadge}>
                <Text style={styles.resultCountText}>
                  {divpanchayatList.length}
                </Text>
              </View>
            </View>

            {divpanchayatList.length > 0 ? (
              divpanchayatList.map(renderDIVCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Icon
                  name="database-search-outline"
                  size={46}
                  color="#94A3B8"
                />

                <Text style={styles.emptyTitle}>No Gram Panchayat Found</Text>

                <Text style={styles.emptySubTitle}>No records available</Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : isCEO ? (
        <>
          {renderCEOSearch()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ceoResultsContainer}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Gram Panchayat Results</Text>

              <View style={styles.resultCountBadge}>
                <Text style={styles.resultCountText}>
                  {panchayatList.length}
                </Text>
              </View>
            </View>

            {panchayatList.length > 0 ? (
              panchayatList.map(renderCEOCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Icon
                  name="database-search-outline"
                  size={46}
                  color="#94A3B8"
                />

                <Text style={styles.emptyTitle}>No Gram Panchayat Found</Text>

                <Text style={styles.emptySubTitle}>
                  Please check Taluka or LGD Code
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: 5,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: '#0B4FA3',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 16,
              }}
            >
              Form Scrutiny
            </Text>
          </View>

          <View style={styles.bdoSearchContainer}>
            <Icon
              name="magnify"
              size={20}
              color="#64748B"
              style={{ marginRight: 6 }}
            />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search"
              placeholderTextColor="#94A3B8"
              style={{
                flex: 1,
                fontSize: 14,
                color: '#1E293B',
              }}
            />

            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pageContent}
          >
            {filteredVillageList.map(renderVillageCard)}
          </ScrollView>
        </>
      )}

      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#0B63B6" />

            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default BDODashboard;

const styles = StyleSheet.create({
  //sta style

  staformButton: {
    minWidth: 120,
    height: 40,
    marginRight: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8D7E2',
  },

  stacompletedFormButton: {
    backgroundColor: '#8DEB96',
    borderColor: '#6ED679',
  },

  stapendingFormButton: {
    backgroundColor: '#F4F7FA',
    borderColor: '#C8D7E2',
  },

  cardsta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 4,
    marginBottom: 16,
    padding: 10,
    elevation: 3,
    shadowColor: '#0B2A55',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  header: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  villageNamesta: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#334155' 
  },
  rankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBBF24',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 6,
    elevation: 2,
  },
  rankChipText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '800',
    color: '#7A4A00',
  },

  perfRow: { 
    paddingVertical:12,
    paddingRight: 4 
  },
  perfCard: {
    width: 170,
    minHeight: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  perfCircle: {
    position: 'absolute',
    top: -22,
    right: -22,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBE8FD',
  },
  perfTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10,
  },
  perfMarks: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#0F172A' 
  },
  perfPercent: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 4,
    marginBottom: 10,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 'auto',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },

  formsRow: { 
    paddingBottom: 4 
  },
  formWrapper: { 
    marginRight: 12, 
    alignItems: 'center' 
  },
  downloadRowsta: { 
    flexDirection: 'row', 
    marginTop: 8 
  },
  downloadTile: {
    width: 40,
    height: 48,
    borderRadius: 8,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: { 
    fontSize: 10, 
    fontWeight: '800', 
    marginTop: 2 
  },

  scrutinyStatus: {
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },

  scrutinyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },

  scrutinyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333333',
  },

  placeholderText: {
    color: '#999999',
  },

  dropdownMenu: {
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 999,
  },

  dropdownItem: {
    minHeight: 45,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#333333',
  },

  selectedDropdownItem: {
    color: '#159447',
    fontWeight: '600',
  },

  loaderText: {
    color: '#0B63B6',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 11,
  },

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
  bdoSearchContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DFEA',
    borderRadius: 10,
    paddingHorizontal: 11,
    marginVertical: 5,
    marginHorizontal: 14,
  },

  ceoPageHeader: {
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ceoPageTitle: {
    color: '#0B4FA3',
    fontSize: 20,
    fontWeight: '800',
  },

  ceoPageSubtitle: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 12,
  },

  ceoSearchCard: {
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9E4EC',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  searchFieldLabel: {
    color: '#183551',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  searchFieldLabel1: {
    color: '#183551',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },

  pickerContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  picker: {
    width: '100%',
    height: 50,
    color: '#333333',
  },

  ceoSearchInput: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D3DEE8',
    borderRadius: 9,
    paddingHorizontal: 12,
  },

  ceoSearchTextInput: {
    flex: 1,
    marginLeft: 7,
    color: '#1E293B',
    fontSize: 14,
  },

  searchButtonsRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  gpSearchButton: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#118CC5',
    borderRadius: 8,
    marginRight: 8,
  },

  clearButton: {
    width: 105,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DF3D48',
    borderRadius: 8,
  },

  searchButtonText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  ceoResultsContainer: {
    paddingHorizontal: 14,
    //paddingTop: 5,
    paddingBottom: 50,
  },

  resultHeader: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultTitle: {
    color: '#183551',
    fontSize: 15,
    fontWeight: '800',
  },

  resultCountBadge: {
    marginLeft: 8,
    minWidth: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#0B4FA3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  ceoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D8E2EA',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  ceoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  ceoVillageName: {
    color: '#003C75',
    fontSize: 17,
    fontWeight: '900',
  },

  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },

  rankText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
  },

  ceoInfoRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 9,
    padding: 10,
    marginBottom: 12,
  },

  ceoInfoItem: {
    flex: 1,
  },

  ceoInfoLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },

  ceoInfoValue: {
    marginTop: 3,
    color: '#183551',
    fontSize: 12,
    fontWeight: '700',
  },

  ceoMarksBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E8EE',
    paddingHorizontal: 11,
  },

  ceoMarkRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },

  ceoMarkItem: {
    flex: 1.7,
  },

  ceoPercentageItem: {
    flex: 1,
  },

  ceoMarkLabel: {
    color: '#183551',
    fontSize: 10,
    fontWeight: '800',
  },

  ceoMarkValue: {
    marginTop: 3,
    color: '#607182',
    fontSize: 11,
    fontWeight: '500',
  },

  marksDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  ceoFormsTitle: {
    marginTop: 14,
    marginBottom: 9,
    color: '#183551',
    fontSize: 12,
    fontWeight: '800',
  },

  ceoFormWrapper: {
    alignItems: 'center',
  },

  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },

  downloadButton: {
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  downloadLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5EB',
  },

  emptyTitle: {
    marginTop: 10,
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
  },

  emptySubTitle: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 11,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#E8EEF3',
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EFF6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  menuIcon: {
    fontSize: 25,
    color: '#0869A5',
    fontWeight: '700',
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: '#122B49',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 2,
    color: '#557084',
    fontSize: 11,
  },

  userInfoContainer: {
    backgroundColor: '#087EC1',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  welcomeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  roleText: {
    marginTop: 3,
    color: '#E4F5FF',
    fontSize: 12,
  },

  pageContent: {
    padding: 14,
    paddingBottom: 40,
  },

  pageHeadingContainer: {
    marginBottom: 14,
  },

  pageHeading: {
    color: '#0A3157',
    fontSize: 21,
    fontWeight: '800',
  },

  pageSubheading: {
    marginTop: 3,
    color: '#5C7485',
    fontSize: 12,
    lineHeight: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DBE6EC',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  villageName: {
    flex: 1,
    color: '#003C75',
    fontSize: 17,
    fontWeight: '800',
  },

  percentageBadge: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#DCF7E1',
  },

  percentageBadgeText: {
    color: '#21893B',
    fontSize: 11,
    fontWeight: '800',
  },

  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 13,
    marginHorizontal: -4,
  },

  detailItem: {
    width: '25%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  detailLabel: {
    color: '#183551',
    fontSize: 11,
    fontWeight: '700',
  },

  detailValue: {
    marginTop: 3,
    color: '#607182',
    fontSize: 12,
    fontWeight: '500',
  },

  marksContainer: {
    marginTop: 2,
    padding: 10,
    borderRadius: 9,
    backgroundColor: '#F4F8FB',
    flexDirection: 'row',
  },

  markItem: {
    flex: 1,
  },

  formsTitle: {
    marginTop: 13,
    marginBottom: 9,
    color: '#183551',
    fontSize: 12,
    fontWeight: '700',
  },

  formsContainer: {
    paddingRight: 10,
    marginTop: 10,
  },

  formButton: {
    minWidth: 78,
    height: 40,
    marginRight: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8D7E2',
  },

  completedFormButton: {
    backgroundColor: '#8DEB96',
    borderColor: '#6ED679',
  },

  pendingFormButton: {
    backgroundColor: '#F4F7FA',
    borderColor: '#C8D7E2',
  },

  disabledFormButton: {
    backgroundColor: '#EDF1F4',
    borderColor: '#D4DDE3',
  },

  formButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  completedFormText: {
    color: '#176A2A',
  },

  pendingFormText: {
    color: '#E11B22',
    textDecorationLine: 'line-through',
  },

  disabledFormText: {
    color: '#526A7D',
  },
});
