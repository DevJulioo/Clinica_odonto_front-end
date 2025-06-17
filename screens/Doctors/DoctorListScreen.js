// screens/Doctors/DoctorListScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import DoctorList from '../../components/lists/DoctorList'; // Reutilizando o componente DoctorList

const DoctorListScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Lista de Médicos" showBackButton={true} />
      <DoctorList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default DoctorListScreen;