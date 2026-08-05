/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/screens/components/ProgressSteps.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

interface Props {
  totalQuestions: number;
  currentQuestion: number;
  submittedSteps: number[]; // ✅ submitted step numbers
  onStepPress?: (index: number) => void;
}

interface QuestionItem {
  srNo: number;
  questionID: number;
  toolTipName: string;
}

const ProgressSteps: React.FC<Props> = ({
  currentQuestion,
  onStepPress,
  submittedSteps,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [userID, setUserID] = useState<string | null>(null);
  // const [token, setToken] = useState<string | null>(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]);

  const { userID, token } = useAuth();
  // ✅ Fetch questions
  const fetchQuestions = async (id: string, bearerToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetPreQuestionMaster',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ Userid: id }),
        },
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data?.responseCode === 2000 && Array.isArray(data.items)) {
        setQuestions(data.items);
      } else {
        Alert.alert('Error', data?.responseMessage || 'Unexpected response');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnsweredStatus = async (
    questionId: number,
    userId: string,
    bearerToken: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetPreQuestionByQuestionID',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            QuesionID: String(questionId),
            Userid: userId,
          }),
        },
      );

      const data = await response.json();

      if (data?.responseCode === 2000 && Array.isArray(data.items)) {
        return data.items.some((item: any) => Number(item.optAnsNo) > 0);
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const checkAnsweredQuestions = async () => {
      if (!userID || !token || questions.length === 0) return;

      const answered: number[] = [];

      for (const q of questions) {
        const hasAnswer = await fetchAnsweredStatus(
          q.questionID,
          userID,
          token,
        );

        if (hasAnswer) {
          answered.push(q.questionID);
        }
      }

      setAnsweredQuestionIds(answered);
    };

    checkAnsweredQuestions();
  }, [questions, userID, token]);

  useEffect(() => {
    if (userID && token) {
      fetchQuestions(userID, token);
    }
  }, [userID, token]);

  // ✅ Auto-scroll active question
  useEffect(() => {
    const xOffset = (currentQuestion - 1) * 45;
    scrollRef.current?.scrollTo({ x: xOffset - 100, animated: true });
  }, [currentQuestion]);

  if (loading) {
    return <ActivityIndicator size="small" color="#0B4FA3" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {questions.map((item, index) => {
          const stepNumber = index + 1; // ✅ defined here
          const isSubmitted = submittedSteps.includes(stepNumber);
          const isAnswered = answeredQuestionIds.includes(item.questionID);

          return (
            <TouchableOpacity
              key={item.questionID}
              style={[
                styles.circle,
                isAnswered
                  ? styles.submittedCircle // 🟢 GREEN
                  : isSubmitted
                  ? styles.submittedCircle // 🟡 YELLOW
                  : stepNumber === currentQuestion
                  ? styles.activeCircle // 🔵 BLUE
                  : styles.inactiveCircle,
              ]}
              onPress={() => onStepPress?.(stepNumber)}
            >
              <Text
                style={[
                  styles.circleText,
                  stepNumber === currentQuestion
                    ? { color: '#FFF' } // ⚪ selected → white
                    : isSubmitted
                    ? { color: '#000' } // ⚫ submitted/answered → black
                    : styles.inactiveText, // ⚪ inactive
                ]}
              >
                {item.srNo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProgressSteps;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
  },
  activeCircle: {
    backgroundColor: '#0B4FA3',
    borderColor: '#0B4FA3',
  },
  submittedCircle: {
    backgroundColor: '#1b8f4d', // ✅ green
    borderColor: '#1b8f4d',
  },
  inactiveCircle: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  circleText: {
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#000',
  },
});

// // src/screens/components/ProgressSteps.tsx
// import React, { useRef, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface Props {
//   totalQuestions?: number;
//   currentQuestion: number;
//   onStepPress?: (index: number) => void;
//   /** map/object where key = questionID (or srNo) and value = saved answer object */
//   submittedAnswers?: Record<string, any>;
// }

// interface QuestionItem {
//   srNo: number;
//   questionID: number;
//   toolTipName: string;
// }

// const ProgressSteps: React.FC<Props> = ({ currentQuestion, onStepPress, submittedAnswers = {} }) => {
//   const scrollRef = useRef<ScrollView>(null);
//   const [questions, setQuestions] = useState<QuestionItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [userID, setUserID] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   // Load credentials
//   const getStoredCredentials = async () => {
//     try {
//       const id = await AsyncStorage.getItem('userID');
//       const storedToken = await AsyncStorage.getItem('bearerToken');
//       if (id && storedToken) {
//         setUserID(id);
//         setToken(storedToken);
//       } else {
//         // no need to alert here each render; just continue
//         setUserID(null);
//         setToken(null);
//       }
//     } catch (e) {
//       console.error('Error reading AsyncStorage:', e);
//     }
//   };

//   // Fetch questions from API
//   const fetchQuestions = async (id: string, bearerToken: string) => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         'https://CMSPRajAbhiyanAPI.mahaitgov.in/api/PreExamQuestion/GetPreQuestionMaster',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${bearerToken}`,
//           },
//           body: JSON.stringify({ Userid: id }),
//         }
//       );

//       const text = await response.text();
//       if (!text || text.trim().length === 0) {
//         setQuestions([]);
//         setLoading(false);
//         return;
//       }

//       const data = JSON.parse(text);

//       if (data?.responseCode === 2000 && Array.isArray(data.items)) {
//         // Ensure items contain srNo and questionID
//         const items = data.items.map((it: any, idx: number) => ({
//           srNo: it.srNo ?? idx + 1,
//           questionID: it.questionID ?? it.questionId ?? it.questionId, // defensive
//           toolTipName: it.toolTipName ?? it.preRDQuestionName ?? '',
//         }));
//         setQuestions(items);
//       } else {
//         setQuestions([]);
//       }
//     } catch (error: any) {
//       console.error('ProgressSteps fetch error:', error);
//       setQuestions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getStoredCredentials();
//   }, []);

//   useEffect(() => {
//     if (userID && token) {
//       fetchQuestions(userID, token);
//     }
//   }, [userID, token]);

//   // Auto-scroll to current question
//   useEffect(() => {
//     const xOffset = (currentQuestion - 1) * 45;
//     scrollRef.current?.scrollTo({ x: Math.max(0, xOffset - 100), animated: true });
//   }, [currentQuestion, questions.length]);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="small" color="#0B4FA3" />
//       </View>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <View style={styles.noDataContainer}>
//         <Text style={{ color: '#666' }}>No questions found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContainer}
//       >
//         {questions.map((item, index) => {
//           const stepNumber = index + 1;
//           // Determine submission status using questionID as key
//           const isSubmitted = Boolean(submittedAnswers?.[String(item.questionID)]);

//           // Determine style priority:
//           // 1) active -> currentQuestion
//           // 2) submitted -> yellow
//           // 3) completed (previous but not submitted) -> green
//           // 4) inactive -> white
//           const circleStyle =
//             stepNumber === currentQuestion
//               ? styles.activeCircle
//               : isSubmitted
//               ? styles.submittedCircle
//               : stepNumber < currentQuestion
//               ? styles.completedCircle
//               : styles.inactiveCircle;

//           const textStyle =
//             stepNumber === currentQuestion
//               ? styles.activeText
//               : isSubmitted
//               ? styles.submittedText
//               : stepNumber < currentQuestion
//               ? styles.completedText
//               : styles.inactiveText;

//           return (
//             <TouchableOpacity
//               key={String(item.questionID)}
//               style={[styles.circle, circleStyle]}
//               onPress={() => onStepPress && onStepPress(stepNumber)}
//             >
//               <Text style={[styles.circleText, textStyle]}>{item.srNo}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// };

// export default ProgressSteps;

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   scrollContainer: {
//     paddingHorizontal: 10,
//     alignItems: 'center',
//   },
//   loaderContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   noDataContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circle: {
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//     borderWidth: 2,
//   },
//   // active (current)
//   activeCircle: {
//     backgroundColor: '#0B4FA3',
//     borderColor: '#0B4FA3',
//   },
//   activeText: {
//     color: '#fff',
//   },

//   // submitted (yellow)
//   submittedCircle: {
//     backgroundColor: '#FFD54F', // yellow
//     borderColor: '#FBC02D',
//   },
//   submittedText: {
//     color: '#000',
//   },

//   // completed but not submitted (green)
//   completedCircle: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   completedText: {
//     color: '#fff',
//   },

//   // not reached
//   inactiveCircle: {
//     backgroundColor: '#fff',
//     borderColor: '#ccc',
//   },
//   inactiveText: {
//     color: '#000',
//   },

//   circleText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });
