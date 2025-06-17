// components/common/InputField.js
import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

const InputField = ({ label, value, onChangeText, onBlur, error, helperText, style, ...rest }) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={error}
        style={styles.input}
        {...rest}
      />
      {error && helperText && <Text style={styles.errorText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default InputField;