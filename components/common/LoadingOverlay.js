// components/common/LoadingOverlay.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Portal, Dialog } from 'react-native-paper';

const LoadingOverlay = ({ visible, message = "Carregando..." }) => {
  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={styles.dialog}>
        <Dialog.Content style={styles.content}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.message}>{message}</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%', // Ajuste conforme necessário
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingOverlay;