// services/appointmentService.js
import api from './api';

const BASE_URL = '/api/consulta'; // Base URL para operações de consulta

// Função para adicionar uma nova consulta
export const addAppointment = async (appointmentData) => {
  try {
    const response = await api.post(`${BASE_URL}/add`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar nova consulta:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter consultas por ID do paciente
export const getAppointmentsByPatient = async (patientId) => {
  try {
    const response = await api.get(`${BASE_URL}/paciente/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar consultas do paciente com ID ${patientId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para obter todas as consultas
export const getAllAppointments = async () => {
  try {
    const response = await api.get(`${BASE_URL}/get/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todas as consultas:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter uma consulta por ID
export const getAppointmentById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar consulta com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para deletar uma consulta
export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/dell/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar consulta com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para editar uma consulta existente
export const editarConsulta = async (id, appointmentData) => {
  try {
    const response = await api.put(`${BASE_URL}/edit/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao editar consulta com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};