// screens/Appointments/AppointmentListScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import AppointmentList from '../../components/lists/AppointmentList'; // Reutilizando o componente AppointmentList

const AppointmentListScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Lista de Consultas" showBackButton={true} />
      <AppointmentList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AppointmentListScreen;