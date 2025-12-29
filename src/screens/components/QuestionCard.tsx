// src/components/QuestionCard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { pick, types } from "@react-native-documents/picker";

interface Props {
  data: any;
  docData: {
    title: string;
    note: string;
  } | null;
  textboxData?: any;
  checkboxData?: any[];
  onTextboxChange?: (val: string) => void;
  onSelectOption: (id: number, answer: any) => void;
  onFilePick: (questionId: number, file: any) => void;
  onCheckboxChange?: (
    questionId: number,
    selectedIds: number[],
    checkboxData: any
  ) => void;
  onQuestionSubmit: (question: any) => void;
  savedAnswer?: {
    option?: any;
    checkbox?: number[];
    textbox?: string;
    file?: any;
  };
}

const QuestionCard: React.FC<Props> = ({
  data,
  docData,
  textboxData,
  checkboxData = [],
  onTextboxChange,
  onCheckboxChange,
  onSelectOption,
  onFilePick,
  onQuestionSubmit,
  savedAnswer,
}) => {
  // ---------------- LOCAL STATE ----------------
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [textboxValue, setTextboxValue] = useState<string>("");
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // ---------------- RESTORE SAVED ANSWER ----------------


  
  useEffect(() => {
    if (!savedAnswer) return;

    if (savedAnswer.option) {
      setSelectedOption(savedAnswer.option);
    }

    if (savedAnswer.checkbox) {
      setSelectedCheckboxIds(savedAnswer.checkbox);
    }

    if (savedAnswer.textbox !== undefined) {
      setTextboxValue(savedAnswer.textbox);
    }

    if (savedAnswer.file) {
      setSelectedFile(savedAnswer.file);
    }
  }, [savedAnswer]);

  // ---------------- CHECKBOX HANDLER ----------------
  const toggleCheckbox = (itemId: number) => {
    setSelectedCheckboxIds(prev => {
      const updated = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];

      onCheckboxChange?.(data.id, updated, checkboxData);
      return updated;
    });
  };

  // ---------------- FILE PICKER ----------------
  const pickDocument = async () => {
    try {
      const [file] = await pick({ type: [types.allFiles] });
      if (file) {
        setSelectedFile(file);
        onFilePick(data.id, file);
      }
    } catch (err: any) {
      if (err?.message?.includes("cancelled")) return;
    }
  };

  // ---------------- FILE UI ----------------
  const renderFileUpload = () => (
    <View>
      {docData?.title && <Text style={styles.uploadTitle}>{docData.title}</Text>}
      {docData?.note && <Text style={styles.noteText}>{docData.note}</Text>}

      <TouchableOpacity style={styles.fileContainer} onPress={pickDocument}>
        <Text style={styles.chooseFileBtn}>Choose File</Text>
        <Text style={styles.noFileText}>
          {selectedFile?.name || "No File Chosen"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ---------------- TEXTBOX UI ----------------
  const renderTextbox = () => (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.uploadTitle}>
        {textboxData?.textBoxName || "Enter value"}
      </Text>

      <TextInput
        style={styles.input}
        value={textboxValue}
        onChangeText={(val) => {
          setTextboxValue(val);
          onTextboxChange?.(val);
        }}
        placeholder={textboxData?.validationName || "Enter value"}
        keyboardType={
          textboxData?.validationName === "Number" ? "numeric" : "default"
        }
      />
    </View>
  );

  // ---------------- CHECKBOX UI ----------------
  const renderCheckboxList = () => (
    <View style={{ marginTop: 10 }}>
      {checkboxData.map(item => {
        const checked = selectedCheckboxIds.includes(item.id);
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleCheckbox(item.id)}
            style={styles.checkboxRow}
          >
            <Ionicons
              name={checked ? "checkbox" : "square-outline"}
              size={20}
              color="#0B4FA3"
            />
            <Text style={styles.cbText}>{item.module}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ---------------- SUB UI ----------------
  const renderSubUI = (sub: number, flag: number) => {
    if (sub === 0 && flag === 0) return null;

    return (
      <View style={{ marginLeft: 30 }}>
        {flag === 1 && renderCheckboxList()}
        {flag === 2 && renderFileUpload()}
        {flag === 3 && renderTextbox()}
        {flag === 4 && (
          <>
            {renderTextbox()}
            {renderFileUpload()}
          </>
        )}
        {flag === 6 && (
          <>
            {renderCheckboxList()}
            {renderFileUpload()}
          </>
        )}
      </View>
    );
  };

  // ---------------- RENDER ----------------
  return (
    <View style={styles.card}>
      <Text style={styles.question}>
        {/* {data.id}. {data.question} */}
        {data.question}
        
      </Text>

      {data.options.map((opt: any, index: number) => {
        const isSelected = selectedOption?.optionNo === opt.optionNo;

        return (
          <View key={index}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                setSelectedOption(opt);
                onSelectOption(data.id, opt);
              }}
            >
              <Ionicons
                name={isSelected ? "radio-button-on" : "radio-button-off"}
                size={20}
                color="#0B4FA3"
              />
              <Text style={styles.optionText}>{opt.optionName}</Text>
            </TouchableOpacity>

            {isSelected &&
              renderSubUI(opt.isSubOption, opt.subMenuFlag)}
          </View>
        );
      })}
    </View>
  );
};

export default QuestionCard;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cbText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 5,
    color: "#000",
  },

  /* FILE UPLOAD UI */
  uploadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadLabel: {
    color: "#000",
    fontSize: 14,
  },
  fileRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    color: "#777",
    marginRight: 6,
  },
  uploadTitle: {
  fontSize: 15,
  fontWeight: "bold",
  color: "#000",
  marginTop: 10,
},

noteText: {
  fontSize: 13,
  color: "red",
  marginVertical: 8,
  lineHeight: 18,
},

fileContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: 30,
  borderWidth: 1,
  borderColor: "#C7C7C7",
  paddingHorizontal: 15,
  paddingVertical: 12,
  marginTop: 5,
},

chooseFileBtn: {
  backgroundColor: "#E8E8E8",
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
  fontWeight: "bold",
  color: "#000",
},

noFileText: {
  color: "#000",
  fontSize: 14,
},

});


