// services/specialtyService.js
import api from './api';

const BASE_URL = '/api/especialidades'; // Base URL para operações de especialidade

// Função para obter todas as especialidades
export const getAllSpecialties = async () => {
  try {
    const response = await api.get(`${BASE_URL}/get/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todas as especialidades:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter uma especialidade por ID
export const getSpecialtyById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar especialidade com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para adicionar uma nova especialidade
export const addSpecialty = async (specialtyData) => {
  try {
    const response = await api.post(`${BASE_URL}/add`, specialtyData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar nova especialidade:', error.response?.data || error.message);
    throw error;
  }
};

// Função para editar uma especialidade existente
export const editarEspecialidade = async (specialtyData, id) => {
  try {
    // Certifique-se de que o ID está no URL e não no corpo se o backend espera assim
    const response = await api.put(`${BASE_URL}/edit/${id}`, specialtyData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao editar especialidade com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para deletar uma especialidade
export const deleteSpecialty = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/dell/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar especialidade com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};