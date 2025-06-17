// screens/Patients/PatientListScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import PatientList from '../../components/lists/PatientList'; // Reutilizando o componente PatientList

const PatientListScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Lista de Pacientes" showBackButton={true} />
      <PatientList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PatientListScreen;