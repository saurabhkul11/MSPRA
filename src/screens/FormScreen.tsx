// src/screens/FormScreen.tsx
import React, { useState, useEffect } from 'react';
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
import RNFS from "react-native-fs";
import { useAuth } from "../context/AuthContext";

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
const [selectedSubMenuFlag, setSelectedSubMenuFlag] = useState("");
const [savedAnswers, setSavedAnswers] = useState<Record<number, any>>({});


//const submittedSteps = Object.keys(savedAnswers).map(Number);
const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);


const { userID, token } = useAuth();


interface SavedAnswer {
  option?: any;
  checkbox?: any[];
  textbox?: string;
  file?: any;
}

useEffect(() => {
  if (!userID || !token) return;
}, [userID, token]);



  // ✅ 2. Fetch all question steps (GetPreQuestionMaster)
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
        }
      );

      const text = await response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from GetPreQuestionMaster');
      }

      const data = JSON.parse(text);
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

  // ✅ 3. Fetch specific question by ID (GetPreQuestionByQuestionID)
  const fetchQuestionByID = async (questionID: string, userID: string, bearerToken: string) => {
    try {
      setLoading(true);
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
        }
      );

      const text = await response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from server');
      }

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
            subMenuFlag: opt.preRDSubMenuFlag
          })),
          answer: "",
        };


  setQuestions([formattedQuestion]);
  setToolTipName(firstItem.preRDQuestionName);
} else {
  Alert.alert('Error', data?.responseMessage || 'Unexpected response');
}
 setSavedAnswers(prev => ({
      ...prev,
      [questionID]: {
        option: selectedOptionNo,   // selected option number
        textbox: textboxData,       // textbox value
        checkbox: checkboxData,     // checkbox array
      },
    }));
    } catch (error: any) {
      console.error('Detail API Error:', error);
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
    const selected = questionList.find((q) => q.srNo === stepNumber);
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

const [docData, setDocData] = useState<{ title: string; note: string;docID: number; } | null>(null);
const [textboxData, setTextboxData] = useState<any>(null);
const [checkboxData, setCheckboxData] = useState<any[]>([]); 
const [docDataMap, setDocDataMap] = useState({});
const [selectedFile, setSelectedFile] = useState(null);


const handleSelectOption = async (questionId: number, opt: any) => {

  // ONLY update question's selected option
  setQuestions(prev =>
    prev.map(q =>
      q.id === questionId ? { ...q, selectedOption: opt } : q
    )
  );

  console.log("✔ Saved selected option:", opt);

  // ------------------ DOCUMENT API ------------------
  try {
    const body = {
      QuesionID: questionId,
      UserID: userID,
      selectedRadioBtn: opt.optionNo,
    };

    const res = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetMasterDocumentList",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data?.items?.length > 0) {
      setDocData({
        title: res.data.items[0].docDocumentName,
        note: res.data.items[0].docNameToolTp,
        docID: res.data.items[0].docID,
      });
    } else {
      setDocData(null);
    }
  } catch (error) {
    console.log("Doc API error:", error);
  }

  // ------------------ TEXTBOX API ------------------
  try {
    const tbRes = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetTextBoxValues",
      { QuesionID: questionId, UserID: userID },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTextboxData(tbRes.data?.items?.[0] ?? null);
  } catch (err) {
    console.log("Textbox API error:", err);
  }

  // ------------------ CHECKBOX API ------------------
  try {
    const cbRes = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetCheckBoxValues",
      { QuesionID: questionId, UserID: userID },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCheckboxData(cbRes.data?.items ?? []);
  } catch (err) {
    console.log("Checkbox API error:", err);
  }
};

useEffect(() => {
  questions.forEach(q => {
    const selectedNames = q.options
      ?.filter((opt: { id: any; }) => q.selectedCheckboxIds?.includes(opt.id))
      ?.map((opt: { name: any; }) => opt.name);

   
  });
}, [questions]);


