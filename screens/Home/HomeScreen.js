// screens/Home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Appbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { removeToken, removeUserRole, getUserRole } from '../../utils/authStorage';
import { ROLES } from '../../utils/constants';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await removeToken(); // Remove o token
      await removeUserRole(); // Remove a função do usuário
      Alert.alert('Sucesso', 'Você foi desconectado.');
      // IMPORTANTE: A navegação de volta para 'Login' é gerenciada automaticamente
      // pelo AppNavigator (em navigation/index.js) quando o token é removido.
      // NÃO chame navigation.replace('Login') aqui.
      // navigation.replace('Login'); // <<-- ESTA LINHA DEVE ESTAR COMENTADA OU REMOVIDA!
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Erro', 'Não foi possível desconectar.');
    }
  };

  const isAllowed = (roles) => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Clínica Odonto" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Title style={styles.welcomeText}>Bem-vindo, {userRole}!</Title>

        {isAllowed([ROLES.ADMIN, ROLES.MEDICO, ROLES.PACIENTE]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('AppointmentList')}>
            <Card.Title title="Gerenciar Consultas" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Visualize e gerencie as consultas agendadas.</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isAllowed([ROLES.ADMIN, ROLES.MEDICO]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('AppointmentRegister')}>
            <Card.Title title="Agendar Nova Consulta" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Crie um novo agendamento de consulta.</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('PatientList')}>
            <Card.Title title="Gerenciar Pacientes" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Adicione, edite ou remova pacientes do sistema.</Paragraph>
            </Card.Content>
          </Card>
        )}
        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('PatientRegister')}>
            <Card.Title title="Cadastrar Novo Paciente" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Cadastre um novo paciente no sistema.</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('DoctorList')}>
            <Card.Title title="Gerenciar Médicos" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Visualize e gerencie as informações dos médicos.</Paragraph>
            </Card.Content>
          </Card>
        )}
        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('DoctorRegister')}>
            <Card.Title title="Cadastrar Novo Médico" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Cadastre um novo médico no sistema.</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('SpecialtyList')}>
            <Card.Title title="Gerenciar Especialidades" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Gerencie as especialidades oferecidas pela clínica.</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isAllowed([ROLES.ADMIN]) && (
          <Card style={styles.card} onPress={() => navigation.navigate('Reports')}>
            <Card.Title title="Gerar Relatórios" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
            <Card.Content>
              <Paragraph>Gere relatórios de consultas por período.</Paragraph>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card} onPress={() => navigation.navigate('Profile')}>
          <Card.Title title="Meu Perfil" left={() => <Card.Cover source={require('../../assets/images/img-carro.jpg')} style={styles.cardIcon} />} />
          <Card.Content>
            <Paragraph>Visualize e edite suas informações de perfil.</Paragraph>
          </Card.Content>
        </Card>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    backgroundColor: '#007BFF',
  },
  appBarTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    resizeMode: 'contain',
  }
});

export default HomeScreen;