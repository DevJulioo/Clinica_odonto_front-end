// services/reportService.js
import api from './api';

const BASE_URL = '/api/relatorio'; // Base URL para operações de relatório

// Função para obter o relatório de consultas em formato JSON
export const getAppointmentsReportJson = async (dataInicio, dataFim) => {
  try {
    const response = await api.get(`${BASE_URL}/consultas-por-periodo-json`, {
      params: {
        dataInicio, // Espera-se que já esteja no formato 'YYYY-MM-DDTHH:mm:ss'
        dataFim,    // Espera-se que já esteja no formato 'YYYY-MM-DDTHH:mm:ss'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório JSON de consultas:', error.response?.data || error.message);
    throw error;
  }
};

export const getAppointmentsReportPdf = async (dataInicio, dataFim) => {
  try {
  
    const response = await api.get(`${BASE_URL}/consultas-por-periodo-pdf`, {
      params: {
        dataInicio,
        dataFim,
      },
      responseType: 'arraybuffer', // Importante para receber dados binários
    });
    return response.data; // Retorna o arraybuffer do PDF
  } catch (error) {
    console.error('Erro ao buscar relatório PDF de consultas:', error.response?.data || error.message);
    throw error;
  }
};