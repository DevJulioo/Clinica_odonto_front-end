// utils/authStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const USER_ROLE_KEY = 'userRole';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const storeUserRole = async (role) => {
  try {
    await AsyncStorage.setItem(USER_ROLE_KEY, role);
  } catch (error) {
    console.error('Error storing user role:', error);
  }
};

export const getUserRole = async () => {
  try {
    return await AsyncStorage.getItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const removeUserRole = async () => {
  try {
    await AsyncStorage.removeItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error removing user role:', error);
  }
};