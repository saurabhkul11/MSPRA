 
// src/screens/FormScreen.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionCard from './components/QuestionCard';
import ProgressSteps from './components/ProgressSteps';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation/BottomTabs';
import CustomHeader from '../utils/CustomHeader';

type FormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FormScreen = () => {
  const [questions, setQuestions] = useState<any[]>([]); // current question data
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  // const [userID, setUserID] = useState<string | null>(null);
  //  const [token, setToken] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<any[]>([]); // list of all steps
  const [toolTipName, setToolTipName] = useState<string>('');
  const [selectedOptionData, setSelectedOptionData] = useState<any>(null);
  const [selectedOptionNo, setSelectedOptionNo] = useState(null);
  const [selectedSubMenuFlag, setSelectedSubMenuFlag] = useState('');
  const [savedAnswers, setSavedAnswers] = useState<Record<number, any>>({});
  const [filePayloads, setFilePayloads] = useState<any[]>([]);

  //const submittedSteps = Object.keys(savedAnswers).map(Number);
  const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);
  const { userID, token } = useAuth();

  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<number[]>([]);
  const { isProfileComplete } = useAuth();
  //const navigation = useNavigation();
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const hasAlertShown = useRef(false);

  interface SavedAnswer {
    option?: any;
    checkbox?: any[];
    textbox?: string;
    file?: any;
  }

  useEffect(() => {
    if (!userID || !token) return;
  }, [userID, token]);

  useFocusEffect(
  useCallback(() => {
    setCurrentQuestion(1);

    if (questionList.length && userID && token) {
      const firstQuestion = questionList[0];
      fetchQuestionByID(firstQuestion.questionID, userID, token);
      setToolTipName(firstQuestion.toolTipName);
    }
  }, [questionList, userID, token])
);


  const fetchAllQuestions = async (userId: string, bearerToken: string) => {
    try {
      const response = await fetch(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetPreQuestionMaster',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ Userid: userId }),
        },
      );

      const text = await response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from GetPreQuestionMaster');
      }

      const data = JSON.parse(text);
      console.log('🟢 GetPreQuestionMaster Response:', data);
      if (data?.responseCode === 2000 && Array.isArray(data.items)) {
        setQuestionList(data.items);
        // Load first question automatically
        const firstQ = data.items[0];
        fetchQuestionByID(firstQ.questionID, userId, bearerToken);
        setToolTipName(firstQ.toolTipName);
      } else {
        Alert.alert('Error', data?.responseMessage || 'Unexpected response');
      }
    } catch (err: any) {
      console.error('Master API Error:', err);
      Alert.alert('Error', err.message);
    }
  };

  const fetchQuestionByID = async (
  questionID: string,
  userID: string,
  bearerToken: string,
  textboxData: any = null,
  checkboxData: any[] = [],
) => {
  try {
    setLoading(true);

    console.log('TOKEN:', bearerToken);

    const response = await fetch(
      'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetPreQuestionByQuestionID',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          QuesionID: questionID,
          Userid: userID,
        }),
      },
    );

    console.log('HTTP Status:', response.status);

    const text = await response.text();
    console.log('Raw Response:', text);

    if (!text?.trim()) throw new Error('Empty response from server');

    const data = JSON.parse(text);

    if (data?.responseCode === 2000 && Array.isArray(data.items)) {
      const firstItem = data.items[0];

      const formattedQuestion = {
        id: firstItem.preRDQuestionID,
        question: firstItem.preRDQuestion,
        options: data.items.map((opt: any) => ({
          optionNo: opt.preRDOptionNo,
          optionName: opt.preRDOptionName,
          isSubOption: opt.preRDIsSubOption,
          subMenuFlag: opt.preRDSubMenuFlag,
          optAnsNo: opt.optAnsNo ?? 0,
        })),
        answer: '',
      };

      console.log('Formatted Question:', formattedQuestion);

      const selectedOpt = data.items.find(
        (opt: any) => Number(opt.optAnsNo) > 0,
      );

     

      setQuestions([formattedQuestion]);

      setToolTipName(firstItem.preRDQuestionName);

      const answerState = {
        option: selectedOpt ? selectedOpt.preRDOptionNo : null,
        textbox: textboxData ?? [],
        checkbox: checkboxData ?? [],
      };

      console.log('Saving Answer State:', answerState);

      setSavedAnswers(prev => ({
        ...prev,
        [questionID]: answerState,
      }));

      if (selectedOpt) {
        setSelectedOptionNo(selectedOpt.preRDOptionNo);
      }

    } else {
      console.log('Unexpected Response:', data);
      Alert.alert('Error', data?.responseMessage || 'Unexpected response');
    }
  } catch (error: any) {
    console.error(error);
    Alert.alert('Error', error.message || 'Failed to fetch questions');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (userID && token) {
      fetchAllQuestions(userID, token);
    }
  }, [userID, token]);

  // ✅ 4. When user taps a step
  const handleStepPress = (stepNumber: number) => {
    setCurrentQuestion(stepNumber);
    const selected = questionList.find(q => q.srNo === stepNumber);
    if (selected && userID && token) {
      fetchQuestionByID(selected.questionID, userID, token);
      setToolTipName(selected.toolTipName);
    }
  };

  // Handlers for navigation
  const handleNext = () => {
    if (currentQuestion < questionList.length) {
      const nextStep = currentQuestion + 1;
      handleStepPress(nextStep);
    } else {
      Alert.alert('✅ पूर्ण', 'आपले सर्व प्रश्न पूर्ण झाले आहेत');
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      const prevStep = currentQuestion - 1;
      handleStepPress(prevStep);
    }
  };

  const [docData, setDocData] = useState<
    { title: string; note: string; docID: number }[]
  >([]);

  const [textboxData, setTextboxData] = useState<any[]>([]);
  const [textboxValues, setTextboxValues] = useState<string[]>([]);

  const [checkboxData, setCheckboxData] = useState<any[]>([]);
  const [docDataMap, setDocDataMap] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (Array.isArray(textboxData) && textboxData.length > 0) {
      setTextboxValues(textboxData.map(tb => tb.textBoxValue || ''));
    }
  }, [textboxData]);

  const handleSelectOption = async (questionId: number, opt: any) => {
    // ONLY update question's selected option
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, selectedOption: opt } : q)),
    );

  //  console.log('✔ Saved selected option:', opt);

    // ------------------ DOCUMENT API ------------------
    try {
      const body = {
        QuesionID: questionId,
        UserID: userID,
        selectedRadioBtn: opt.optionNo,
      };

      const res = await axios.post(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetMasterDocumentList',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("new response",res)

      if (res.data?.items?.length > 0) {
        const mappedDocs = res.data.items.map((item: any) => ({
          title: item.docDocumentName,
          note: item.docNameToolTp,
          docID: item.docID,
        }));
        console.log('📄 Document Data:', mappedDocs);

        setDocData(mappedDocs);
      } else {
        setDocData([]);
      }
    } catch (error) {
      console.log('Doc API error:', error);
    }

    // ------------------ TEXTBOX API ------------------
    try {
      const tbRes = await axios.post(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetTextBoxValues',
        { QuesionID: questionId, UserID: userID },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTextboxData(tbRes.data?.items ?? []);
      setTextboxValues(tbRes.data?.items?.map(() => '') ?? []); // initialize empty values
    } catch (err) {
      console.log('Textbox API error:', err);
    }

    // ------------------ CHECKBOX API ------------------
    if (opt.subMenuFlag !== 6) {
      try {
        const cbRes = await axios.post(
          'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetCheckBoxValues',
          { QuesionID: questionId, UserID: userID },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        //console.log('📄 Checkbox Data:', cbRes.data?.items);
        setCheckboxData(cbRes.data?.items ?? []);
      } catch (err) {
        console.log('Checkbox API error:', err);
      }
    }

    const isAutoSelectAll = opt.optionNo === 1 && opt.subMenuFlag === 6;

    if (opt.subMenuFlag === 6) {
      try {
        const cbDocRes = await axios.post(
          'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetMasterCheckBoxandDocumentList',
          {
            QuesionID: questionId,
            Userid: userID,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const items = cbDocRes.data?.items ?? [];

        console.log

        const mappedCheckboxes = items.map((i: any) => ({
          id: i.checkBoxID,
          label: i.checkBoxName,
          checked: isAutoSelectAll ? true : i.checkBoxValue === '1',
          disabled: isAutoSelectAll,
          documentID: i.documentID,
          ansDocID: i.ansDocID,
          note: i.docNameToolTp,
        }));

        console.log('🟢 FINAL CHECKBOX DATA:', mappedCheckboxes);
        setCheckboxData(mappedCheckboxes);

        if (isAutoSelectAll) {
          const allIds = items.map((i: any) => i.checkBoxID);
          setSelectedCheckboxIds(allIds); // 🔥 THIS DRIVES UI
        }

        setDocData(
          items.map((i: any) => ({
            docID: i.documentID,
            title: i.documentName,
            note: i.docNameToolTp,
          })),
        );
      } catch (err) {
        console.log('❌ FLAG 6 API ERROR:', err);
      }
    }
  };

  useEffect(() => {
    questions.forEach(q => {
      const selectedNames = q.options
        ?.filter((opt: { id: any }) => q.selectedCheckboxIds?.includes(opt.id))
        ?.map((opt: { name: any }) => opt.name);
    });
  }, [questions]);

  const handleCheckboxChange = (
    questionId: number,
    selectedIds: number[],
    checkboxData: any[],
  ) => {
    const selectedValues = checkboxData.filter(c => selectedIds.includes(c.id));

    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              selectedCheckboxIds: selectedIds,
              checkboxValues: selectedValues,
            }
          : q,
      ),
    );
  };

  const isValidWebsite = (value: string | undefined): boolean => {
    if (!value) return false; // handle undefined or empty
    const regex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return regex.test(value.trim());
  };
  const isValidNumber = (value: string): boolean => {
    return !isNaN(Number(value.trim())) && value.trim() !== '';
  };

  //------------Submit API textbox------------

  const handleSubmittextbox = async (question: any, index: number = 0) => {
    try {
      if (!question?.selectedOption) {
        Alert.alert('⚠️ Warning', 'Please select an option first.');
        return;
      }

      // 🔑 FIX: pick textbox by index (supports single + multiple)
      const tb = Array.isArray(textboxData) ? textboxData[index] : textboxData;

      if (!tb?.textBoxValue) {
        Alert.alert('Warning', 'कृपया टेक्स्ट बॉक्स भरा.');
        return;
      }
      // // ---------------- VALIDATION ----------------
      if (tb?.validationName?.toUpperCase() === 'WEBSITE') {
        if (!isValidWebsite(tb.textBoxValue)) {
          Alert.alert('⚠️ Warning', 'कृपया वैध वेबसाइट URL प्रविष्ट करा.');
          return;
        }
      } else if (tb?.validationName?.toUpperCase() === 'NUMBER') {
        if (!isValidNumber(tb.textBoxValue)) {
          Alert.alert('⚠️ Warning', 'कृपया वैध संख्या प्रविष्ट करा.');
          return;
        }
      }
      const payload = {
        RoleID: '1',
        UserID: userID,
        QuestionID: tb.quesionID,
        OptionNo: question.selectedOption.optionNo,
        SubMenuFlag: question.selectedOption.subMenuFlag,
        TextboxValue: tb.textBoxValue,
        TextboxID: tb.textBoxID,
      };

      console.log('➡️ FINAL PAYLOAD:', payload);

      const res = await axios.post(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersTextboxValue',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('✅ Submit Response:', res.data);
      Alert.alert('✅ सबमिट झाले', 'आपले उत्तर यशस्वीपणे सबमिट झाले.');
      handleNext();

      if (res.data?.responseCode === 1001) {
        setSubmittedSteps(prev =>
          prev.includes(currentQuestion) ? prev : [...prev, currentQuestion],
        );
      } else {
        Alert.alert(
          '❌ सबमिशन अयशस्वी',
          res.data?.responseMessage || 'Submission failed',
        );
      }
    } catch (err) {
      console.log('❌ Submit Error:', err);
      Alert.alert(
        '❌ सबमिशन अयशस्वी',
        'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
      );
    }
  };

  const handleTextboxChange = (val: string, index: number) => {
    setTextboxValues(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });

    setTextboxData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], textBoxValue: val };
      return copy;
    });
  };

  //---------submit api document--------

  const submitDocument = async (question: any, index: number = 0) => {
    try {
      // 🔹 FIX: support multiple files, fallback for old single-file logic
      const filePayload =
        question.filePayloads?.[index] || question.filePayload;

      if (!filePayload) {
        Alert.alert('Warning', 'कृपया फाईल निवडा.');
        return;
      }
      console.log('FILE PAYLOAD', JSON.stringify(filePayload, null, 2));

      const payload = {
        RoleID: '1',
        UserID: userID,
        QuestionID: question.id,
        OptionNo: question.selectedOption.optionNo,
        SubMenuFlag: question.selectedOption.subMenuFlag,

        FileName: filePayload.FileName,
        FileSize: String(filePayload.FileSize),
        //Filetype: filePayload.FileType,
        FileContent: filePayload.FileContent,
        IPAddress: '1:00',
        //filePath: filePayload.filePath || '',
        Filetype: "PDF", // or file.type if API accepts MIME type
        DocMasterID: "45",
        DocMasterName: "सदस्य यादीसह SHG रेकॉर्ड",
        filePath: `/PrePrashnavali/${userID}/${question.id}_${question.selectedOption.subMenuFlag}_${45}`, // Constructed path
      };

      console.log(
        '📤 FINAL DOCUMENT PAYLOAD:',
        JSON.stringify(payload, null, 2),
      );
      console.log('TOKEN:', token);

      const res = await axios.post(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersDocValue',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubmittedSteps(prev =>
        prev.includes(currentQuestion) ? prev : [...prev, currentQuestion],
      );

      setSavedAnswers(prev => ({
        ...prev,
        [question.id]: {
          option: question.selectedOption,
          checkbox: question.checkboxValues,
          textbox: question.textboxValue,
          file: question.fileBase64,
        },
      }));

      console.log('📥 DOCUMENT RESPONSE:', res.data);
      Alert.alert('✅ सबमिट झाले', 'आपले उत्तर यशस्वीपणे सबमिट झाले.');
      handleNext();
      return res.data;
    } catch (error: any) {
      console.log('❌ DOCUMENT ERROR:', error);

      if (error.response) {
        console.log('❌ SERVER:', error.response.data);
      }
    }
  };

  //---------submit api for checkbox-----

  const handleSubmitCheckbox = async (question: any) => {
    try {
      const selected = question.selectedOption || {};
      const checkboxValues = question.checkboxValues || [];

      if (checkboxValues.length === 0) {
        Alert.alert('Warning', 'Please select at least one checkbox value');
        return;
      }

      // ✅ Submit each checkbox separately
      for (const cb of checkboxValues) {
        const payload = {
          model: {
            RoleID: '1',
            UserID: userID,
            QuestionID: question.id,
            OptionNo: selected.optionNo ?? 0,
            SubMenuFlag: selected.subMenuFlag ?? 0,
            CheckBoxValue: Number(cb.value), // ✅ INT
            CheckBoxID: Number(cb.id), // ✅ INT
          },
        };

        console.log('📤 CHECKBOX PAYLOAD', payload);

        await axios.post(
          'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersCheckboxValue',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      // ✅ Update submitted state (yellow step)
      setSavedAnswers(prev => ({
        ...prev,
        [String(question.id)]: true,
      }));

      Alert.alert('✅ सबमिट झाले', 'Checkbox answer submitted successfully');
      handleNext();
    } catch (err: any) {
      Alert.alert('❌ Error', 'Checkbox submission failed');
    }
  };

  //--------submit api for flag 0-----------

  const submitOptionOnly = async (question: any) => {
    try {
      if (!question.selectedOption) {
        Alert.alert('⚠️ Warning', 'Please select an option.');
        return;
      }

      const payload = {
        RoleID: '1',
        UserID: userID,
        QuestionID: question.id,
        OptionNo: question.selectedOption.optionNo,
        SubMenuFlag: question.selectedOption.subMenuFlag, // IMPORTANT
      };

      console.log('📤 OPTION ONLY PAYLOAD:', JSON.stringify(payload, null, 2));

      const res = await axios.post(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionsAnswer',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('📥 OPTION ONLY RESPONSE:', res.data);

      if (res.data?.responseCode === 1001) {
        Alert.alert('✅ Saved', 'Option submitted successfully.');

        setSubmittedSteps(prev =>
          prev.includes(currentQuestion) ? prev : [...prev, currentQuestion],
        );
      } else {
        Alert.alert(
          '❌ Failed',
          res.data?.responseMessage || 'Unable to submit option.',
        );
      }

      // ✅ FIX: Update optAnsNo to store selected option as "preselected"
      const optionToSave = {
        ...question.selectedOption,
        optAnsNo: question.selectedOption.optionNo, // key fix
      };

      setSavedAnswers(prev => ({
        ...prev,
        [question.id]: {
          option: optionToSave,
          checkbox: question.checkboxValues,
          textbox: question.textboxValue,
          file: question.fileBase64,
        },
      }));
    } catch (err) {
      Alert.alert('❌ Error', 'Something went wrong.');
    }
  };

  const handleQuestionSubmit = async (question: any) => {
    try {
      console.log('📌 Submitted Question Object:', question);

      const selected = question?.selectedOption;

      if (!selected) {
        Alert.alert('Warning', 'कृपया एक पर्याय निवडा.');
        return;
      }

      // Extract flag values
      const flag = Number(selected.subMenuFlag);
      const hasSub = Number(selected.isSubOption);

      // Determine whether to skip checkbox validation
      const skipCheckboxValidation =
        selected.optionNo === 1 && selected.subMenuFlag === 6;

      // CASE 0 → NO SUB UI (only main option)
      if (hasSub === 0 && flag === 0) {
        await submitOptionOnly(question);
      }

      // CASE 1 → CHECKBOX ONLY
      else if (flag === 1) {
        if (!skipCheckboxValidation && !question.checkboxValues?.length) {
          Alert.alert('Warning', 'कृपया checkbox निवडा.');
          return;
        }
        await handleSubmitCheckbox(question);
      }

      // CASE 2 → FILE ONLY
      else if (flag === 2) {
        if (!question.filePayloads?.[0]) {
          Alert.alert('Warning', 'कृपया फाईल निवडा.');
          return;
        }
        await submitDocument(question, 0);
      }

      // CASE 3 → TEXTBOX ONLY
      else if (flag === 3) {
        if (
          !textboxData?.[0]?.textBoxValue ||
          textboxData[0].textBoxValue.trim() === ''
        ) {
          Alert.alert('Warning', 'कृपया टेक्स्ट बॉक्स भरा.');
          return;
        }
        await handleSubmittextbox(question, 0);
      }

      // CASE 4 → TEXTBOX + FILE
      else if (flag === 4) {
        if (!question.filePayloads?.[0]) {
          Alert.alert('Warning', 'कृपया फाईल निवडा.');
          return;
        }
        await handleSubmittextbox(question, 0);
        await submitDocument(question, 0);
      }

      // CASE 5 → TEXTBOX + TWO FILES
      else if (flag === 5) {
        if (!question.filePayloads?.[0] || !question.filePayloads?.[1]) {
          Alert.alert('Warning', 'कृपया दोन्ही फाईल निवडा.');
          return;
        }
        await handleSubmittextbox(question, 0);
        await submitDocument(question, 0);
        await submitDocument(question, 1);
      }

      // CASE 6 → CHECKBOX + FILE
      else if (flag === 6) {
        if (!skipCheckboxValidation && !question.checkboxValues?.length) {
          Alert.alert('Warning', 'कृपया checkbox निवडा.');
          return;
        }

        if (!question.filePayloads?.[0]) {
          Alert.alert('Warning', 'कृपया फाईल निवडा.');
          return;
        }

        if (question.checkboxValues?.length || skipCheckboxValidation) {
          await handleSubmitCheckbox(question);
        }

        await submitDocument(question, 0);
      }

      // CASE 7 → TEXTBOX + TEXTBOX + FILE
      else if (flag === 7) {
        if (!question.filePayloads?.[0]) {
          Alert.alert('Warning', 'कृपया फाईल निवडा.');
          return;
        }

        await handleSubmittextbox(question, 0); // textbox 1
        await handleSubmittextbox(question, 1); // textbox 2
        await submitDocument(question, 0);
      }

      // UNKNOWN FLAG
      else {
        Alert.alert('Error', 'Unknown submission type.');
        return;
      }

      // ✅ Update savedAnswers after successful submission
      setSavedAnswers(prev => ({
        ...prev,
        [question.id]: {
          //option: question.selectedOption,
          option: {
            ...question.selectedOption,
            optAnsNo: question.selectedOption.optionNo, // fix
          },
          checkbox: question.checkboxValues,
          textbox: question.textboxValue,
          file: question.fileBase64,
        },
      }));

      console.log('✅ Submission successful for question:', question.id);
      handleNext();
    } catch (err) {
      console.log('❌ Submission Error:', err);
      Alert.alert('Error', 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const handleFilePick = async (
    questionId: number,
    payload: { index: number; file: any },
  ) => {
    const { index, file } = payload;
    const base64Data = await RNFS.readFile(file.uri, 'base64');
    const filePayload = {
      FileName: file.name,
      FileSize: file.size,
      FileType: file.type,
      FileContent: base64Data,
      filePath: file.uri,
    };

    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;

        const existing = q.filePayloads || [];

        const updated = [...existing];
        updated[index] = filePayload;

        return {
          ...q,
          filePayloads: updated, // 🔑 IMPORTANT
        };
      }),
    );
  };

  const handleSubmitFile = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);

    if (!question?.filePayload) {
      Alert.alert('⚠️ Warning', 'कृपया फाईल निवडा.');
      return;
    }

    console.log('📄 SUBMITTING FILE PAYLOAD:', question.filePayload);

    submitDocument(question);
  };

  return (
    <View style={styles.container}>

      {/* <CustomHeader title="पूर्व प्रश्नावली" /> */}
      {/* 🧭 Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          ग्रामपंचायतीची पूर्व प्रश्नावली (सध्याची स्थिती)
        </Text>
      </View>

      {/* 🔵 Scrollable Progress Steps */}
      <ProgressSteps
        totalQuestions={questionList.length}
        currentQuestion={currentQuestion}
        onStepPress={handleStepPress}
        submittedSteps={submittedSteps}
      />

      {/* 🧾 Dynamic toolTipName */}
      <Text style={styles.headerText1}>
        {toolTipName || 'ग्रामपंचायतीची पूर्व प्रश्नावली (सध्याची स्थिती)'}
      </Text>

      {/* 🧾 Question Section */}
      <FlatList
        data={questions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <QuestionCard
            data={item} // MUST contain updated answer
            docData={docData}
            textboxData={textboxData}
            textboxValues={textboxValues}
            checkboxData={checkboxData}
            selectedCheckboxIds={selectedCheckboxIds}
            onTextboxChange={handleTextboxChange}
            onCheckboxChange={handleCheckboxChange}
            onSelectOption={handleSelectOption}
            onFilePick={handleFilePick}
            savedAnswer={savedAnswers[item.id]}
            onQuestionSubmit={handleQuestionSubmit}
          />
        )}
      />

      {/* 🔘 Navigation Buttons */}
      <View style={styles.btnRow}>
        {currentQuestion > 1 && (
          <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
            <Text style={styles.btnText}>मागील</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.prevBtn}
          onPress={() => {
            const question = questions[0]; // or the currently selected question
            handleQuestionSubmit(question);
          }}>
          <Text style={styles.btnText}>सबमिट</Text>
        </TouchableOpacity>

        {currentQuestion < questionList.length && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.btnText}>पुढे</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B4FA3',
  },
  headerText1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  nextBtn: {
    backgroundColor: '#0B4FA3',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  prevBtn: {
    backgroundColor: '#0B4FA3',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
