import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pick, types } from "@react-native-documents/picker";
import RNFS from "react-native-fs";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";


// Optional document picker (install if you want actual file picker)
let DocumentPicker: any = null;
try {
  // @ts-ignore
  DocumentPicker = require("react-native-document-picker");
} catch (e) {
  DocumentPicker = null;
}
export default function Form7() {
  // Steps / questions
  const [steps, setSteps] = useState<number[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // selected step & details
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [questionDetails, setQuestionDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  // credentials
  // const [userID, setUserID] = useState<string | null>(null);
  //  const [username, setUsername] = useState<string | null>(null);
  // const [token, setToken] = useState<string | null>(null);
  // options cache keyed by `${questionid}_${elementmstid}` or master id
  const [dropdownOptionsMap, setDropdownOptionsMap] = useState<Record<string, any[]>>({});
  const [checkboxOptionsMap, setCheckboxOptionsMap] = useState<Record<string, any[]>>({});
  const [textboxInfoMap, setTextboxInfoMap] = useState<Record<string, any>>({});
  const [uploadedDocsMap, setUploadedDocsMap] = useState<Record<string, any[]>>({});
  // answers keyed by rdformelementno
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const scrollRef = useRef<ScrollView | null>(null);
const [tableDataMap, setTableDataMap] = useState<Record<string, any[]>>({});
  //const [tableDataMap, setTableDataMap] = useState<Record<string, string[][]>>({});
const [tableMetaMap, setTableMetaMap] = useState<Record<string, any>>({});
const renderedTableSet = useRef<Set<string>>(new Set());

const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);

//const [tableDataMap, setTableDataMap] = useState<TableDataMap>({});

const navigation = useNavigation<any>();

const { userID, token, username } = useAuth();


console.log("👤 AUTH DATA:", { userID, username, token });

type TableRowValues = {
  [key: string]: string | number;
};

type TableDataMap = {
  [tableMstId: number]: TableRowValues;
};

type TableCell = {
  type: "textbox" | "dropdown" | "file" | "label";
  elementMstId: number;
  tableMstId?: number;
  validationType?: number;
};

  // safe JSON parse
  const safeJsonParse = (text: string) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };



 useEffect(() => {
    if (userID && token) {
      fetchSteps(userID, token);
    }
  }, [userID, token]);

  useEffect(() => {
  console.log("submittedSteps updated:", submittedSteps);
}, [submittedSteps]);


  // -------------------- Fetch steps (question master) --------------------
  const fetchSteps = async (userId: string, bearerToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1QuestionMaster",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            userid: userId,
            formid: "7",
          }),
        }
      );
      const raw = await res.text();
      const data = safeJsonParse(raw);
      if (data && data.responseCode === 2000 && data.items) {
        setQuestions(data.items);
        const ids = data.items.map((it: any) => it.questionid);
        setSteps(ids);
        if (ids.length > 0) {
          setActiveStepIndex(0);
          fetchQuestionById(ids[0], userId, bearerToken);
        }
      } else {
        console.warn("GetForm1QuestionMaster returned", raw);
      }
    } catch (err) {
      console.error("Error fetchSteps:", err);
    } finally {
      setLoading(false);
    }
  };


  //--------------GetForm1QuestionByID----------
