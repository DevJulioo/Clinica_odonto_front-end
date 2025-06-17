// screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import { storeUserRole } from '../../utils/authStorage'; // Importado para armazenar a função do usuário

const LoginSchema = Yup.object().shape({
  usuario: Yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: Yup.string().required('Senha é obrigatória'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await login(values); // Esta função (em services/auth.js) já armazena o token e a função do usuário.
      await storeUserRole(response.role); // Armazena a função do usuário explicitamente após o login bem-sucedido
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      // A navegação para 'Home' é gerenciada automaticamente pelo AppNavigator
      // quando o token é salvo e detectado em navigation/index.js.
      // NÃO chame navigation.replace('Home') aqui.
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      Alert.alert('Erro no Login', error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bem-vindo à Clínica Odonto</Title>
      <Formik
        initialValues={{ usuario: '', senha: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={values.usuario}
              onChangeText={handleChange('usuario')}
              onBlur={handleBlur('usuario')}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={touched.usuario && errors.usuario ? true : false}
            />
            {touched.usuario && errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

            <TextInput
              label="Senha"
              value={values.senha}
              onChangeText={handleChange('senha')}
              onBlur={handleBlur('senha')}
              secureTextEntry
              style={styles.input}
              error={touched.senha && errors.senha ? true : false}
            />
            {touched.senha && errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Entrar
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate('RegisterPatient')}
              style={styles.registerButton}
            >
              Não tem conta? Cadastre-se como Paciente
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 30,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
  },
  registerButton: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default LoginScreen;