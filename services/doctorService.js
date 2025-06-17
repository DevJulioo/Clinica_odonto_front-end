// services/doctorService.js
import api from './api';

const BASE_URL_USUARIO = '/api/usuario/medico'; // Base URL para operações de médico no controlador de usuário
const BASE_URL_MEDICO = '/api/medicos'; // Base URL para operações específicas de médico

// Função para obter todos os médicos
export const getAllDoctors = async () => {
  try {
    const response = await api.get(`${BASE_URL_USUARIO}/get/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os médicos:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter um médico por CRM
export const getDoctorByCrm = async (crm) => {
  try {
    const response = await api.get(`${BASE_URL_USUARIO}/get/${crm}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar médico com CRM ${crm}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para adicionar um novo médico (endpoint de registro ou administração)
// Note: Este endpoint também é usado no auth.js para registro público.
// Aqui é para uso administrativo.
export const novoMedico = async (doctorData) => {
  try {
    const response = await api.post(`${BASE_URL_USUARIO}/add`, doctorData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar novo médico:', error.response?.data || error.message);
    throw error;
  }
};

// Função para editar um médico existente
export const editarMedico = async (crm, doctorData) => {
  try {
    const response = await api.put(`${BASE_URL_USUARIO}/edit/${crm}`, doctorData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao editar médico com CRM ${crm}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para deletar um médico
export const deleteDoctor = async (crm) => {
  try {
    const response = await api.delete(`${BASE_URL_USUARIO}/dell/${crm}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar médico com CRM ${crm}:`, error.response?.data || error.message);
    throw error;
  }
};

// Função para obter especialidades de um médico específico
export const getDoctorSpecialties = async (crm) => {
  try {
    const response = await api.get(`${BASE_URL_MEDICO}/${crm}/especialidades`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar especialidades do médico com CRM ${crm}:`, error.response?.data || error.message);
    throw error;
  }
};