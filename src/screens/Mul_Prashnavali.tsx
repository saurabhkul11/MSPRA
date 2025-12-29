// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mul_Prashnavali = () => (
  <View style={styles.container}>
    <Text style={styles.text}>🏠 Welcome to Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
});

export default Mul_Prashnavali;
