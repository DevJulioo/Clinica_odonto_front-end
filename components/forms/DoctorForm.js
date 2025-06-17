// components/forms/DoctorForm.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '../common/InputField'; // Reutilizando o componente InputField

const DoctorSchema = Yup.object().shape({
  crm: Yup.string()
    .matches(/^\d{6}-\w{2}$/, 'CRM inválido (Ex: 123456-SP)')
    .required('CRM é obrigatório'),
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido (Ex: (XX) XXXXX-XXXX)')
    .required('Telefone é obrigatório'),
  imgUrl: Yup.string().url('URL de imagem inválida').nullable(),
  senha: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
  especialidadesIds: Yup.array()
    .of(Yup.number().integer('ID de especialidade inválido'))
    .min(1, 'Selecione ao menos uma especialidade')
    .required('Especialidades são obrigatórias'),
});

const DoctorForm = ({ initialValues, onSubmit, isEditing = false, loading = false }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={DoctorSchema}
        onSubmit={(values) => {
          // Converte a string de especialidadesIds para um array de números
          const formattedValues = {
            ...values,
            especialidadesIds: values.especialidadesIds
              ? values.especialidadesIds.map(id => parseInt(id, 10))
              : [],
          };
          onSubmit(formattedValues);
        }}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.form}>
            <InputField
              label="CRM (Ex: 123456-SP)"
              value={values.crm}
              onChangeText={handleChange('crm')}
              onBlur={handleBlur('crm')}
              error={touched.crm && !!errors.crm}
              helperText={touched.crm && errors.crm}
              editable={!isEditing} // CRM geralmente não é editável
            />

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

            <InputField
              label="IDs das Especialidades (separados por vírgula)"
              value={Array.isArray(values.especialidadesIds) ? values.especialidadesIds.join(',') : ''}
              onChangeText={(text) => {
                const ids = text.split(',').map(s => s.trim()).filter(s => s !== '');
                setFieldValue('especialidadesIds', ids);
              }}
              onBlur={handleBlur('especialidadesIds')}
              keyboardType="numeric"
              error={touched.especialidadesIds && !!errors.especialidadesIds}
              helperText={touched.especialidadesIds && errors.especialidadesIds}
            />
            {/* Em uma aplicação real, aqui seria um componente de seleção de múltiplas especialidades com base em dados da API */}
            <HelperText type="info">
                Para adicionar/editar especialidades, insira os IDs separados por vírgula (ex: 1,3,5).
            </HelperText>


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
              {isEditing ? 'Atualizar Médico' : 'Cadastrar Médico'}
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

export default DoctorForm;