import { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import { buildPayload } from "../../utils/payloadBuilders";
import { useAuth } from "../../context/AuthContext";
export const useDynamicForm = (formNo: number) => {
  const { userID, username, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionDetails, setQuestionDetails] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);

  // 🔹 Fetch form questions
  useEffect(() => {
    fetch(
      `https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1QuestionByID?formNo=${formNo}`
    )
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setQuestionDetails(data.questionDetails || []);
      })
      .finally(() => setLoading(false));
  }, [formNo]);

  const handleNext = () => {
    if (activeStepIndex < questions.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userID || !username || !token) {
      Alert.alert("Error", "User info missing. Please re-login.");
      return;
    }

    const questionId = questions[activeStepIndex]?.questionid;
    if (!questionId) return;

    const payload = buildPayload({
      questionId,
      answers,
      questionDetails,
      userID,
      username,
    });

    if (!payload) return;

    const res = await fetch(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/InserUpdateFormElements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      Alert.alert("Error", "Submission failed");
      return;
    }

    Alert.alert("Success", "Form submitted successfully");

    setSubmittedSteps(prev =>
      prev.includes(activeStepIndex) ? prev : [...prev, activeStepIndex]
    );
  };

  return {
    loading,
    questions,
    questionDetails,
    answers,
    setAnswers,
    activeStepIndex,
    submittedSteps,
    handleNext,
    handlePrev,
    handleSubmit,
  };
};
