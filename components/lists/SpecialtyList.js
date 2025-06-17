// components/lists/SpecialtyList.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { List, Divider, ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../common/Header'; // Reutilizando o componente Header
import LoadingOverlay from '../common/LoadingOverlay'; // Reutilizando o componente LoadingOverlay

// Importar serviço de especialidade (conceitual - descomente em seu projeto real)
// import { getAllSpecialties, deleteSpecialty } from '../../services/specialtyService';

const SpecialtyList = () => {
  const navigation = useNavigation();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false); // Estado para indicar exclusão em progresso

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      // Em uma aplicação real:
      // const data = await getAllSpecialties();
      // setSpecialties(data);

      // Dados mockados para o exemplo:
      setSpecialties([
        { especialidadeId: 1, nome: 'Clínico Geral' },
        { especialidadeId: 2, nome: 'Ortodontia' },
        { especialidadeId: 3, nome: 'Endodontia' },
        { especialidadeId: 4, nome: 'Periodontia' },
      ]);
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de especialidades.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteSpecialty = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta especialidade? Isso pode afetar médicos e consultas associadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setDeleting(true);
            try {
              // Em uma aplicação real:
              // await deleteSpecialty(id);
              Alert.alert('Sucesso', 'Especialidade excluída com sucesso!');
              fetchSpecialties(); // Recarrega a lista
            } catch (error) {
              console.error('Erro ao excluir especialidade:', error);
              Alert.alert('Erro', 'Não foi possível excluir a especialidade.');
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
      fetchSpecialties(); // Recarrega a lista toda vez que a tela foca
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSpecialties();
  };

  const renderSpecialtyItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`ID: ${item.especialidadeId}`}
      left={props => <List.Icon {...props} icon="tooth" />}
      right={props => (
        <View style={styles.itemActions}>
          <List.Icon {...props} icon="pencil" onPress={() => navigation.navigate('SpecialtyRegister', { specialtyId: item.especialidadeId, isEditing: true })} />
          <List.Icon {...props} icon="delete" onPress={() => handleDeleteSpecialty(item.especialidadeId)} />
        </View>
      )}
      // Se houver uma tela de detalhes para especialidades
      // onPress={() => navigation.navigate('SpecialtyDetail', { specialtyId: item.especialidadeId })}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Especialidades" showBackButton={true} />
      <LoadingOverlay visible={deleting} message="Excluindo especialidade..." />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : specialties.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma especialidade encontrada.</Text>
      ) : (
        <FlatList
          data={specialties}
          keyExtractor={(item) => String(item.especialidadeId)}
          renderItem={renderSpecialtyItem}
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
        onPress={() => navigation.navigate('SpecialtyRegister', { isEditing: false })}
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

export default SpecialtyList;