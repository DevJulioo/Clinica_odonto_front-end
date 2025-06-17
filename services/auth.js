// services/auth.js
import api from './api';
import { storeToken, storeUserRole } from '../utils/authStorage';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, role } = response.data;
    await storeToken(token);
    await storeUserRole(role);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerPatient = async (patientData) => {
  try {
    const response = await api.post('/auth/register', patientData);
    if (response.data.token && response.data.role) {
      await storeToken(response.data.token);
      await storeUserRole(response.data.role);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};