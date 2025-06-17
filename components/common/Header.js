// components/common/Header.js
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const Header = ({ title, showBackButton = true, rightActions = [] }) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.appBar}>
      {showBackButton && <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />}
      <Appbar.Content title={title} titleStyle={styles.title} />
      {rightActions.map((action, index) => (
        <Appbar.Action key={index} icon={action.icon} onPress={action.onPress} color="#fff" />
      ))}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#007BFF', // Cor primária da sua clínica
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Header;