const handleCheckboxChange = (
  questionId: number,
  selectedIds: number[],
  checkboxData: any[]
) => {
  const selectedValues = checkboxData.filter(c =>
    selectedIds.includes(c.id)
  );

  // 🔥 Correct logs — no "question" here
  console.log("📌 handleCheckboxChange → Question ID:", questionId);
  console.log("📌 Selected IDs:", selectedIds);
  console.log("📌 Selected Values:", selectedValues);

  setQuestions(prev =>
    prev.map(q =>
      q.id === questionId
        ? {
            ...q,
            selectedCheckboxIds: selectedIds,
            checkboxValues: selectedValues,
          }
        : q
    )
  );
};

//------------Submit API textbox------------
const handleSubmittextbox = async (question: any) => {
  try {
    // ✅ VALIDATION (IMPORTANT)
    if (!question?.selectedOption) {
      Alert.alert("⚠️ Warning", "Please select an option first.");
      return;
    }

    const payload = {
      RoleID: "1",
      UserID: userID,
      QuestionID: textboxData?.quesionID,

      // ✅ TAKE FROM QUESTION, NOT GLOBAL STATE
      OptionNo: question.selectedOption.optionNo,
      SubMenuFlag: question.selectedOption.subMenuFlag,

      TextboxValue: textboxData?.textBoxValue,
      TextboxID: textboxData?.textBoxID,
    };

    console.log("➡️ FINAL PAYLOAD:", payload);

    const res = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersTextboxValue",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Submit Response:", res.data);

    if (res.data?.responseCode === 1001) {
      Alert.alert("✅ सबमिट झाले", "आपले उत्तर यशस्वीपणे सबमिट झाले.");


       setSubmittedSteps(prev =>
    prev.includes(currentQuestion)
      ? prev
      : [...prev, currentQuestion]
  );

      // ✅ Mark question as submitted (for yellow step)
      // setSavedAnswers(prev => ({
      //   ...prev,
      //   [String(question.id)]: true,
      // }));

  setSavedAnswers(prev => ({
    ...prev,
    [question.id]: {
      option: question.selectedOption,
      checkbox: question.checkboxValues,
      textbox: question.textboxValue,
      file: question.fileBase64,
    },
  }));
      
    } else {
      Alert.alert(
        "❌ सबमिशन अयशस्वी",
        res.data?.responseMessage || "Submission failed"
      );
    }
  } catch (err) {
    console.log("❌ Submit Error:", err);
    Alert.alert("❌ सबमिशन अयशस्वी", "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.");
  }
};

const handleTextboxChange = (val: string) => {
  setTextboxData((prev: any) => ({
    ...prev,
    textBoxValue: val   // 👈 USER ENTERED VALUE STORED HERE
  }));
};

//---------submit api document--------

const submitDocument = async (question: any) => {
  try {
    const filePayload = question.filePayload;

    if (!filePayload) {
      console.log("❌ No file selected");
      return;
    }

    const payload = {
      RoleID: "1",
      UserID: userID,
      QuestionID: question.id,
      OptionNo: question.selectedOption.optionNo,
      SubMenuFlag: question.selectedOption.subMenuFlag,

      FileName: filePayload.FileName,
      FileSize: String(filePayload.FileSize),
      Filetype: filePayload.FileType, // EXACT key name as API
      FileContent: filePayload.FileContent,
      IPAddress: "1:00",

      filePath: filePayload.filePath || "",
    };

    console.log("📤 FINAL DOCUMENT PAYLOAD:", JSON.stringify(payload, null, 2));

    const res = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersDocValue",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

       setSubmittedSteps(prev =>
    prev.includes(currentQuestion)
      ? prev
      : [...prev, currentQuestion]
  );

  
setSavedAnswers(prev => ({
  ...prev,
  [question.id]: {
    option: question.selectedOption,
    checkbox: question.checkboxValues,
    textbox: question.textboxValue,
    file: question.fileBase64
  }
}));

    console.log("📥 DOCUMENT RESPONSE:", res.data);
     Alert.alert("✅ सबमिट झाले', 'आपले उत्तर यशस्वीपणे सबमिट झाले");
    return res.data;

  } catch (error: any) {
    console.log("❌ DOCUMENT ERROR:", error);

    if (error.response) {
      console.log("❌ SERVER:", error.response.data);
    }
  }
};


