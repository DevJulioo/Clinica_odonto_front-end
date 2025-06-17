// screens/Appointments/AppointmentRegisterScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import AppointmentForm from '../../components/forms/AppointmentForm'; // Reutilizando o componente AppointmentForm
import LoadingOverlay from '../../components/common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay
import moment from 'moment'; // Para formatar datas

// Importar serviços (conceitual - descomente e ajuste em seu projeto real)
// import { addAppointment, getAppointmentById, editarConsulta } from '../../services/appointmentService';

const AppointmentRegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId, isEditing } = route.params || {}; // Recebe parâmetros

  const [loading, setLoading] = useState(true); // Para carregar dados iniciais ao editar
  const [submitting, setSubmitting] = useState(false); // Para o processo de submit
  const [currentAppointmentData, setCurrentAppointmentData] = useState(null);
  const [error, setError] = useState(null);

  const defaultInitialValues = {
    dataConsulta: '',
    pacienteId: '',
    medicoId: '',
    especialidadeId: '',
  };

  const fetchAppointmentData = async () => {
    if (!isEditing || !appointmentId) {
      setLoading(false);
      return; // Se não for edição, não precisa buscar dados
    }

    setLoading(true);
    setError(null);
    try {
      // Em uma aplicação real:
      // const data = await getAppointmentById(appointmentId);
      // setCurrentAppointmentData({
      //   ...data,
      //   dataConsulta: moment(data.dataConsulta).format('DD/MM/YYYY HH:mm'), // Formata para o formato esperado pelo formulário
      // });

      // Dados mockados para o exemplo (simulando a busca por ID):
      const mockAppointments = [
        {
          consultaId: 1,
          dataConsulta: '2025-06-18T10:00:00',
          paciente: { pacienteId: 1, nome: 'João Paciente' },
          medico: { crm: '123456-SP', nome: 'Dr. Silva' },
          especialidade: { especialidadeId: 1, nome: 'Geral' },
        },
        {
          consultaId: 2,
          dataConsulta: '2025-06-19T14:30:00',
          paciente: { pacienteId: 2, nome: 'Maria Paciente' },
          medico: { crm: '654321-RJ', nome: 'Dra. Souza' },
          especialidade: { especialidadeId: 2, nome: 'Ortodontia' },
        },
      ];
      const foundAppointment = mockAppointments.find(a => a.consultaId === appointmentId);

      if (foundAppointment) {
        setCurrentAppointmentData({
          consultaId: foundAppointment.consultaId,
          dataConsulta: moment(foundAppointment.dataConsulta).format('DD/MM/YYYY HH:mm'),
          pacienteId: foundAppointment.paciente.pacienteId,
          medicoId: foundAppointment.medico.crm,
          especialidadeId: foundAppointment.especialidade ? foundAppointment.especialidade.especialidadeId : null,
        });
      } else {
        setError('Consulta não encontrada para edição.');
      }
    } catch (err) {
      console.error('Erro ao carregar dados da consulta para edição:', err);
      setError('Não foi possível carregar os dados da consulta.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        // Em uma aplicação real:
        // const response = await editarConsulta(appointmentId, values);
        Alert.alert('Sucesso', 'Consulta atualizada com sucesso!');
      } else {
        // Em uma aplicação real:
        // const response = await addAppointment(values);
        Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
      }
      navigation.goBack(); // Volta para a tela anterior (geralmente a lista)
    } catch (err) {
      console.error('Erro ao salvar consulta:', err.response ? err.response.data : err.message);
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível salvar a consulta.');
    } finally {
      setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointmentData();
    }, [appointmentId, isEditing])
  );

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? "Editar Consulta" : "Agendar Consulta"}
        showBackButton={true}
      />
      <LoadingOverlay visible={submitting} message={isEditing ? "Atualizando consulta..." : "Agendando consulta..."} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>Voltar</PaperButton>
        </View>
      ) : (
        <AppointmentForm
          initialValues={currentAppointmentData || defaultInitialValues}
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

export default AppointmentRegisterScreen;