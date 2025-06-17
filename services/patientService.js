// services/patientService.js
import api from './api';

const BASE_URL = '/api/usuario/paciente'; // Base URL para operações de paciente

// Função para obter todos os pacientes
export const getAllPatients = async () => {
  try {
    const response = await api.get(`${BASE_URL}/get/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os pacientes:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter um paciente por ID
export const getPatientById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar paciente com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para adicionar um novo paciente (endpoint de registro ou administração)
// Note: Este endpoint também é usado no auth.js para registro público.
// Aqui é para uso administrativo.
export const novoPaciente = async (patientData) => {
  try {
    const response = await api.post(`${BASE_URL}/add`, patientData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar novo paciente:', error.response?.data || error.message);
    throw error;
  }
};

// Função para editar um paciente existente
export const editarPaciente = async (id, patientData) => {
  try {
    const response = await api.put(`${BASE_URL}/edit/${id}`, patientData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao editar paciente com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para deletar um paciente
export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/dell/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar paciente com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};