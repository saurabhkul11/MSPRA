/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../utils/CustomHeader';


type FormStatus = 'completed' | 'pending' | 'disabled';

interface VillageForm {
  formNo: number;
  status: FormStatus;
}

interface VillageData {
  id: number;
  villageName: string;
  lgdCode: string;
  district: string;
  taluka: string;
  gpMarks?: string;
  gpPercentage?: string;
  forms: VillageForm[];
}

const pendingForms: VillageForm[] = Array.from({length: 8}, (_, index) => ({
  formNo: index + 1,
  status: 'pending',
}));

const villageList: VillageData[] = [
  {
    id: 1,
    villageName: 'Kalher',
    lgdCode: '191888',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 2,
    villageName: 'Kalwar',
    lgdCode: '191889',
    district: 'Thane',
    taluka: 'Bhiwandi',
    gpMarks: '0.00 / 99.00',
    gpPercentage: '0.00',
    forms: pendingForms,
  },
  {
    id: 3,
    villageName: 'Kandali',
    lgdCode: '191891',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 4,
    villageName: 'Kon',
    lgdCode: '191907',
    district: 'Thane',
    taluka: 'Bhiwandi',
    gpMarks: '61.11 / 100.00',
    gpPercentage: '61.11',
    forms: [
      {formNo: 1, status: 'completed'},
      {formNo: 2, status: 'completed'},
      {formNo: 3, status: 'disabled'},
      {formNo: 4, status: 'completed'},
      {formNo: 5, status: 'completed'},
      {formNo: 6, status: 'disabled'},
      {formNo: 7, status: 'completed'},
      {formNo: 8, status: 'completed'},
    ],
  },
  {
    id: 5,
    villageName: 'Borivali T. Rahur',
    lgdCode: '191864',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 6,
    villageName: 'Damangaon',
    lgdCode: '191872',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 7,
    villageName: 'Dapode',
    lgdCode: '191871',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 8,
    villageName: 'Dohole',
    lgdCode: '191876',
    district: 'Thane',
    taluka: 'Bhiwandi',
    gpMarks: '0.00 / 100.00',
    gpPercentage: '0.00',
    forms: pendingForms,
  },
  {
    id: 9,
    villageName: 'Kurund',
    lgdCode: '191913',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
  {
    id: 10,
    villageName: 'Kusapur',
    lgdCode: '191914',
    district: 'Thane',
    taluka: 'Bhiwandi',
    forms: pendingForms,
  },
];

type RootStackParamList = {
  StageForm1: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
   StageForm2: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
   StageForm3: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
  StageForm4: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
  StageForm5: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
  StageForm6: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
  StageForm7: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };
  StageForm8: {
    villageId: string | number;
    villageName: string;
    formNo: number;
  };

};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const BDODashboard = () => {
  
  const navigation = useNavigation<NavigationProp>();

  const handleFormPress = (village: VillageData, form: VillageForm) => {
    console.log('Village:', village.villageName);
    console.log('Form:', form.formNo); switch (Number(form.formNo)) {
    case 1:
      navigation.navigate('StageForm1', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 2:
      navigation.navigate('StageForm2', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 3:
      navigation.navigate('StageForm3', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 4:
      navigation.navigate('StageForm4', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 5:
      navigation.navigate('StageForm5', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 6:
      navigation.navigate('StageForm6', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 7:
      navigation.navigate('StageForm7', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

      case 8:
      navigation.navigate('StageForm8', {
        villageId: village.id,
        villageName: village.villageName,
        formNo: Number(form.formNo),
      });
      break;

    default:
      console.log(`Stage Form ${form.formNo} screen not configured`);
      break;
  }
  };

  const renderFormButton = (
    village: VillageData,
    form: VillageForm,
  ) => {
    const isCompleted = form.status === 'completed';
    const isPending = form.status === 'pending';
    const isDisabled = form.status === 'disabled';

    return (
  <TouchableOpacity
    key={`${village.id}_${form.formNo}`}
    disabled={isDisabled} // disables touch
    activeOpacity={isDisabled || isPending ? 1 : 0.7} // no press effect when disabled
    style={[
      styles.formButton,
      isCompleted && styles.completedFormButton,
      isPending && styles.pendingFormButton,
      isDisabled && styles.disabledFormButton,
    ]}
    onPress={() => {
      if (isDisabled || isPending) return;
      handleFormPress(village, form);
    }}>
    <Text
      style={[
        styles.formButtonText,
        isCompleted && styles.completedFormText,
        isPending && styles.pendingFormText,
        isDisabled && styles.disabledFormText,
      ]}>
      Form {form.formNo}
    </Text>
  </TouchableOpacity>
);
  };

  const renderVillageCard = (village: VillageData) => {
    return (
      <View key={village.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.villageName}>{village.villageName}</Text>

          {village.gpPercentage !== undefined && (
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageBadgeText}>
                {village.gpPercentage}%
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
            <Text style={styles.detailValue}>{village.district}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Taluka</Text>
            <Text style={styles.detailValue}>{village.taluka}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Village Name</Text>
            <Text style={styles.detailValue}>{village.villageName}</Text>
          </View>
        </View>

        {village.gpMarks !== undefined && (
          <View style={styles.marksContainer}>
            <View style={styles.markItem}>
              <Text style={styles.detailLabel}>GP Marks</Text>
              <Text style={styles.detailValue}>{village.gpMarks}</Text>
            </View>

            <View style={styles.markItem}>
              <Text style={styles.detailLabel}>GP Percentage</Text>
              <Text style={styles.detailValue}>
                {village.gpPercentage}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.formsTitle}>Available Forms</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formsContainer}>
          {village.forms.map(form =>
            renderFormButton(village, form),
          )}
        </ScrollView>
      </View>
    );
  };

  return (
  <View style={styles.safeArea}>

    <CustomHeader title="मुख्यपृष्ठ" />
    <View
      style={{
        paddingHorizontal: 5,
        paddingTop: 15,
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

    {/* CONTENT */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pageContent}
    >
      {villageList.map(renderVillageCard)}
    </ScrollView>

  </View>

);
};

export default BDODashboard;

const styles = StyleSheet.create({
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


