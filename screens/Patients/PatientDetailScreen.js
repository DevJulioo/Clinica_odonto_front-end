// screens/Patients/PatientDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../../components/common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay
import moment from 'moment'; // Para formatar a data de nascimento

// Importar serviço de paciente (conceitual - descomente em seu projeto real)
// import { getPatientById, deletePatient } from '../../services/patientService';

const PatientDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId } = route.params; // Recebe o ID do paciente dos parâmetros de navegação

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatientDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Em uma aplicação real:
      // const data = await getPatientById(patientId);
      // setPatient(data);

      // Dados mockados para o exemplo (simulando a busca por ID):
      const mockPatients = [
        { pacienteId: 1, nome: 'Alice Silva', email: 'alice@example.com', telefone: '(11) 98765-4321', imgUrl: 'https://example.com/imagens/alice.jpg', dataNascimento: '1990-01-15' },
        { pacienteId: 2, nome: 'Bruno Souza', email: 'bruno@example.com', telefone: '(21) 91234-5678', imgUrl: 'https://example.com/imagens/bruno.jpg', dataNascimento: '1985-05-20' },
        { pacienteId: 3, nome: 'Carla Lima', email: 'carla@example.com', telefone: '(31) 93456-7890', imgUrl: 'https://example.com/imagens/carla.jpg', dataNascimento: '1992-11-30' },
      ];
      const foundPatient = mockPatients.find(p => p.pacienteId === patientId);

      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setError('Paciente não encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do paciente:', err);
      setError('Erro ao carregar detalhes do paciente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza de que deseja excluir o paciente ${patient?.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deletePatient(patientId);
              Alert.alert('Sucesso', 'Paciente excluído com sucesso!');
              navigation.goBack(); // Volta para a lista de pacientes
            } catch (err) {
              console.error('Erro ao excluir paciente:', err);
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

  const handleEditPatient = () => {
    navigation.navigate('PatientRegister', { patientId: patient.pacienteId, isEditing: true, initialPatientData: patient });
  };

  useFocusEffect(
    useCallback(() => {
      fetchPatientDetails();
    }, [patientId]) // Refaz a busca se o ID do paciente mudar
  );

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Paciente" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo paciente..." />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <PaperButton mode="outlined" onPress={fetchPatientDetails}>Tentar Novamente</PaperButton>
        </View>
      ) : patient ? (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card style={styles.card}>
            {patient.imgUrl && <Card.Cover source={{ uri: patient.imgUrl }} style={styles.cardImage} />}
            <Card.Content>
              <Title style={styles.patientName}>{patient.nome}</Title>
              <Paragraph style={styles.detailText}>**Email:** {patient.email}</Paragraph>
              <Paragraph style={styles.detailText}>**Telefone:** {patient.telefone}</Paragraph>
              <Paragraph style={styles.detailText}>
                **Data de Nascimento:** {moment(patient.dataNascimento).format('DD/MM/YYYY')}
              </Paragraph>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <PaperButton icon="pencil" mode="outlined" onPress={handleEditPatient} style={styles.actionButton}>
                Editar
              </PaperButton>
              <PaperButton icon="delete" mode="contained" onPress={handleDeletePatient} style={[styles.actionButton, styles.deleteButton]}>
                Excluir
              </PaperButton>
            </Card.Actions>
          </Card>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>Nenhum paciente selecionado ou dados não disponíveis.</Paragraph>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>Voltar</PaperButton>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  patientName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545', 
  },
});

export default PatientDetailScreen;