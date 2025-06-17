// screens/Doctors/DoctorRegisterScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import DoctorForm from '../../components/forms/DoctorForm'; // Reutilizando o componente DoctorForm
import LoadingOverlay from '../../components/common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviços (conceitual - descomente e ajuste em seu projeto real)
// import { novoMedico } from '../../services/usuarioService'; // para registrar novo médico
// import { getDoctorByCrm, editarMedico } from '../../services/doctorService'; // para editar médico
// import { medicoEspecialidades } from '../../services/doctorService'; // se as especialidades vêm separadamente

const DoctorRegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorCrm, isEditing, initialDoctorData } = route.params || {}; // Recebe parâmetros

  const [loading, setLoading] = useState(true); // Para carregar dados iniciais ao editar
  const [submitting, setSubmitting] = useState(false); // Para o processo de submit
  const [currentDoctorData, setCurrentDoctorData] = useState(null);
  const [error, setError] = useState(null);

  const defaultInitialValues = {
    crm: '',
    nome: '',
    email: '',
    telefone: '',
    imgUrl: '',
    senha: '',
    especialidadesIds: [],
  };

  const fetchDoctorData = async () => {
    if (!isEditing || !doctorCrm) {
      setLoading(false);
      return; // Se não for edição, não precisa buscar dados
    }

    setLoading(true);
    setError(null);
    try {
      // Em uma aplicação real, você faria a chamada para buscar o médico:
      // const data = await getDoctorByCrm(doctorCrm);
      // // Se as especialidades vêm em um endpoint separado ou em um formato diferente, ajuste:
      // const specialtiesDetails = await medicoEspecialidades(doctorCrm);
      // const especialidadesIds = specialtiesDetails.especialidadesLista.map(s => s.especialidade_id);
      // setCurrentDoctorData({ ...data, especialidadesIds });

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
        setCurrentDoctorData({
          ...foundDoctor,
          especialidadesIds: foundDoctor.especialidadesLista ? foundDoctor.especialidadesLista.map(s => s.especialidade_id) : [],
        });
      } else {
        setError('Médico não encontrado para edição.');
      }
    } catch (err) {
      console.error('Erro ao carregar dados do médico para edição:', err);
      setError('Não foi possível carregar os dados do médico.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        // Em uma aplicação real:
        // await editarMedico(doctorCrm, values);
        Alert.alert('Sucesso', 'Médico atualizado com sucesso!');
      } else {
        // Em uma aplicação real:
        // await novoMedico(values);
        Alert.alert('Sucesso', 'Médico cadastrado com sucesso!');
      }
      navigation.goBack(); // Volta para a tela anterior (geralmente a lista)
    } catch (err) {
      console.error('Erro ao salvar médico:', err.response ? err.response.data : err.message);
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível salvar o médico.');
    } finally {
      setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDoctorData();
    }, [doctorCrm, isEditing])
  );

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? "Editar Médico" : "Cadastrar Médico"}
        showBackButton={true}
      />
      <LoadingOverlay visible={submitting} message={isEditing ? "Atualizando médico..." : "Cadastrando médico..."} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>Voltar</PaperButton>
        </View>
      ) : (
        <DoctorForm
          initialValues={currentDoctorData || defaultInitialValues}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          loading={submitting}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingIndicator: {
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
});

export default DoctorRegisterScreen;