const fetchQuestionById = async (
  questionId: number,
  userId: string,
  bearerToken: string
) => {
  setLoadingDetails(true);

  try {
    const res = await fetch(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1QuestionByID",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          quesionid: String(questionId),
          userid: userId,
          formid: "7",
        }),
      }
    );

    const raw = await res.text();
    const data = safeJsonParse(raw);

    if (data?.responseCode === 2000 && Array.isArray(data.items)) {
      // set full items
      setQuestionDetails(data.items);

      const updatedAnswers: any = { ...answers };

      // collect table rows (we'll group them after processing all items)
      const tableItems: any[] = [];

      // process each item (existing logic largely unchanged)
      for (const it of data.items) {
        const key = String(it.rdformelementno);

        const elementMstId = it.elementmstid ?? null;
        const tableMstId = it.tablemstid ?? null;
        const rdtableelementid = it.rdtableelementid;
        
        console.log("rdtableelementid:", rdtableelementid);

        // Initialize answers (unchanged)
        if (!updatedAnswers[key]) {
          let initialValue: any = null;

          if (it.rdformelementid === 3) initialValue = [];
          else if (it.rdformelementid === 4) initialValue = null;
        //  else initialValue = it.rdformtextboxsubmitval ?? "";
        else initialValue ="";
          updatedAnswers[key] = {
            value: initialValue,
            elementMstId,
            rdformelementid: it.rdformelementid, 
              QuestionId: questionId,

            tableMstId,
          };
        } else {
          const prev = updatedAnswers[key];
          updatedAnswers[key] =
            prev && typeof prev === "object"
              ? { ...prev, elementMstId, tableMstId }
              : { value: prev, elementMstId, tableMstId };
        }

        const masterId = String(elementMstId ?? "");
        const mapKey = `${questionId}_${masterId}`;

        // Element-specific logic (unchanged)
        switch (it.rdformelementid) {
          case 1: // Textbox
          
            if (!textboxInfoMap[mapKey]) {
              fetchTextBoxValues(
                questionId,
                masterId,
                userId,
                bearerToken,
                String(tableMstId ?? "0")
                
              );
            }
            break;

          case 2: // Dropdown
            fetchDropdownValues(
              questionId,
              masterId,
              userId,
              bearerToken,
              String(tableMstId ?? "0"),
              mapKey
            );
            break;

          case 3: // Checkbox
            if (!checkboxOptionsMap[mapKey]) {
              fetchCheckboxValues(
                questionId,
                masterId,
                userId,
                bearerToken,
                String(tableMstId ?? "0")
              );
            }
            break;

          case 4: // File Upload
            if (!uploadedDocsMap[mapKey]) {
              fetchUploadedDocs(
                questionId,
                masterId,
                userId,
                bearerToken,
                String(tableMstId ?? "0")
              );
            }
            break;

              case 5: {
      // Collect table rows (we will group by questionId + rdformelementno)
      tableItems.push(it);

      // If this table cell is a dropdown (rdtableelementid === 2),
      try {
        const elementMstIdStr = String(it.elementmstid ?? "");
        const tableMstIdStr = String(it.tablemstid ?? "0");
        const ddMapKey = `${questionId}_${elementMstIdStr}`;

        // only call fetch if options not already present
    if (it.rdtableelementid === 2 && !dropdownOptionsMap[ddMapKey]) {
      // call fetchDropdownValues (it will set dropdownOptionsMap[ddMapKey])
      fetchDropdownValues(
        questionId,
        elementMstIdStr,
        userId,
        bearerToken,
        tableMstIdStr,
        ddMapKey
      );
    }
  } catch (e) {
    console.warn("table dropdown fetch error", e);
  }

  break;
}
          default:
            console.warn("Unknown element type:", it.rdformelementid);
        }
      } 
      // ---- GROUP TABLES BY rdformelementno ----
const groupedTables: Record<string, any[]> = {};
tableItems.forEach((it) => {
  const groupKey = `${questionId}_${it.rdformelementno}`;
  if (!groupedTables[groupKey]) groupedTables[groupKey] = [];
  groupedTables[groupKey].push(it);
});

// Build table matrices per group
const newTableDataMap: Record<string, any[][]> = {};

Object.keys(groupedTables).forEach((groupKey) => {
  const items = groupedTables[groupKey];

  // Determine table size
  const totalRows = Math.max(...items.map((x: any) => x.rdtotaltablerowsNum ?? 1));
  const totalCols = Math.max(...items.map((x: any) => x.rdtotaltablecolumnsnum ?? 1));

  // Initialize empty table matrix
  const matrix: any[][] = Array.from({ length: totalRows }, () =>
    Array.from({ length: totalCols }, () => ({ value: "", type: "label" }))
  );

 // Fill matrix with API data, include rdtableelementid
items.forEach((x: any) => {
  const r = (x.rdtablerowsnum ?? 1) - 1;
  const c = (x.rdtablecolumnsnum ?? 1) - 1;
  if (r >= 0 && r < totalRows && c >= 0 && c < totalCols) {
 matrix[r][c] = {
  value: x.rdtablefieldname ?? "",
  type: x.rdtableelementid === 1 ? "textbox"
       : x.rdtableelementid === 2 ? "dropdown"
       : x.rdtableelementid === 4 ? "file"
       : "label",

  elementMstId: x.elementmstid ?? null,
  tableMstId: x.tablemstid ?? null,
  rdtableelementid: x.rdtableelementid ?? null,

  // ✅ ADD THIS
  validationType: x.validationtype ?? null,
};

  }
});

  newTableDataMap[groupKey] = matrix;
});

// Save grouped table data into state
setTableDataMap((prev) => ({ ...prev, ...newTableDataMap }));

      // Save answers as before
      setAnswers(updatedAnswers);
    } else {
      setQuestionDetails([]);
      console.warn("Invalid response:", raw);
    }
  } catch (err) {
    console.error("Error fetchQuestionById:", err);
    setQuestionDetails([]);
  } finally {
    setLoadingDetails(false);
  }
};

useEffect(() => {
  Object.keys(tableMetaMap).forEach(mapKey => {
    const meta = tableMetaMap[mapKey];
    if (!meta?.metaList?.length) return;

    const rows = meta.totalRows;
    const cols = meta.totalColumns;

    const matrix: string[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "")
    );

    meta.metaList.forEach((item: any) => {
      const r = item.visibleRows - 1;
      const c = item.visibleColumns - 1;
      if (r >= 0 && c >= 0) {
        matrix[r][c] = item.tableFieldName || "";
      }
    });

    setTableDataMap(prev => ({
      ...prev,
      [mapKey]: matrix,
    }));
  });
}, [tableMetaMap]);

useEffect(() => {
  if (!activeStepIndex) return;

  setAnswers(prev => {
    const updated: any = {};

    Object.keys(prev).forEach(key => {
      const ans = prev[key];

      // ✅ Keep only current question answers
      if (ans?.QuestionId === activeStepIndex) {
        updated[key] = ans;
      }
    });

    return updated;
  });
}, [activeStepIndex]);

  // -------------------- Dropdown values API --------------------
  
