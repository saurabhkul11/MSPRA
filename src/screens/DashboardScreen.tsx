
//import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import React from "react";
import CustomHeader from "../utils/CustomHeader";
//import AsyncStorage from "@react-native-async-storage/async-storage";


const menuItems = [
  { id: 1, title: "सुशासनयुक्त पंचायत", screen: "Form1" },
  { id: 2, title: "सक्षम पंचायत", screen: "Form2" },
  { id: 3, title: "जल समृद्ध, स्वच्छ व हरित गाव", screen: "Form3" },
  { id: 4, title: "मनरेगा व इतर योजनांशी अभिसरण", screen: "Form4" },
  { id: 5, title: "गावपातळी वरील संस्था सक्षमीकरण", screen: "Form5" },
  { id: 6, title: "उपजीविका विकास, सामाजिक न्याय", screen: "Form6" },
  { id: 7, title: "लोकसहभाग व श्रमदान माध्यमातून लोकचळवळ निर्माण करणे", screen: "Form7" },
  { id: 8, title: "नाविन्यपूर्ण उपक्रम", screen: "Form8" },
];


const Dashboard = () => {
type Nav = NativeStackNavigationProp<RootStackParamList>;

const navigation = useNavigation<Nav>();


  const renderItem = ({ item }: any) => (
   <TouchableOpacity
    style={styles.tabButton}
    onPress={() => navigation.navigate(item.screen)}
    activeOpacity={0.8}
  >
    <View style={styles.tabContent}>
      <Text style={styles.tabNumber}>{item.id}.</Text>
      <Text style={styles.tabText}>{item.title}</Text>
    </View>
  </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <CustomHeader title="मुख्यपृष्ठ" />
      

      {/* Tabs */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     backgroundColor: "#E8EEF3",

   },

  header: {
    backgroundColor: "#0B60B0",
    paddingVertical: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  listContainer: {
    padding: 20,
  },

 tabButton: {
  backgroundColor: "#fff",
  paddingVertical: 15,
  paddingHorizontal: 15,
  marginBottom: 15,
  borderRadius: 30,
  elevation: 3,
  width: "100%",      // button stays inside container
  maxWidth: "100%",   // ensures it never overflows
},

tabContent: {
  flexDirection: "row",
  alignItems: "flex-start",
  flexShrink: 1,       // important for wrapping
},

tabNumber: {
  width: 25,           // fixed width for number
  fontWeight: "700",
  color: "#0B4FA3",
  fontSize: 16,
  marginTop: 2,
},

tabText: {
  flexShrink: 1,        // crucial: allows text to wrap inside container
  fontSize: 16,
  color: "#0B4FA3",
  fontWeight: "600",
  flexWrap: "wrap",
},

});



