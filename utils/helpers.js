// utils/helpers.js
import { Linking, Alert, Platform } from 'react-native';

/**
 * Formata um número de telefone para o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 * @param {string} phoneNumber O número de telefone a ser formatado.
 * @returns {string} O número de telefone formatado.
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber; // Retorna o original se não corresponder
};

/**
 * Abre um link externo no navegador padrão do dispositivo.
 * @param {string} url O URL a ser aberto.
 */
export const openExternalLink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', `Não foi possível abrir o link: ${url}`);
    }
  } catch (error) {
    console.error('Erro ao abrir link externo:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao tentar abrir o link.');
  }
};

/**
 * Retorna true se a plataforma atual for iOS.
 * @returns {boolean}
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Retorna true se a plataforma atual for Android.
 * @returns {boolean}
 */
export const isAndroid = Platform.OS === 'android';