const fetchDropdownValues = async (
  questionId: number,
  elementMstId: string,
  userId: string,
  bearerToken: string,
  tableMstId: string,
  mapKey: string
) => {
  try {
    const res = await fetch(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1DropDownValues",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          questionid: String(questionId),
          formno: "7",
          elementmstid: String(elementMstId),
          userid: userId,
          tablemstid: String(tableMstId),
        }),
      }
    );

    const raw = await res.text();
    const data = safeJsonParse(raw);

    let items: any[] = [];

    if (data?.responseCode === 2000 && Array.isArray(data.items)) {
      items = data.items.map((it: any) => ({
        label: it.ddtext,
        value: it.ddid,
        FormNoVal: it.formno,
        QuestionId: it.questionid,
        ElementMasterId: it.elementmstid,
        TableMstID: tableMstId,
      }));
    }

    // Save options with metadata
    setDropdownOptionsMap(prev => ({ ...prev, [mapKey]: items }));
  } catch (e) {
    console.error("Dropdown fetch error:", e);
  }
};


  // -------------------- Checkbox values API --------------------
  const fetchCheckboxValues = async (questionId: number, elementMstId1: string, userId: string, bearerToken: string, tableMstId: string) => {
    const mapKey = `${questionId}_${elementMstId1}`;
    try {
      const res = await fetch(
        "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1CheckboxValues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            questionid: String(questionId),
            formno: "7",
            elementmstid: String(elementMstId1),
            userid: userId,
            tableMstId: tableMstId,
          }),
        }
      );
      console.log("Checkbox API Request:", {
        questionid: String(questionId),
        formno: "7",
        elementmstid: String(elementMstId1),
        userid: userId,
        tableMstId: tableMstId,
      });

      const raw = await res.text();
      const data = safeJsonParse(raw);
      const items = (data && data.responseCode === 2000 && Array.isArray(data.items))
        ? data.items.map((it: any) => ({ label: it.chktext ?? String(it), value: it.chkid ?? it.chkval ?? it.chktext }))
        : [];

      setCheckboxOptionsMap(prev => ({ ...prev, [mapKey]: items }));

      console.log('checkbox response', items);
    } catch (err) {
      console.error("Error fetchCheckboxValues:", err);
      setCheckboxOptionsMap(prev => ({ ...prev, [mapKey]: [] }));
    }
  };

  // -------------------- Textbox values API (prefill / meta) --------------------
const fetchTextBoxValues = async (
  questionId: number,
  elementMstId: string,
  userId: string,
  bearerToken: string,
  tableMstId: string
) => {
  const mapKey = `${questionId}_${elementMstId}_${tableMstId}`;

  try {
    const res = await fetch(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1TextBoxValues",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          questionid: String(questionId),
          formno: "7",
          elementmstid: String(elementMstId),
          userid: userId,
          tablemstid: String(tableMstId),
        }),
      }
    );

    const raw = await res.text();
    const data = safeJsonParse(raw);

    console.log("📥 Raw TextBox API:", data);

    // ❌ No data
    if (
      !data ||
      data.responseCode !== 2000 ||
      !Array.isArray(data.items)
    ) {
      console.log("⚠️ No validationType found for textbox");
      return;
    }

    const apiItem = data.items[0];
    const validationType = apiItem.validationtype ?? null;

    console.log("✅ Final validationType:", validationType);

    // ----------------------------------------------------
    // 1️⃣ STORE validationType in textboxInfoMap
    // ----------------------------------------------------
    setTextboxInfoMap(prev => ({
      ...prev,
      [mapKey]: { validationType },
    }));

    // ----------------------------------------------------
    // 2️⃣ UPDATE answers for BOTH normal and table inputs
    // ----------------------------------------------------
    setAnswers(prev => {
      const updated = { ...prev };

      Object.keys(updated).forEach(key => {
        const ans = updated[key];

        if (
          ans?.elementMstId == elementMstId &&
          ans?.tableMstId == tableMstId
        ) {
          updated[key] = {
            ...ans,
            validationType: validationType,
          };
        }
      });

      return updated;
    });
  } catch (err) {
    console.log("❌ TextBox fetch error:", err);
  }
};


  // -------------------- Uploaded docs API (existing uploaded files) --------------------

const fetchUploadedDocs = async (
  questionId: number,
  elementMstId: string,
  userId: string,
  bearerToken: string,
  tableMstId: string
) => {

  const mapKey = `${questionId}_${elementMstId}`;

  try {
    const res = await fetch(
      "https://CMSPRAjAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/GetForm1UploadedDocVal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          questionid: String(questionId),
          formno: "7",
          elementmstid: String(elementMstId),
          userid: userId,
          tablemstid: String(tableMstId),
        }),
      }
    );

    const raw = await res.text();
    console.log("📥 Raw UploadedDocs response:", raw);

    const data = safeJsonParse(raw);

    // Validate items
    const uploadedFiles =
      data?.responseCode === 2000 &&
      Array.isArray(data.items)
        ? data.items
        : [];

    // Save into map for UI
    setUploadedDocsMap((prev) => ({
      ...prev,
      [mapKey]: uploadedFiles,
    }));

    // Now insert inside `answers` exactly like textbox logic
    questionDetails.forEach((it) => {
      if (String(it.elementmstid) === String(elementMstId)) {

        const elementNo = String(it.rdformelementno);

        setAnswers((prev) => ({
          ...prev,
          [elementNo]: {
            ...prev[elementNo],
            files: uploadedFiles,  // store array always
          },
        }));
      }
    });

  } catch (err) {
    console.log("❌ fetchUploadedDocs error:", err);
    setUploadedDocsMap(prev => ({ ...prev, [mapKey]: [] }));
  }
};

 
  // -------------------- UI handlers --------------------

const handleTextChange = (elementKey: string, text: string) => {
  setAnswers(prev => {
    const meta = prev[elementKey] ?? {};

    return {
      ...prev,
      [elementKey]: {
        ...meta,
        value: text,
        FormNoVal: meta.FormNoVal ?? 7,
        ElementMasterId: meta.ElementMasterId,
        QuestionId: meta.QuestionId, // ✅ MUST be present
        TableMstID: meta.TableMstID ?? 0,
        validationType: meta.validationType,
      }
    };
  });
};


