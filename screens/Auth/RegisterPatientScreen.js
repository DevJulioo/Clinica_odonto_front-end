// screens/Auth/RegisterPatientScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerPatient } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Para o seletor de data
import moment from 'moment'; // Para formatação de data

const RegisterPatientSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido (Ex: (XX) XXXXX-XXXX)').required('Telefone é obrigatório'),
  imgUrl: Yup.string().url('URL de imagem inválida').nullable(),
  dataNascimento: Yup.string().required('Data de Nascimento é obrigatória'),
  senha: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

const RegisterPatientScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // CORREÇÃO: O backend espera dataNascimento no formato "DD/MM/YYYY" (conforme @JsonFormat)
      const formattedValues = {
        ...values,
        dataNascimento: moment(values.dataNascimento, "DD/MM/YYYY").format("DD/MM/YYYY"),
      };
      await registerPatient(formattedValues);
      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso! Faça login para continuar.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      Alert.alert('Erro no Cadastro', error.response?.data?.message || 'Erro ao cadastrar paciente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Cadastro de Paciente</Title>
      <Formik
        initialValues={{ nome: '', email: '', telefone: '', imgUrl: '', dataNascimento: '', senha: '' }}
        validationSchema={RegisterPatientSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              label="Nome Completo"
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              style={styles.input}
              error={touched.nome && errors.nome ? true : false}
            />
            {touched.nome && errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={touched.email && errors.email ? true : false}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Telefone (Ex: (XX) XXXXX-XXXX)"
              value={values.telefone}
              onChangeText={(text) => {
                // Aplica máscara de telefone se necessário
                const cleaned = text.replace(/\D/g, '');
                let formatted = '';
                if (cleaned.length > 0) {
                  formatted = `(${cleaned.substring(0, 2)}`;
                }
                if (cleaned.length > 2) {
                  formatted += `) ${cleaned.substring(2, 7)}`;
                }
                if (cleaned.length > 7) {
                  formatted += `-${cleaned.substring(7, 11)}`;
                }
                setFieldValue('telefone', formatted);
              }}
              onBlur={handleBlur('telefone')}
              keyboardType="phone-pad"
              style={styles.input}
              error={touched.telefone && errors.telefone ? true : false}
            />
            {touched.telefone && errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

            <TextInput
              label="URL da Imagem (Opcional)"
              value={values.imgUrl}
              onChangeText={handleChange('imgUrl')}
              onBlur={handleBlur('imgUrl')}
              keyboardType="url"
              autoCapitalize="none"
              style={styles.input}
              error={touched.imgUrl && errors.imgUrl ? true : false}
            />
            {touched.imgUrl && errors.imgUrl && <Text style={styles.errorText}>{errors.imgUrl}</Text>}

            <TextInput
              label="Data de Nascimento (DD/MM/YYYY)"
              value={values.dataNascimento}
              onChangeText={handleChange('dataNascimento')} // Permite entrada manual para flexibilidade
              onBlur={handleBlur('dataNascimento')}
              onFocus={() => setShowDatePicker(true)} // Abre o seletor no foco
              style={styles.input}
              showSoftInputOnFocus={false} // Impede que o teclado apareça no foco
            />
            {touched.dataNascimento && errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento}</Text>}
            
            {showDatePicker && (
              <DateTimePicker
                value={values.dataNascimento ? moment(values.dataNascimento, "DD/MM/YYYY").toDate() : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFieldValue('dataNascimento', moment(selectedDate).format('DD/MM/YYYY'));
                  }
                }}
              />
            )}

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
              Registrar
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            >
              Já tem conta? Voltar ao Login
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  backButton: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default RegisterPatientScreen;