//---------submit api for checkbox-----

const handleSubmitCheckbox = async (question: any) => {
  try {
    const selected = question.selectedOption || {};
    const checkboxValues = question.checkboxValues || [];

    if (checkboxValues.length === 0) {
      Alert.alert("Warning", "Please select at least one checkbox value");
      return;
    }

    // ✅ Submit each checkbox separately
    for (const cb of checkboxValues) {
      const payload = {
        model: {
          RoleID: "1",
          UserID: userID,
          QuestionID: question.id,
          OptionNo: selected.optionNo ?? 0,
          SubMenuFlag: selected.subMenuFlag ?? 0,
          CheckBoxValue: Number(cb.value), // ✅ INT
          CheckBoxID: Number(cb.id),        // ✅ INT
        },
      };

      console.log("📤 CHECKBOX PAYLOAD", payload);

      await axios.post(
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionAnswersCheckboxValue",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // ✅ Update submitted state (yellow step)
    setSavedAnswers(prev => ({
      ...prev,
      [String(question.id)]: true,
    }));

    Alert.alert("✅ सबमिट झाले", "Checkbox answer submitted successfully");

  } catch (err: any) {
    console.log("❌ CHECKBOX ERROR:", err?.response?.data || err);
    Alert.alert("❌ Error", "Checkbox submission failed");
  }
};




//--------submit api for flag 0-----------

const submitOptionOnly = async (question: any) => {
  try {
    if (!question.selectedOption) {
      Alert.alert("⚠️ Warning", "Please select an option.");
      return;
    }

    const payload = {
      RoleID: "1",
      UserID: userID,
      QuestionID: question.id,
      OptionNo: question.selectedOption.optionNo,
      SubMenuFlag: question.selectedOption.subMenuFlag, // IMPORTANT
    };

    console.log("📤 OPTION ONLY PAYLOAD:", JSON.stringify(payload, null, 2));

    const res = await axios.post(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/InsertPreQuestionsAnswer",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📥 OPTION ONLY RESPONSE:", res.data);

    if (res.data?.responseCode === 1001) {
      Alert.alert("✅ Saved", "Option submitted successfully.");

         setSubmittedSteps(prev =>
    prev.includes(currentQuestion)
      ? prev
      : [...prev, currentQuestion]
  );
    } else {
      Alert.alert(
        "❌ Failed",
        res.data?.responseMessage || "Unable to submit option."
      );
    }
    setSavedAnswers(prev => ({
  ...prev,
  [question.id]: {
    option: question.selectedOption,
    checkbox: question.checkboxValues,
    textbox: question.textboxValue,
    file: question.fileBase64
  }
}));

  } catch (err) {
    console.log("❌ Option Submit Error:", err);
    Alert.alert("❌ Error", "Something went wrong.");
  }
};


//-----------All  API Submission-------

const handleQuestionSubmit = async (question: any) => {
  const selected = question?.selectedOption;

  if (!selected) {
    console.log("❌ Please select an option first");
    Alert.alert("Warning", "कृपया एक पर्याय निवडा.");
    return;
  }

  const flag = Number(selected.subMenuFlag);
  const hasSub = Number(selected.isSubOption);

  console.log("➡️ Submitting With Flag:", flag, " Sub Option:", hasSub);

  try {
    // CASE 0 → NO SUB UI (only main option)
    if (hasSub === 0 && flag === 0) {
      await submitOptionOnly(question);
    }

    // CASE 1 → CHECKBOX ONLY
    else if (flag === 1) {
      if (!question.checkboxValues?.length) {
        Alert.alert("Warning", "कृपया checkbox निवडा.");
        return;
      }
      await handleSubmitCheckbox(question);
    }

    // CASE 2 → FILE ONLY
    else if (flag === 2) {
      if (!question.filePayload) {
        Alert.alert("Warning", "कृपया फाईल निवडा.");
        return;
      }
      await submitDocument(question);
    }

    // CASE 3 → TEXTBOX ONLY
    else if (flag === 3) {
      if (!textboxData?.textBoxValue) {
        Alert.alert("Warning", "कृपया टेक्स्ट बॉक्स भरा.");
        return;
      }
      await handleSubmittextbox(question);
    }

    // CASE 4 → TEXTBOX + FILE
    else if (flag === 4) {
      await handleSubmittextbox(question);
      await submitDocument(question);
    }

    // CASE 5 → TEXTBOX + TWO FILES
    else if (flag === 5) {
      await handleSubmittextbox(question);
      await submitDocument(question); // file 1
      await submitDocument(question); // file 2
    }

    // CASE 6 → CHECKBOX + FILE
    else if (flag === 6) {
      // ✅ Validate checkbox
      if (!question.checkboxValues?.length) {
        Alert.alert("Warning", "कृपया checkbox निवडा.");
        return;
      }

      // ✅ Validate file
      if (!question.filePayload) {
        Alert.alert("Warning", "कृपया फाईल निवडा.");
        return;
      }

      // ✅ Submit in order
      await handleSubmitCheckbox(question);
      await submitDocument(question);
    }

    // CASE 7 → TEXTBOX + TEXTBOX + FILE
    else if (flag === 7) {
      await handleSubmittextbox(question); // textbox 1
      await handleSubmittextbox(question); // textbox 2
      await submitDocument(question);
    }

    // UNKNOWN FLAG
    else {
      console.log("⚠️ Unknown flag received:", flag);
      Alert.alert("Error", "Unknown submission type.");
      return;
    }

    // ✅ Update savedAnswers after successful submission
    setSavedAnswers(prev => ({
      ...prev,
      [question.id]: {
        option: question.selectedOption,
        checkbox: question.checkboxValues,
        textbox: question.textboxValue,
        file: question.fileBase64
      }
    }));

  } catch (err) {
    console.log("❌ Submission Error:", err);
    Alert.alert("Error", "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.");
  }
};


  // if (loading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#0B4FA3" />
  //     </View>
  //   );
  // }


const handleFilePick = async (questionId: number, file: any) => {
  
  const base64Data = await RNFS.readFile(file.uri, "base64");

  const filePayload = {
    FileName: file.name,
    FileSize: file.size,
    FileType: file.type,
    FileContent: base64Data,
    filePath: file.uri,
  };

  setQuestions(prev =>
    prev.map(q =>
      q.id === questionId ? { ...q, upload: file.name, filePayload } : q
    )
  );
 
};



const handleSubmitFile = (questionId: number) => {
  const question = questions.find(q => q.id === questionId);

  if (!question?.filePayload) {
    Alert.alert("⚠️ Warning", "कृपया फाईल निवडा.");
    return;
  }

  console.log("📄 SUBMITTING FILE PAYLOAD:", question.filePayload);

  submitDocument(question);
};


  return (
    <View style={styles.container}>
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
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (

      <QuestionCard
        data={item}  // MUST contain updated answer
        docData={docData}
        textboxData={textboxData} 
        checkboxData={checkboxData}
        onTextboxChange={handleTextboxChange}
        onCheckboxChange={handleCheckboxChange}
        onSelectOption={handleSelectOption}
        onFilePick={handleFilePick}
      //  onQuestionSubmit={submitDocument}
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
        
{/* <TouchableOpacity style={styles.prevBtn} onPress={handleSubmittemp}>
  <Text style={styles.btnText}>Submit</Text>
</TouchableOpacity> */}
<TouchableOpacity
  style={styles.prevBtn}
  onPress={() => {
    const question = questions[0]; // or the currently selected question
    handleQuestionSubmit(question);
  }}
>
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

