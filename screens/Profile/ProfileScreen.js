// screens/Profile/ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header';
import { getUserRole, getToken } from '../../utils/authStorage';
import { ROLES } from '../../utils/constants';

// Importar serviços de usuário/paciente/médico (conceitual - descomente e ajuste em seu projeto real)
// import { getPatientById } from '../../services/patientService';
// import { getDoctorByCrm } from '../../services/doctorService';
// import { getLoggedInUserProfile } from '../../services/userService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const role = await getUserRole();
      setUserRole(role);
      console.log('Perfil: Função do usuário carregada:', role); // LOG 1

      let data = null;
      if (role === ROLES.ADMIN) {
        data = { nome: 'Administrador Principal', email: 'admin@clinica.com' };
      } else if (role === ROLES.PACIENTE) {
        // Exemplo: buscar pelo ID do paciente associado ao usuário logado
        // const patientId = getPatientIdFromTokenOrUserApi(); // Método para obter o ID do paciente
        // data = await getPatientById(patientId);
        data = { pacienteId: 1, nome: 'Alice Paciente', email: 'alice.paciente@example.com', telefone: '(11) 98765-4321', dataNascimento: '1990-01-01', imgUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=P' };
      } else if (role === ROLES.MEDICO) {
        // Exemplo: buscar pelo CRM do médico associado ao usuário logado
        // const doctorCrm = getDoctorCrmFromTokenOrUserApi(); // Método para obter o CRM do médico
        // data = await getDoctorByCrm(doctorCrm);
        data = { crm: '123456-SP', nome: 'Dr. Silva Médico', email: 'silva.medico@example.com', telefone: '(21) 91234-5678', especialidades: ['Geral', 'Ortodontia'], imgUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=M' };
      }
      setProfileData(data);
      console.log('Perfil: Dados do perfil carregados:', data); // LOG 2

    } catch (err) {
      console.error('Perfil: Erro ao buscar perfil:', err);
      setError('Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    console.log('Perfil: Botão Editar Perfil clicado!'); // LOG 3
    console.log('Perfil: userRole no clique:', userRole); // LOG 4
    console.log('Perfil: profileData no clique:', profileData); // LOG 5

    if (userRole === ROLES.PACIENTE && profileData?.pacienteId) {
      console.log('Perfil: Navegando para PatientRegister - Paciente ID:', profileData.pacienteId); // LOG 6
      navigation.navigate('PatientRegister', { patientId: profileData.pacienteId, isEditing: true, initialPatientData: profileData });
    } else if (userRole === ROLES.MEDICO && profileData?.crm) {
      console.log('Perfil: Navegando para DoctorRegister - Médico CRM:', profileData.crm); // LOG 7
      navigation.navigate('DoctorRegister', { doctorCrm: profileData.crm, isEditing: true, initialDoctorData: profileData });
    } else {
      console.log('Perfil: Edição não disponível para esta função ou ID ausente.'); // LOG 8
      Alert.alert('Informação', 'A edição de perfil para esta função não está disponível.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header title="Meu Perfil" showBackButton={true} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <PaperButton mode="outlined" onPress={fetchUserProfile}>Tentar Novamente</PaperButton>
        </View>
      ) : profileData ? (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card style={styles.card}>
            {profileData.imgUrl && <Card.Cover source={{ uri: profileData.imgUrl }} style={styles.cardImage} />}
            <Card.Content>
              <Title style={styles.profileName}>{profileData.nome || 'Nome não disponível'}</Title>
              <Paragraph style={styles.roleText}>Função: {userRole}</Paragraph>
              <Paragraph style={styles.detailText}>**Email:** {profileData.email || 'Não disponível'}</Paragraph>

              {userRole === ROLES.PACIENTE && (
                <>
                  <Paragraph style={styles.detailText}>**Telefone:** {profileData.telefone || 'Não disponível'}</Paragraph>
                  <Paragraph style={styles.detailText}>**Data Nasc.:** {profileData.dataNascimento || 'Não disponível'}</Paragraph>
                </>
              )}

              {userRole === ROLES.MEDICO && (
                <>
                  <Paragraph style={styles.detailText}>**CRM:** {profileData.crm || 'Não disponível'}</Paragraph>
                  <Paragraph style={styles.detailText}>**Telefone:** {profileData.telefone || 'Não disponível'}</Paragraph>
                  {profileData.especialidades && profileData.especialidades.length > 0 && (
                    <Paragraph style={styles.detailText}>
                      **Especialidades:** {profileData.especialidades.join(', ')}
                    </Paragraph>
                  )}
                </>
              )}
            </Card.Content>
            {(userRole === ROLES.PACIENTE || userRole === ROLES.MEDICO) && (
              <Card.Actions style={styles.cardActions}>
                <PaperButton icon="pencil" mode="contained" onPress={handleEditProfile} style={styles.editButton}>
                  Editar Perfil
                </PaperButton>
              </Card.Actions>
            )}
          </Card>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>Nenhum dado de perfil disponível.</Paragraph>
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
    marginBottom: 20,
  },
  cardImage: {
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  roleText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 15,
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
  editButton: {
    backgroundColor: '#007BFF',
  },
});

export default ProfileScreen;