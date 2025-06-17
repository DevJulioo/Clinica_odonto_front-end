// components/lists/PatientList.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { List, Divider, ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviço de paciente (conceitual - descomente em seu projeto real)
// import { getAllPatients, deletePatient } from '../../services/patientService';

const PatientList = () => {
  const navigation = useNavigation();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false); // Estado para indicar exclusão em progresso

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Em uma aplicação real:
      // const data = await getAllPatients();
      // setPatients(data);

      // Dados mockados para o exemplo:
      setPatients([
        { pacienteId: 1, nome: 'Alice Silva', email: 'alice@example.com', telefone: '(11) 98765-4321', dataNascimento: '1990-01-15' },
        { pacienteId: 2, nome: 'Bruno Souza', email: 'bruno@example.com', telefone: '(21) 91234-5678', dataNascimento: '1985-05-20' },
        { pacienteId: 3, nome: 'Carla Lima', email: 'carla@example.com', telefone: '(31) 93456-7890', dataNascimento: '1992-11-30' },
      ]);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de pacientes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeletePatient = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deletePatient(id);
              Alert.alert('Sucesso', 'Paciente excluído com sucesso!');
              fetchPatients(); // Recarrega a lista
            } catch (error) {
              console.error('Erro ao excluir paciente:', error);
              Alert.alert('Erro', 'Não foi possível excluir o paciente.');
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
      fetchPatients(); // Recarrega a lista toda vez que a tela foca
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const renderPatientItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.email} - ${item.telefone}`}
      left={props => <List.Icon {...props} icon="account" />}
      right={props => (
        <View style={styles.itemActions}>
          <List.Icon {...props} icon="pencil" onPress={() => navigation.navigate('PatientRegister', { patientId: item.pacienteId, isEditing: true })} />
          <List.Icon {...props} icon="delete" onPress={() => handleDeletePatient(item.pacienteId)} />
        </View>
      )}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.pacienteId })}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Pacientes" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo paciente..." />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : patients.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum paciente encontrado.</Text>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => String(item.pacienteId)}
          renderItem={renderPatientItem}
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
        onPress={() => navigation.navigate('PatientRegister', { isEditing: false })}
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

export default PatientList;