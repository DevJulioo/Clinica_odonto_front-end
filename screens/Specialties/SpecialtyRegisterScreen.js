// screens/Specialties/SpecialtyRegisterScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header'; // Reutilizando o componente Header
import SpecialtyForm from '../../components/forms/SpecialtyForm'; // Reutilizando o componente SpecialtyForm
import LoadingOverlay from '../../components/common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviços (conceitual - descomente e ajuste em seu projeto real)
// import { adicionarEspecialidade, buscarEspecialidade, editarEspecialidade } from '../../services/specialtyService';

const SpecialtyRegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { specialtyId, isEditing } = route.params || {}; // Recebe parâmetros

  const [loading, setLoading] = useState(true); // Para carregar dados iniciais ao editar
  const [submitting, setSubmitting] = useState(false); // Para o processo de submit
  const [currentSpecialtyData, setCurrentSpecialtyData] = useState(null);
  const [error, setError] = useState(null);

  const defaultInitialValues = {
    nome: '',
  };

  const fetchSpecialtyData = async () => {
    if (!isEditing || !specialtyId) {
      setLoading(false);
      return; // Se não for edição, não precisa buscar dados
    }

    setLoading(true);
    setError(null);
    try {
      // Em uma aplicação real:
      // const data = await buscarEspecialidade(specialtyId);
      // setCurrentSpecialtyData(data);

      // Dados mockados para o exemplo (simulando a busca por ID):
      const mockSpecialties = [
        { especialidadeId: 1, nome: 'Clínico Geral' },
        { especialidadeId: 2, nome: 'Ortodontia' },
      ];
      const foundSpecialty = mockSpecialties.find(s => s.especialidadeId === specialtyId);

      if (foundSpecialty) {
        setCurrentSpecialtyData(foundSpecialty);
      } else {
        setError('Especialidade não encontrada para edição.');
      }
    } catch (err) {
      console.error('Erro ao carregar dados da especialidade para edição:', err);
      setError('Não foi possível carregar os dados da especialidade.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        // Em uma aplicação real:
        // await editarEspecialidade(values, specialtyId); // Ajuste a ordem dos parâmetros se necessário no seu serviço
        Alert.alert('Sucesso', 'Especialidade atualizada com sucesso!');
      } else {
        // Em uma aplicação real:
        // await adicionarEspecialidade(values);
        Alert.alert('Sucesso', 'Especialidade cadastrada com sucesso!');
      }
      navigation.goBack(); // Volta para a tela anterior (geralmente a lista)
    } catch (err) {
      console.error('Erro ao salvar especialidade:', err.response ? err.response.data : err.message);
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível salvar a especialidade.');
    } finally {
      setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSpecialtyData();
    }, [specialtyId, isEditing])
  );

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? "Editar Especialidade" : "Adicionar Especialidade"}
        showBackButton={true}
      />
      <LoadingOverlay visible={submitting} message={isEditing ? "Atualizando especialidade..." : "Adicionando especialidade..."} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>Voltar</PaperButton>
        </View>
      ) : (
        <SpecialtyForm
          initialValues={currentSpecialtyData || defaultInitialValues}
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

export default SpecialtyRegisterScreen;