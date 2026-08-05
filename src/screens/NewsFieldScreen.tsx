import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  primary: '#0B4FA3',
  primaryDark: '#083B7C',
  primaryLight: '#EAF2FF',

  background: '#F4F7FB',
  card: '#FFFFFF',

  textPrimary: '#1E293B',
  textSecondary: '#64748B',

  border: '#D8E0EA',

  success: '#16803C',
  danger: '#D92D20',
};

type NewsItem = {
  id: number;
  jobName: string;
  description: string;
  files: string[];
};

const NewsFieldScreen = ({navigation}: any) => {
  const [jobName, setJobName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      id: 1,
      jobName: 'Job Title',
      description:
        'Tell me the context, and I will give you an exact and suitable job name.',
      files: ['Document 1.pdf', 'Document 2.pdf'],
    },
    {
      id: 2,
      jobName: 'Test News',
      description: 'Could you please clarify what you mean by job description',
      files: ['NewsDocument.pdf'],
    },
    {
      id: 3,
      jobName: 'Activities',
      description:
        'Could you please clarify what you mean by job description and I will give you an exact and suitable job name.',
      files: ['Activity.pdf'],
    },
    {
      id: 4,
      jobName: 'Job',
      description: 'Job description in detail',
      files: ['JobDocument.pdf'],
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'News Fields',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: '#FFFFFF',
    });
  }, [navigation]);

  const handleChooseFile = () => {
    // Replace this with your actual DocumentPicker logic.
    setSelectedFiles(prev => [
      ...prev,
      `Document_${prev.length + 1}.pdf`,
    ]);
  };

  const handleAdd = () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Validation', 'Please choose a file.');
      return;
    }

    Alert.alert('Added', 'File added successfully.');
  };

  const handleSubmit = () => {
    if (!jobName.trim()) {
      Alert.alert('Validation', 'कृपया कामाचे नाव भरा.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation', 'कृपया कामाचे वर्णन/तपशील भरा.');
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Validation', 'कृपया फाईल निवडा.');
      return;
    }

    const newItem: NewsItem = {
      id: newsList.length + 1,
      jobName: jobName.trim(),
      description: description.trim(),
      files: selectedFiles,
    };

    setNewsList(prev => [...prev, newItem]);

    handleReset();

    Alert.alert('Success', 'Record submitted successfully.');
  };

  const handleReset = () => {
    setJobName('');
    setDescription('');
    setSelectedFiles([]);
  };

  const handleFilePress = (file: string) => {
    Alert.alert('File', file);

    // Add your actual file preview/download logic here.
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* FORM CARD */}
        <View style={styles.formCard}>

          {/* Top Icon */}
          <View style={styles.iconContainer}>
            <Icon
              name="bullhorn-outline"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.formTitle}>
            उपक्रम (ACTIVITIES)
          </Text>

          {/* Job Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              कामाचे नाव
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={jobName}
              onChangeText={setJobName}
              style={styles.input}
              placeholder="कामाचे नाव प्रविष्ट करा"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              कामाचे वर्णन/तपशील
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              placeholder="कामाचे वर्णन/तपशील प्रविष्ट करा"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* FILE */}
          <Text style={styles.label}>
            फाईल
          </Text>

          <View style={styles.fileRow}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              activeOpacity={0.8}
              onPress={handleChooseFile}>

              <Icon
                name="paperclip"
                size={19}
                color={COLORS.primary}
              />

              <Text style={styles.chooseFileText}>
                Choose File
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.8}
              onPress={handleAdd}>

              <Icon
                name="plus"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.addButtonText}>
                Add
              </Text>

            </TouchableOpacity>
          </View>

          {selectedFiles.length === 0 ? (
            <Text style={styles.noFileText}>
              No file chosen
            </Text>
          ) : (
            <View style={styles.selectedFilesContainer}>
              {selectedFiles.map((file, index) => (
                <View
                  key={`${file}_${index}`}
                  style={styles.selectedFileRow}>

                  <Icon
                    name="file-pdf-box"
                    size={22}
                    color="#E53935"
                  />

                  <Text
                    style={styles.selectedFileName}
                    numberOfLines={1}>
                    {file}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFiles(prev =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}>

                    <Icon
                      name="close-circle-outline"
                      size={21}
                      color={COLORS.textSecondary}
                    />

                  </TouchableOpacity>

                </View>
              ))}
            </View>
          )}

          {/* BUTTONS */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleSubmit}
              activeOpacity={0.8}>

              <Icon
                name="check"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.actionButtonText}>
                Submit
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={handleReset}
              activeOpacity={0.8}>

              <Icon
                name="refresh"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.actionButtonText}>
                Reset
              </Text>

            </TouchableOpacity>
          </View>

        </View>

        {/* EXISTING RECORDS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Existing Activities
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {newsList.length}
            </Text>
          </View>
        </View>

        {newsList.map((item, index) => (
          <View
            key={item.id}
            style={styles.newsCard}>

            {/* Card Header */}
            <View style={styles.newsHeader}>

              <View style={styles.serialCircle}>
                <Text style={styles.serialText}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.newsTitleContainer}>
                <Text style={styles.newsTitle}>
                  {item.jobName}
                </Text>

                <Text style={styles.recordText}>
                  Record #{item.id}
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

            {/* Description */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>
                Description
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>

            {/* Files */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>
                Files
              </Text>

              {item.files.map((file, fileIndex) => (
                <TouchableOpacity
                  key={`${file}_${fileIndex}`}
                  style={styles.fileItem}
                  onPress={() => handleFilePress(file)}
                  activeOpacity={0.7}>

                  <View style={styles.pdfIcon}>
                    <Icon
                      name="file-pdf-box"
                      size={25}
                      color="#E53935"
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={styles.fileName}>
                    {file}
                  </Text>

                  <Icon
                    name="eye-outline"
                    size={20}
                    color={COLORS.primary}
                  />

                </TouchableOpacity>
              ))}
            </View>

          </View>
        ))}

      </ScrollView>
    </View>
  );
};

