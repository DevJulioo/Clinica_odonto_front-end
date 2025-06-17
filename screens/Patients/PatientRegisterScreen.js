// screens/Appointments/AppointmentRegisterScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header';
import AppointmentForm from '../../components/forms/AppointmentForm';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import moment from 'moment';

// Importar serviços REAIS (descomentado)
import { addAppointment, getAppointmentById, editarConsulta } from '../../services/appointmentService';

const AppointmentRegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId, isEditing } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentAppointmentData, setCurrentAppointmentData] = useState(null);
  const [error, setError] = useState(null);

  const defaultInitialValues = {
    dataConsulta: '',
    pacienteId: '', // Alterado de null para ''
    medicoId: '',
    especialidadeId: '', // Alterado de null para ''
  };

  const fetchAppointmentData = async () => {
    if (!isEditing || !appointmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Usando o serviço real para buscar consulta por ID
      const data = await getAppointmentById(appointmentId);
      
      if (data) {
        setCurrentAppointmentData({
          consultaId: data.consultaId,
          dataConsulta: moment(data.dataConsulta).format('DD/MM/YYYY HH:mm'),
          pacienteId: data.paciente?.pacienteId || '', // Garante que seja '' se for nulo
          medicoId: data.medico?.crm || '', // Garante que seja '' se for nulo
          especialidadeId: data.especialidade?.especialidadeId || '', // Garante que seja '' se for nulo
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
    console.log('handleSubmit chamado!');
    console.log('Valores do formulário:', values);
    console.log('isEditing:', isEditing);
    console.log('appointmentId:', appointmentId);

    setSubmitting(true);
    try {
      if (isEditing) {
        console.log('Tentando editar consulta...');
        // Usando o serviço real para editar
        await editarConsulta(appointmentId, values); 
        Alert.alert('Sucesso', 'Consulta atualizada com sucesso!');
      } else {
        console.log('Tentando agendar nova consulta...');
        // Usando o serviço real para adicionar
        await addAppointment(values); 
        Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
      }
      console.log('Navegando de volta...');
      navigation.goBack();
    } catch (err) {
      console.error('Erro ao salvar consulta:', err.response ? err.response.data : err.message);
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível salvar a consulta.');
    } finally {
      console.log('Finalizando submissão...');
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