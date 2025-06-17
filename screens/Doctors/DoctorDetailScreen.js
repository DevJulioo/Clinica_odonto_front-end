// screens/Doctors/DoctorDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../../components/common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviço de médico (conceitual - descomente em seu projeto real)
// import { getDoctorByCrm, deleteDoctor, medicoEspecialidades } from '../../services/doctorService';

const DoctorDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorCrm } = route.params; // Recebe o CRM do médico dos parâmetros de navegação

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Em uma aplicação real:
      // const data = await getDoctorByCrm(doctorCrm);
      // const specialtiesData = await medicoEspecialidades(doctorCrm); // Ou o endpoint de getDoctorByCrm já retorna as especialidades
      // setDoctor({ ...data, especialidadesLista: specialtiesData.especialidadesLista });

      // Dados mockados para o exemplo (simulando a busca por CRM e especialidades):
      const mockDoctors = [
        {
          crm: '123456-SP',
          nome: 'Dr. João Pedro Lima',
          email: 'joao.lima@example.com',
          telefone: '(11) 99876-5432',
          imgUrl: 'https://example.com/imagens/joaopedro.jpg',
          especialidadesLista: [{ especialidade_id: 1, nome: 'Clínico Geral' }, { especialidade_id: 3, nome: 'Endodontia' }]
        },
        {
          crm: '789012-RJ',
          nome: 'Dra. Ana Paula Santos',
          email: 'ana.santos@example.com',
          telefone: '(21) 91234-5678',
          imgUrl: 'https://example.com/imagens/anapaula.jpg',
          especialidadesLista: [{ especialidade_id: 2, nome: 'Ortodontia' }]
        },
      ];
      const foundDoctor = mockDoctors.find(d => d.crm === doctorCrm);

      if (foundDoctor) {
        setDoctor(foundDoctor);
      } else {
        setError('Médico não encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do médico:', err);
      setError('Erro ao carregar detalhes do médico.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza de que deseja excluir o médico ${doctor?.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deleteDoctor(doctorCrm);
              Alert.alert('Sucesso', 'Médico excluído com sucesso!');
              navigation.goBack(); // Volta para a lista de médicos
            } catch (err) {
              console.error('Erro ao excluir médico:', err);
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

  const handleEditDoctor = () => {
    navigation.navigate('DoctorRegister', { doctorCrm: doctor.crm, isEditing: true, initialDoctorData: doctor });
  };

  useFocusEffect(
    useCallback(() => {
      fetchDoctorDetails();
    }, [doctorCrm]) // Refaz a busca se o CRM do médico mudar
  );

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Médico" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo médico..." />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <PaperButton mode="outlined" onPress={fetchDoctorDetails}>Tentar Novamente</PaperButton>
        </View>
      ) : doctor ? (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card style={styles.card}>
            {doctor.imgUrl && <Card.Cover source={{ uri: doctor.imgUrl }} style={styles.cardImage} />}
            <Card.Content>
              <Title style={styles.doctorName}>{doctor.nome}</Title>
              <Paragraph style={styles.detailText}>**CRM:** {doctor.crm}</Paragraph>
              <Paragraph style={styles.detailText}>**Email:** {doctor.email}</Paragraph>
              <Paragraph style={styles.detailText}>**Telefone:** {doctor.telefone}</Paragraph>
              {doctor.especialidadesLista && doctor.especialidadesLista.length > 0 && (
                <Paragraph style={styles.detailText}>
                  **Especialidades:** {doctor.especialidadesLista.map(s => s.nome).join(', ')}
                </Paragraph>
              )}
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <PaperButton icon="pencil" mode="outlined" onPress={handleEditDoctor} style={styles.actionButton}>
                Editar
              </PaperButton>
              <PaperButton icon="delete" mode="contained" onPress={handleDeleteDoctor} style={[styles.actionButton, styles.deleteButton]}>
                Excluir
              </PaperButton>
            </Card.Actions>
          </Card>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>Nenhum médico selecionado ou dados não disponíveis.</Paragraph>
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
  doctorName: {
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
    backgroundColor: '#dc3545', // Cor de perigo
  },
});

export default DoctorDetailScreen;