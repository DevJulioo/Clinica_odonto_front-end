// components/common/Button.js
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Button = ({ children, mode = 'contained', onPress, style, ...rest }) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={styles.buttonLabel}
      {...rest}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;