export default NewsFieldScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 38,
    paddingBottom: 20,
    marginTop: 25,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  iconContainer: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',

    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: COLORS.primary,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 4,
    borderColor: COLORS.background,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 24,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 7,
  },

  required: {
    color: COLORS.danger,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 13,
    paddingVertical: 10,

    fontSize: 15,
    color: COLORS.textPrimary,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 12,
  },

  fileRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  chooseFileButton: {
    flex: 1,
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,

    backgroundColor: '#FFFFFF',
  },

  chooseFileText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  addButton: {
    height: 48,

    paddingHorizontal: 17,

    backgroundColor: '#1473E6',
    borderRadius: 9,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 3,
  },

  noFileText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  selectedFilesContainer: {
    marginTop: 10,
  },

  selectedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 9,
    paddingHorizontal: 10,

    marginBottom: 6,

    borderRadius: 8,
    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedFileName: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 25,
  },

  actionButton: {
    minWidth: 105,
    height: 45,

    borderRadius: 8,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButton: {
    backgroundColor: COLORS.success,
  },

  resetButton: {
    backgroundColor: COLORS.danger,
  },

  actionButtonText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 26,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  countBadge: {
    marginLeft: 8,

    minWidth: 25,
    height: 25,
    paddingHorizontal: 6,

    borderRadius: 13,

    backgroundColor: COLORS.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  newsCard: {
    backgroundColor: COLORS.card,

    borderRadius: 14,
    marginBottom: 14,

    padding: 15,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  serialCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: COLORS.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  serialText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  newsTitleContainer: {
    flex: 1,
    marginLeft: 11,
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  recordText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 13,
  },

  detailBlock: {
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textPrimary,
  },

  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 9,
    paddingHorizontal: 10,

    marginTop: 6,

    borderRadius: 8,

    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  pdfIcon: {
    width: 30,
    alignItems: 'flex-start',
  },

  fileName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
});