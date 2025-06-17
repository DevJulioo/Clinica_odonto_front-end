// screens/Specialties/SpecialtyListScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import SpecialtyList from '../../components/lists/SpecialtyList'; // Reutilizando o componente SpecialtyList

const SpecialtyListScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Lista de Especialidades" showBackButton={true} />
      <SpecialtyList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SpecialtyListScreen;