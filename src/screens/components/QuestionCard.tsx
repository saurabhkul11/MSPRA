/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';

interface Props {
  data: any;
  //questionNumber?: number;
  docData:
    | {
        title: string;
        note: string;
      }[]
    | null;
  textboxData?: any;
  checkboxData?: any[];
  onTextboxChange?: (val: string, index: number) => void;
  textboxValues?: string[];
  onSelectOption: (id: number, answer: any) => void;
  onFilePick: (questionId: number, file: any) => void;
  onCheckboxChange?: (
    questionId: number,
    selectedIds: number[],
    checkboxData: any,
  ) => void;
  onQuestionSubmit: (question: any) => void;
  savedAnswer?: {
    option?: any;
    checkbox?: number[];
    textbox?: string;
    file?: any;
  };
  selectedCheckboxIds?: number[];
}

const QuestionCard: React.FC<Props> = ({
  data,
  // questionNumber , // default to 1
  docData,
  textboxData,
  checkboxData = [],
  onTextboxChange,
  onCheckboxChange,
  onSelectOption,
  onFilePick,
  savedAnswer,
}) => {
  // ---------------- LOCAL STATE ----------------
  const [selectedOption, setSelectedOption] = useState<any>(null);
  // const [textboxValue, setTextboxValue] = useState<string>("");
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: any }>(
    {},
  );
  const [textboxValues, setTextboxValues] = useState<string[]>([]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');


  // ---------------- RESTORE SAVED ANSWER ----------------

  useEffect(() => {
    if (savedAnswer?.option) {
      setSelectedOption(savedAnswer.option);
    }
  }, [savedAnswer]);

  useEffect(() => {
    if (!checkboxData || checkboxData.length === 0) return;

   // console.log('🟢 [QuestionCard] checkboxData received:', checkboxData);

    const autoCheckedIds = checkboxData
      .filter(cb => cb.checked === true)
      .map(cb => cb.id);

    if (autoCheckedIds.length > 0) {
     // console.log('🟢 [QuestionCard] AUTO CHECK IDs:', autoCheckedIds);
      setSelectedCheckboxIds(autoCheckedIds);
    }
  }, [checkboxData]);

  useEffect(() => {
    if (!textboxData) return;

    const count = Array.isArray(textboxData) ? textboxData.length : 1;

    setTextboxValues(prev => {
      if (prev.length === count) return prev; // already initialized
      const initial = Array(count).fill('');
      // If API has pre-filled values, use them
      if (Array.isArray(textboxData)) {
        textboxData.forEach((tb, i) => {
          if (tb?.textBoxValue != null) initial[i] = tb.textBoxValue;
        });
      } else if (textboxData.textBoxValue != null) {
        initial[0] = textboxData.textBoxValue;
      }
      return initial;
    });
  }, [textboxData]);

  useEffect(() => {
    if (!savedAnswer) return;

    if (savedAnswer.option) {
      setSelectedOption(savedAnswer.option);
    }

    if (savedAnswer.checkbox) {
      setSelectedCheckboxIds(savedAnswer.checkbox);
    }

    if (savedAnswer.textbox !== undefined) {
      setTextboxValues(
        Array.isArray(savedAnswer.textbox)
          ? savedAnswer.textbox
          : [savedAnswer.textbox],
      );
    }

    if (savedAnswer.file) {
      setSelectedFiles(savedAnswer.file);
    }
  }, [savedAnswer]);

  const toggleCheckbox = (itemId: number) => {
    const item = checkboxData.find(cb => cb.id === itemId);

    if (item?.disabled) {
      //console.log('⛔ Checkbox disabled, ignoring click:', itemId);
      return;
    }

    setSelectedCheckboxIds(prev => {
      const updated = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];

      //console.log('🟡 Checkbox toggled:', updated);

      onCheckboxChange?.(data.id, updated, checkboxData);
      return updated;
    });
  };

  // ---------------- FILE PICKER ----------------
  // const pickDocument = async (index: number) => {
  //   try {
  //     const [file] = await pick({ type: [types.allFiles] });
  //     if (file) {
  //       setSelectedFiles(prev => ({
  //         ...prev,
  //         [index]: file,
  //       }));
  //       onFilePick(data.id, { index, file });
  //     }
  //   } catch (err: any) {
  //     if (err?.message?.includes('cancelled')) return;
  //   }
  // };

  const pickDocument = async (index: number) => {
    try {
      const [file] = await pick({ type: [types.allFiles] });

      if (!file) return;

      const isPdf =
        file.type === 'application/pdf' ||
        file.name?.toLowerCase().endsWith('.pdf');

        console.log('filename',file.name)

      if (!isPdf) {
        Alert.alert('Invalid File Type', 'Only PDF files are allowed.');
        return;
      }

      setSelectedFiles(prev => ({
        ...prev,
        [index]: file,
      }));

      onFilePick(data.id, { index, file });
    } catch (err: any) {
      if (err?.message?.includes('cancelled')) return;
      console.log(err);
    }
  };

  // ---------------- FILE UI ----------------
  const renderFileUpload = (doc: any, index: number) => ( 
    <View>
      {doc?.title && <Text style={styles.uploadTitle}>{doc.title}</Text>}
      {doc?.note && <Text style={styles.noteText}>{doc.note}</Text>}
      <View style={styles.fileContainer}>
        <TouchableOpacity
          style={styles.chooseFileBtn}
          onPress={() => pickDocument(index)}
        >
          <Text>Choose File</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.noFileText}>
            {selectedFiles[index]?.name ||  'No File Chosen'}
          </Text>

          {selectedFiles[index]?.uri?.startsWith('http://') || selectedFiles[index]?.uri?.startsWith('https://') && (
            <TouchableOpacity
              onPress={() => {
                setPreviewUrl(selectedFiles[index].uri);
                setPreviewFileName(selectedFiles[index].name);
                setPreviewVisible(true);
              }}
            >
              <Text
                style={{
                  color: 'blue',
                  marginTop: 4,
                  textDecorationLine: 'underline',
                }}
              >
                Preview File
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderFileUpload1 = (doc: any, index: number) => (
    
    <View>
      {doc?.title && <Text style={styles.uploadTitle}>{doc.title}</Text>}
      {doc?.note && <Text style={styles.noteText}>{doc.note}</Text>}

      <View style={styles.fileContainer}>
        <TouchableOpacity
          style={styles.chooseFileBtn}
          onPress={() => pickDocument(index)}>
          <Text>Choose File</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.noFileText}>
            {selectedFiles[index]?.name || 'No File Chosen'}
          </Text>

          {selectedFiles[index]?.uri?.startsWith('http://') || selectedFiles[index]?.uri?.startsWith('https://') && (
            <TouchableOpacity
              onPress={() => {
                setPreviewUrl(selectedFiles[index].uri);
                setPreviewFileName(selectedFiles[index].name);
                setPreviewVisible(true);
              }}
            >
              <Text
                style={{
                  color: 'blue',
                  marginTop: 4,
                  textDecorationLine: 'underline',
                }}
              >
                Preview File
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // ---------------- TEXTBOX UI ----------------

  const isValidWebsite = (value: any): boolean => {
    if (!value || typeof value !== 'string') return false; // safe fallback
    const regex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return regex.test(value.trim());
  };

  const renderTextbox = (index: number) => {
    const tb = Array.isArray(textboxData) ? textboxData[index] : textboxData;

    // safe current value
    const currentValue = textboxValues[index] ?? '';

    // determine live border for validation
    const borderStyle: any = {};
    if (tb?.validationName?.toUpperCase() === 'NUMBER' && currentValue) {
      if (!/^\d*$/.test(currentValue)) {
        borderStyle.borderColor = 'red';
        borderStyle.borderWidth = 1;
      }
    }
    if (tb?.validationName?.toUpperCase() === 'WEBSITE' && currentValue) {
      if (!isValidWebsite(currentValue)) {
        borderStyle.borderColor = 'red';
        borderStyle.borderWidth = 1;
      }
    }

    return (
      <View style={{ marginTop: 10 }}>
        <Text style={styles.uploadTitle}>
          {tb?.textBoxName || 'Enter value'}
        </Text>

        <TextInput
          style={[styles.input, borderStyle]}
          value={currentValue} // controlled safely
          maxLength={
            tb?.validationName?.toUpperCase() === 'NUMBER' ? 5 : undefined
          }
          onChangeText={val => {
            // live NUMBER validation: ignore invalid input
            if (tb?.validationName?.toUpperCase() === 'NUMBER') {
              if (val !== '' && !/^\d*$/.test(val)) return; // ignore non-numeric
            }

            // update local state
            const updated = [...textboxValues];
            updated[index] = val;
            setTextboxValues(updated);

            // notify parent
            onTextboxChange?.(val, index);
          }}
          placeholder={tb?.validationName || 'Enter value'}
          keyboardType={
            tb?.validationName?.toUpperCase() === 'NUMBER'
              ? 'numeric'
              : 'default'
          }
        />
      </View>
    );
  };

  const renderCheckboxList = () => (
    <View style={{ marginTop: 10 }}>
      {checkboxData.map(item => {
        const checked = selectedCheckboxIds.includes(item.id);
        const disabled = item.disabled === true;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleCheckbox(item.id)}
            style={[styles.checkboxRow, disabled && { opacity: 0.5 }]}
            disabled={disabled}
          >
            <Ionicons
              name={checked ? 'checkbox' : 'square-outline'}
              size={20}
              color={disabled ? '#999' : '#0B4FA3'}
            />
            <Text style={styles.cbText}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const docList = Array.isArray(docData) ? docData : docData ? [docData] : [];

  // ---------------- SUB UI ----------------
  const renderSubUI = (sub: number, flag: number) => {
    if (sub === 0 && flag === 0) return null;

    return (
      <View style={{ marginLeft: 30 }}>
        {flag === 1 && renderCheckboxList()}
        {flag === 2 && renderFileUpload(docList[0], 0)}

        {flag === 3 && renderTextbox(0)}

        {flag === 4 && (
          <>
            {renderTextbox(0)}
            {renderFileUpload1(docList[0], 0)}
          </>
        )}
        {flag === 5 && (
          <>
            {renderTextbox(0)}
            {docList.map((doc, index) => renderFileUpload(doc, index))}
          </>
        )}

        {flag === 6 && (
          <>
            {renderCheckboxList()}
            {renderFileUpload(docList[0], 0)}
          </>
        )}

        {flag === 7 && (
          <>
            {renderTextbox(0)}
            {renderTextbox(1)}
            {renderFileUpload(docData?.[0], 0)}
          </>
        )}
      </View>
    );
  };

    const isPdf = previewUrl?.toLowerCase().includes('.pdf');
    const isImage =
      /\.(jpg|jpeg|png)$/i.test(previewUrl) ||
      previewFileName?.match(/\.(jpg|jpeg|png)$/i);

  // ---------------- RENDER ----------------
  return (
    <View style={styles.card}>
      <Text style={styles.question}>
        {data.question}
      </Text>

      {data.options.map((opt: any, index: number) => {
        const isSelected =
          selectedOption === opt.optionNo ||
          selectedOption?.optionNo === opt.optionNo;

        return (
          <View key={index}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                setSelectedOption(opt.optionNo);
                onSelectOption(data.id, opt);
              }}
            >
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color="#0B4FA3"
              />
              <Text style={styles.optionText}>
                {index + 1}.{opt.optionName}
              </Text>
            </TouchableOpacity>
            {isSelected && renderSubUI(opt.isSubOption, opt.subMenuFlag)}
          </View>
        );
      })}

      <Modal
        visible={previewVisible}
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 15,
              backgroundColor: '#fff',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {previewFileName}
            </Text>

            <TouchableOpacity onPress={() => setPreviewVisible(false)}>
              <Text style={{ color: 'red' }}>Close</Text>
            </TouchableOpacity>
          </View>

          {isPdf ? (
            <Pdf
              source={{ uri: previewUrl }}
              style={{ flex: 1 }}
              trustAllCerts={false}
            />
          ) : isImage ? (
            <Image
              source={{ uri: previewUrl }}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Preview not available.</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default QuestionCard;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cbText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 5,
    color: '#000',
  },

  /* FILE UPLOAD UI */
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadLabel: {
    color: '#000',
    fontSize: 14,
  },
  fileRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    color: '#777',
    marginRight: 6,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },

  noteText: {
    fontSize: 13,
    color: 'red',
    marginVertical: 8,
    lineHeight: 18,
  },

  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#C7C7C7',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 5,
  },

  chooseFileBtn: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  noFileText: {
    color: '#000',
    fontSize: 14,
  },
});
