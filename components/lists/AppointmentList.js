// components/lists/AppointmentList.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { List, Divider, ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay
import { getUserRole } from '../../utils/authStorage'; // Para verificar a função do usuário
import { ROLES } from '../../utils/constants'; // Para as constantes de funções
import moment from 'moment'; // Para formatar datas

// Importar serviço de consulta (conceitual - descomente em seu projeto real)
// import { getAllAppointments, getAppointmentsByPatient, deleteAppointment } from '../../services/appointmentService';
// Importar serviço de usuário para pegar ID do usuário logado (se necessário)
// import { getCurrentUser } from '../../services/userService'; // Exemplo: um serviço para obter o usuário logado

const AppointmentList = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Para pacientes/médicos logados

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const role = await getUserRole();
      setUserRole(role);

      // Em uma aplicação real, você buscaria o ID do usuário logado se ele for paciente ou médico
      // const currentUser = await getCurrentUser();
      // setCurrentUserId(currentUser?.id); // Adapte para o ID correto (pacienteId ou crm)

      let data = [];
      if (role === ROLES.ADMIN) {
        // Em uma aplicação real:
        // data = await getAllAppointments();
        data = [ // Dados mockados para Admin
          { consultaId: 1, dataConsulta: '2025-06-18T10:00:00', paciente: { nome: 'João Paciente', pacienteId: 1 }, medico: { nome: 'Dr. Silva', crm: '123456-SP' }, especialidade: { nome: 'Geral' } },
          { consultaId: 2, dataConsulta: '2025-06-19T14:30:00', paciente: { nome: 'Maria Paciente', pacienteId: 2 }, medico: { nome: 'Dra. Souza', crm: '654321-RJ' }, especialidade: { nome: 'Ortodontia' } },
        ];
      } else if (role === ROLES.PACIENTE) {
        // Em uma aplicação real, passaria o currentUserId
        // data = await getAppointmentsByPatient(currentUserId); // Assumindo que currentUserId é o ID do paciente
        data = [ // Dados mockados para Paciente
          { consultaId: 101, dataConsulta: '2025-06-20T09:00:00', paciente: { nome: 'Você', pacienteId: 5 }, medico: { nome: 'Dr. Dentista', crm: '987654-SP' }, especialidade: { nome: 'Clínico Geral' } },
        ];
      } else if (role === ROLES.MEDICO) {
        // Em uma aplicação real, passaria o currentUserId
        // data = await getAppointmentsByDoctor(currentUserId); // Assumindo que currentUserId é o CRM do médico
        data = [ // Dados mockados para Médico
          { consultaId: 201, dataConsulta: '2025-06-21T11:00:00', paciente: { nome: 'Paciente X', pacienteId: 8 }, medico: { nome: 'Você', crm: 'MED001-SP' }, especialidade: { nome: 'Endodontia' } },
        ];
      }
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de consultas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta consulta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deleteAppointment(id);
              Alert.alert('Sucesso', 'Consulta excluída com sucesso!');
              fetchAppointments(); // Recarrega a lista
            } catch (error) {
              console.error('Erro ao excluir consulta:', error);
              Alert.alert('Erro', 'Não foi possível excluir a consulta.');
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
      fetchAppointments(); // Recarrega a lista toda vez que a tela foca
    }, [userRole, currentUserId]) // Depende da função do usuário e do ID
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const renderAppointmentItem = ({ item }) => (
    <List.Item
      title={`Paciente: ${item.paciente.nome}`}
      description={`Médico: ${item.medico.nome} | Especialidade: ${item.especialidade?.nome || 'N/A'}\nData: ${moment(item.dataConsulta).format('DD/MM/YYYY HH:mm')}`}
      left={props => <List.Icon {...props} icon="calendar-clock" />}
      right={props => (
        <View style={styles.itemActions}>
          {userRole === ROLES.ADMIN || userRole === ROLES.MEDICO ? (
            <>
              <List.Icon {...props} icon="pencil" onPress={() => navigation.navigate('AppointmentRegister', { appointmentId: item.consultaId, isEditing: true })} />
              <List.Icon {...props} icon="delete" onPress={() => handleDeleteAppointment(item.consultaId)} />
            </>
          ) : null}
        </View>
      )}
      // Você pode ter uma tela de detalhes da consulta se necessário
      // onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.consultaId })}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Consultas" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo consulta..." />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : appointments.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma consulta encontrada.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => String(item.consultaId)}
          renderItem={renderAppointmentItem}
          ItemSeparatorComponent={Divider}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007BFF']} />
          }
        />
      )}

      {(userRole === ROLES.ADMIN || userRole === ROLES.PACIENTE) && ( // Apenas ADMIN e PACIENTE podem agendar novas consultas
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AppointmentRegister', { isEditing: false })}
          color="#fff"
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

export default AppointmentList;