const handleTableTextChange = (
  elementKey: string,
  text: string,
  questionId: number,
  elementMstId: string,
  tableMstId: string | number,
  rowIndex: number,
  colIndex: number
) => {
  setAnswers(prev => {
    const meta = prev[elementKey] ?? {};

    return {
      ...prev,
      [elementKey]: {
        ...meta,
        value: text,
        FormNoVal: meta.FormNoVal ?? 7,
        ElementMasterId: elementMstId,
        QuestionId: questionId,
        TableMstID: tableMstId ?? 0,
        RowIndex: rowIndex,       // ✅ for safety
        ColumnIndex: colIndex,    // ✅ for safety
        validationType: meta.validationType
      }
    };
  });
};


const handleDropdownChange = (elementNoKey: string, selected: any) => {
  setAnswers(prev => ({
    ...prev,
    [elementNoKey]: {
      value: selected.value,
      FormNoVal: selected.FormNoVal,
      QuestionId: selected.QuestionId,
      ElementMasterId: selected.ElementMasterId,
      TableMstID: selected.TableMstID ?? 0,
    }
  }));
};


const prepareDropdownPayload = (questionId: number) => {
  const payload: any[] = [];

  questionDetails.forEach(q => {
    // ✅ ONLY dropdown elements
    if (q.rdformelementid !== 2) return;

    const key = String(q.rdformelementno);
    const ans = answers[key];

    if (!ans || ans.value === null || ans.value === undefined) return;

    const selectedValue = Array.isArray(ans.value)
      ? ans.value[0]
      : ans.value;

    if (
      selectedValue === "" ||
      selectedValue === null ||
      selectedValue === undefined
    ) {
      return;
    }

    payload.push({
      FormNoVal: 7,
      QuestionId: questionId,
      ElementMasterId: String(q.elementmstid), // ✅ NEVER undefined now
      dropdownValue: String(selectedValue),    // ✅ convert to string
      IsFromMobileApp: 1,
      TableMstID: q.tablemstid ?? 0,
    });
  });

  console.log("🧪 dropdownPayload:", payload);
  return payload;
};




const prepareTextboxPayload = (questionId: number): any[] => {
  const payload: any[] = [];

  Object.values(answers).forEach(ans => {
    if (
      ans &&
      typeof ans === "object" &&
      "value" in ans &&
      typeof ans.value === "string" &&
      ans.value.trim() !== "" &&          // only non-empty
      ans.QuestionId === questionId       // ⭐ filter by this question
    ) {
      payload.push({
        FormNoVal: ans.FormNoVal,
        ElementMasterId: ans.ElementMasterId,
        QuestionId: ans.QuestionId,
        textboxValue: ans.value,
        IsFromMobileApp: 1,
        TableMstID: ans.TableMstID ?? 0,
      });
    }
  });

  console.log("🧪 textboxPayload:", payload);
  return payload;
};



const prepareCheckboxPayload = (questionId: number) => {
  const payload: any[] = [];

  Object.keys(answers).forEach(key => {
    const ans = answers[key];

    if (
      ans &&
      typeof ans === "object" &&
      Array.isArray(ans.value) &&
      ans.ElementMasterId &&
      ans.QuestionId === questionId
    ) {
      const selectedArr = ans.value.map((v: any) => String(v)); // selected values

      // Only push checked items
      selectedArr.forEach((chkId: string) => {
        payload.push({
          FormNoVal: ans.FormNoVal ?? 7,
          ElementMasterId: ans.ElementMasterId,
          QuestionId: ans.QuestionId,
          ChkID: chkId,
          Value: 1,  // always 1, because only selected are included
          IsFromMobileApp: 1
        });
      });
    }
  });

  console.log("📥 JSON Checkbox Payload (selected only):", payload);
  return payload;
};



const prepareDocumentPayload = async (questionId: number) => {
  const payload: any[] = [];

  for (const [elementNo, val] of Object.entries(answers)) {
    // Skip if no files or not an array
    if (!val?.files || !Array.isArray(val.files)) continue;

    // Only include files for the current question
    if (val.QuestionId !== questionId) continue;

    for (const file of val.files) {
      const base64Content = await readFileAsBase64(file);

      payload.push({
        FormNoVal: val.FormNoVal ?? 7,
        ElementMasterId: Number(val.ElementMasterId ?? 0),
        QuestionId: Number(val.QuestionId ?? 0),
        FileName: file.name,
        FileSize: String(file.size ?? 0),
        FilePath: `Form1/${userID}/1_${val.ElementMasterId}_${file.name}`,
        FileType: file.type ?? "unknown",
        FileContent: base64Content,
        IsFromMobileApp: 1,
        TableMstID: Number(val.TableMstID ?? 0),
      });
    }
  }

  console.log("🧪 documentPayload:", payload);
  return payload;
};



const handleCheckboxToggle = (
  elementNo: string,
  optionValue: string | number,
  questionId: number,
  elementMstId: string | number
) => {
  setAnswers(prev => {
    const prevVal = prev[elementNo];

    const arr = Array.isArray(prevVal?.value)
      ? prevVal.value
      : Array.isArray(prevVal)
      ? prevVal
      : [];

    const exists = arr.includes(optionValue);
    const newArr = exists
      ? arr.filter((v: string | number) => v !== optionValue)
      : [...arr, optionValue];

    return {
      ...prev,
      [elementNo]: {
        ...(typeof prevVal === "object" ? prevVal : {}),
        value: newArr,
        FormNoVal: 7,
        ElementMasterId: elementMstId, // ✅ string allowed
        QuestionId: questionId
      }
    };
  });
};

