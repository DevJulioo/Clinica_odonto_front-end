// components/forms/PatientForm.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Platform } from 'react-native'; // <-- Importado Platform
import { Button, HelperText, TextInput as PaperTextInput } from 'react-native-paper'; // Importar TextInput do paper se for usar ele em vez do InputField para o datepicker web
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '../common/InputField';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const PatientSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido (Ex: (XX) XXXXX-XXXX)')
    .required('Telefone é obrigatório'),
  imgUrl: Yup.string().url('URL de imagem inválida').nullable(),
  dataNascimento: Yup.string().required('Data de Nascimento é obrigatória'),
  senha: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});

const PatientForm = ({ initialValues, onSubmit, isEditing = false, loading = false }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={PatientSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.form}>
            <InputField
              label="Nome Completo"
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              error={touched.nome && !!errors.nome}
              helperText={touched.nome && errors.nome}
            />

            <InputField
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />

            <InputField
              label="Telefone (Ex: (XX) XXXXX-XXXX)"
              value={values.telefone}
              onChangeText={(text) => {
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
              error={touched.telefone && !!errors.telefone}
              helperText={touched.telefone && errors.telefone}
            />

            <InputField
              label="URL da Imagem (Opcional)"
              value={values.imgUrl}
              onChangeText={handleChange('imgUrl')}
              onBlur={handleBlur('imgUrl')}
              keyboardType="url"
              autoCapitalize="none"
              error={touched.imgUrl && !!errors.imgUrl}
              helperText={touched.imgUrl && errors.imgUrl}
            />

            {Platform.OS === 'web' ? (
              <PaperTextInput // Usando PaperTextInput para manter o estilo
                label="Data de Nascimento"
                value={values.dataNascimento}
                onChangeText={(text) => {
                  // A entrada de data HTML é YYYY-MM-DD
                  // Mas o valor do formulário deve ser DD/MM/YYYY para validação e backend
                  setFieldValue('dataNascimento', moment(text).format('DD/MM/YYYY'));
                }}
                onBlur={handleBlur('dataNascimento')}
                type="date" // Isso renderiza um input date no navegador
                style={styles.input}
                error={touched.dataNascimento && !!errors.dataNascimento}
              />
            ) : (
              <InputField
                label="Data de Nascimento (DD/MM/YYYY)"
                value={values.dataNascimento}
                onFocus={() => setShowDatePicker(true)}
                showSoftInputOnFocus={false}
                error={touched.dataNascimento && !!errors.dataNascimento}
                helperText={touched.dataNascimento && errors.dataNascimento}
              />
            )}
            {touched.dataNascimento && errors.dataNascimento && Platform.OS === 'web' && (
              <HelperText type="error" visible={true}>{errors.dataNascimento}</HelperText>
            )}
            
            {showDatePicker && Platform.OS !== 'web' && ( // Apenas mostra o picker nativo se não for web
              <DateTimePicker
                value={values.dataNascimento ? moment(values.dataNascimento, 'DD/MM/YYYY').toDate() : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFieldValue('dataNascimento', moment(selectedDate).format('DD/MM/YYYY'));
                  }
                }}
              />
            )}

            <InputField
              label="Senha"
              value={values.senha}
              onChangeText={handleChange('senha')}
              onBlur={handleBlur('senha')}
              secureTextEntry
              error={touched.senha && !!errors.senha}
              helperText={touched.senha && errors.senha}
            />
             {isEditing && (
                <HelperText type="info">
                    Deixe a senha em branco para não alterá-la ao editar.
                </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              {isEditing ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    width: '100%',
  },
  input: { // Estilo para o PaperTextInput no web
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
  },
});

export default PatientForm;