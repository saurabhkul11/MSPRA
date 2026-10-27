/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Platform,
  PanResponder,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';
import FileViewer from 'react-native-file-viewer';
import CustomAlert, { AlertType } from '../utils/CustomAlert';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { generatePDF } from 'react-native-html-to-pdf';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {API_BASE_URL} from '../utils/api';

import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
// import Marker, { ImageFormat, Position } from 'react-native-image-marker';
import Geolocation, { GeoPosition } from '@react-native-community/geolocation';

import Marker, { ImageFormat, Position } from 'react-native-image-marker';
interface Step {
  srNo: number;
  questionid: number;
  anssum: number;
}

interface IDropdownItem {
  ddtext: string;
  ddid: number | string;
  formno: number;
  questionid: number;
  elementmstid: string;
  tablemstid?: number;
  ddval?: number | string;
}

interface IDropdownOption {
  label: string;
  value: number | string;
  FormNoVal: number;
  QuestionId: number;
  ElementMasterId: string;
  TableMstID: number;
  ddval?: number | string;
}

interface IDependencyItem {
  dependantelementmasterid: string | number;
  showelementflag: number;
  tablemstid?: number;
  dropdownitems?: IDropdownItem[]; // optional if your API returns dropdown items
}

let DocumentPicker: any = null;
try {
  // @ts-ignore
  DocumentPicker = require('react-native-document-picker');
} catch (e) {
  DocumentPicker = null;
}
export default function Form7() {
  // Steps / questions
  // const [steps, setSteps] = useState<number[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<
    Record<string, 'before' | 'after'>
  >({});

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const [tableImages, setTableImages] = useState<
    Record<
      string,
      {
        before: any[];
        after: any[];
      }
    >
  >({});

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
  const [steps, setSteps] = useState<Step[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeQuestion = questions[activeStepIndex];
  const questionId = activeQuestion?.questionid;

  const [questionDetails, setQuestionDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const [dropdownOptionsMap, setDropdownOptionsMap] = useState<
    Record<string, any[]>
  >({});
  const [checkboxOptionsMap, setCheckboxOptionsMap] = useState<
    Record<string, any[]>
  >({});
  const [textboxInfoMap, setTextboxInfoMap] = useState<Record<string, any>>({});
  const [uploadedDocsMap, setUploadedDocsMap] = useState<Record<string, any[]>>(
    {},
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const scrollRef = useRef<ScrollView | null>(null);
  const [tableDataMap, setTableDataMap] = useState<Record<string, any[]>>({});

  const [tableMetaMap, setTableMetaMap] = useState<Record<string, any>>({});
  const renderedTableSet = useRef<Set<string>>(new Set());

  const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);

  const navigation = useNavigation<any>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { userID, token, username } = useAuth();
  const [visibleElements, setVisibleElements] = useState<
    Record<number, boolean>
  >({});
  const [hiddenElementMap, setHiddenElementMap] = useState<
    Record<string, boolean>
  >({});

  const [disabledElements, setDisabledElements] = useState<
    Record<string, boolean>
  >({});

  const [voterCount, setVoterCount] = useState<string | null>(null);
  const [villagePeopleCount, setVillagePeopleCount] = useState<string | null>(
    null,
  );

  const voterCountFilled = useRef(false);
  const villageCountFilled = useRef(false);

  const disabledElementsRef = useRef<Record<string, boolean>>({});
  const dropdownValueRef = useRef<Record<string, number>>({});
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [isWebFinalSubmitted, setIsWebFinalSubmitted] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [selectedDateKey, setSelectedDateKey] = useState('');

  const [selectedDateKey, setSelectedDateKey] = useState<{
    key: string;
    questionId: number;
    elementMasterId: number;
    tableMstID: number;
    formNo: number;
  } | null>(null);

  const [uploadedDocsMap1, setUploadedDocsMap1] = useState<
    Record<string, any[]>
  >({});
  const [tableUploadedDocsMap, setTableUploadedDocsMap] = useState<
    Record<string, any[]>
  >({});

  const STATIC_TABLE_VALIDATION: Record<string, number> = {
    // Example overrides
    '1_133_547_6': 3, // column 2 = text
    '1_133_109_4': 2, // column 4 = numeric
    '1_133_110_5': 4, // column 5 = decimal
    '1_133_548_6': 3, // column 6 = text
    // add more overrides as needed
    '1_211_536_1': 3,
    //"1_211_476_2": 3,
    '1_211_537_1': 3,
    //"1_211_479_2": 3,
    '1_211_538_1': 3,
    // "1_211_482_2": 3,
    '1_211_539_1': 3,
    //"1_211_485_2": 3,
    '1_211_540_1': 3,
    //"1_211_488_2": 3,
    '1_211_541_1': 3,
    //"1_211_491_2": 3,
    '1_211_542_1': 3,
    // "1_211_494_2": 3,
    '1_211_543_1': 3,
    // "1_211_497_2": 3,
    '1_211_544_1': 3,
    // "1_211_500_2": 3,
    '1_211_545_1': 3,
    //"1_211_503_2": 3,
  };

  const horizontalTableRef = useRef<ScrollView | null>(null);
  const horizontalOffsetRef = useRef(0);
  const horizontalStartOffsetRef = useRef(0);
  const horizontalMaxOffsetRef = useRef(0);

  const tablePanResponder = useRef(
    PanResponder.create({
      // Do not take simple taps.
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // Capture only a clear horizontal drag.
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;

        return Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy);
      },

      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const { dx, dy } = gestureState;

        return Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy);
      },

      onPanResponderGrant: () => {
        horizontalStartOffsetRef.current = horizontalOffsetRef.current;
      },

      onPanResponderMove: (_, gestureState) => {
        const nextOffset = horizontalStartOffsetRef.current - gestureState.dx;

        const clampedOffset = Math.max(
          0,
          Math.min(nextOffset, horizontalMaxOffsetRef.current),
        );

        horizontalOffsetRef.current = clampedOffset;

        horizontalTableRef.current?.scrollTo({
          x: clampedOffset,
          animated: false,
        });
      },

      onPanResponderRelease: () => {
        horizontalStartOffsetRef.current = horizontalOffsetRef.current;
      },

      onPanResponderTerminate: () => {
        horizontalStartOffsetRef.current = horizontalOffsetRef.current;
      },

      onPanResponderTerminationRequest: () => true,
    }),
  ).current;

  useEffect(() => {
    // Loop over all questions & elements to fetch file uploads
    questionDetails.forEach(item => {
      if (Number(item.rdformelementid) === 4) {
        // file upload element
        fetchUploadedDocs(
          item.rdformquestionid,
          String(item.elementmstid),
          String(userID),
          token!,
          String(item.tablemstid ?? 0),
        );
      }
    });
  }, [questionDetails, userID, token]);

  useEffect(() => {
    const initialDisabled: Record<string, boolean> = {};

    Object.keys(answers).forEach(key => {
      if (!key.startsWith('disabled_')) return;

      const disabledForQuestion = answers[key];
      Object.keys(disabledForQuestion).forEach(elId => {
        if (disabledForQuestion[elId] === true) {
          initialDisabled[elId] = true;
        }
      });
    });

    disabledElementsRef.current = initialDisabled;
    setDisabledElements(initialDisabled);

    //console.log('✅ INITIAL DISABLED ELEMENTS LOADED', initialDisabled);
  }, [answers]); // depend on answers to run after API prefill

  useEffect(() => {
    checkFinalSubmitStatus();
  }, []);

  const checkFinalSubmitStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(
        `form7_final_submitted_${userID}`,
      );

      if (status === '1') {
        setIsFinalSubmitted(true);
      }
    } catch (error) {
      console.log('Error checking final submit status:', error);
    }
  };

  const isDisabled = (elementMstId: string | number) => {
    const elId = String(elementMstId);
    return disabledElementsRef.current[elId] === true;
  };

  type TableRowValues = {
    [key: string]: string | number;
  };

  type TableDataMap = {
    [tableMstId: number]: TableRowValues;
  };

  type TableCell = {
    type: 'textbox' | 'dropdown' | 'file' | 'label';
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
    const loadCounts = async () => {
      try {
        const voter = await AsyncStorage.getItem('voterCount');
        const villagePeople = await AsyncStorage.getItem('villagePeopleCount');
        setVoterCount(voter);
        setVillagePeopleCount(villagePeople);
      } catch (error) {
        console.log('❌ Error reading AsyncStorage', error);
      }
    };

    loadCounts();
  }, []);

  useEffect(() => {
    const activeQuestion = questions[activeStepIndex];
    const questionId = activeQuestion?.questionid;

    if (!questionId) return;
    if (!questionDetails?.length) return;

    // console.log('🔁 Replaying dropdown dependencies', { questionId });

    questionDetails.forEach(item => {
      // only dropdowns
      if (Number(item.rdformelementid) !== 2) return;

      const elementMstId = String(item.elementmstid);
      const mapKey = `${questionId}_${elementMstId}`;
      const selectedValue = answers[mapKey]?.value;

      if (
        selectedValue !== null &&
        selectedValue !== undefined &&
        Number(selectedValue) !== 0
      ) {
        fetchDropdownDependency(
          elementMstId,
          questionId,
          String(selectedValue),
          token!,
        );
      }
    });
  }, [activeStepIndex, questionDetails]);

  useEffect(() => {
    if (!voterCount || !questionDetails?.length || voterCountFilled.current)
      return;

    //--------skip validation---

    const target = questionDetails.find(
      item =>
        Number(item.rdformno) === 7 &&
        Number(item.rdformquestionid) === 2 &&
        Number(item.rdformelementno) === 1 &&
        Number(item.rdformelementid) === 1, // TEXTBOX
    );

    if (!target) return;

    // ✅ MUST MATCH render key
    const elementKey = `${target.rdformquestionid}_${target.elementmstid}_${
      target.tableMstId ?? 0
    }`;

    setAnswers(prev => {
      if (prev[elementKey]?.value === String(voterCount)) return prev;

      return {
        ...prev,
        [elementKey]: {
          ...(prev[elementKey] || {}),
          value: String(voterCount),
          FormNoVal: 7,
          QuestionId: target.rdformquestionid,
          ElementMasterId: target.elementmstid,
          TableMstID: target.tableMstId ?? 0,
          validationType: target.validationType,
        },
      };
    });

    voterCountFilled.current = true;
  }, [voterCount, questionDetails]);

  //----------set auto villagePeopleCount----------
  useEffect(() => {
    if (
      !villagePeopleCount ||
      !questionDetails?.length ||
      villageCountFilled.current
    ) {
      return;
    }

    // Find the target TextBox
    const target = questionDetails.find(
      item =>
        Number(item.rdformno) === 7 &&
        Number(item.rdformquestionid) === 2 &&
        Number(item.rdformelementno) === 1,
    );

    if (!target) {
      //console.log('❌ villagePeopleCount TextBox not found in questionDetails');
      return;
    }

    // 🔑 Create the exact elementKey used in case 1
    const elementKey = `${target.rdformquestionid}_${
      target.rdformelementmstid
    }_${target.tablemstid ?? 0}`;

    setAnswers(prev => ({
      ...prev,
      [elementKey]: {
        ...(prev[elementKey] || {}),
        value: villagePeopleCount,
      },
    }));

    villageCountFilled.current = true;
  }, [villagePeopleCount, questionDetails]);

  useEffect(() => {
    loadImageDrafts();
  }, []);

  const loadImageDrafts = async () => {
    try {
      const existingDraftsString = await AsyncStorage.getItem(
        'TABLE_IMAGE_DRAFTS',
      );

      if (!existingDraftsString) {
        return;
      }

      const existingDrafts = JSON.parse(existingDraftsString);

      if (!existingDrafts || typeof existingDrafts !== 'object') {
        return;
      }

      // Convert saved drafts into tableImages structure
      const restoredImages: Record<string, any> = {};

      Object.keys(existingDrafts).forEach(key => {
        const draft = existingDrafts[key];

        restoredImages[key] = {
          before: draft.before || [],
          after: draft.after || [],
        };
      });

      setTableImages(prev => ({
        ...prev,
        ...restoredImages,
      }));

      console.log('Image drafts restored:', restoredImages);
    } catch (error) {
      console.log('Load draft error:', error);
    }
  };

  const saveDraft = async (imageTabKey: string) => {
    try {
      const images = tableImages[imageTabKey];

      if (!images) {
        Alert.alert('Draft', 'No images found to save.');
        return;
      }

      const draftData = {
        imageTabKey,
        before: images.before || [],
        after: images.after || [],
        savedAt: new Date().toISOString(),
      };

      // Get existing drafts
      const existingDraftsString = await AsyncStorage.getItem(
        'TABLE_IMAGE_DRAFTS',
      );

      let existingDrafts: Record<string, any> = {};

      if (existingDraftsString) {
        try {
          existingDrafts = JSON.parse(existingDraftsString);
        } catch (error) {
          console.log('Draft parse error:', error);
          existingDrafts = {};
        }
      }

      // Save / update this particular table cell
      existingDrafts[imageTabKey] = draftData;

      await AsyncStorage.setItem(
        'TABLE_IMAGE_DRAFTS',
        JSON.stringify(existingDrafts),
      );

      Alert.alert(
        'Draft Saved',
        'Before आणि After फोटो local storage मध्ये save झाले.',
      );

      console.log('Draft saved:', draftData);
    } catch (error) {
      console.log('Save draft error:', error);

      Alert.alert('Error', 'Draft save करण्यात अडचण आली.');
    }
  };

  // const generateImagesPDF = async (imageTabKey: string) => {
  //   try {
  //     const images = tableImages[imageTabKey];

  //     if (!images) {
  //       Alert.alert('PDF', 'Please select all images first.');
  //       return;
  //     }

  //     // Must have exactly 3 Before + 3 After
  //     if (images.before.length !== 3 || images.after.length !== 3) {
  //       Alert.alert('PDF', 'Please select 3 Before and 3 After images.');
  //       return;
  //     }

  //     const allImages = [...images.before, ...images.after];

  //     const imageHtml: string[] = [];

  //     for (const image of allImages) {
  //       const imagePath = image.uri.replace('file://', '');

  //       const base64 = await RNFS.readFile(imagePath, 'base64');

  //       imageHtml.push(`
  //       <div class="image-container">
  //         <img src="data:image/jpeg;base64,${base64}" />
  //       </div>
  //     `);
  //     }

  //     const html = `
  //     <html>
  //       <head>
  //         <style>
  //           @page {
  //             margin: 20px;
  //           }

  //           html, body {
  //             margin: 0;
  //             padding: 0;
  //             width: 100%;
  //             height: 100%;
  //           }

  //           .image-container {
  //             width: 100%;
  //             height: 100%;
  //             page-break-after: always;
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //           }

  //           img {
  //             max-width: 100%;
  //             max-height: 100%;
  //             object-fit: contain;
  //           }

  //           .image-container:last-child {
  //             page-break-after: auto;
  //           }
  //         </style>
  //       </head>

  //       <body>
  //         ${imageHtml.join('')}
  //       </body>
  //     </html>
  //   `;

  //     const pdf = await generatePDF({
  //       html,
  //       fileName: `MSPRA_${Date.now()}`,
  //       directory: 'Download',
  //     });


  //     console.log('PDF generated:', pdf.filePath);

  //     if (pdf.filePath) {
  //       // Automatically open PDF preview
  //       await FileViewer.open(pdf.filePath, {
  //         showOpenWithDialog: true,
  //         showAppsSuggestions: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('PDF generation/open error:', error);

  //     Alert.alert('PDF Error', 'Unable to create or open PDF.');
  //   }
  // };

  const generateImagesPDF = async (
  imageTabKey: string,
  questionId: number,
  elementMstId: string,
  tableMstId: number,
  elementNo: string,
) => {
  try {
    const images = tableImages[imageTabKey];

    if (!images) {
      Alert.alert('PDF', 'Please select all images first.');
      return null;
    }

    if (
      images.before.length !== 3 ||
      images.after.length !== 3
    ) {
      Alert.alert(
        'PDF',
        'Please select 3 Before and 3 After images.',
      );
      return null;
    }

    const allImages = [
      ...images.before,
      ...images.after,
    ];

    const imageHtml: string[] = [];

    for (const image of allImages) {
      if (!image?.uri) {
        continue;
      }

      let imagePath = image.uri;

      if (imagePath.startsWith('file://')) {
        imagePath = imagePath.replace('file://', '');
      }

      const base64 = await RNFS.readFile(
        imagePath,
        'base64',
      );

      imageHtml.push(`
        <div class="image-container">
          <img src="data:image/jpeg;base64,${base64}" />
        </div>
      `);
    }

    if (imageHtml.length !== 6) {
      Alert.alert(
        'PDF',
        'Unable to read all 6 images.',
      );
      return null;
    }

    const html = `
      <html>
        <head>
          <style>
            @page {
              margin: 20px;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }

            .image-container {
              width: 100%;
              height: 100%;
              page-break-after: always;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .image-container:last-child {
              page-break-after: auto;
            }
          </style>
        </head>

        <body>
          ${imageHtml.join('')}
        </body>
      </html>
    `;

    const pdf = await generatePDF({
      html,
      fileName: `MSPRA_${Date.now()}`,
      directory: 'Download',
    });

    console.log('📄 PDF generated:', pdf);

    if (!pdf?.filePath) {
      throw new Error('PDF path not generated');
    }


    let pdfUri = pdf.filePath;

    if (
      pdfUri &&
      !pdfUri.startsWith('file://') &&
      !pdfUri.startsWith('content://')
    ) {
      pdfUri = `file://${pdfUri}`;
    }

    const pdfName =
      `MSPRA_${questionId}_${elementMstId}_${tableMstId}.pdf`;

    let pdfPathForSize = pdfUri;

    if (pdfPathForSize.startsWith('file://')) {
      pdfPathForSize =
        pdfPathForSize.replace('file://', '');
    }

    let pdfSize = 0;

    try {
      const stat = await RNFS.stat(
        pdfPathForSize,
      );

      pdfSize = Number(stat.size || 0);
    } catch (sizeError) {
      console.log(
        '⚠️ Unable to get PDF size:',
        sizeError,
      );
    }

    const pdfFile = {
      uri: pdfUri,
      path: pdfPathForSize,
      name: pdfName,
      fileName: pdfName,
      type: 'application/pdf',
      size: pdfSize,
      fileSize: pdfSize,
      FormNoVal: 7,
      ElementMasterId: elementMstId,
      QuestionId: questionId,
      TableMstID: tableMstId,
      IsFromMobileApp: 1,
    };

    const elementNo = '211'
    console.log(
      '📄 PDF file stored in answers:',
      pdfFile,
    );

    setAnswers(prev => ({
      ...prev,

      [elementNo]: {
        ...(typeof prev[elementNo] === 'object'
          ? prev[elementNo]
          : {}),
        files: [pdfFile],
        FormNoVal: 7,
        ElementMasterId: elementMstId,
        QuestionId: questionId,
        TableMstID: tableMstId,
      },
    }));

    await FileViewer.open(pdf.filePath, {
      showOpenWithDialog: true,
      showAppsSuggestions: true,
    });

    return pdfFile;

  } catch (error) {
    console.error(
      'PDF generation/open error:',
      error,
    );

    Alert.alert(
      'PDF Error',
      'Unable to create or open PDF.',
    );

    return null;
  }
};


  const getImageTabKey = (
    questionId: string,
    tableMstId: string | number,
    rowIndex: number,
    colIndex: number,
  ) => {
    return `${questionId}_${tableMstId}_${rowIndex}_${colIndex}`;
  };

  const openImagePreview = (image: any) => {
    if (!image?.uri) {
      console.log('Invalid preview image:', image);
      return;
    }

    let imageUri = image.uri;

    // Android local path
    if (imageUri.startsWith('/data/') || imageUri.startsWith('/storage/')) {
      imageUri = `file://${imageUri}`;
    }

    console.log('Opening preview:', imageUri);

    setPreviewImage(imageUri);
  };

  const handleImageTabChange = (key: string, tab: 'before' | 'after') => {
    setActiveImageTab(prev => ({
      ...prev,
      [key]: tab,
    }));
  };

  
  const getCurrentLocation = (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      let resolved = false;

      const success = (position: GeoPosition) => {
        if (resolved) return;

        resolved = true;

        console.log('Location received:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        resolve(position);
      };

      const failure = (error: any) => {
        console.log('High accuracy location error:', error);

        // Fast fallback
        Geolocation.getCurrentPosition(
          success,
          fallbackError => {
            console.log('Low accuracy location error:', fallbackError);

            if (!resolved) {
              resolved = true;
              reject(fallbackError);
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 120000,
          },
        );
      };

      // First try high accuracy
      Geolocation.getCurrentPosition(success, failure, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      });
    });
  };

  
  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'MSPRA-Mobile-App',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Unable to get address');
      }

      const data = await response.json();

      console.log('Reverse geocode:', data);

      const address = data.address || {};

      const houseNumber = address.house_number || '';
      const road = address.road || address.pedestrian || address.street || '';

      const locality =
        address.suburb || address.neighbourhood || address.locality || '';

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        '';

      const state = address.state || '';

      const postcode = address.postcode || '';

      const country = address.country || '';

      const fullAddress = [
        houseNumber,
        road,
        locality,
        city,
        state,
        postcode,
        country,
      ]
        .filter(Boolean)
        .join(', ');

      return {
        fullAddress,
        city,
        state,
        country,
        postcode,
      };
    } catch (error) {
      console.log('Reverse geocoding error:', error);

      return {
        fullAddress: '',
        city: '',
        state: '',
        country: '',
        postcode: '',
      };
    }
  };

  const processImageWithLocation = async (
    image: Asset,
    elementNo: string,
    questionId: number,
    elementMstId: string,
    tableMstId: number = 0,
  ): Promise<any> => {
    try {
      if (!image.uri) {
        Alert.alert('Error', 'Invalid image');
        return null;
      }

      setIsProcessingImage(true);
      //setProcessingMessage('Loading ...............');

      const position = await getCurrentLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      const addressData = await getAddressFromCoordinates(latitude, longitude);

      console.log('Address:', addressData);
      const now = new Date();

      const dateTime = now.toLocaleString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const locationTitle = [
        addressData.city,
        addressData.state,
        addressData.country,
      ]
        .filter(Boolean)
        .join(', ');

      const geoText =
        `${locationTitle || 'Location'}\n` +
        `${addressData.fullAddress || 'Address unavailable'}\n` +
        `Lat ${latitude.toFixed(6)}°  Long ${longitude.toFixed(6)}°\n` +
        `${dateTime} GMT +05:30`;

      console.log('Geo text:', geoText);

      //setProcessingMessage('Adding location to image...');

      const markedImage = await Marker.markText({
        backgroundImage: {
          src: image.uri,
          scale: 1,
        },

        watermarkTexts: [
          {
            text: geoText,

            position: {
              position: Position.bottomLeft,
              X: 25,
              Y: 25,
            },

            style: {
              color: '#FFFFFF',

              fontSize: 24,

              bold: true,

              textAlign: 'left',

              // BLACK GPS CAMERA CARD
              textBackgroundStyle: {
                color: '#DD000000',

                paddingX: 22,
                paddingY: 18,

                cornerRadius: {
                  topLeft: {
                    x: 20,
                    y: 20,
                  },

                  topRight: {
                    x: 20,
                    y: 20,
                  },

                  bottomLeft: {
                    x: 20,
                    y: 20,
                  },

                  bottomRight: {
                    x: 20,
                    y: 20,
                  },
                },
              },
            },
          },
        ],

        filename: `geotag_${Date.now()}`,

        saveFormat: ImageFormat.jpg,

        quality: 90,
      });

      console.log('Marked image:', markedImage);

      if (!markedImage?.uri) {
        throw new Error('Unable to generate marked image');
      }
      let processedUri = markedImage.uri;

      if (
        processedUri &&
        !processedUri.startsWith('file://') &&
        (processedUri.startsWith('/data/') ||
          processedUri.startsWith('/storage/'))
      ) {
        processedUri = `file://${processedUri}`;
      }

      console.log('Final image URI:', processedUri);

      const fileName = image.fileName || `geotagged_${Date.now()}.jpg`;
      const processedImage = {
        ...image,
        // uri: markedImage.uri,
        uri: processedUri,
        fileName,
        type: 'image/jpeg',
        latitude,
        longitude,
        accuracy,
        address: addressData.fullAddress,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
      };

      const geoTaggedFile = {
        //uri: markedImage.uri,
        uri: processedUri,
        name: fileName,
        type: 'image/jpeg',
        FileSize: image.fileSize || 0,
        FormNoVal: 7,
        ElementMasterId: elementMstId,
        QuestionId: questionId,
        TableMstID: tableMstId,
        Latitude: latitude,
        Longitude: longitude,
        Accuracy: accuracy,
        Address: addressData.fullAddress,
        City: addressData.city,
        State: addressData.state,
        Country: addressData.country,
      };

      setAnswers(prev => ({
        ...prev,

        [elementNo]: {
          ...(typeof prev[elementNo] === 'object' ? prev[elementNo] : {}),

          files: [geoTaggedFile],
          FormNoVal: 7,
          ElementMasterId: elementMstId,
          QuestionId: questionId,
          TableMstID: tableMstId,
        },
      }));

      console.log('Processed image:', processedImage);

      return processedImage;
    } catch (error: any) {
      console.log('Geo-tagging error:', error);

      Alert.alert('Error', error?.message || 'Unable to process image.');

      return null;
    } finally {
      setIsProcessingImage(false);
      //setProcessingMessage('');
    }
  };

  const handleChooseImage = async (
    imageTabKey: string,
    tab: 'before' | 'after',
    tableMstId: number,
    elementMstId:String
  ) => {
    try {
      Keyboard.dismiss();
      const existingImages = tableImages[imageTabKey]?.[tab] || [];

      if (existingImages.length >= 3) {
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];

      if (!image.uri) {
        Alert.alert('Error', 'Invalid image');
        return;
      }

      const processedImage = await processImageWithLocation(
        image,
        imageTabKey,
        questionId,
        String(elementMstId),
        tableMstId,
      );

      if (!processedImage?.uri) {
        return;
      }

      setTableImages(prev => {
        const current = prev[imageTabKey] || {
          before: [],
          after: [],
        };

        const currentTabImages = current[tab] || [];

        if (currentTabImages.length >= 3) {
          return prev;
        }

        return {
          ...prev,
          [imageTabKey]: {
            ...current,
            [tab]: [...currentTabImages, processedImage],
          },
        };
      });
    } catch (error: any) {
      console.log('Image capture error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Unable to capture and geotag image.',
      );
    }
  };

  const fetchSteps = async (userId: string, bearerToken: string) => {
    setLoading(true);
    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1QuestionMaster`;

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
            formid: '7',
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      console.log('API Response:', data);

      if (data && data.responseCode === 2000 && data.items) {
        setQuestions(data.items);

        const webSubmitted = data.items?.some(
          (item: { isfromfinalsubmitflag: any }) =>
            Number(item.isfromfinalsubmitflag) === 1,
        );

        setIsWebFinalSubmitted(webSubmitted);
        // ✅ store full object
        const stepsArray: Step[] = data.items.map((item: any) => ({
          srNo: item.srNo,
          questionid: item.questionid,
          anssum: Number(item.anssum) || 0,
        }));

        setSteps(stepsArray);

        if (stepsArray.length > 0) {
          setActiveStepIndex(0);
          fetchQuestionById(stepsArray[0].questionid, userId, bearerToken);
        }
      } else {
        console.warn('GetForm1QuestionMaster returned', raw);
      }
    } catch (err) {
      console.error('Error fetchSteps:', err);
    } finally {
      setLoading(false);
    }
  };

  //--------------GetForm1QuestionByID----------
  const fetchQuestionById = async (
    questionId: number,
    userId: string,
    bearerToken: string,
  ) => {
    setLoadingDetails(true);

    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1QuestionByID`;

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
            quesionid: String(questionId),
            userid: userId,
            formid: '7',
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);
      // console.log('API Response:', data);

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
          const rdformtextboxsubmitval = it.rdformtextboxsubmitval;
          const rdDownloadAhvalNamuna = it.rdDownloadAhvalNamuna;

          if (!updatedAnswers[key]) {
            let initialValue: any = null;

            if (it.rdformelementid === 3) initialValue = [];
            else if (it.rdformelementid === 4) initialValue = null;
            // else initialValue = it.rdformtextboxsubmitval ?? "";
            else initialValue = '';
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
              prev && typeof prev === 'object'
                ? { ...prev, elementMstId, tableMstId }
                : { value: prev, elementMstId, tableMstId };
          }

          const masterId = String(elementMstId ?? '');
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
                  String(tableMstId ?? '0'),
                );
              }
              break;

            case 2: // Dropdown
              fetchDropdownValues(
                questionId,
                masterId,
                userId,
                bearerToken,
                String(tableMstId ?? '0'),
                mapKey,
              );
              break;

            case 3: // Checkbox
              if (!checkboxOptionsMap[mapKey]) {
                fetchCheckboxValues(
                  questionId,
                  masterId,
                  userId,
                  bearerToken,
                  String(tableMstId ?? '0'),
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
                  String(tableMstId ?? '0'),
                );
              }
              break;

            case 5: {
              // Collect table rows (we will group by questionId + rdformelementno)
              tableItems.push(it);

              // If this table cell is a dropdown (rdtableelementid === 2),
              try {
                const elementMstIdStr = String(it.elementmstid ?? '');
                const tableMstIdStr = String(it.tablemstid ?? '0');
                const ddMapKey = `${questionId}_${elementMstIdStr}`;

                if (it.rdtableelementid === 1) {
                  const elementKey = `${questionId}_${elementMstIdStr}_${tableMstIdStr}`;

                  // avoid duplicate API calls
                  if (!answers[elementKey]?.value) {
                    fetchTextBoxValues(
                      questionId,
                      elementMstIdStr,
                      userId,
                      bearerToken,
                      tableMstIdStr,
                    );
                  }
                }

                // only call fetch if options not already present
                if (
                  it.rdtableelementid === 2 &&
                  !dropdownOptionsMap[ddMapKey]
                ) {
                  // call fetchDropdownValues (it will set dropdownOptionsMap[ddMapKey])
                  fetchDropdownValues(
                    questionId,
                    elementMstIdStr,
                    userId,
                    bearerToken,
                    tableMstIdStr,
                    ddMapKey,
                  );
                }
                if (it.rdtableelementid === 4) {
                  fetchUploadedDocs1(
                    questionId,
                    elementMstIdStr,
                    userId,
                    bearerToken,
                    tableMstIdStr,
                  );
                }
                if (it.rdtableelementid === 7) {
                  fetchTableDateValues(
                    questionId,
                    elementMstIdStr,
                    userId,
                    bearerToken,
                    tableMstIdStr,
                  );
                }
              } catch (e) {
                console.warn('table dropdown fetch error', e);
              }

              break;
            }
            default:
              console.warn('Unknown element type:', it.rdformelementid);
          }
        }
        // ---- GROUP TABLES BY rdformelementno ----
        const groupedTables: Record<string, any[]> = {};
        tableItems.forEach(it => {
          const groupKey = `${questionId}_${it.rdformelementno}`;
          if (!groupedTables[groupKey]) groupedTables[groupKey] = [];
          groupedTables[groupKey].push(it);
        });

        // Build table matrices per group
        const newTableDataMap: Record<string, any[][]> = {};

        Object.keys(groupedTables).forEach(groupKey => {
          const items = groupedTables[groupKey];

          // Determine table size
          const totalRows = Math.max(
            ...items.map((x: any) => x.rdtotaltablerowsNum ?? 1),
          );
          const totalCols = Math.max(
            ...items.map((x: any) => x.rdtotaltablecolumnsnum ?? 1),
          );

          const matrix: any[][] = Array.from({ length: totalRows }, () =>
            Array.from({ length: totalCols }, () => ({
              value: '',
              type: 'label',
            })),
          );

          items.forEach((x: any) => {
            const r = (x.rdtablerowsnum ?? 1) - 1;
            const c = (x.rdtablecolumnsnum ?? 1) - 1;
            if (r >= 0 && r < totalRows && c >= 0 && c < totalCols) {
              matrix[r][c] = {
                value: x.rdtablefieldname ?? '',
                type:
                  x.rdtableelementid === 1
                    ? 'textbox'
                    : x.rdtableelementid === 2
                    ? 'dropdown'
                    : x.rdtableelementid === 4
                    ? 'file'
                    : x.rdtableelementid === 7
                    ? 'date'
                    : 'label',

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
        setTableDataMap(prev => ({ ...prev, ...newTableDataMap }));

        // Save answers as before
        setAnswers(updatedAnswers);
      } else {
        setQuestionDetails([]);
        console.warn('Invalid response:', raw);
      }
    } catch (err) {
      console.error('Error fetchQuestionById:', err);
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
        Array.from({ length: cols }, () => ''),
      );

      meta.metaList.forEach((item: any) => {
        const r = item.visibleRows - 1;
        const c = item.visibleColumns - 1;
        if (r >= 0 && c >= 0) {
          matrix[r][c] = item.tableFieldName || '';
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

  useEffect(() => {
    if (steps && steps.length > 0) {
      const prefilledIndices = steps
        .map((step: Step, index: number) => (step.anssum > 0 ? index : null))
        .filter((index): index is number => index !== null);

      setSubmittedSteps(prev =>
        Array.from(new Set([...prev, ...prefilledIndices])),
      );
    }
  }, [steps]);

  const fetchDropdownValues = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
    mapKey: string,
  ) => {
    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1DropDownValues`;

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
            questionid: String(questionId),
            formno: '7',
            elementmstid: String(elementMstId),
            userid: userId,
            tablemstid: String(tableMstId),
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);
      console.log('API Response:', data);

      let items: any[] = [];

      if (data?.responseCode === 2000 && Array.isArray(data.items)) {
        //  items = data.items.map((it: any) => ({
        items = data.items.map((it: IDropdownItem) => ({
          label: it.ddtext,
          value: it.ddid, // 🔑 primitive
          FormNoVal: it.formno,
          QuestionId: it.questionid,
          ElementMasterId: it.elementmstid,
          TableMstID: tableMstId,
          ddval: it.ddval, // 🔑 for prefill
        }));
      }

      setDropdownOptionsMap(prev => {
        const updated = { ...prev, [mapKey]: items };

        // Prefill selected value immediately
        const selectedItem = items.find(
          it => Number(it.value) === Number(it.ddval),
        );

        if (selectedItem) {
          setAnswers(prevAns => ({
            ...prevAns,
            [mapKey]: {
              ...(prevAns[mapKey] || {}),
              value: Number(selectedItem.value), // ✅ FORCE NUMBER
              FormNoVal: 7,
              QuestionId: questionId,
              ElementMasterId: elementMstId,
              TableMstID: tableMstId ?? 0,
            },
          }));
        }

        return updated;
      });

      console.log('🟦 DROPDOWN OPTIONS', { mapKey, items });
    } catch (e) {
      console.error('❌ Dropdown fetch error:', e);
    }
  };

  const fetchDropdownDependency = async (
    elementMstId: string,
    questionId: number,
    selectedDdValue: string,
    token: string,
  ) => {
    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1DropDownDependElement`;
      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            elementmstid: String(elementMstId),
            questionid: String(questionId),
            selectedddvalue: String(selectedDdValue),
            formno: '7',
          }),
        },
      );

      const data = await res.json();

      if (data?.responseCode !== 2000 || !Array.isArray(data.items)) {
        console.warn('⚠️ Invalid dependency response');
        return;
      }

      // ------------------ BUILD DISABLE MAP ------------------
      const disabledMap: Record<string, boolean> = {};
      data.items.forEach((dep: any) => {
        const dependentElementMstId = String(dep.dependantelementmasterid);
        disabledMap[dependentElementMstId] = dep.showelementflag !== 1;
      });

      disabledElementsRef.current = {
        ...disabledElementsRef.current,
        ...disabledMap,
      };

      setDisabledElements(prev => ({
        ...prev,
        ...disabledMap,
      }));

      setAnswers(prev => ({
        ...prev,
        [`disabled_${questionId}`]: {
          ...(prev[`disabled_${questionId}`] || {}),
          ...disabledMap,
        },
      }));
    } catch (error) {
      console.error('❌ fetchDropdownDependency error:', error);
    }
  };

  const fetchCheckboxValues = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
  ) => {
    const mapKey = `${questionId}_${elementMstId}`;

    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1CheckboxValues`;

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
            questionid: String(questionId),
            formno: '7',
            elementmstid: String(elementMstId),
            userid: userId,
            tableMstId: tableMstId,
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);
      console.log('📥 Checkbox API raw data:', data);

      if (!data || data.responseCode !== 2000 || !Array.isArray(data.items))
        return;

      const selectedChkIds: number[] = [];
      const items = data.items.map((it: any) => {
        if (Number(it.chkval) === 1) selectedChkIds.push(Number(it.chkid));
        return {
          label: it.chktext,
          value: Number(it.chkid),
        };
      });

      // Save checkbox options
      setCheckboxOptionsMap(prev => ({ ...prev, [mapKey]: items }));

      // Prefill answers (keyed by mapKey)
      setAnswers(prev => ({
        ...prev,
        [mapKey]: {
          ...(prev[mapKey] || {}),
          value: selectedChkIds, // selected checkbox IDs
          FormNoVal: 7,
          ElementMasterId: elementMstId,
          QuestionId: questionId,
          TableMstID: tableMstId ?? 0,
          disabled: isDisabled(Number(elementMstId)),
        },
      }));

      //console.log('📌 Answers after prefill (for revisit):', selectedChkIds);
    } catch (err) {
      console.error('❌ fetchCheckboxValues error:', err);
    }
  };

  const fetchTextBoxValues = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
  ) => {
    const mapKey = `${questionId}_${elementMstId}_${tableMstId}`;

    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1TextBoxValues`;

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
            questionid: String(questionId),
            formno: '7',
            elementmstid: String(elementMstId),
            userid: userId,
            tablemstid: String(tableMstId),
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      if (!data || data.responseCode !== 2000 || !Array.isArray(data.items)) {
        console.log('⚠️ No validationType found for textbox');
        return;
      }

      const apiItem = data.items[0];
      const validationType = apiItem.validationtype ?? null;
      //const textboxValue = apiItem.textboxval ?? "";

      const textboxValue =
        apiItem.textboxval === null ||
        apiItem.textboxval === undefined ||
        apiItem.textboxval === 'null' ||
        apiItem.textboxval === 0
          ? ''
          : String(apiItem.textboxval);
      setTextboxInfoMap(prev => ({
        ...prev,
        [mapKey]: { validationType },
      }));
      setAnswers(prev => {
        const updated = { ...prev };

        const elementKey = `${questionId}_${elementMstId}_${tableMstId}`;

        updated[elementKey] = {
          ...(updated[elementKey] ?? {}),
          value: textboxValue,
          validationType: validationType,
          FormNoVal: 7,
          QuestionId: questionId,
          ElementMasterId: elementMstId,
          TableMstID: tableMstId,
        };

        //  console.log('📌 Updated answers state:', updated);
        return updated;
      });
    } catch (err) {
      console.log('❌ TextBox fetch error:', err);
    }
  };

  const fetchTableDateValues = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
  ) => {
    try {

      const url = `${API_BASE_URL}/Form1QuestionMaster/GetFormTableValues`;

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
            quesionid: String(questionId),
            userid: userId,
            formid: '7',
            elementmstid: String(elementMstId),
          }),
        },
      );

      const raw = await res.text();
      const data = safeJsonParse(raw);

      // console.log('📥 Raw Table Date API:', data);

      if (!data || data.responseCode !== 2000 || !Array.isArray(data.items)) {
        return;
      }

      setAnswers(prev => {
        const updated = { ...prev };

        data.items.forEach((item: any) => {
          // Skip header row
          if (item.rdtbltablerowsnum <= 1) return;

          // Only Date column (column 2)
          if (item.rdtbltablecolumnsnum !== 2) return;

          const rowIndex = item.rdtbltablerowsnum - 2; // API row 2 => UI row 0
          const colIndex = item.rdtbltablecolumnsnum - 1; // API col 2 => UI col 1

          const dateKey = `${questionId}_${elementMstId}_${tableMstId}_${rowIndex}_${colIndex}`;
          updated[dateKey] = {
            ...(updated[dateKey] ?? {}),
            value:
              item.rdtblelementval == null ? '' : String(item.rdtblelementval),
            FormNoVal: 7,
            QuestionId: questionId,
            ElementMasterId: elementMstId,
            TableMstID: tableMstId,
            //type: 'date',
            isEdited: false,
          };
        });

        return updated;
      });
    } catch (err) {
      console.log('❌ Table Date fetch error:', err);
    }
  };

  const downloadTemplate = async (
    downloadFileName: string,
    fileBase64: string,
  ) => {
    try {
      // Extract file name
      const fileName = downloadFileName.split('/').pop() || 'download.xlsx';

      // Save location
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      console.log('Saving to:', filePath);

      // Write Base64 to file
      await RNFS.writeFile(filePath, fileBase64, 'base64');

      Alert.alert('Success', 'File downloaded successfully');

      // Open Excel
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
      });
    } catch (error) {
      console.log('Download Error:', error);
      Alert.alert('Error', 'Unable to save or open file');
    }
  };

  const getTableFiles = (
    questionId: number,
    cell: any,
    rowIndex: number,
    colIndex: number,
  ) => {
    const tableKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;
    const answerKey = `${questionId}_${cell.tableMstId}_${rowIndex}_${colIndex}`;

    return answers[answerKey]?.files ?? tableUploadedDocsMap[tableKey] ?? [];
  };

  type UploadedFile = {
    dockey: string;
    formno: number;
    questionid: number;
    elementmstid: number;
    tableMstID: number;
    name: string; // derived from dockey
  };

  const fetchUploadedDocs = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
  ) => {
    const mapKey = `${questionId}_${elementMstId}`;

    try {
      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1UploadedDocVal`;

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
            questionid: String(questionId),
            formno: '7',
            elementmstid: String(elementMstId),
            userid: userId,
            tablemstid: String(tableMstId),
          }),
        },
      );

      const raw = await res.text();
      console.log('📥 Raw UploadedDocs response:', raw);

      const data = JSON.parse(raw);

      console.log('RESPONSE', data);

      const uploadedFiles: UploadedFile[] =
        data?.responseCode === 2000 && Array.isArray(data.items)
          ? data.items.map((f: any) => ({
              ...f,
              name: f.dockey ? f.dockey.split('/').pop() : 'File Chosen',
              url: f.fileUrl,
            }))
          : [];

      console.log('🟢 uploadedFiles mapped:', uploadedFiles);
      setUploadedDocsMap(prev => ({
        ...prev,
        [mapKey]: uploadedFiles,
      }));

      // 2️⃣ Hydrate answers for revisit
      questionDetails.forEach(it => {
        if (String(it.elementmstid) === String(elementMstId)) {
          const elementNoKey = String(it.rdformelementno);

          setAnswers(prev => ({
            ...prev,
            [elementNoKey]: {
              ...prev[elementNoKey],
              files: uploadedFiles,
            },
          }));
        }
      });
    } catch (err) {
      console.error('❌ fetchUploadedDocs error:', err);
      setUploadedDocsMap(prev => ({ ...prev, [mapKey]: [] }));
    }
  };

  const fetchUploadedDocs1 = async (
    questionId: number,
    elementMstId: string,
    userId: string,
    bearerToken: string,
    tableMstId: string,
  ) => {
    const mapKey = `${questionId}_${elementMstId}`;

    try {
      const url = `${API_BASE_URL}/Form1QuestionMaster/GetForm1UploadedDocVal`;

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
            questionid: String(questionId),
            formno: '7',
            elementmstid: String(elementMstId),
            userid: userId,
            tablemstid: String(tableMstId),
          }),
        },
      );

      const raw = await res.text();
      const data = JSON.parse(raw);

      const uploadedFiles: UploadedFile[] =
        data?.responseCode === 2000 && Array.isArray(data.items)
          ? data.items.map((f: any) => ({
              ...f,
              name: f.dockey ? f.dockey.split('/').pop() : 'File Chosen',
              url: f.fileUrl,
            }))
          : [];

      // 1️⃣ Save to uploadedDocsMap for UI
      setTableUploadedDocsMap(prev => {
        const updated = { ...prev };

        uploadedFiles.forEach(file => {
          const key = `${questionId}_${elementMstId}_${file.tableMstID}`;

          updated[key] = [file];
        });
        return updated;
      });
      // 2️⃣ Hydrate answers for revisit
      questionDetails.forEach(it => {
        if (String(it.elementmstid) === String(elementMstId)) {
          const elementNoKey = String(it.rdformelementno);

          setAnswers(prev => ({
            ...prev,
            [elementNoKey]: {
              ...prev[elementNoKey],
              files: uploadedFiles,
            },
          }));
        }
      });
    } catch (err) {
      console.error('❌ fetchUploadedDocs error:', err);
      setUploadedDocsMap1(prev => ({ ...prev, [mapKey]: [] }));
    }
  };

  const deleteTableRowAPI = async (
    textboxIds: string[],
    elementMstId: string,
    documentMstId: string,
    questrionId: number,
  ) => {
    try {
      setLoading;
      const payload = {
        userid: String(userID),
        textboxids: [textboxIds.join(',')],
        ElementMasterId: String(elementMstId),
        QuestionId: String(questrionId),
        FormNoVal: '7',
        documentMstId: String(documentMstId),
      };

      console.log('Delete Payload:', payload);

      const url = `${API_BASE_URL}/Form1QuestionMaster/DeleteTableRows`;

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token ?? ''}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      console.log('Delete API Status:', response.status);
      console.log('Delete API Response:', result);

      if (response.ok && result.responseCode === 2000) {
        //Alert.alert('Success', result.responseMessage);
        return true;
      }

      Alert.alert(
        'Error',
        result.responseMessage || 'Unable to delete record.',
      );
      return false;
    } catch (error) {
      console.log('Delete API Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
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
          QuestionId: meta.QuestionId,
          TableMstID: meta.TableMstID ?? 0,
          validationType: meta.validationType,
        },
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
    colIndex: number,
  ) => {
    setAnswers(prev => {
      const updated = { ...prev };

      const meta = prev[elementKey] ?? {};

      const apiKey = `${questionId}_${elementMstId}_${tableMstId ?? 0}`;

      updated[elementKey] = {
        ...meta,
        value: text,
        FormNoVal: meta.FormNoVal ?? 7,
        ElementMasterId: elementMstId,
        QuestionId: questionId,
        TableMstID: tableMstId ?? 0,
        RowIndex: rowIndex,
        ColumnIndex: colIndex,
        validationType: meta.validationType,
      };

      if (apiKey !== elementKey) {
        delete updated[apiKey];
      }

      return updated;
    });
  };
  const handleDropdownChange = (elementNoKey: string, selected: any) => {
    if (!selected || selected.value === null || selected.value === undefined) {
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [elementNoKey]: {
        ...(prev[elementNoKey] || {}),
        value: Number(selected.value), // 🔥 NUMBER ONLY
        FormNoVal: selected.FormNoVal,
        QuestionId: selected.QuestionId,
        ElementMasterId: selected.ElementMasterId,
        TableMstID: selected.TableMstID ?? 0,
      },
    }));
  };

  const prepareDropdownPayload = (questionId: number) => {
    const payload: any[] = [];

    questionDetails.forEach(q => {
      if (q.rdformelementid !== 2) return;
      const mapKey = `${q.rdformquestionid}_${q.elementmstid}`;
      const ans = answers[mapKey];

      if (!ans || ans.value === null || ans.value === undefined) return;

      const selectedValue = Array.isArray(ans.value) ? ans.value[0] : ans.value;

      if (
        selectedValue === '' ||
        selectedValue === null ||
        selectedValue === undefined
      ) {
        return;
      }

      payload.push({
        FormNoVal: 7,
        QuestionId: q.rdformquestionid,
        ElementMasterId: String(q.elementmstid),
        dropdownValue: String(Number(selectedValue)), // 🔥 force number → string
        IsFromMobileApp: 1,
        TableMstID: q.tablemstid ?? 0,
      });
    });

    console.log('🧪 dropdownPayload:', payload);
    return payload;
  };

  const prepareTextboxPayload = (questionId: number): any[] => {
    const textboxMap = new Map<string, any>();

    Object.entries(answers).forEach(([answerKey, ans]: [string, any]) => {
      if (!ans || typeof ans !== 'object') return;

      const value = String(ans?.value ?? '').trim();
      const ansQuestionId = Number(ans.QuestionId);
      const elementMasterId = Number(ans.ElementMasterId);
      const tableMstId = Number(ans.TableMstID ?? 0);

      // Skip invalid, empty and date values
      if (
        value === '' ||
        ansQuestionId !== Number(questionId) ||
        /^\d{2}-\d{2}-\d{4}$/.test(value)
      ) {
        return;
      }

      const uniqueKey = `${ansQuestionId}_${elementMasterId}_${tableMstId}`;

      const keyParts = answerKey.split('_');
      const isRowSpecificKey = keyParts.length >= 5;

      const existing = textboxMap.get(uniqueKey);

      if (!existing || isRowSpecificKey) {
        textboxMap.set(uniqueKey, {
          FormNoVal: 7,
          ElementMasterId: ans.ElementMasterId,
          QuestionId: ans.QuestionId,
          textboxValue: value,
          IsFromMobileApp: 1,
          TableMstID: ans.TableMstID ?? 0,

          // Temporary internal property for priority handling
          __isRowSpecific: isRowSpecificKey,
        });
      }
    });

    const payload = Array.from(textboxMap.values()).map(
      ({ __isRowSpecific, ...item }) => item,
    );

    console.log('🧪 textboxPayload:', payload);

    return payload;
  };

  const prepareDatePayload = (questionId: number) => {
    const payload: any[] = [];

    Object.entries(answers).forEach(([key, ans]: any) => {
      if (!ans || ans.QuestionId !== questionId) return;

      // Date column is always column 1 (API column 2)
      const parts = key.split('_');
      const colIndex = Number(parts[4]);

      if (colIndex !== 1) return;

      if (!ans.value || String(ans.value).trim() === '') return;

      if (
        ans.QuestionId === questionId &&
        ans.isEdited === true &&
        ans.value &&
        String(ans.value).trim() !== ''
      ) {
        payload.push({
          FormNoVal: ans.FormNoVal,
          QuestionId: ans.QuestionId,
          ElementMasterId: ans.ElementMasterId,
          TableMstID: ans.TableMstID,
          dateValue: ans.value,
          IsFromMobileApp: 1,
        });
      }
    });

    return payload;
  };

  const prepareCheckboxPayload = (questionId: number) => {
    const payload: any[] = [];

    Object.keys(answers).forEach(key => {
      const ans = answers[key];

      if (
        ans &&
        typeof ans === 'object' &&
        Array.isArray(ans.value) &&
        ans.ElementMasterId &&
        ans.QuestionId === questionId
      ) {
        // TypeScript-safe conversion to string
        const uniqueValues: string[] = Array.from(
          new Set(ans.value.map((v: unknown) => String(v))),
        );

        uniqueValues.forEach((chkId: string) => {
          payload.push({
            FormNoVal: ans.FormNoVal ?? 7,
            ElementMasterId: ans.ElementMasterId,
            QuestionId: ans.QuestionId,
            ChkID: chkId,
            Value: 1, // only selected checkboxes
            IsFromMobileApp: 1,
          });
        });
      }
    });

    console.log('📥 JSON Checkbox Payload (deduplicated & typed):', payload);
    return payload;
  };

  //added for geotag image

//   const prepareDocumentPayload = async (questionId: number) => {
//   const payload: any[] = [];
//   let fileIndex = 0;

//   for (const [elementNo, val] of Object.entries(answers)) {
//     if (!val || typeof val !== 'object') continue;
//     if (Number(val.QuestionId) !== Number(questionId)) continue;

//     if (!val.files || !Array.isArray(val.files)) continue;

//     for (const file of val.files) {
//       if (!file?.uri && !file?.path) {
//         console.log(
//           '⏭ Skipping already uploaded file:',
//           file?.name,
//         );
//         continue;
//       }

//       if (
//         file.type !== 'application/pdf' &&
//         !file.name?.toLowerCase().endsWith('.pdf')
//       ) {
//         console.log('⏭ Skipping non-PDF file:', file?.name);
//         continue;
//       }

//       console.log('📄 Preparing PDF:', file);
//       const base64Content = await readFileAsBase64(file);

//       const fileName =
//         file.name ||
//         `Form7_${val.QuestionId}_${val.ElementMasterId}_${Date.now()}.pdf`;

//       const filePath =
//         `Form7/${username}/` +
//         `${val.QuestionId}_${val.ElementMasterId}_` +
//         `${val.TableMstID}_${fileName}`;

//       payload.push({
//         FormNoVal: String(7),
//         ElementMasterId: String(
//           val.ElementMasterId ?? file.ElementMasterId ?? 0,
//         ),
//         QuestionId: String(
//           val.QuestionId ?? file.QuestionId ?? 0,
//         ),

//         FileName: fileName,
//         FileType: 'application/pdf',
//         FileSize: String(
//           file.size ??
//             file.fileSize ??
//             file.FileSize ??
//             0,
//         ),

//         FileContent: base64Content,
//         FilePath: filePath,
//         _fileIndex: fileIndex++,
//         TableMstID: String(
//           val.TableMstID ?? file.TableMstID ?? 0,
//         ),

//         IsFromMobileApp: 1,
//       });
//     }
//   }

//   console.log('📄 Final PDF documentPayload:', payload);

//   return payload;
// };


  //working
  const prepareDocumentPayload = async (questionId: number) => {
    const payload: any[] = [];
    let fileIndex = 0;

    for (const [elementNo, val] of Object.entries(answers)) {
      if (!val?.files || !Array.isArray(val.files)) continue;

      if (val.QuestionId !== questionId) continue;

      for (const file of val.files) {
        // Skip already uploaded files
        if (!file?.uri && !file?.path) {
          console.log('⏭ Skipping already uploaded file:', file?.name);
          continue;
        }

        const base64Content = await readFileAsBase64(file);

        const filePath = `Form${7}/${username}/${val.QuestionId}_${
          val.ElementMasterId
        }_${val.TableMstID}_${file.name}`;

        payload.push({
          FormNoVal: String(7),
          ElementMasterId: String(val.ElementMasterId ?? 0),
          QuestionId: String(val.QuestionId ?? 0),
          FileName: file.name,
          FileType: file.type ?? 'application/pdf',
          FileSize: String(file.size ?? 0),
          FileContent: base64Content,
          FilePath: filePath,
          _fileIndex: fileIndex++, // 0,1,2,3...
          TableMstID: String(val.TableMstID ?? 0),
          IsFromMobileApp: 1,
        });
      }
    }

    console.log('🧪 documentPayload:', payload);
    return payload;
  };

  const handleCheckboxToggle = (
    mapKey: string,
    chkId: number,
    questionId: number,
    elementMstId: string,
  ) => {
    setAnswers(prev => {
      const prevVal: number[] = Array.isArray(prev[mapKey]?.value)
        ? prev[mapKey].value.map(Number)
        : [];
      let newVal: number[];
      if (prevVal.includes(chkId)) {
        newVal = prevVal.filter(v => v !== chkId);
      } else {
        newVal = [...prevVal, chkId];
      }

      return {
        ...prev,
        [mapKey]: {
          ...(prev[mapKey] || {}),
          value: newVal,
          ElementMasterId: elementMstId,
          QuestionId: questionId,
        },
      };
    });
  };

  //---------handle choose file----
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleChooseFile = async (
    elementNo: string,
    questionId: number,
    elementMstId: string,
    tableMstId: number = 0,
  ) => {
    try {
      const [file] = await pick({
        allowMultiSelection: false,
        type: [types.pdf, types.images],
      });

      if (!file) return;

      const fileName = file.name?.toLowerCase() || '';

      const isPdf = fileName.endsWith('.pdf');
      const isJpg = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');

      if (!isPdf && !isJpg) {
        Alert.alert(
          'Invalid File Type',
          'Only PDF and JPG files are allowed.',
          [{ text: 'OK' }],
        );
        return;
      }

      if (file.size && file.size > MAX_FILE_SIZE) {
        Alert.alert('File Size Error', 'Selected file must be 10 MB or less');
        return;
      }

      setAnswers(prev => ({
        ...prev,
        [elementNo]: {
          ...(typeof prev[elementNo] === 'object' ? prev[elementNo] : {}),
          files: [
            {
              ...file,
              FileSize: file.size, // ✅ STORE ORIGINAL SIZE
            },
          ],
          FormNoVal: 7,
          ElementMasterId: elementMstId,
          QuestionId: questionId,
          TableMstID: tableMstId,
        },
      }));
    } catch (err: any) {
      if (err?.message?.includes('cancelled')) return;
      Alert.alert('Error', 'File selection failed');
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
    tableDataMap: Record<string, any[][]>,
  ): string[] => {
    const errors: string[] = [];

    // Only table elements for this question
    const tableQuestions = questionDetails.filter(
      q => q.rdformquestionid === questionId && q.rdformelementid === 5,
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
          if (cell.type === 'label') return;

          // Validate value
          if (
            cell.value === null ||
            cell.value === undefined ||
            String(cell.value).trim() === ''
          ) {
            errors.push(
              `${q.rdformlablename} → Row ${rowIndex + 1}, Column ${
                colIndex + 1
              }`,
            );
          }
        });
      });
    });

    return errors;
  };

  //-------textbox validation---------

  const validateGreaterLesserTextbox = (
    questionDetails: any[],
    textboxPayload: any[],
    disabledElements: Record<string, boolean>,
    answers: any,
  ): {
    valid: boolean;
    message?: string;
    invalidKey?: string;
  } => {
    let greaterValue = 0;
    let lesserSum = 0;
    // eslint-disable-next-line no-undef-init
    let invalidKey: string | undefined = undefined;
    let greaterLabel = '';
    const lesserLabels: string[] = [];

    for (const q of questionDetails) {
      if (q.rdformelementid !== 1) continue; // ONLY textbox

      const elementMstId = Number(q.elementmstid);

      // Skip hidden/disabled textbox
      if (visibleElements?.[elementMstId] === false) continue;
      if (disabledElements?.[String(q.elementmstid)]) continue;

      const submitVal = q.rdformtextboxsubmitval;
      if (!submitVal) continue;

      const elementId = String(q.elementmstid);
      const questionId = q.rdformquestionid;

      const payloadItem = textboxPayload.find(
        t =>
          String(t.ElementMasterId) === elementId &&
          Number(t.QuestionId) === Number(questionId),
      );

      if (!payloadItem) continue;

      const numericValue = Number(payloadItem.textboxValue);
      if (isNaN(numericValue)) continue;

      // Greater textbox
      if (submitVal === 'Greater-1') {
        greaterValue = numericValue;
        greaterLabel = q.rdformlablename;
        continue;
      }

      if (submitVal === 'Lesser-1') {
        lesserSum += numericValue;

        if (q.rdformlablename && !lesserLabels.includes(q.rdformlablename)) {
          lesserLabels.push(q.rdformlablename);
        }

        const answerKey = `${questionId}_${elementMstId}_0`;

        if (lesserSum > greaterValue) {
          return {
            valid: false,
            invalidKey: answerKey,
            message: `${lesserLabels.join(
              ' + ',
            )} (${lesserSum}) ही संख्या ${greaterLabel} (${greaterValue}) पेक्षा जास्त नसावी.`,
          };
        }
      }
    }

    return { valid: true };
  };

  const validateDocumentSize = (answers: any, questionDetails: any[]) => {
    for (const key in answers) {
      const files = answers[key]?.files;
      if (!files || !Array.isArray(files)) continue;

      const elementMstId = Number(answers[key]?.ElementMasterId);
      if (visibleElements?.[elementMstId] === false) continue;
      if (disabledElements?.[String(answers[key]?.ElementMasterId)]) continue;
      for (const f of files) {
        const size = Number(f.FileSize || f.size || 0);

        if (size > 10 * 1024 * 1024) {
          const element = questionDetails.find(
            q => String(q.elementmstid) === String(elementMstId),
          );

          return {
            valid: false,
            message: `${
              element?.rdformlablename || 'File'
            } must be 10 MB or less`,
          };
        }
      }
    }

    return { valid: true };
  };

  const isDisabledOnSubmit = (elementMstId: string | number) => {
    if (!elementMstId) return false;
    return visibleElements[Number(elementMstId)] === false;
  };

  const isFormFinalSubmitted = isFinalSubmitted || isWebFinalSubmitted;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!userID || !username || !token) {
        Alert.alert('Error', 'User info missing. Please re-login.');
        return;
      }

      const activeQuestion = questions[activeStepIndex];
      const questionId = activeQuestion?.questionid;

      if (!questionId) {
        Alert.alert('Error', 'Invalid question');
        return;
      }

      const jsontextboxpayload = prepareTextboxPayload(questionId);

      for (const item of questionDetails) {
        if (Number(item.rdformelementid) !== 1) continue;

        const elementKey = String(item.elementmstid);

        const textbox = jsontextboxpayload.find(
          t =>
            String(t.ElementMasterId) === elementKey &&
            t.QuestionId === item.rdformquestionid,
        );

        if (!textbox) continue;

        const answerKey = Object.keys(answers).find(k =>
          k.includes(`_${elementKey}_`),
        );

        const validationType = answerKey
          ? answers[answerKey]?.validationType
          : null;

        if (validationType === 1) {
          const value = textbox.textboxValue;

          if (value && !isValidWebsite(value)) {
            const invalidKey = Object.keys(answers).find(key => {
              const ans = answers[key];
              return (
                Number(ans?.ElementMasterId) ===
                  Number(textbox.ElementMasterId) &&
                Number(ans?.QuestionId) === Number(textbox.QuestionId)
              );
            });

            if (invalidKey) {
              setAnswers(prev => ({
                ...prev,
                [invalidKey]: {
                  ...prev[invalidKey],
                  value: '',
                },
              }));
            }

            Alert.alert('Validation Error', 'Please enter a valid website URL');
            return;
          }
        }
      }

      const glCheck = validateGreaterLesserTextbox(
        questionDetails,
        jsontextboxpayload,
        disabledElements,
        answers,
      );

      if (!glCheck.valid) {
        const invalidKey = glCheck.invalidKey;

        if (typeof invalidKey === 'string' && invalidKey.length > 0) {
          setAnswers(prev => ({
            ...prev,
            [invalidKey]: {
              ...prev[invalidKey],
              value: '',
            },
          }));
        }

        Alert.alert('Validation Error', glCheck.message);
        return;
      }

      console.log(
        Object.entries(answers)
          .filter(([_, value]: any) => value?.type === 'date')
          .map(([key, value]: any) => ({
            key,
            value,
          })),
      );

      const jsoncheckboxpayload = prepareCheckboxPayload(questionId);
      const jsondropdownpayload = prepareDropdownPayload(questionId);
      const Jsondocumentpayload = await prepareDocumentPayload(questionId);
      const jsontablepayload = prepareDatePayload(questionId);

      const fileCheck = validateDocumentSize(answers, questionDetails);

      if (!fileCheck.valid) {
        Alert.alert('Validation Error', fileCheck.message);
        return;
      }

      const missingLabels: string[] = [];
      let tableMissing = false;
      const validatedTables = new Set<string>();

      questionDetails.forEach(q => {
        if (Number(q.rdformelementid) === 5) {
        }
      });

      questionDetails.forEach(item => {
        // ================= SKIP ELEMENT 5 WITH questionId=1 & formNo=1 =================
        if (
          Number(item.rdformelementno) === 5 &&
          Number(item.rdformquestionid) === 1 &&
          Number(item.rdformno) === 1
        )
          return;

        const elementMstId = Number(item.elementmstid);
        if (isDisabled(item.elementmstid)) return;
        if (visibleElements?.[elementMstId] === false) return;

        const label = item.rdformlablename;
        const type = item.rdformelementid;
        const elementId = String(item.elementmstid);
        const qId = item.rdformquestionid;

        let answered = true;
        if (isDisabledOnSubmit(elementId)) return;

        switch (type) {
          case 1: // TEXTBOX
            answered = jsontextboxpayload.some(
              t =>
                String(t.ElementMasterId) === elementId &&
                t.QuestionId === qId &&
                String(t.textboxValue || '').trim() !== '',
            );
            break;

          case 2: {
            // DROPDOWN
            const mapKey = `${questionId}_${elementMstId}`;
            const selectedValue = answers[mapKey]?.value;

            if (
              selectedValue === undefined ||
              selectedValue === null ||
              selectedValue === ''
            ) {
              missingLabels.push(label);
              answered = false;
            } else {
              answered = true;
            }

            break;
          }

          case 3:
            answered = jsoncheckboxpayload.some(
              c =>
                String(c.ElementMasterId) === elementId && c.QuestionId === qId,
            );
            break;

          case 4: {
            const fileMapKey = `${qId}_${elementMstId}`;

            const hasNewFile = Jsondocumentpayload.some(
              (file: any) =>
                String(file?.ElementMasterId) === String(elementId) &&
                String(file?.QuestionId) === String(qId),
            );

            const hasFileInAnswers = Object.values(answers).some(
              (answer: any) =>
                String(answer?.ElementMasterId) === String(elementId) &&
                String(answer?.QuestionId) === String(qId) &&
                Array.isArray(answer?.files) &&
                answer.files.length > 0,
            );

            const existingUploadedFiles = uploadedDocsMap[fileMapKey];

            const hasExistingUploadedFile =
              Array.isArray(existingUploadedFiles) &&
              existingUploadedFiles.length > 0;

            answered =
              hasNewFile || hasFileInAnswers || hasExistingUploadedFile;

            break;
          }

          // case 5: {
          //   // TABLE VALIDATION
          //   const tableMstId = Number(item.tablemstid);

          //   const tableFields = questionDetails.filter(
          //     q => Number(q.tablemstid) === tableMstId,
          //   );

          //   if (tableFields.length === 0) return;

          //   const requiredFields = tableFields.filter(q => {
          //     const elId = Number(q.rdtableelementid);
          //     return q.rdtablefieldname === '' && [1, 2, 3].includes(elId);
          //   });

          //   if (requiredFields.length === 0) return;

          //   let invalid = false;

          //   requiredFields.forEach(field => {
          //     const matchingKeys = Object.keys(answers).filter(
          //       k =>
          //         k.includes(
          //           `_${field.elementmstid ?? field.rdformelementid ?? ''}_`,
          //         ) || k.includes(`_${tableMstId}_`),
          //     );

          //     const hasValue = matchingKeys.some(k => {
          //       const val = answers[k]?.value;
          //       return (
          //         val !== undefined && val !== null && String(val).trim() !== ''
          //       );
          //     });

          //     if (!hasValue) {
          //       invalid = true;
          //     }
          //   });

          //   if (invalid) missingLabels.push('Please fill all table fields');

          //   return;
          // }

          case 5: {
            const questionId = Number(item.rdformquestionid);
            const elementMstId = Number(item.elementmstid);

            const tableKey = `${questionId}_${item.rdformelementno}`;
            const tableValidationKey = `${questionId}_${elementMstId}`;

            // Validate each table only once
            if (validatedTables.has(tableValidationKey)) {
              return;
            }

            validatedTables.add(tableValidationKey);

            const table = tableDataMap[tableKey];

            if (!Array.isArray(table) || table.length <= 1) {
              return;
            }

            let hasIncompleteRow = false;

            // rowIndex 0 is the table header
            table.forEach((row: any[], rowIndex: number) => {
              if (rowIndex === 0) return;

              const requiredCells = row
                .map((cell: any, colIndex: number) => ({
                  cell,
                  colIndex,
                }))
                .filter(({ cell }) =>
                  ['textbox', 'dropdown', 'date'].includes(cell.type),
                );

              if (requiredCells.length === 0) {
                return;
              }

              const rowValidation = requiredCells.map(({ cell, colIndex }) => {
                let value: any = '';

                if (cell.type === 'textbox') {
                  const rowKey = `${questionId}_${cell.elementMstId}_${
                    cell.tableMstId ?? 0
                  }_${rowIndex}_${colIndex}`;

                  const apiKey = `${questionId}_${cell.elementMstId}_${
                    cell.tableMstId ?? 0
                  }`;

                  const hasRowKey = Object.prototype.hasOwnProperty.call(
                    answers,
                    rowKey,
                  );

                  value = hasRowKey
                    ? answers[rowKey]?.value
                    : answers[apiKey]?.value;
                }

                if (cell.type === 'dropdown') {
                  const dropdownKey = `${tableKey}_${rowIndex}_${colIndex}`;

                  value = answers[dropdownKey]?.value;
                }

                if (cell.type === 'date') {
                  /*
                   * Your date rendering uses rowIndex - 1.
                   */
                  const dateKey = `${questionId}_${cell.elementMstId}_${
                    cell.tableMstId ?? 0
                  }_${rowIndex - 1}_${colIndex}`;

                  const apiDateKey = `${questionId}_${cell.elementMstId}_${
                    cell.tableMstId ?? 0
                  }`;

                  const hasDateRowKey = Object.prototype.hasOwnProperty.call(
                    answers,
                    dateKey,
                  );

                  value = hasDateRowKey
                    ? answers[dateKey]?.value
                    : answers[apiDateKey]?.value;
                }

                const isFilled =
                  value !== undefined &&
                  value !== null &&
                  String(value).trim() !== '';

                return {
                  type: cell.type,
                  tableMstId: cell.tableMstId,
                  rowIndex,
                  colIndex,
                  value,
                  isFilled,
                };
              });

              const filledCount = rowValidation.filter(
                field => field.isFilled,
              ).length;
              if (filledCount === 0) {
                return;
              }

              const isRowComplete = filledCount === rowValidation.length;
              if (!isRowComplete) {
                hasIncompleteRow = true;
              }
            });

            if (hasIncompleteRow) {
              missingLabels.push(
                'Please fill all fields in the entered table row',
              );
            }

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
          messages.push('Please fill all table fields');
        }

        Alert.alert(
          'Please fill required fields',
          messages.map(m => `• ${m}`).join('\n'),
        );
        return;
      }

      // ================= FINAL PAYLOAD =================
      const payload = {
        roleid: '1',
        userid: userID,
        username: username,
        jsontextboxpayload,
        jsoncheckboxpayload,
        jsondropdownpayload,
        Jsondocumentpayload,
        dateList: jsontablepayload,
      };
      console.log('📤 Final Payload:', JSON.stringify(payload, null, 2));

      const url = `${API_BASE_URL}/Form1QuestionMaster/InserUpdateFormElements`;

      // ================= SUBMIT =================
      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        Alert.alert('Error', 'Submission failed');
        return;
      }

      setSubmittedSteps(prev =>
        prev.includes(activeStepIndex) ? prev : [...prev, activeStepIndex],
      );

      await AsyncStorage.removeItem('TABLE_IMAGE_DRAFTS');

      Alert.alert(
        'Success',
        activeStepIndex < totalSteps - 1
          ? 'Answer saved successfully'
          : 'Form submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              if (activeStepIndex < totalSteps - 1) {
                handleNext();
              }
            },
          },
        ],
        { cancelable: false },
      );

      setSubmittedSteps(prev =>
        prev.includes(activeStepIndex) ? prev : [...prev, activeStepIndex],
      );
    } catch (error) {
      console.error('Submit Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = (index: number) => {
    return submittedSteps.includes(index) || (steps[index]?.anssum ?? 0) > 0;
  };

  const allStepsSubmitted =
    steps.length > 0 && steps.every((_, index) => isStepComplete(index));

  const finalSubmitForm = async () => {
    try {
      setLoading(true);
      console.log('🚀 Final Submit initiated');

      // ------------------ 1️⃣ Check missing steps ------------------
      const missingSteps = questions
        .map((q, index) => ({ ...q, index }))
        .filter(q => !isStepComplete(q.index));

      if (missingSteps.length > 0) {
        const missingNumbers = missingSteps.map(s => `Q${s.srNo}`).join(', ');
        Alert.alert(
          'Incomplete Form',
          `Please complete the following questions before final submit:\n${missingNumbers}`,
        );
        return;
      }

      console.log('✅ All questions submitted, calling final submit API');

      // ------------------ 2️⃣ Call Final Submit API ------------------
      const payload = {
        userid: userID,
        formno: '7',
        isfrommobileapp: '1',
      };
      console.log('📤 Final Submit Payload:', payload);

      const url = `${API_BASE_URL}/Form1QuestionMaster/InsertFormFinalSubmit`;

      const res = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      console.log('📥 Final Submit Response:', data);

      if (data.responseCode !== 2000) {
        console.log('❌ API responded with error:', data.responseMessage);
        Alert.alert('Error', 'Final submission failed');
        return;
      }

      if (Number(data.items?.[0]?.isForm7Complete) === 1) {
        await AsyncStorage.setItem(`form7_final_submitted_${userID}`, '1');
        console.log('✅ Final Form marked as complete on server');
        Alert.alert('Success', 'Final Form 7 submitted successfully!');
        setIsFinalSubmitted(true);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        console.log('❌ Form not complete on server');
        Alert.alert('Error', 'Form submission incomplete on server');
      }
    } catch (err) {
      console.error('❌ Final Submit Error:', err);
      Alert.alert('Error', 'Something went wrong during final submit');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = steps.length;

  const handleNext = () => {
    if (activeStepIndex >= totalSteps - 1) return;

    const nextIndex = activeStepIndex + 1;
    const nextQuestionId = questions[nextIndex]?.questionid;
    setActiveStepIndex(nextIndex);

    renderedTableSet.current.clear();

    if (userID && token && nextQuestionId) {
      fetchQuestionById(nextQuestionId, userID, token);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex <= 0) return;

    const prevIndex = activeStepIndex - 1;
    const prevQuestionId = questions[prevIndex]?.questionid;
    setActiveStepIndex(prevIndex);
    renderedTableSet.current.clear();
    if (userID && token && prevQuestionId) {
      fetchQuestionById(prevQuestionId, userID, token);
    }
  };

  const handleChooseTableFile = async (
    questionId: number,
    tableMstId: number,
    rowIndex: number,
    colIndex: number,
    elementMstId: number,
  ) => {
    try {
      const [file] = await pick({
        allowMultiSelection: false,
        type: [types.pdf, types.images],
      });

      if (!file) return;

      // ✅ FILE SIZE VALIDATION
      if (file.size && file.size > MAX_FILE_SIZE) {
        Alert.alert('File Size Error', 'Selected file must be 10 MB or less');
        return;
      }

      const tableKey = `${questionId}_${tableMstId}_${rowIndex}_${colIndex}`;

      setAnswers(prev => ({
        ...prev,
        [tableKey]: {
          ...(typeof prev[tableKey] === 'object' ? prev[tableKey] : {}),
          files: [
            {
              ...file,
              FileSize: file.size, // ✅ consistent with other uploads
            },
          ],
          QuestionId: questionId,
          TableMstID: tableMstId,
          RowIndex: rowIndex,
          ColIndex: colIndex,
          FormNoVal: 7,
          ElementMasterId: elementMstId,
        },
      }));
    } catch (err: any) {
      if (err?.message?.includes('cancelled')) return;
      //console.error('Table file picker error:', err);
      Alert.alert('Error', 'File selection failed');
    }
  };

  // const readFileAsBase64 = async (file: any) => {
  //   let filePath = file.uri;

  //   // Android content:// fix
  //   if (filePath.startsWith('content://')) {
  //     const destPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;

  //     await RNFS.copyFile(filePath, destPath);
  //     filePath = destPath;
  //   }

  //   const base64 = await RNFS.readFile(filePath, 'base64');
  //   return base64;
  // };

  const readFileAsBase64 = async (file: any) => {
  try {
    let filePath = file?.uri || file?.path;

    if (!filePath) {
      throw new Error('File URI/path not found');
    }

    // Android content:// fix
    if (filePath.startsWith('content://')) {
      const fileName =
        file?.name || `temp_file_${Date.now()}`;

      const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

      await RNFS.copyFile(filePath, destPath);

      filePath = destPath;
    }

    // Remove file:// before RNFS.readFile
    if (filePath.startsWith('file://')) {
      filePath = filePath.replace('file://', '');
    }

    console.log('📖 Reading file for Base64:', filePath);

    const base64 = await RNFS.readFile(filePath, 'base64');

    console.log(
      '✅ Base64 generated. Length:',
      base64.length,
    );

    return base64;
  } catch (error) {
    console.log('❌ readFileAsBase64 error:', error);
    throw error;
  }
};



  const isValidWebsite = (value: string): boolean => {
    const regex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return regex.test(value.trim());
  };

  const getColumnStyle = (colIndex: number, totalCols: number) => {
    if (colIndex === totalCols - 1) {
      return { width: 300 }; // File Upload column
    }

    if (colIndex === totalCols - 2) {
      return { width: 180 };
    }

    return { width: 120 };
  };

  const getTableValidationType = (
    questionId: number,
    elementMstId: string,
    tableMstId: string | number,
    colIndex: number,
    textboxInfoMap: Record<string, any>,
  ): number | undefined => {
    // 1️⃣ Column-level static override
    const colKey = `${questionId}_${elementMstId}_${String(
      tableMstId,
    )}_${colIndex}`;
    if (STATIC_TABLE_VALIDATION.hasOwnProperty(colKey)) {
      return STATIC_TABLE_VALIDATION[colKey];
    }

    const tableKey = `${questionId}_${elementMstId}_${String(tableMstId)}`;
    if (textboxInfoMap[tableKey]?.validationType !== undefined) {
      return textboxInfoMap[tableKey].validationType;
    }

    return undefined;
  };

  const isLastQuestion = activeStepIndex === totalSteps - 1;
  const isLastQuestionSubmitted = submittedSteps.includes(totalSteps - 1);

  const renderControl = (item: any) => {
    const elementNoKey = String(item.rdformelementno);
    const elementType = Number(item.rdformelementid);
    const questionId =
      questions[activeStepIndex]?.questionid ?? steps[activeStepIndex];
    const tableMstId = Number(item.tablemstid);
    // Prefer backend field elementmstid; fallback to previously stored meta
    const elementMstIdFromItem =
      item.elementmstid ?? item.rdformelementmasterid ?? '';
    const elementMstIdFromAnswers =
      answers[elementNoKey]?.elementMstId ??
      answers[elementNoKey]?.elementmstid ??
      '';
    const elementMstId = String(
      elementMstIdFromItem || elementMstIdFromAnswers || '',
    );
    const mapKey = `${questionId}_${elementMstId}`;

    const isElementVisible = (elementMstId: number) => {
      return visibleElements[elementMstId] !== false;
    };

    const elementMstIdNum = Number(elementMstId);

    if (visibleElements[elementMstIdNum] === false) {
      return null;
    }

    switch (elementType) {
      case 1: {
        //textbox

        const elementKey = `${questionId}_${elementMstId}_${tableMstId ?? 0}`;
        const ansObj = answers[elementKey] ?? {};

        const value = ansObj.value ?? '';
        const validationType = ansObj.validationType;

        let keyboardType: 'default' | 'numeric' | 'url' = 'default';
        let placeholder = '';

        if (validationType === 1) {
          placeholder = 'Enter valid website URL';
          keyboardType = 'url';
        } else if (validationType === 2)
          placeholder = 'Enter numeric value (max 5 digits)';
        else if (validationType === 3) placeholder = 'Enter text';
        else if (validationType === 4)
          placeholder = 'Enter number (max 10 digits)';

        const isAutoDisabled =
          item.rdformno === 7 &&
          item.rdformquestionid === 2 &&
          item.rdformelementno === 1 &&
          item.rdformelementid === 1;

        const isFieldDisabled =
          disabledElementsRef.current[String(elementMstId)] === true ||
          isAutoDisabled;

        return (
          <TextInput
            style={[styles.input, isFieldDisabled && styles.disabledInput]}
            placeholder={placeholder}
            placeholderTextColor="#777"
            value={value}
            editable={!isFieldDisabled}
            selectTextOnFocus={!isFieldDisabled}
            onChangeText={text => {
              if (isFieldDisabled) return;

              if (!answers[elementKey]) {
                setAnswers(prev => ({
                  ...prev,
                  [elementKey]: {
                    value: '',
                    FormNoVal: item.rdformno,
                    QuestionId: questionId,
                    ElementMasterId: elementMstId,
                    TableMstID: 0,
                    validationType: validationType,
                  },
                }));
              }
              handleTextChange(elementKey, text);
            }}
            keyboardType={
              validationType === 2 || validationType === 4
                ? 'numeric'
                : 'default'
            }
            maxLength={
              validationType === 2 ? 5 : validationType === 4 ? 10 : undefined
            }
          />
        );
      }

      case 2: {
        // DROPDOWN
        const ddOptions = dropdownOptionsMap[mapKey] ?? [];

        const isFieldDisabled =
          disabledElementsRef.current[String(elementMstId)] === true;

        const selectedValue =
          dropdownValueRef.current[mapKey] ??
          (answers[mapKey]?.value !== undefined
            ? Number(answers[mapKey].value)
            : null);

        return (
          <View>
            {ddOptions.length === 0 ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Dropdown
                style={[
                  styles.dropdown,
                  isFieldDisabled && styles.disabledInput,
                ]}
                data={ddOptions}
                labelField="label"
                valueField="value"
                value={selectedValue}
                placeholder="निवडा"
                disable={isFieldDisabled}
                onChange={(selected: any) => {
                  if (isFieldDisabled) return;

                  const numericValue = Number(selected.value);

                  dropdownValueRef.current[mapKey] = numericValue;

                  handleDropdownChange(mapKey, {
                    ...selected,
                    value: numericValue,
                  });

                  fetchDropdownDependency(
                    elementMstId,
                    questionId,
                    String(numericValue),
                    token!,
                  );
                }}
              />
            )}
          </View>
        );
      }

      case 3: {
        // checkbox
        const mapKey = `${questionId}_${elementMstId}`;
        const cbOptions = checkboxOptionsMap[mapKey] ?? [];
        const ansObj = answers[mapKey] ?? {};

        const selectedIds: number[] = Array.isArray(ansObj.value)
          ? ansObj.value.map((v: number | string) => Number(v))
          : [];

        const isFieldDisabled =
          disabledElementsRef.current[String(elementMstId)] === true;

        return (
          <View>
            {cbOptions.map(opt => {
              const checked = selectedIds.includes(Number(opt.value));

              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  style={[
                    styles.checkboxRow,
                    isFieldDisabled && { opacity: 0.5 },
                  ]}
                  disabled={isFieldDisabled}
                  onPress={() => {
                    if (isFieldDisabled) return;
                    handleCheckboxToggle(
                      mapKey,
                      opt.value,
                      questionId,
                      elementMstId,
                    );
                  }}
                >
                  <Icon
                    name={
                      checked ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={22}
                    color="#2E7D32"
                  />
                  <Text style={styles.checkboxLabel}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }

      case 4: {
        // file upload
        const uploaded = uploadedDocsMap[mapKey] ?? [];

        return (
          <View>
            {item.rdDownloadAhvalNamuna && (
              <TouchableOpacity
                // onPress={() => downloadTemplate(item.downloadFileName)}
                onPress={() =>
                  downloadTemplate(item.downloadFileName, item.fileBase64)
                }
              >
                <Text
                  style={[
                    styles.tooltipText1,
                    {
                      color: 'blue',
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  {item.rdDownloadAhvalNamuna}
                </Text>
              </TouchableOpacity>
            )}
            {item.rdformdocnametooltp && (
              <Text style={styles.tooltipText}>{item.rdformdocnametooltp}</Text>
            )}
            <View style={styles.fileRow}>
              <TouchableOpacity
                style={[
                  styles.chooseBtn,
                  isDisabled(Number(elementMstId)) && styles.disabledBtn,
                ]}
                disabled={isDisabled(Number(elementMstId))}
                onPress={() => {
                  if (isDisabled(Number(elementMstId))) return;

                  handleChooseFile(
                    elementNoKey,
                    questionId,
                    elementMstId,
                    tableMstId ?? 0,
                  );
                }}
              >
                <Text>Choose File</Text>
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.noFile,
                    answers[elementNoKey]?.files?.length === 0 && {
                      marginTop: 12,
                    },
                  ]}
                >
                  {answers[elementNoKey]?.files?.length > 0
                    ? answers[elementNoKey].files[0].name
                    : 'No File Chosen'}
                </Text>

                {answers[elementNoKey]?.files?.[0]?.url && (
                  <TouchableOpacity
                    onPress={() => {
                      setPreviewUrl(answers[elementNoKey].files[0].url);
                      setPreviewFileName(answers[elementNoKey].files[0].name);

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
      }

      case 5: {
        const tableKey = `${questionId}_${item.rdformelementno}`;

        if (renderedTableSet.current.has(tableKey)) return null;
        renderedTableSet.current.add(tableKey);

        const table = tableDataMap[tableKey];
        if (!table) return null;

        const handleDeleteRow = (
          rowIndexToDelete: number,
          selectedRow: any[],
        ) => {
          const row = table[rowIndexToDelete];

          let hasTextboxOrDropdown = false;
          let hasFile = false;
          let hasDate = false;

          row.forEach((cell: any, colIndex: number) => {
            // Textbox
            if (cell.type === 'textbox') {
              const elementKey = `${questionId}_${cell.elementMstId}_${
                cell.tableMstId ?? 0
              }_${rowIndexToDelete}_${colIndex}`;

              const value = answers[elementKey]?.value;

              if (value && String(value).trim() !== '') {
                hasTextboxOrDropdown = true;
              }
            }

            // Dropdown
            if (cell.type === 'dropdown') {
              const cellKey = `${tableKey}_${rowIndexToDelete}_${colIndex}`;

              const value = answers[cellKey]?.value;

              if (value !== null && value !== undefined && value !== '') {
                hasTextboxOrDropdown = true;
              }
            }

            // File
            if (cell.type === 'file') {
              const fileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;

              const uploadedFiles = tableUploadedDocsMap[fileKey] || [];
              const files = getTableFiles(
                questionId,
                cell,
                rowIndexToDelete,
                colIndex,
              );

              if (files.length > 0) {
                hasFile = true;
              }
            }

            // Date
            if (cell.type === 'date') {
              const dateKey = `${questionId}_${cell.elementMstId}_${
                cell.tableMstId ?? 0
              }_${rowIndexToDelete}_${colIndex}`;

              if (answers[dateKey]?.value) {
                hasDate = true;
              }
            }
          });

          // Validation
          if (
            (hasTextboxOrDropdown && !hasFile) ||
            (!hasDate && !hasFile && !hasTextboxOrDropdown)
          ) {
            Alert.alert(
              'Information',
              `श्रमदिन आठवडा क्रमांक: ${rowIndexToDelete} साठी कोणताही डेटा उपलब्ध नाही.`,
            );
            return;
          }

          Alert.alert(
            'Confirm Delete',
            `तुम्हाला श्रमदिन आठवडा क्रमांक: ${rowIndexToDelete} ही ओळ नक्कीच हटवायची आहे का?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  const textboxIds: string[] = [];
                  let documentMstId = '';

                  const shouldCallApi = selectedRow.some((cell: any) => {
                    const tableFileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;
                    return (
                      (tableUploadedDocsMap[tableFileKey] ?? []).length > 0
                    );
                  });

                  if (shouldCallApi) {
                    selectedRow.forEach((cell: any) => {
                      // Textbox & Date IDs
                      if (
                        (cell.type === 'textbox' || cell.type === 'date') &&
                        !textboxIds.includes(String(cell.tableMstId))
                      ) {
                        textboxIds.push(String(cell.tableMstId));
                      }

                      // File ID
                      if (cell.type === 'file') {
                        documentMstId = String(cell.tableMstId);
                      }
                    });

                    const apiDeleted = await deleteTableRowAPI(
                      textboxIds,
                      elementMstId,
                      documentMstId,
                      questionId,
                    );

                    if (!apiDeleted) {
                      Alert.alert('Error', 'Unable to delete server data');
                      return;
                    }

                    Alert.alert('Success', 'Record deleted successfully');
                  }

                  setAnswers(prev => {
                    const updated = { ...prev };

                    row.forEach((cell: any, colIndex: number) => {
                      // Textbox
                      const textboxKey = `${questionId}_${cell.elementMstId}_${
                        cell.tableMstId ?? 0
                      }_${rowIndexToDelete}_${colIndex}`;
                      delete updated[textboxKey];

                      const apiKey = `${questionId}_${cell.elementMstId}_${
                        cell.tableMstId ?? 0
                      }`;
                      delete updated[apiKey];
                      const dropdownKey = `${tableKey}_${rowIndexToDelete}_${colIndex}`;
                      delete updated[dropdownKey];

                      const fileKey = `${questionId}_${cell.tableMstId}_${rowIndexToDelete}_${colIndex}`;
                      delete updated[fileKey];

                      const tableFileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;
                      delete updated[tableFileKey];

                      const dateKey = `${questionId}_${cell.elementMstId}_${
                        cell.tableMstId ?? 0
                      }_${rowIndexToDelete - 1}_${colIndex}`;
                      delete updated[dateKey];
                    });

                    setTableUploadedDocsMap(prev => {
                      const updated = { ...prev };

                      row.forEach((cell: any) => {
                        if (cell.type === 'file') {
                          const tableFileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;
                          delete updated[tableFileKey];
                        }
                      });

                      return updated;
                    });
                    return updated;
                  });
                },
              },
            ],
          );
        };

        return (
          // <ScrollView
          //   keyboardShouldPersistTaps="handled"
          //   horizontal
          //   style={{ marginVertical: 12 }}
          // >

          <View
            {...tablePanResponder.panHandlers}
            style={styles.tableScrollWrapper}
          >
            <ScrollView
              ref={horizontalTableRef}
              horizontal
              scrollEnabled={false}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator
              overScrollMode="never"
              onLayout={event => {
                const visibleWidth = event.nativeEvent.layout.width;

                horizontalMaxOffsetRef.current = Math.max(
                  0,
                  horizontalMaxOffsetRef.current - visibleWidth,
                );
              }}
              onContentSizeChange={(contentWidth: number) => {
                horizontalMaxOffsetRef.current = contentWidth;
              }}
              style={{ marginVertical: 12 }}
              contentContainerStyle={{
                paddingBottom: 8,
              }}
            >
              <View style={styles.tableContainer}>
                {table.map((row: any[], rowIndex: number) => (
                  <View key={rowIndex} style={styles.tableRow}>
                    {row.map((cell: any, colIndex: number) => {
                      if (rowIndex === 0) {
                        return (
                          <>
                            <View
                              key={colIndex}
                              style={[
                                styles.tableCell,
                                getColumnStyle(colIndex, row.length),
                                styles.headerCell,
                              ]}
                            >
                              <Text
                                style={[styles.cellText, styles.headerText]}
                              >
                                {cell.value}
                              </Text>
                            </View>

                            {colIndex === row.length - 1 &&
                              item.rdformquestionid === 1 && (
                                <View
                                  style={[
                                    styles.tableCell,
                                    styles.headerCell,
                                    { width: 120 },
                                  ]}
                                >
                                  <Text
                                    style={[styles.cellText, styles.headerText]}
                                  >
                                    Action
                                  </Text>
                                </View>
                              )}
                          </>
                        );
                      }

                      const cellKey = `${tableKey}_${rowIndex}_${colIndex}`;

                      //date picker
                      if (cell.type === 'date') {
                        const tableMstId = cell.tableMstId ?? 0;
                        const dateKey = `${questionId}_${elementMstId}_${tableMstId}_${
                          rowIndex - 1
                        }_${colIndex}`;
                        return (
                          <>
                            <TouchableOpacity
                              style={[
                                styles.tableInput,
                                getColumnStyle(colIndex, row.length),
                                {
                                  justifyContent: 'center',
                                },
                              ]}
                              onPress={() => {
                                setSelectedDateKey({
                                  key: dateKey,
                                  questionId,
                                  elementMasterId: cell.elementMstId,
                                  tableMstID: tableMstId,
                                  formNo: 7,
                                });
                                setShowDatePicker(true);
                              }}
                            >
                              <Text>
                                {answers[dateKey]?.value || 'dd-mm-yyyy'}
                              </Text>
                            </TouchableOpacity>

                            {colIndex === row.length - 1 &&
                              item.rdformquestionid === 1 && (
                                <TouchableOpacity
                                  style={styles.deleteBtn}
                                  onPress={() => handleDeleteRow(rowIndex, row)}
                                >
                                  <Text style={{ color: '#fff' }}>Delete</Text>
                                </TouchableOpacity>
                              )}
                          </>
                        );
                      }

                      // Textbox
                      if (cell.type === 'textbox') {
                        const elementMstId = cell.elementMstId;
                        const tableMstId = cell.tableMstId ?? 0;

                        const elementKey = `${questionId}_${elementMstId}_${
                          tableMstId ?? 0
                        }_${rowIndex}_${colIndex}`;

                        const rowKey = `${questionId}_${elementMstId}_${tableMstId}_${rowIndex}_${colIndex}`;
                        const apiKey = `${questionId}_${elementMstId}_${tableMstId}`;
                        const currentValue =
                          answers[rowKey]?.value ??
                          answers[apiKey]?.value ??
                          '';

                        const validationType = getTableValidationType(
                          questionId,
                          elementMstId,
                          tableMstId,
                          colIndex,
                          textboxInfoMap,
                        );

                        const urlRegex =
                          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

                        let placeholder = 'Enter value greater than 0';

                        if (validationType === 1)
                          placeholder = 'Enter valid website URL';
                        else if (validationType === 2)
                          placeholder = 'Enter numeric value';
                        else if (validationType === 3)
                          placeholder = 'Enter text ';
                        else if (validationType === 4)
                          placeholder = 'Enter Decimal number';

                        const isNumericOnly =
                          validationType === 2 ||
                          validationType === 4 ||
                          validationType === undefined;

                        return (
                          <View
                            key={colIndex}
                            style={{
                              flexDirection: 'row',
                              //alignItems: 'center',
                            }}
                          >
                            <TextInput
                              key={colIndex}
                              style={[
                                styles.tableInput,
                                getColumnStyle(colIndex, row.length),
                              ]}
                              value={currentValue}
                              placeholder={placeholder}
                              placeholderTextColor="#777"
                              keyboardType={
                                isNumericOnly ? 'numeric' : 'default'
                              }
                              editable={
                                questionId === 2
                                  ? colIndex === 2
                                    ? false
                                    : true
                                  : true
                              }
                              onChangeText={text => {
                                if (isNumericOnly) {
                                  if (!/^\d*\.?\d*$/.test(text)) return;
                                  if (text === '0') return;
                                }

                                if (validationType === 1) {
                                  if (!urlRegex.test(text)) return;
                                }

                                handleTableTextChange(
                                  elementKey,
                                  text,
                                  questionId,
                                  elementMstId,
                                  tableMstId,
                                  rowIndex,
                                  colIndex,
                                );
                              }}
                            />

                            {/* Action button only at last column */}
                            {colIndex === row.length - 1 &&
                              item.rdformquestionid === 1 && (
                                <TouchableOpacity
                                  style={styles.deleteBtn}
                                  onPress={() => handleDeleteRow(rowIndex, row)}
                                >
                                  <Text style={{ color: '#fff' }}>Delete</Text>
                                </TouchableOpacity>
                              )}
                          </View>
                        );
                      }

                      if (cell.type === 'dropdown') {
                        const ddMapKey = `${questionId}_${cell.elementMstId}`;
                        const ddOptions = dropdownOptionsMap[ddMapKey] ?? [];
                        const selectedValue = answers[cellKey]?.value ?? null;

                        return (
                          <>
                            <View
                              key={colIndex}
                              style={getColumnStyle(colIndex, row.length)}
                            >
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
                                        ElementMasterId:
                                          selected.ElementMasterId,
                                        TableMstID: selected.TableMstID ?? 0,
                                      },
                                    }))
                                  }
                                />
                              )}
                            </View>

                            {colIndex === row.length - 1 && (
                              <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDeleteRow(rowIndex, row)}
                              >
                                <Text style={{ color: '#fff' }}>Delete</Text>
                              </TouchableOpacity>
                            )}
                          </>
                        );
                      }

                      if (cell.type === 'file') {
                        const fileKey = `${questionId}_${cell.tableMstId}_${rowIndex}_${colIndex}`;
                        const fileObj = answers[fileKey];
                        const tableFileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;

                        const uploadedFiles =
                          tableUploadedDocsMap[tableFileKey] || [];
                        const file = uploadedFiles[0];

                        const answerFileKey = `${questionId}_${cell.tableMstId}_${rowIndex}_${colIndex}`;

                        const localFile = answers[answerFileKey]?.files?.[0];

                        const apiFile =
                          tableUploadedDocsMap[
                            `${questionId}_${cell.elementMstId}_${cell.tableMstId}`
                          ]?.[0];

                        const displayFile = localFile || apiFile;

                        return (
                          <>
                            <View
                              key={colIndex}
                              style={[
                                styles.tableCell,
                                getColumnStyle(colIndex, row.length),
                                {
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderWidth: 1,
                                  borderColor: '#ccc',
                                  overflow: 'hidden',
                                },
                              ]}
                            >
                              <TouchableOpacity
                                style={styles.chooseBtn}
                                onPress={() =>
                                  handleChooseTableFile(
                                    questionId,
                                    cell.tableMstId,
                                    rowIndex,
                                    colIndex,
                                    cell.elementMstId,
                                  )
                                }
                              >
                                <Text>Choose File</Text>
                              </TouchableOpacity>

                              <View style={{ flex: 1, marginLeft: 10 }}>
                                {displayFile ? (
                                  <>
                                    <Text
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                      style={styles.noFile}
                                    >
                                      {displayFile.name}
                                    </Text>

                                    <TouchableOpacity
                                      onPress={() => {
                                        setPreviewUrl(displayFile.url);
                                        setPreviewFileName(displayFile.name);
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
                                  </>
                                ) : (
                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: 'center',
                                      alignContent: 'center',
                                      paddingTop: 10,
                                    }}
                                  >
                                    <Text style={styles.noFile}>
                                      No File Chosen
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>

                            {colIndex === row.length - 1 && (
                              <View
                                style={[
                                  styles.tableCell,
                                  {
                                    width: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  style={styles.deleteBtn}
                                  onPress={() => handleDeleteRow(rowIndex, row)}
                                >
                                  <Text style={{ color: '#fff' }}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        );
                      }



                      //draft code

                      // if (cell.type === 'file') {
                      //   Keyboard.dismiss();
                      //   const imageTabKey = `${questionId}_${cell.tableMstId}_${rowIndex}_${colIndex}`;

                      //   const activeTab =
                      //     activeImageTab[imageTabKey] || 'before';

                      //   const images = tableImages[imageTabKey] || {
                      //     before: [],
                      //     after: [],
                      //   };

                      //   const currentImages = images[activeTab] || [];

                      //   const isPdfReady =
                      //     images.before.length === 3 &&
                      //     images.after.length === 3;

                      //   const tableFileKey = `${questionId}_${cell.elementMstId}_${cell.tableMstId}`;
                      //   const apiFile = tableUploadedDocsMap[tableFileKey]?.[0];
                      //   const answerFileKey = `${questionId}_${cell.tableMstId}_${rowIndex}_${colIndex}`;
                      //   const localFile = answers[answerFileKey]?.files?.[0];

                      //   return (
                      //     <>
                      //       <View
                      //         key={colIndex}
                      //         style={[
                      //           styles.tableCell,
                      //           getColumnStyle(colIndex, row.length),
                      //           {
                      //             borderWidth: 1,
                      //             borderColor: '#ccc',
                      //             padding: 8,
                      //           },
                      //         ]}
                      //       >
                      //         {apiFile && (
                      //           <View
                      //             style={{
                      //               marginBottom: 8,
                      //               padding: 7,
                      //               backgroundColor: '#F8F9FA',
                      //               borderRadius: 6,
                      //               borderWidth: 1,
                      //               borderColor: '#E0E0E0',
                      //             }}
                      //           >
                      //             <View
                      //               style={{
                      //                 flexDirection: 'row',
                      //                 alignItems: 'center',
                      //                 width: '100%',
                      //               }}
                      //             >
                      //               <MaterialCommunityIcons
                      //                 name={
                      //                   apiFile.name
                      //                     ?.toLowerCase()
                      //                     .endsWith('.pdf')
                      //                     ? 'file-pdf-box'
                      //                     : 'file-image-outline'
                      //                 }
                      //                 size={22}
                      //                 color="#1976D2"
                      //               />
                      //               <Text
                      //                 numberOfLines={1}
                      //                 ellipsizeMode="tail"
                      //                 style={{
                      //                   flex: 1,
                      //                   marginLeft: 6,
                      //                   marginRight: 8,
                      //                   fontSize: 12,
                      //                   color: '#333',
                      //                 }}
                      //               >
                      //                 {apiFile.name || 'Uploaded File'}
                      //               </Text>

                      //               <TouchableOpacity
                      //                 activeOpacity={0.8}
                      //                 onPress={() => {
                      //                   const fileUrl =
                      //                     apiFile.url ||
                      //                     apiFile.fileURL ||
                      //                     apiFile.uri;

                      //                   if (!fileUrl) {
                      //                     Alert.alert(
                      //                       'Preview',
                      //                       'File preview is not available.',
                      //                     );
                      //                     return;
                      //                   }

                      //                   setPreviewUrl(fileUrl);
                      //                   setPreviewFileName(
                      //                     apiFile.name || 'Uploaded File',
                      //                   );

                      //                   setPreviewVisible(true);
                      //                 }}
                      //                 style={{
                      //                   width: 30,
                      //                   height: 30,
                      //                   borderRadius: 15,
                      //                   justifyContent: 'center',
                      //                   alignItems: 'center',
                      //                 }}
                      //               >
                      //                 <MaterialCommunityIcons
                      //                   name="eye-outline"
                      //                   size={21}
                      //                   color="#1976D2"
                      //                 />
                      //               </TouchableOpacity>
                      //             </View>
                      //           </View>
                      //         )}

                      //         <View
                      //           style={{
                      //             flexDirection: 'row',
                      //             backgroundColor: '#EEF1F5',
                      //             borderRadius: 9,
                      //             padding: 3,
                      //             marginBottom: 8,
                      //             borderWidth: 1,
                      //             borderColor: '#E2E6EA',
                      //           }}
                      //         >
                      //           <TouchableOpacity
                      //             activeOpacity={0.7}
                      //             onPress={() =>
                      //               handleImageTabChange(imageTabKey, 'before')
                      //             }
                      //             style={{
                      //               flex: 1,
                      //               paddingVertical: 8,
                      //               borderRadius: 7,
                      //               alignItems: 'center',
                      //               justifyContent: 'center',
                      //               backgroundColor:
                      //                 activeTab === 'before'
                      //                   ? '#FFFFFF'
                      //                   : 'transparent',

                      //               shadowColor:
                      //                 activeTab === 'before'
                      //                   ? '#000'
                      //                   : 'transparent',
                      //               shadowOffset: {
                      //                 width: 0,
                      //                 height: 1,
                      //               },
                      //               shadowOpacity:
                      //                 activeTab === 'before' ? 0.12 : 0,
                      //               shadowRadius: 2,
                      //               elevation: activeTab === 'before' ? 2 : 0,
                      //             }}
                      //           >
                      //             <View
                      //               style={{
                      //                 flexDirection: 'row',
                      //                 alignItems: 'center',
                      //                 gap: 5,
                      //               }}
                      //             >
                      //               <MaterialCommunityIcons
                      //                 name="image-outline"
                      //                 size={16}
                      //                 color={
                      //                   activeTab === 'before'
                      //                     ? '#1976D2'
                      //                     : '#777'
                      //                 }
                      //               />

                      //               <Text
                      //                 style={{
                      //                   fontSize: 13,
                      //                   fontWeight:
                      //                     activeTab === 'before'
                      //                       ? '700'
                      //                       : '500',
                      //                   color:
                      //                     activeTab === 'before'
                      //                       ? '#1976D2'
                      //                       : '#555',
                      //                 }}
                      //               >
                      //                 Before
                      //               </Text>

                      //               {images.before.length > 0 && (
                      //                 <View
                      //                   style={{
                      //                     minWidth: 18,
                      //                     height: 18,
                      //                     paddingHorizontal: 4,
                      //                     borderRadius: 9,
                      //                     backgroundColor:
                      //                       activeTab === 'before'
                      //                         ? '#1976D2'
                      //                         : '#BDBDBD',
                      //                     justifyContent: 'center',
                      //                     alignItems: 'center',
                      //                   }}
                      //                 >
                      //                   <Text
                      //                     style={{
                      //                       color: '#FFF',
                      //                       fontSize: 10,
                      //                       fontWeight: '700',
                      //                     }}
                      //                   >
                      //                     {images.before.length}
                      //                   </Text>
                      //                 </View>
                      //               )}
                      //             </View>
                      //           </TouchableOpacity>

                      //           <TouchableOpacity
                      //             activeOpacity={0.7}
                      //             onPress={() =>
                      //               handleImageTabChange(imageTabKey, 'after')
                      //             }
                      //             style={{
                      //               flex: 1,
                      //               paddingVertical: 8,
                      //               borderRadius: 7,
                      //               alignItems: 'center',
                      //               justifyContent: 'center',
                      //               backgroundColor:
                      //                 activeTab === 'after'
                      //                   ? '#FFFFFF'
                      //                   : 'transparent',

                      //               shadowColor:
                      //                 activeTab === 'after'
                      //                   ? '#000'
                      //                   : 'transparent',
                      //               shadowOffset: {
                      //                 width: 0,
                      //                 height: 1,
                      //               },
                      //               shadowOpacity:
                      //                 activeTab === 'after' ? 0.12 : 0,
                      //               shadowRadius: 2,
                      //               elevation: activeTab === 'after' ? 2 : 0,
                      //             }}
                      //           >
                      //             <View
                      //               style={{
                      //                 flexDirection: 'row',
                      //                 alignItems: 'center',
                      //                 gap: 5,
                      //               }}
                      //             >
                      //               <MaterialCommunityIcons
                      //                 name="image-multiple-outline"
                      //                 size={16}
                      //                 color={
                      //                   activeTab === 'after'
                      //                     ? '#1976D2'
                      //                     : '#777'
                      //                 }
                      //               />

                      //               <Text
                      //                 style={{
                      //                   fontSize: 13,
                      //                   fontWeight:
                      //                     activeTab === 'after' ? '700' : '500',
                      //                   color:
                      //                     activeTab === 'after'
                      //                       ? '#1976D2'
                      //                       : '#555',
                      //                 }}
                      //               >
                      //                 After
                      //               </Text>

                      //               {images.after.length > 0 && (
                      //                 <View
                      //                   style={{
                      //                     minWidth: 18,
                      //                     height: 18,
                      //                     paddingHorizontal: 4,
                      //                     borderRadius: 9,
                      //                     backgroundColor:
                      //                       activeTab === 'after'
                      //                         ? '#1976D2'
                      //                         : '#BDBDBD',
                      //                     justifyContent: 'center',
                      //                     alignItems: 'center',
                      //                   }}
                      //                 >
                      //                   <Text
                      //                     style={{
                      //                       color: '#FFF',
                      //                       fontSize: 10,
                      //                       fontWeight: '700',
                      //                     }}
                      //                   >
                      //                     {images.after.length}
                      //                   </Text>
                      //                 </View>
                      //               )}
                      //             </View>
                      //           </TouchableOpacity>
                      //         </View>

                      //         <Text
                      //           style={{
                      //             fontSize: 10,
                      //             color: '#D32F2F',
                      //             fontWeight: '500',
                      //           }}
                      //         >
                      //           सूचना: Before आणि After साठी प्रत्येकी ३ फोटो
                      //           जोडा व PDF तयार करा.
                      //         </Text>

                      //         <View
                      //           style={{
                      //             flexDirection: 'row',
                      //             alignItems: 'center',
                      //             marginTop: 8,
                      //             gap: 6,
                      //           }}
                      //         >
                      //           <TouchableOpacity
                      //             activeOpacity={0.8}
                      //             disabled={currentImages.length >= 3}
                      //             onPress={() =>
                      //               handleChooseImage(
                      //                 imageTabKey,
                      //                 activeTab,
                      //                 tableMstId,
                      //                 elementMstId
                      //               )
                      //             }
                      //             style={{
                      //               height: 32,
                      //               minWidth: 70,
                      //               paddingHorizontal: 10,
                      //               borderRadius: 5,
                      //               backgroundColor:
                      //                 currentImages.length >= 3
                      //                   ? '#D0D0D0'
                      //                   : '#1976D2',
                      //               justifyContent: 'center',
                      //               alignItems: 'center',
                      //               flexDirection: 'row',
                      //               gap: 4,
                      //               opacity:
                      //                 currentImages.length >= 3 ? 0.6 : 1,
                      //             }}
                      //           >
                      //             <MaterialCommunityIcons
                      //               name="camera-plus"
                      //               size={17}
                      //               color={
                      //                 currentImages.length >= 3
                      //                   ? '#999999'
                      //                   : '#FFFFFF'
                      //               }
                      //             />

                      //             <Text
                      //               style={{
                      //                 color:
                      //                   currentImages.length >= 3
                      //                     ? '#999999'
                      //                     : '#FFFFFF',
                      //                 fontSize: 11,
                      //                 fontWeight: '600',
                      //               }}
                      //             >
                      //               Photo
                      //             </Text>
                      //           </TouchableOpacity>

                      //           <TouchableOpacity
                      //             activeOpacity={0.8}
                      //             disabled={!isPdfReady}
                      //             onPress={() => 
                      //               generateImagesPDF(
                      //                   imageTabKey,
                      //                   questionId,
                      //                   elementMstId,
                      //                   tableMstId,
                      //                   cellKey
                      //                 )
                      //             }
                      //             style={{
                      //               height: 32,
                      //               minWidth: 70,
                      //               paddingHorizontal: 10,
                      //               borderRadius: 5,
                      //               backgroundColor: isPdfReady
                      //                 ? '#4CAF50'
                      //                 : '#D0D0D0',
                      //               justifyContent: 'center',
                      //               alignItems: 'center',
                      //               flexDirection: 'row',
                      //               gap: 4,
                      //             }}
                      //           >
                      //             <MaterialCommunityIcons
                      //               name="file-pdf-box"
                      //               size={18}
                      //               color={isPdfReady ? '#FFFFFF' : '#999999'}
                      //             />

                      //             <Text
                      //               style={{
                      //                 color: isPdfReady ? '#FFFFFF' : '#999999',
                      //                 fontSize: 11,
                      //                 fontWeight: '600',
                      //               }}
                      //             >
                      //               PDF
                      //             </Text>
                      //           </TouchableOpacity>

                      //           <TouchableOpacity
                      //             activeOpacity={0.8}
                      //             disabled={
                      //               isPdfReady ||
                      //               (images.before.length === 0 &&
                      //                 images.after.length === 0)
                      //             }
                      //             onPress={() => {
                      //               saveDraft(imageTabKey);
                      //             }}
                      //             style={{
                      //               height: 32,
                      //               minWidth: 70,
                      //               paddingHorizontal: 10,
                      //               borderRadius: 5,
                      //               backgroundColor:
                      //                 !isPdfReady &&
                      //                 (images.before.length > 0 ||
                      //                   images.after.length > 0)
                      //                   ? '#FF9800'
                      //                   : '#D0D0D0',
                      //               justifyContent: 'center',
                      //               alignItems: 'center',
                      //               flexDirection: 'row',
                      //               gap: 4,
                      //               opacity:
                      //                 isPdfReady ||
                      //                 (images.before.length === 0 &&
                      //                   images.after.length === 0)
                      //                   ? 0.6
                      //                   : 1,
                      //             }}
                      //           >
                      //             <MaterialCommunityIcons
                      //               name="content-save-outline"
                      //               size={17}
                      //               color={
                      //                 !isPdfReady &&
                      //                 (images.before.length > 0 ||
                      //                   images.after.length > 0)
                      //                   ? '#FFFFFF'
                      //                   : '#999999'
                      //               }
                      //             />

                      //             <Text
                      //               style={{
                      //                 color:
                      //                   !isPdfReady &&
                      //                   (images.before.length > 0 ||
                      //                     images.after.length > 0)
                      //                     ? '#FFFFFF'
                      //                     : '#999999',
                      //                 fontSize: 11,
                      //                 fontWeight: '600',
                      //               }}
                      //             >
                      //               Draft
                      //             </Text>
                      //           </TouchableOpacity>
                      //         </View>

                      //         {currentImages.length > 0 && (
                      //           <View
                      //             style={{
                      //               flexDirection: 'row',
                      //               marginTop: 8,
                      //               gap: 6,
                      //             }}
                      //           >
                      //             {currentImages.map(
                      //               (image: any, index: number) => (
                      //                 <View
                      //                   key={index}
                      //                   style={{
                      //                     width: 55,
                      //                     height: 55,
                      //                     borderRadius: 5,
                      //                     overflow: 'hidden',
                      //                     borderWidth: 1,
                      //                     borderColor: '#D0D0D0',
                      //                   }}
                      //                 >
                      //                   <TouchableOpacity
                      //                     activeOpacity={0.8}
                      //                     onPress={() =>
                      //                       openImagePreview(image)
                      //                     }
                      //                     style={{
                      //                       width: '100%',
                      //                       height: '100%',
                      //                     }}
                      //                   >
                      //                     <Image
                      //                       source={{
                      //                         uri: image.uri,
                      //                       }}
                      //                       style={{
                      //                         width: '100%',
                      //                         height: '100%',
                      //                       }}
                      //                       resizeMode="cover"
                      //                       onLoad={() => {
                      //                         console.log(
                      //                           'Thumbnail loaded:',
                      //                           image.uri,
                      //                         );
                      //                       }}
                      //                       onError={error => {
                      //                         console.log(
                      //                           'Thumbnail load error:',
                      //                           image.uri,
                      //                           error.nativeEvent,
                      //                         );
                      //                       }}
                      //                     />
                      //                   </TouchableOpacity>

                      //                   <TouchableOpacity
                      //                     activeOpacity={0.8}
                      //                     onPress={() => {
                      //                       setTableImages(prev => ({
                      //                         ...prev,

                      //                         [imageTabKey]: {
                      //                           ...prev[imageTabKey],

                      //                           [activeTab]: prev[imageTabKey][
                      //                             activeTab
                      //                           ].filter(
                      //                             (_: any, i: number) =>
                      //                               i !== index,
                      //                           ),
                      //                         },
                      //                       }));
                      //                     }}
                      //                     style={{
                      //                       position: 'absolute',
                      //                       right: 2,
                      //                       top: 2,
                      //                       width: 18,
                      //                       height: 18,
                      //                       borderRadius: 9,
                      //                       backgroundColor: 'rgba(0,0,0,0.65)',
                      //                       justifyContent: 'center',
                      //                       alignItems: 'center',
                      //                     }}
                      //                   >
                      //                     <Text
                      //                       style={{
                      //                         color: '#fff',
                      //                         fontSize: 13,
                      //                         lineHeight: 16,
                      //                         fontWeight: 'bold',
                      //                       }}
                      //                     >
                      //                       ×
                      //                     </Text>
                      //                   </TouchableOpacity>
                      //                 </View>
                      //               ),
                      //             )}
                      //           </View>
                      //         )}
                      //       </View>

                      //       {colIndex === row.length - 1 && (
                      //         <View
                      //           style={[
                      //             styles.tableCell,
                      //             {
                      //               width: 120,
                      //               justifyContent: 'center',
                      //               alignItems: 'center',
                      //               borderWidth: 1,
                      //               borderColor: '#ccc',
                      //             },
                      //           ]}
                      //         >
                      //           <TouchableOpacity
                      //             style={styles.deleteBtn}
                      //             onPress={() => handleDeleteRow(rowIndex, row)}
                      //           >
                      //             <Text style={{ color: '#fff' }}>Delete</Text>
                      //           </TouchableOpacity>
                      //         </View>
                      //       )}
                      //     </>
                      //   );
                      // }

                      return (
                        <>
                          <View
                            key={colIndex}
                            style={[
                              styles.tableCell,
                              getColumnStyle(colIndex, row.length),
                            ]}
                          >
                            <Text style={styles.cellText}>{cell.value}</Text>
                          </View>

                          {colIndex === row.length - 1 && (
                            <TouchableOpacity
                              style={styles.deleteBtn}
                              onPress={() => handleDeleteRow(rowIndex, row)}
                            >
                              <Text style={{ color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      }

      default:
        return null;
    }
  };

  
    const renderProgress = () => {
      return (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.progressContainer}
          >
            {steps.map((step: Step, index: number) => {
              const isActive = index === activeStepIndex;
              const isSubmitted = submittedSteps.includes(index);
              const isAnswered = Number(step.anssum || 0) > 0;
              const isCompleted = isSubmitted || isAnswered;
  
              const previousCompleted =
                index > 0 &&
                (submittedSteps.includes(index - 1) ||
                  Number(steps[index - 1]?.anssum || 0) > 0);
  
              return (
                <React.Fragment
                  key={String(step.questionid ?? step.srNo ?? index)}
                >
                  {index !== 0 && (
                    <View
                      style={[
                        styles.progressLine,
                        previousCompleted && styles.progressLineCompleted,
                      ]}
                    />
                  )}
  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onStepPress(index, step.questionid)}
                  >
                    <View
                      style={[
                        styles.progressCircle,
                        isCompleted && styles.progressCircleCompleted,
                        isActive && styles.progressCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.progressText,
                          isCompleted && styles.progressTextCompleted,
                          isActive && styles.progressTextActive,
                        ]}
                      >
                        {step.srNo}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </>
      );
    };

  const isPdf = previewUrl?.toLowerCase().includes('.pdf');
  const isImage =
    /\.(jpg|jpeg|png)$/i.test(previewUrl) ||
    previewFileName?.match(/\.(jpg|jpeg|png)$/i);

  const formNo = 7; // set manually for now
  const currentQuestionNumber = activeStepIndex + 1; // 1-based numbering
  const questionIdForHeading =
    steps[activeStepIndex] ?? questions[activeStepIndex]?.questionid ?? '';
  const activeQuestionName =
    questionDetails[0]?.rdformquestionname ??
    questions[activeStepIndex]?.questionname ??
    '';
  renderedTableSet.current.clear();
  let questionNumber = 1;

  // return (
  //   <View style={styles.container}>
  //     {/* TOOLBAR */}
  //     <View style={styles.toolbar}>
  //       <Text style={styles.toolbarTitle}>
  //         लोकसहभाग व श्रमदान माध्यमातून लोकचळवळ निर्माण करणे
  //       </Text>
  //       <Text style={styles.toolbarSubtitle}>(Good Governance)</Text>
  //     </View>

  //     {/* STEPS */}

  //     <ScrollView
  //       ref={scrollRef}
  //       horizontal
  //       showsHorizontalScrollIndicator={false}
  //       contentContainerStyle={styles.stepContainer}
  //     >
  //       {steps.map((step: Step, index: number) => {
  //         const isActive = index === activeStepIndex;
  //         const isSubmitted = submittedSteps.includes(index);
  //         const isAnswered = step.anssum > 0;

  //         return (
  //           <TouchableOpacity
  //             key={step.questionid}
  //             onPress={() => onStepPress(index, step.questionid)}
  //           >
  //             <View
  //               style={[
  //                 styles.stepCircle,
  //                 isActive && styles.activeStep,
  //                 isSubmitted && styles.submittedStep,
  //                 isAnswered && styles.submittedStep,
  //               ]}
  //             >
  //               <Text
  //                 style={[
  //                   styles.stepText,
  //                   isActive
  //                     ? { color: '#FFF' }
  //                     : isAnswered
  //                     ? { color: '#000' }
  //                     : styles.inactiveText,
  //                 ]}
  //               >
  //                 {step.srNo}
  //               </Text>
  //             </View>
  //           </TouchableOpacity>
  //         );
  //       })}
  //     </ScrollView>

  //     <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
  //       <View style={styles.card}>
  //         <Text style={styles.heading}>
  //           {`${formNo}.${currentQuestionNumber}: ${
  //             activeQuestionName || 'प्रश्न'
  //           }`}
  //         </Text>

  //         {loadingDetails ? (
  //           <ActivityIndicator size="small" />
  //         ) : (
  //           <>
  //             {questionDetails.map((item: any) => {
  //               if (item.rdformelementid === 5) {
  //                 if (renderedTableSet.current.has(item.rdformelementno)) {
  //                   return null;
  //                 }
  //                 renderedTableSet.current.add(item.rdformelementno);

  //                 const currentNumber = questionNumber;
  //                 questionNumber++;

  //                 return (
  //                   <View
  //                     key={item.rdformelementno}
  //                     style={styles.fieldWrapper}
  //                   >
  //                     <Text
  //                       style={styles.label}
  //                     >{`${currentNumber}. ${item.rdformlablename}`}</Text>
  //                     {renderControl(item)}
  //                   </View>
  //                 );
  //               }

  //               const currentNumber = questionNumber;
  //               questionNumber++;

  //               return (
  //                 <View
  //                   key={String(item.rdformelementno)}
  //                   style={styles.fieldWrapper}
  //                 >
  //                   <Text
  //                     style={styles.label}
  //                   >{`${currentNumber}. ${item.rdformlablename}`}</Text>
  //                   {renderControl(item)}
  //                 </View>
  //               );
  //             })}

  //             {/* <View style={styles.btnRow}>
  //               {activeStepIndex > 0 && (
  //                 <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
  //                   <Text style={styles.btnText}>मागील</Text>
  //                 </TouchableOpacity>
  //               )}

  //               {!isFormFinalSubmitted &&
  //                 !(isLastQuestion && isLastQuestionSubmitted) && (
  //                   <TouchableOpacity
  //                     style={styles.prevBtn}
  //                     onPress={handleSubmit}
  //                   >
  //                     <Text style={styles.btnText}>सबमिट</Text>
  //                   </TouchableOpacity>
  //                 )}

  //               {isLastQuestion &&
  //                 isLastQuestionSubmitted &&
  //                 !isFormFinalSubmitted && (
  //                   <TouchableOpacity
  //                     style={styles.submitBtn}
  //                     onPress={finalSubmitForm}
  //                   >
  //                     <Text style={styles.btnText}>फायनल सबमिट</Text>
  //                   </TouchableOpacity>
  //                 )}

  //               {activeStepIndex < totalSteps - 1 && (
  //                 <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
  //                   <Text style={styles.btnText}>पुढे</Text>
  //                 </TouchableOpacity>
  //               )}
  //             </View> */}
  //           </>
  //         )}
  //       </View>

  //       <View style={styles.btnWrapper}>
  //         {/* Row 1: Actions (Save Step & Final Submit) */}
  //         <View style={styles.btnRow}>
  //           {!isFormFinalSubmitted && (
  //             <TouchableOpacity
  //               style={[styles.btn, styles.submitBtn]}
  //               onPress={handleSubmit}
  //               activeOpacity={0.8}
  //             >
  //               <Text style={styles.btnText}>सबमिट</Text>
  //             </TouchableOpacity>
  //           )}

  //           {allStepsSubmitted && !isFormFinalSubmitted && (
  //             <TouchableOpacity
  //               style={[styles.btn, styles.finalSubmitBtn]}
  //               onPress={finalSubmitForm}
  //               activeOpacity={0.8}
  //             >
  //               <Text style={styles.btnText}>फायनल सबमिट</Text>
  //             </TouchableOpacity>
  //           )}
  //         </View>

  //         {/* Row 2: Step Navigation (Previous & Next) */}
  //         {(activeStepIndex > 0 || activeStepIndex < totalSteps - 1) && (
  //           <View style={styles.btnRow}>
  //             {activeStepIndex > 0 ? (
  //               <TouchableOpacity
  //                 style={[styles.btn, styles.navBtn, styles.prevBtn]}
  //                 onPress={handlePrev}
  //                 activeOpacity={0.8}
  //               >
  //                 <Text style={styles.prevBtnText}>मागील</Text>
  //               </TouchableOpacity>
  //             ) : (
  //               <View style={styles.placeholder} />
  //             )}

  //             {activeStepIndex < totalSteps - 1 ? (
  //               <TouchableOpacity
  //                 style={[styles.btn, styles.navBtn, styles.nextBtn]}
  //                 onPress={handleNext}
  //                 activeOpacity={0.8}
  //               >
  //                 <Text style={styles.btnText}>पुढे</Text>
  //               </TouchableOpacity>
  //             ) : (
  //               <View style={styles.placeholder} />
  //             )}
  //           </View>
  //         )}
  //       </View>
  //     </ScrollView>
  //     <Modal
  //       visible={previewVisible}
  //       animationType="slide"
  //       onRequestClose={() => setPreviewVisible(false)}
  //     >
  //       <View style={{ flex: 1 }}>
  //         <View
  //           style={{
  //             height: 50,
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignItems: 'center',
  //             paddingHorizontal: 15,
  //             backgroundColor: '#fff',
  //           }}
  //         >
  //           <Text
  //             style={{
  //               fontSize: 16,
  //               fontWeight: 'bold',
  //               flex: 1,
  //             }}
  //             numberOfLines={1}
  //           >
  //             {previewFileName}
  //           </Text>

  //           <TouchableOpacity onPress={() => setPreviewVisible(false)}>
  //             <Text style={{ color: 'red' }}>Close</Text>
  //           </TouchableOpacity>
  //         </View>

  //         {isPdf ? (
  //           <Pdf
  //             source={{ uri: previewUrl }}
  //             style={{ flex: 1 }}
  //             trustAllCerts={false}
  //           />
  //         ) : isImage ? (
  //           <Image
  //             source={{ uri: previewUrl }}
  //             style={{ flex: 1 }}
  //             resizeMode="contain"
  //           />
  //         ) : (
  //           <View
  //             style={{
  //               flex: 1,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //             }}
  //           >
  //             <Text>Preview not available.</Text>
  //           </View>
  //         )}
  //       </View>
  //     </Modal>

  //     {showDatePicker && (
  //       <DateTimePicker
  //         value={new Date()}
  //         mode="date"
  //         display="default"
  //         onChange={(event, selectedDate) => {
  //           setShowDatePicker(false);
  //           if (event.type === 'dismissed') {
  //             return;
  //           }

  //           if (!selectedDate || !selectedDateKey) {
  //             return;
  //           }

  //           const minDate = new Date(2025, 9, 17);
  //           const maxDate = new Date(2026, 3, 31);

  //           if (selectedDate < minDate || selectedDate > maxDate) {
  //             Alert.alert(
  //               'Information',
  //               'कृपया १७-०९-२०२५ ते ३१-०३-२०२६ या दरम्यानची तारीख निवडा.',
  //             );
  //             return;
  //           }

  //           const day = String(selectedDate.getDate()).padStart(2, '0');
  //           const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  //           const year = selectedDate.getFullYear();
  //           const formattedDate = `${day}-${month}-${year}`;

  //           setAnswers(prev => ({
  //             ...prev,
  //             [selectedDateKey.key]: {
  //               ...prev[selectedDateKey.key],
  //               value: formattedDate,
  //               QuestionId: selectedDateKey.questionId,
  //               ElementMasterId: selectedDateKey.elementMasterId,
  //               TableMstID: selectedDateKey.tableMstID,
  //               //TableMstID: rowTableMstID,
  //               FormNoVal: 7,
  //               IsFromMobileApp: 1,
  //               isEdited: true,
  //             },
  //           }));
  //         }}
  //       />
  //     )}

  //     {loading && (
  //       <View style={styles.loaderOverlay}>
  //         <ActivityIndicator size="large" color="#2E7D32" />
  //         <Text style={styles.loaderText}>Loading...</Text>
  //       </View>
  //     )}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarTextContainer}>
          <Text style={styles.toolbarTitle}>
            7. लोकसहभाग व श्रमदान माध्यमातून लोकचळवळ निर्माण करणे
          </Text>
          <Text style={styles.toolbarSubtitle}>Good Governance</Text>
        </View>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Form Progress</Text>

              <Text style={styles.progressSubtitle}>
                प्रश्न {activeStepIndex + 1} पैकी {totalSteps}
              </Text>
            </View>

            <View style={styles.progressCountBadge}>
              <Text style={styles.progressCountText}>
                {activeStepIndex + 1}/{totalSteps}
              </Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepContainer}
          >
            {steps.map((step: Step, index: number) => {
              const isActive = index === activeStepIndex;
              const isSubmitted = submittedSteps.includes(index);
              const isAnswered = step.anssum > 0;
              const isCompleted = isSubmitted || isAnswered;

              return (
                <View key={String(step.questionid)} style={styles.stepItem}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onStepPress(index, step.questionid)}
                  >
                    <View
                      style={[
                        styles.stepCircle,
                        isCompleted && styles.completedStepCircle,
                        isActive && styles.currentStepBorder,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepText,
                          isCompleted && styles.completedStepText,
                        ]}
                      >
                        {step.srNo}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.completedStepLine,
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View> */}

        <View style={styles.progressCard}>{renderProgress()}</View>

        <View style={styles.questionHeader}>
          <Text style={styles.formNumberText}>FORM {formNo}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopSection}>
            <View style={styles.cardHeadingContainer}>
              <Text style={styles.heading}>
                {`${formNo}.${currentQuestionNumber}: ${
                  activeQuestionName || 'प्रश्न'
                }`}
              </Text>

              <Text style={styles.cardDescription}>
                कृपया खालील माहिती काळजीपूर्वक भरा
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {loadingDetails ? (
            <View style={styles.questionLoaderContainer}>
              <ActivityIndicator size="large" color="#0B63B6" />
              <Text style={styles.questionLoaderText}>
                प्रश्नाची माहिती लोड होत आहे...
              </Text>
            </View>
          ) : (
            <>
              {(() => {
                renderedTableSet.current.clear();
                let questionNumber = 1;

                return questionDetails.map((item: any) => {
                  if (item.rdformelementid === 5) {
                    if (renderedTableSet.current.has(item.rdformelementno)) {
                      return null;
                    }

                    renderedTableSet.current.add(item.rdformelementno);

                    const currentNumber = questionNumber;
                    questionNumber += 1;

                    return (
                      <View
                        key={String(item.rdformelementno)}
                        style={styles.fieldWrapper}
                      >
                        <View style={styles.fieldLabelRow}>
                          <View style={styles.fieldNumberCircle}>
                            <Text style={styles.fieldNumberText}>
                              {currentNumber}
                            </Text>
                          </View>

                          <Text style={styles.label}>
                            {item.rdformlablename}
                          </Text>
                        </View>

                        <View style={styles.controlContainer}>
                          {renderControl(item)}
                        </View>
                      </View>
                    );
                  }

                  const currentNumber = questionNumber;
                  questionNumber += 1;

                  return (
                    <View
                      key={String(item.rdformelementno)}
                      style={styles.fieldWrapper}
                    >
                      <View style={styles.fieldLabelRow}>
                        <View style={styles.fieldNumberCircle}>
                          <Text style={styles.fieldNumberText}>
                            {currentNumber}
                          </Text>
                        </View>

                        <Text style={styles.label}>{item.rdformlablename}</Text>
                      </View>

                      <View style={styles.controlContainer}>
                        {renderControl(item)}
                      </View>
                    </View>
                  );
                });
              })()}

              <View style={styles.buttonDivider} />

              <View style={styles.btnWrapper}>
                <View style={styles.btnRow}>
                  {!isFormFinalSubmitted && (
                    <TouchableOpacity
                      style={[styles.btn, styles.submitBtn]}
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnText}>सबमिट</Text>
                    </TouchableOpacity>
                  )}

                  {allStepsSubmitted && !isFormFinalSubmitted && (
                    <TouchableOpacity
                      style={[styles.btn, styles.finalSubmitBtn]}
                      onPress={finalSubmitForm}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnText}>फायनल सबमिट</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {(activeStepIndex > 0 || activeStepIndex < totalSteps - 1) && (
                  <View style={styles.btnRow}>
                    {activeStepIndex > 0 ? (
                      <TouchableOpacity
                        style={[styles.btn, styles.navBtn, styles.prevBtn]}
                        onPress={handlePrev}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.prevBtnText}>मागील</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.placeholder} />
                    )}

                    {activeStepIndex < totalSteps - 1 ? (
                      <TouchableOpacity
                        style={[styles.btn, styles.navBtn, styles.nextBtn]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.btnText}>पुढे</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.placeholder} />
                    )}
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === 'dismissed') {
              return;
            }

            if (!selectedDate || !selectedDateKey) {
              return;
            }

            const minDate = new Date(2025, 9, 17);
            const maxDate = new Date(2026, 3, 31);

            if (selectedDate < minDate || selectedDate > maxDate) {
              Alert.alert(
                'Information',
                'कृपया १७-०९-२०२५ ते ३१-०३-२०२६ या दरम्यानची तारीख निवडा.',
              );
              return;
            }

            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            setAnswers(prev => ({
              ...prev,
              [selectedDateKey.key]: {
                ...prev[selectedDateKey.key],
                value: formattedDate,
                QuestionId: selectedDateKey.questionId,
                ElementMasterId: selectedDateKey.elementMasterId,
                TableMstID: selectedDateKey.tableMstID,
                //TableMstID: rowTableMstID,
                FormNoVal: 7,
                IsFromMobileApp: 1,
                isEdited: true,
              },
            }));
          }}
        />
      )}

      <Modal
        visible={previewImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.95)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* CLOSE */}
          <TouchableOpacity
            onPress={() => setPreviewImage(null)}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              top: 45,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 28,
                lineHeight: 30,
              }}
            >
              ×
            </Text>
          </TouchableOpacity>

          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={{
                width: '95%',
                height: '80%',
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={previewVisible}
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <View style={styles.previewHeaderIcon}>
              <Icon
                name={isPdf ? 'file-pdf-box' : 'file-image-outline'}
                size={24}
                color="#0B63B6"
              />
            </View>

            <Text style={styles.previewFileName} numberOfLines={1}>
              {previewFileName}
            </Text>

            <TouchableOpacity
              style={styles.previewCloseButton}
              onPress={() => setPreviewVisible(false)}
            >
              <Icon name="close" size={23} color="#C4413A" />
            </TouchableOpacity>
          </View>

          {isPdf ? (
            <Pdf
              source={{ uri: previewUrl }}
              style={styles.previewContent}
              trustAllCerts={false}
            />
          ) : isImage ? (
            <Image
              source={{ uri: previewUrl }}
              style={styles.previewContent}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.previewUnavailable}>
              <Icon name="file-question-outline" size={52} color="#839089" />

              <Text style={styles.previewUnavailableTitle}>
                Preview not available
              </Text>

              <Text style={styles.previewUnavailableText}>
                या फाईल प्रकारासाठी पूर्वावलोकन उपलब्ध नाही.
              </Text>
            </View>
          )}
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      {isProcessingImage && (
        <View style={styles.loaderOverlay1}>
          <View style={styles.loaderBox1}>
            <ActivityIndicator size="large" color="#0B63B6" />

            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        </View>
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
}

// const styles = StyleSheet.create({
//   stepContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     backgroundColor: '#e8e8e8',
//     paddingHorizontal: 8,
//   },
//   btnWrapper: {
//     width: '100%',
//     paddingHorizontal: 16,
//     marginVertical: 16,
//     gap: 10, // vertical spacing between rows
//   },
//   btnRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 10,
//     width: '100%',
//   },
//   btn: {
//     flex: 1,
//     paddingVertical: 13,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 46,
//   },
//   placeholder: {
//     flex: 1,
//   },

//   saveBtn: {
//     backgroundColor: '#0B4FA3',
//   },
//   finalSubmitBtn: {
//     backgroundColor: '#1B8F4D',
//   },
//   navBtn: {
//     backgroundColor: '#0B4FA3',
//   },
//   submitBtn: {
//     backgroundColor: 'rgb(236, 190, 62)',
//   },
//   prevBtn: {
//     backgroundColor: '#EAEAEA',
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//   },
//   nextBtn: {
//     backgroundColor: '#0B4FA3',
//   },

//   btnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   prevBtnText: {
//     color: '#333333',
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//   },

//   finalsubmitBtn: {
//     backgroundColor: '#1b8f4d',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   submitText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   tableScrollWrapper: {
//     width: '100%',
//     overflow: 'hidden',
//   },

//   deleteBtn: {
//     width: 'auto',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'red',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 8,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#e8e8e8',
//   },

//   // Toolbar
//   toolbar: {
//     backgroundColor: '#004aad',
//     paddingTop: 55,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   toolbarTitle: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   toolbarSubtitle: {
//     color: 'white',
//     fontSize: 14,
//     marginTop: 4,
//   },

//   // Steps
//   // stepContainer: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'center',
//   //   paddingVertical: 15,
//   //   backgroundColor: '#e8e8e8',
//   // },
//   stepCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: '#999',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   stepText: { color: '#777' },
//   activeStep: {
//     backgroundColor: '#0a3d69',
//     borderColor: '#1b8f4d',
//   },
//   submittedStep: {
//     backgroundColor: '#1b8f4d', // ✅ change to green after submit
//   },
//   activeStepText: { color: 'white', fontWeight: 'bold' },
//   inactiveText: {
//     color: '#000',
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20, // spacing above/below the step row
//   },
//   // Card
//   card: {
//     backgroundColor: 'white',
//     margin: 15,
//     padding: 15,
//     borderRadius: 12,
//     elevation: 4,
//   },
//   heading: { fontSize: 16, fontWeight: '600', marginBottom: 15 },

//   label: { marginTop: 8, marginBottom: 6, fontSize: 14 },

//   dropdown: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//   },

//   checkboxRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   checkboxLabel: { marginLeft: 8 },

//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//   },

//   // File
//   fieldWrapper: { marginBottom: 6 },
//   fileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
//   chooseBtn: {
//     backgroundColor: '#e0e0e0',
//     padding: 10,
//     borderRadius: 8,
//   },
//   noFile: {
//     // marginLeft: 10
//     //flex: 1,
//     marginLeft: 8,
//   },

//   tooltipText: { color: 'red', marginTop: 4 },
//   tooltipText1: { color: 'blue', marginTop: 4 },
//   note: { color: 'red', marginTop: 10, fontSize: 12 },

//   fileItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },

//   // submitBtn: {
//   //   backgroundColor: '#1b8f4d',
//   //   padding: 15,
//   //   borderRadius: 10,
//   //   alignItems: 'center',
//   // },
//   // submitText: {
//   //   color: 'white',
//   //   fontSize: 16,
//   //   fontWeight: '600',
//   // },
//   // btnRow: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   //   marginVertical: 15,
//   //   alignItems: 'center',
//   //   width: '100%',
//   // },
//   // nextBtn: {
//   //   backgroundColor: '#0B4FA3',
//   //   paddingVertical: 15,
//   //   paddingHorizontal: 25,
//   //   borderRadius: 10,
//   // },

//   // prevBtn: {
//   //   backgroundColor: '#0B4FA3',
//   //   paddingVertical: 15,
//   //   paddingHorizontal: 25,
//   //   borderRadius: 10,
//   // },
//   // btnText: {
//   //   color: '#fff',
//   //   fontSize: 16,
//   //   fontWeight: '600',
//   // },
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginVertical: 12,
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     alignItems: 'stretch',
//   },
//   tableCell: {
//     //borderRightWidth: 1,
//     // borderBottomWidth: 1,
//     borderColor: '#ddd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 100, // consistent column width
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//     borderWidth: 1,
//     //borderColor: '#D0D0D0',
//   },
//   headerCell: {
//     backgroundColor: '#0B4FA3', // blue header background
//     borderBottomWidth: 2,
//     borderColor: '#ccc',
//   },
//   cellText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//   },
//   headerText: {
//     fontWeight: '700',
//     color: '#fff', // white text for header
//     textAlign: 'center',
//   },
//   tableInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     minWidth: 100,
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     textAlign: 'center',
//     // backgroundColor: '#fff',
//   },
//   tableDropdown: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     minWidth: 100,
//     paddingHorizontal: 6,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   disabledInput: {
//     backgroundColor: '#f2f2f2',
//     color: '#999',
//   },
//   disabledBtn: {
//     backgroundColor: '#ccc',
//     opacity: 0.6,
//   },
//   loaderOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },

//   loaderText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

const COLORS = {
  // Main blue theme
  primary: '#0B63B6',
  primaryDark: '#084A8A',
  primaryLight: '#E6F1FB',
  completed: '#63B65D',

  // Screen surfaces
  background: '#F3F5F7',
  card: '#FFFFFF',

  // Text
  textPrimary: '#202A33',
  textSecondary: '#687683',
  textMuted: '#8A959E',

  // Inputs and borders
  border: '#CDD6DE',
  inputBackground: '#FFFFFF',
  disabledBackground: '#EFF2F4',

  // Status colors
  danger: '#D64545',
  dangerLight: '#FCEAEA',

  warning: '#A76500',
  warningLight: '#FFF3DD',
};

const styles = StyleSheet.create({
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5EAE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD6E0',
  },

  progressCircleCompleted: {
    backgroundColor: COLORS.completed,
    borderColor: COLORS.completed,
  },

  progressCircleActive: {
    borderColor: '#1976D2',
    borderWidth: 2,
  },

  progressText: {
    color: '#65716B',
    fontSize: 13,
    fontWeight: '600',
  },

  progressTextCompleted: {
    color: '#FFFFFF',
  },

  progressLine: {
    width: 19,
    height: 2,
    backgroundColor: '#D7E0E8',
  },

  progressLineCompleted: {
    backgroundColor: COLORS.completed,
  },

  progressTextActive: {
    color: '#FFFFFF',
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 17,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  loaderOverlay1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },

  loaderBox1: {
    width: 135,
    minHeight: 115,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  loaderText1: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  currentStepBorder: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  formNumberText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingLeft: 10,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    elevation: 1,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E4E9E6',
    marginTop: 10,
  },

  fieldWrapper: {
    marginTop: 15,
  },
  controlContainer: {
    marginLeft: 20,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.inputBackground,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  dropdown: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.inputBackground,
  },

  buttonDivider: {
    height: 1,
    backgroundColor: '#E4E9E6',
    marginTop: 20,
    marginBottom: 10,
  },

  secondaryButton: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  saveButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finalSubmitButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: COLORS.completed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 6,
  },

  previewFileName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 11,
  },

  previewUnavailableTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 13,
  },

  btnWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 10,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  placeholder: {
    flex: 1,
  },

  saveBtn: {
    backgroundColor: '#0B4FA3',
  },
  finalSubmitBtn: {
    backgroundColor: '#1B8F4D',
  },
  navBtn: {
    backgroundColor: '#0B4FA3',
  },
  submitBtn: {
    backgroundColor: 'rgb(236, 190, 62)',
  },
  prevBtn: {
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  nextBtn: {
    backgroundColor: '#0B4FA3',
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  prevBtnText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  finalsubmitBtn: {
    backgroundColor: '#1b8f4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },

  tableCell1: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderWidth: 1,
  },

  tableScrollWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  mainScrollView: {
    flex: 1,
  },

  mainContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 50,
  },

  toolbar: {
    minHeight: 94,
    paddingTop: Platform.OS === 'android' ? 34 : 48,
    paddingBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },

  toolbarIconButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolbarTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },

  toolbarTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 27,
  },

  toolbarSubtitle: {
    color: '#D9E7E1',
    fontSize: 12,
    marginTop: 2,
  },

  // progressCard: {
  //   backgroundColor: COLORS.card,
  //   borderRadius: 16,
  //   paddingHorizontal: 14,
  //   paddingVertical: 15,

  //   elevation: 3,
  //   shadowColor: '#000000',
  //   shadowOpacity: 0.08,
  //   shadowRadius: 8,
  //   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  // },

   progressContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  progressLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  progressSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  progressCountBadge: {
    minWidth: 46,
    height: 31,
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCountText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingRight: 12,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5D0',
    backgroundColor: '#E9EEEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeStepCircle: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  completedStepCircle: {
    backgroundColor: COLORS.completed,
    borderColor: COLORS.completed,
  },

  stepText: {
    color: '#66736D',
    fontSize: 14,
    fontWeight: '700',
  },

  activeStepText: {
    color: '#FFFFFF',
  },

  completedStepText: {
    color: '#FFFFFF',
  },

  stepLine: {
    width: 22,
    height: 2,
    backgroundColor: '#D9E0DC',
  },

  completedStepLine: {
    backgroundColor: COLORS.completed,
  },

  questionHeader: {
    marginTop: 22,
    marginBottom: 13,
  },

  questionHeaderTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    lineHeight: 29,
    fontWeight: '700',
    marginTop: 4,
  },

  cardTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardHeadingContainer: {
    flex: 1,
    marginLeft: 12,
  },

  cardDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  fieldNumberCircle: {
    minWidth: 27,
    height: 27,
    borderRadius: 14,
    paddingHorizontal: 5,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  fieldNumberText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  label: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },

  disabledInput: {
    backgroundColor: COLORS.disabledBackground,
    borderColor: '#DCE3DF',
    color: '#818B86',
  },

  checkboxRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DEE5E1',
    backgroundColor: '#F8FAF9',
  },

  checkboxLabel: {
    flex: 1,
    color: '#394740',
    fontSize: 14,
    marginLeft: 10,
  },

  fileRow: {
    minHeight: 67,
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#F8FAF9',
    flexDirection: 'row',
    alignItems: 'center',
  },

  chooseBtn: {
    minHeight: 42,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: '#BDD0C6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chooseBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  noFile: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 10,
  },

  disabledBtn: {
    backgroundColor: COLORS.disabledBackground,
    borderColor: '#D8DEDB',
    opacity: 0.6,
  },

  tooltipText: {
    color: COLORS.danger,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  tooltipText1: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  note: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 8,
  },

  fileItem: {
    marginTop: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tableContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#D7DFDB',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  tableCell: {
    minWidth: 115,
    minHeight: 57,
    paddingHorizontal: 7,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DCE3DF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCell: {
    minHeight: 62,
    backgroundColor: COLORS.primary,
    borderColor: '#577769',
  },

  cellText: {
    color: '#3E4C45',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  headerText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  tableInput: {
    minWidth: 115,
    minHeight: 54,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5D0',
    backgroundColor: '#FFFFFF',
    color: COLORS.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },

  tableDropdown: {
    minWidth: 115,
    minHeight: 54,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#CBD5D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },

  questionLoaderContainer: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionLoaderText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
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

  loaderText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 11,
  },

  previewContainer: {
    flex: 1,
    backgroundColor: '#F3F5F4',
  },

  previewHeader: {
    minHeight: 66,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? 7 : 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6E3',
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewCloseButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewContent: {
    flex: 1,
  },

  previewUnavailable: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewUnavailableText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
});