const handleChooseFile = async (
  elementNo: string,
  questionId: number,
  elementMstId: string,
  tableMstId: number = 0
) => {
  try {
    const [file] = await pick({
      allowMultiSelection: false,
      type: [types.pdf, types.images],
    });

    if (!file) return;

    setAnswers(prev => ({
      ...prev,
      [elementNo]: {
        ...(typeof prev[elementNo] === "object" ? prev[elementNo] : {}),
        files: [file],                // ✅ always array
        FormNoVal: 7,
        ElementMasterId: elementMstId,
        QuestionId: questionId,
        TableMstID: tableMstId,
      },
    }));

  } catch (err: any) {
    if (err?.message?.includes("cancelled")) return;
    Alert.alert("Error", "File selection failed");
  }
};


  // -------------------- Step click --------------------
  const onStepPress = (index: number, questionId: number) => {
    setActiveStepIndex(index);
    if (userID && token) {
      fetchQuestionById(questionId, userID, token);
    }
    // optional: scroll centering logic could be added here
  };


const validateTableForQuestion = (
  questionId: number,
  questionDetails: any[],
  tableDataMap: Record<string, any[][]>
): string[] => {
  const errors: string[] = [];

  // Only table elements for this question
  const tableQuestions = questionDetails.filter(
    q => q.rdformquestionid === questionId && q.rdformelementid === 5
  );

  tableQuestions.forEach(q => {
    const elementNo = q.rdformelementno;
    const tableKey = `${questionId}_${elementNo}`;
    const matrix = tableDataMap[tableKey];

    if (!Array.isArray(matrix)) {
      errors.push(`${q.rdformlablename} (table missing)`);
      return;
    }

    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) return;

        // Skip labels
        if (cell.type === "label") return;

        // Validate value
        if (
          cell.value === null ||
          cell.value === undefined ||
          String(cell.value).trim() === ""
        ) {
          errors.push(
            `${q.rdformlablename} → Row ${rowIndex + 1}, Column ${colIndex + 1}`
          );
        }
      });
    });
  });

  return errors;
};

  // -------------------- Submit stub --------------------
