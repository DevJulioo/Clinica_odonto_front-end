// components/forms/SpecialtyForm.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '../common/InputField'; // Reutilizando o componente InputField

const SpecialtySchema = Yup.object().shape({
  nome: Yup.string().required('Nome da especialidade é obrigatório'),
});

const SpecialtyForm = ({ initialValues, onSubmit, isEditing = false, loading = false }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={SpecialtySchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <InputField
              label="Nome da Especialidade"
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              error={touched.nome && !!errors.nome}
              helperText={touched.nome && errors.nome}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              {isEditing ? 'Atualizar Especialidade' : 'Adicionar Especialidade'}
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
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
  },
});

export default SpecialtyForm;