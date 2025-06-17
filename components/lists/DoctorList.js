// components/lists/DoctorList.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { List, Divider, ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviço de médico (conceitual - descomente em seu projeto real)
// import { getAllDoctors, deleteDoctor } from '../../services/doctorService';

const DoctorList = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false); // Estado para indicar exclusão em progresso

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Em uma aplicação real:
      // const data = await getAllDoctors();
      // setDoctors(data);

      // Dados mockados para o exemplo:
      setDoctors([
        { crm: '123456-SP', nome: 'Dr. João Pedro Lima', email: 'joao.lima@example.com', telefone: '(11) 99876-5432' },
        { crm: '789012-RJ', nome: 'Dra. Ana Paula Santos', email: 'ana.santos@example.com', telefone: '(21) 91234-5678' },
        { crm: '345678-MG', nome: 'Dr. Carlos Eduardo Costa', email: 'carlos.costa@example.com', telefone: '(31) 93456-7890' },
      ]);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de médicos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteDoctor = async (crm) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este médico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deleteDoctor(crm);
              Alert.alert('Sucesso', 'Médico excluído com sucesso!');
              fetchDoctors(); // Recarrega a lista
            } catch (error) {
              console.error('Erro ao excluir médico:', error);
              Alert.alert('Erro', 'Não foi possível excluir o médico.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchDoctors(); // Recarrega a lista toda vez que a tela foca
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const renderDoctorItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.crm} - ${item.email} - ${item.telefone}`}
      left={props => <List.Icon {...props} icon="doctor" />}
      right={props => (
        <View style={styles.itemActions}>
          <List.Icon {...props} icon="pencil" onPress={() => navigation.navigate('DoctorRegister', { doctorCrm: item.crm, isEditing: true })} />
          <List.Icon {...props} icon="delete" onPress={() => handleDeleteDoctor(item.crm)} />
        </View>
      )}
      onPress={() => navigation.navigate('DoctorDetail', { doctorCrm: item.crm })}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Médicos" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo médico..." />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : doctors.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum médico encontrado.</Text>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.crm}
          renderItem={renderDoctorItem}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007BFF']} />
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('DoctorRegister', { isEditing: false })}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    backgroundColor: '#fff',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007BFF',
  },
});

export default DoctorList;