const handleSubmit = async () => {
  try {
    // ================= USER CHECK =================
    if (!userID || !username || !token) 
      
      {
      Alert.alert("Error", "User info missing. Please re-login.");
      return;
     
    }
 console.log('userID',userID);
 console.log('username',username);
 console.log('token',token);

    const activeQuestion = questions[activeStepIndex];
    const questionId = activeQuestion?.questionid;

    if (!questionId) {
      Alert.alert("Error", "Invalid question");
      return;
    }

    // ================= BUILD PAYLOADS =================
    const jsontextboxpayload = prepareTextboxPayload(questionId);
    const jsoncheckboxpayload = prepareCheckboxPayload(questionId);
    const jsondropdownPayload = prepareDropdownPayload(questionId);
    const Jsondocumentpayload = await prepareDocumentPayload(questionId);

    // ================= LABEL-WISE VALIDATION =================
    const missingLabels: string[] = [];
let tableMissing = false;
console.log("🧩 TABLE META (from GetForm1QuestionByID):");
questionDetails.forEach(q => {
  if (Number(q.rdformelementid) === 5) {
    console.log({
      rdformquestionid: q.rdformquestionid,
      tablemstid: q.tablemstid,
      rdtableelementid: q.rdtableelementid,
      rdtablefieldname: q.rdtablefieldname,
      rdformlablename: q.rdformlablename,
    });
  }
});

    questionDetails.forEach(item => {
      const label = item.rdformlablename;
      const type = item.rdformelementid;
      const elementId = String(item.elementmstid);
      const qId = item.rdformquestionid;

      let answered = true;

      switch (type) {
        case 1: // TEXTBOX
          answered = jsontextboxpayload.some(t =>
            String(t.ElementMasterId) === elementId &&
            t.QuestionId === qId &&
            String(t.textboxValue || "").trim() !== ""
          );
          break;

        case 2: // DROPDOWN
          answered = jsondropdownPayload.some(d =>
            String(d.ElementMasterId) === elementId &&
            d.QuestionId === qId &&
            String(d.dropdownValue || "").trim() !== ""
          );
          break;

        case 3: // CHECKBOX
          answered = jsoncheckboxpayload.some(c =>
            String(c.ElementMasterId) === elementId &&
            c.QuestionId === qId
          );
          break;

        case 4: // FILE UPLOAD
          answered = Jsondocumentpayload.some(f =>
            String(f.ElementMasterId) === elementId &&
            f.QuestionId === qId
          );
          break;


case 5: { // TABLE VALIDATION
  const tableMstId = Number(item.tablemstid);

  // 1️⃣ Filter question details for this table
  const tableFields = questionDetails.filter(q => Number(q.tablemstid) === tableMstId);

  if (tableFields.length === 0) return; // nothing to validate

  // 2️⃣ Only required fields: rdtablefieldname="" AND rdtableelementid = 1,2,3
  const requiredFields = tableFields.filter(q => {
    const elId = Number(q.rdtableelementid);
    return q.rdtablefieldname === "" && [1, 2, 3].includes(elId);
  });

  if (requiredFields.length === 0) return; // nothing to validate

  let invalid = false;

  requiredFields.forEach(field => {
    // ✅ Find all answers for this table cell
    const matchingKeys = Object.keys(answers).filter(
      k =>
        k.includes(`_${field.elementmstid ?? field.rdformelementid ?? ""}_`) ||
        k.includes(`_${tableMstId}_`)
    );

    const hasValue = matchingKeys.some(k => {
      const val = answers[k]?.value;
      return val !== undefined && val !== null && String(val).trim() !== "";
    });

    if (!hasValue) {
      invalid = true;
      console.log(`❌ Missing field: tableMstId=${field.tablemstid}, rdtableelementid=${field.rdtableelementid}`);
    }
  });

  if (invalid) missingLabels.push("Please fill all table fields");

  return;
}

        default:
          return;
      }

      if (!answered) {
        missingLabels.push(label);
      }
    });

    // ================= STOP IF MISSING =================
  if (missingLabels.length > 0 || tableMissing) {
  const messages = [...missingLabels];

  if (tableMissing) {
    messages.push("Please fill all table fields");
  }

  Alert.alert(
    "Please fill required fields",
    messages.map(m => `• ${m}`).join("\n")
  );
  return;
}

    // ================= FINAL PAYLOAD =================
    const payload = {
      roleid: "1",
      userid: userID,
      username: username,
      jsontextboxpayload,
      jsoncheckboxpayload,
      jsondropdownPayload,
      Jsondocumentpayload,
    };

    console.log("📤 Final Payload:", JSON.stringify(payload, null, 2));

    // ================= SUBMIT =================
    const res = await fetch(
      "https://CMSPRajAbhiyanAPI.mahaitgov.in/api/Form1QuestionMaster/InserUpdateFormElements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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

    // ================= STEP COLOR CHANGE =================
    setSubmittedSteps(prev =>
      prev.includes(activeStepIndex) ? prev : [...prev, activeStepIndex]
    );

  } catch (error) {
    console.error("Submit Error:", error);
    Alert.alert("Error", "Something went wrong");
  }
};

//------------table steps--------
const totalSteps = steps.length;
const handleNext = () => {
  setActiveStepIndex(prevIndex => {
    if (prevIndex < totalSteps - 1) {
      return prevIndex + 1;
    }
    return prevIndex; // stay on last step
  });
};


const handlePrev = () => {
  setActiveStepIndex(prevIndex => {
    if (prevIndex > 0) {
      return prevIndex - 1;
    }
    return prevIndex; // stay on first step
  });
};

const handleChooseTableFile = async (
  questionId: number,
  tableMstId: number,
  rowIndex: number,
  colIndex: number
) => {
  try {
    const [file] = await pick({
      allowMultiSelection: false,
      type: [types.pdf, types.images],
    });

    if (file) {
      const tableKey = `${questionId}_${tableMstId}_${rowIndex}_${colIndex}`;
      setAnswers(prev => ({
        ...prev,
        [tableKey]: {
          ...prev[tableKey],
          value: file,
        },
      }));
    }
  } catch (err: any) {
    if (err?.message?.includes("cancelled")) return;
    console.error("Table file picker error:", err);
    Alert.alert("Error", "File selection failed");
  }
};


const readFileAsBase64 = async (file: any) => {
  let filePath = file.uri;

  // Android content:// fix
  if (filePath.startsWith("content://")) {
    const destPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;

    await RNFS.copyFile(filePath, destPath);
    filePath = destPath;
  }

  const base64 = await RNFS.readFile(filePath, "base64");
  return base64;
};

  // -------------------- Render control (WITHOUT label) --------------------
  const renderControl = (item: any) => {
    const elementNoKey = String(item.rdformelementno);
    const elementType = Number(item.rdformelementid);
    const questionId = questions[activeStepIndex]?.questionid ?? steps[activeStepIndex];
    const tableMstId = Number(item.tablemstid);
    // Prefer backend field elementmstid; fallback to previously stored meta
    const elementMstIdFromItem = item.elementmstid ?? item.rdformelementmasterid ?? "";
    const elementMstIdFromAnswers = answers[elementNoKey]?.elementMstId ?? answers[elementNoKey]?.elementmstid ?? "";
    const elementMstId = String(elementMstIdFromItem || elementMstIdFromAnswers || "");
    // mapKey must match fetch: `${questionId}_${elementMstId}`
    const mapKey = `${questionId}_${elementMstId}`;

    switch (elementType) {

case 1: {//textbox
  const elementKey = `${questionId}_${elementMstId}_${tableMstId ?? 0}`;
  const ansObj = answers[elementNoKey] ?? {};
  const value = ansObj.value ?? "";
  const validationType = ansObj.validationType;

  let placeholder = "";
  if (validationType === 1) placeholder = "Enter valid website URL";
  else if (validationType === 2) placeholder = "Enter numeric value (max 5 digits)";
  else if (validationType === 3) placeholder = "Enter text";
  else if (validationType === 4) placeholder = "Enter number (max 10 digits)";

  return (

<TextInput
  style={styles.input}
  placeholder={placeholder}
   placeholderTextColor="#777" 
 // value={String(answers[elementKey]?.value ?? "")}
  value={answers[elementKey]?.value ?? ""}
 onChangeText={(text) => {

    // 🔴 THIS IS THE MISSING PART
    if (!answers[elementKey]) {
      setAnswers(prev => ({
        ...prev,
        [elementKey]: {
          value: "",
          FormNoVal: 7,
          QuestionId: questionId,          // already coming correctly
          ElementMasterId: elementMstId,   // ⭐ YOU WERE MISSING THIS
          TableMstID: 0,
          validationType: validationType,
        }
      }));
    }
   
    handleTextChange(elementKey, text)}

  }


  keyboardType={
    validationType === 2 || validationType === 4 ? "numeric" : "default"
  }
  maxLength={
    validationType === 2
      ? 5
      : validationType === 4
      ? 10
      : undefined
  }
/>
  );
}
      case 2: { // Dropdown
       
        const ddOptions = dropdownOptionsMap[mapKey] ?? [];

        // selected value must match option.value (ddid)
        const selectedValue =
          answers[elementNoKey] && typeof answers[elementNoKey] === "object" && "value" in answers[elementNoKey]
            ? answers[elementNoKey].value
            : answers[elementNoKey] ?? null;

        // Debug log to ensure keys match
        console.log("🔎 render - dropdown mapKey:", mapKey, { ddOptionsLength: ddOptions.length, selectedValue });

        return (
          <View>
            {ddOptions.length === 0 ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Dropdown
                style={styles.dropdown}
                data={ddOptions}
                labelField="label"
                valueField="value"
                value={selectedValue}
                placeholder="निवडा"
                onChange={(selected: any) => {
                  // selected: { label, value }
                  handleDropdownChange(elementNoKey, selected);
                }}
              />
            )}
          </View>
        );
      }

      case 3: { // checkbox
       
        const cbOptions = checkboxOptionsMap[mapKey] ?? [];

        // current selection array
        const currentArr =
          answers[elementNoKey] && typeof answers[elementNoKey] === "object" && "value" in answers[elementNoKey]
            ? answers[elementNoKey].value ?? []
            : answers[elementNoKey] ?? [];

        const normalizedArr = Array.isArray(currentArr) ? currentArr : [];

        return (
          <View>
            {cbOptions.map((opt) => {
              const checked = normalizedArr.includes(opt.value);
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  style={styles.checkboxRow}
                  onPress={() =>  handleCheckboxToggle(
    elementNoKey,
    opt.value,
    questionId,
    elementMstId
  )}
                >
                  <Icon name={checked ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color="#2E7D32" />
                  <Text style={styles.checkboxLabel}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }

      case 4: { // file upload
       
        const uploaded = uploadedDocsMap[mapKey] ?? [];
        return (
          <View>
            {item.rdformdocnametooltp ? <Text style={styles.tooltipText}>{item.rdformdocnametooltp}</Text> : null}
            <View style={styles.fileRow}>
              <TouchableOpacity style={styles.chooseBtn} onPress={() => handleChooseFile(elementNoKey, questionId, elementMstId, tableMstId ?? 0)}>
                <Text>Choose File</Text>
              </TouchableOpacity>
            <Text style={styles.noFile}>
 {answers[elementNoKey]?.files?.length > 0
  ? answers[elementNoKey].files[0].name ?? "File chosen"
  : "No File Chosen"}

</Text>
            </View>
            {uploaded.length > 0 && (
              <View style={{ marginTop: 8 }}>
                {/* {uploaded.map((doc: any, idx: number) => (
                  <View key={idx} style={styles.fileItem}>
                    <Text>{doc.filename ?? doc.fileName ?? doc.docname ?? `Document ${idx + 1}`}</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Download", "Implement download logic")}>
                      <Icon name="download" size={20} />
                    </TouchableOpacity>
                  </View>
                ))} */}
              </View>
            )}
          </View>
        );
      }

case 5: {
  const tableKey = `${questionId}_${item.rdformelementno}`;

  if (renderedTableSet.current.has(tableKey)) return null;
  renderedTableSet.current.add(tableKey);

  const table = tableDataMap[tableKey];
  if (!table) return null;

  return (
    <ScrollView horizontal style={{ marginVertical: 12 }}>
      <View style={styles.tableContainer}>
        {table.map((row: any[], rowIndex: number) => (
          <View key={rowIndex} style={styles.tableRow}>
            {row.map((cell: any, colIndex: number) => {
              const cellKey = `${tableKey}_${rowIndex}_${colIndex}`;
              const cellValue = answers[cellKey]?.value ?? "";

              // Textbox
if (cell.type === "textbox") {
  const elementKey =
    `${questionId}_${elementMstId}_${tableMstId ?? 0}_${rowIndex}_${colIndex}`;

  const ansObj = answers[elementKey] ?? {};
  const validationType = ansObj.validationType;

  let placeholder = "Enter value";
  if (validationType === 1) placeholder = "Enter valid website URL";
  else if (validationType === 2) placeholder = "Enter numeric value";
  else if (validationType === 3) placeholder = "Enter text";
  else if (validationType === 4) placeholder = "Enter number";

  return (
    <TextInput
      key={colIndex}
      style={styles.tableInput}
      placeholder={placeholder}
      value={ansObj.value ?? ""}
      onChangeText={(text) =>
        handleTableTextChange(
          elementKey,
          text,
          questionId,
          elementMstId,
          tableMstId,
          rowIndex,
          colIndex
        )
      }
      keyboardType={
        validationType === 2 || validationType === 4 ? "numeric" : "default"
      }
      maxLength={
        validationType === 2 ? 5 : validationType === 4 ? 10 : undefined
      }
    />
  );
}
// Dropdown inside table cell
if (cell.type === "dropdown") {
  
 const ddMapKey = `${questionId}_${cell.elementMstId}`;
 
  const ddOptions = dropdownOptionsMap[ddMapKey] ?? [];
  const selectedValue = answers[cellKey]?.value ?? null;

  return (
    <View key={colIndex} style={{ minWidth: 100 }}>
      {ddOptions.length === 0 ? (
        <ActivityIndicator size="small" />
      ) : (
        <Dropdown
          style={styles.tableDropdown}
          data={ddOptions}
          labelField="label"
          valueField="value"
          value={selectedValue}
          placeholder="Select"
          onChange={(selected: any) =>
            setAnswers(prev => ({
              ...prev,
              [cellKey]: {
                ...prev[cellKey],
                value: selected.value,
  FormNoVal: selected.FormNoVal,
  QuestionId: selected.QuestionId,
  ElementMasterId: selected.ElementMasterId,
  TableMstID: selected.TableMstID ?? 0,
              },
            }))
          }
        />
      )}
    </View>
  );
}

              // File upload
             {cell.type === "file" && (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity
      style={styles.chooseBtn}
      onPress={() => handleChooseTableFile(questionId, cell.tableMstId, rowIndex, colIndex)}
    >
      <Text>Choose File</Text>
    </TouchableOpacity>

  <Text style={styles.noFile}>
{answers[elementNoKey]?.files?.length > 0
  ? answers[elementNoKey].files[0].name ?? "File chosen"
  : "No File Chosen"}

</Text>


  </View>
)}

              // Label
              return (
                <View key={colIndex} style={[styles.tableCell, rowIndex === 0 && styles.headerCell]}>
                  <Text style={[styles.cellText, rowIndex === 0 && styles.headerText]}>
                    {cell.value}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


      default:
        return null;
    }
  };

  // -------------------- Main render --------------------
  // if (loading) {
  //   return (
  //     <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  const questionIdForHeading = steps[activeStepIndex] ?? questions[activeStepIndex]?.questionid ?? "";
  const activeQuestionName = questionDetails[0]?.rdformquestionname ?? questions[activeStepIndex]?.questionname ?? "";
renderedTableSet.current.clear();
let questionNumber = 1;
  return (
    <View style={styles.container}>
      {/* TOOLBAR */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>लोकसहभाग व श्रमदान माध्यमातून लोकचळवळ निर्माण करणे</Text>
        <Text style={styles.toolbarSubtitle}>(Good Governance)</Text>
      </View>

      {/* STEPS */}

<ScrollView
  ref={scrollRef}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.stepContainer}
>
  {steps.map((id, index) => {
    const isActive = index === activeStepIndex;
    const isSubmitted = submittedSteps.includes(index);

    return (
      <TouchableOpacity key={id} onPress={() => onStepPress(index, id)}>
        <View
          style={[
            styles.stepCircle,
            isActive && styles.activeStep,       // current step style
            isSubmitted && styles.submittedStep // yellow for submitted
          ]}
        >
          <Text
            style={[
              styles.stepText,
              isActive && styles.activeStepText,        // active text style
              isSubmitted && { color: "white", fontWeight: "700" } // white text if yellow
            ]}
          >
            {id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  })}
</ScrollView>

      {/* QUESTION CARD */}
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={styles.card}>
          {/* Heading: format -> 1.{questionId}: Question Name */}
          <Text style={styles.heading}>
            {`1.${questionIdForHeading}: `}{activeQuestionName || "प्रश्न"}
          </Text>

          {loadingDetails ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
          

    


{questionDetails.map((item: any) => {
  // Table element
  if (item.rdformelementid === 5) {
    if (renderedTableSet.current.has(item.rdformelementno)) {
      return null; // skip repeated table items
    }
    renderedTableSet.current.add(item.rdformelementno);

    const currentNumber = questionNumber;
    questionNumber++; // increment only when rendering

    return (
      <View key={item.rdformelementno} style={styles.fieldWrapper}>
        <Text style={styles.label}>{`${currentNumber}. ${item.rdformlablename}`}</Text>
        {renderControl(item)}
      </View>
    );
  }

  // Non-table elements
  const currentNumber = questionNumber;
  questionNumber++; // increment only when rendering

  return (
    <View key={String(item.rdformelementno)} style={styles.fieldWrapper}>
      <Text style={styles.label}>{`${currentNumber}. ${item.rdformlablename}`}</Text>
      {renderControl(item)}
    </View>
  );
})}

<View style={styles.btnRow}>
  {activeStepIndex > 0 && (
    <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
      <Text style={styles.btnText}>मागील</Text>
    </TouchableOpacity>
  )}

  <TouchableOpacity
    style={styles.prevBtn}
    onPress={() => {
      if (activeStepIndex === totalSteps - 1) {
        handlePrev(); // ✅ preview only
      } else {
        handleSubmit(); // ✅ submit only
      }
    }}
  >
    <Text style={styles.btnText}>
      {activeStepIndex === totalSteps - 1 ? "Preview" : "Submit"}
    </Text>
  </TouchableOpacity>

  {activeStepIndex < totalSteps - 1 && (
    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
      <Text style={styles.btnText}>पुढे</Text>
    </TouchableOpacity>
  )}
</View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}


// -------------------- Styles (kept same as your original) --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8e8e8" },

  // Toolbar
  toolbar: {
    backgroundColor: "#004aad",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  toolbarTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  toolbarSubtitle: { color: "white", fontSize: 14, marginTop: 4 },

  // Steps
  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#e8e8e8",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  stepText: { color: "#777" },
  activeStep: {
    backgroundColor: "#1b8f4d",
    borderColor: "#1b8f4d",
  },
  submittedStep: {
    backgroundColor: "red", // ✅ change to yellow after submit
  },
  activeStepText: { color: "white", fontWeight: "bold" },
stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20, // spacing above/below the step row
  },
  // Card
  card: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 4,
  },
  heading: { fontSize: 16, fontWeight: "600", marginBottom: 15 },

  label: { marginTop: 8, marginBottom: 6, fontSize: 14 },

  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  checkboxLabel: { marginLeft: 8 },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  // File
  fieldWrapper: { marginBottom: 6 },
  fileRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  chooseBtn: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
  },
  noFile: { marginLeft: 10 },

  tooltipText: { color: "gray", marginTop: 4 },

  note: { color: "red", marginTop: 10, fontSize: 12 },

  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  submitBtn: {
    backgroundColor: "#1b8f4d",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  submitText: { color: "white", fontSize: 16, fontWeight: "600" },
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
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 12,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100, // consistent column width
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerCell: {
    backgroundColor: "#0B4FA3", // blue header background
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  cellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  headerText: {
    fontWeight: "700",
    color: "#fff", // white text for header
    textAlign: "center",
  },
  tableInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    minWidth: 100,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  tableDropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    minWidth: 100,
    paddingHorizontal: 6,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
