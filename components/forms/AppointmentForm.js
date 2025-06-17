// components/forms/AppointmentForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Platform, Alert } from 'react-native'; //
import { Button, HelperText, ActivityIndicator, TextInput as PaperTextInput } from 'react-native-paper'; // <-- Importado TextInput como PaperTextInput AQUI
import { Formik } from 'formik'; //
import * as Yup from 'yup'; //
import InputField from '../common/InputField'; //
import DateTimePicker from '@react-native-community/datetimepicker'; //
import moment from 'moment'; //
import { Picker } from '@react-native-picker/picker'; //

// Importar serviços para buscar pacientes e médicos (conceitual - descomente em seu projeto real)
// import { getAllPatients } from '../../services/patientService';
// import { getAllDoctors } from '../../services/doctorService';
// import { getAllSpecialties } from '../../services/specialtyService';

const AppointmentSchema = Yup.object().shape({
  dataConsulta: Yup.string().required('Data e Hora da Consulta são obrigatórias'),
  pacienteId: Yup.number()
    .transform(value => (value === '' ? null : value)) //
    .nullable(true) //
    .required('Paciente é obrigatório')
    .integer('Selecione um Paciente válido'),
  medicoId: Yup.string().required('Médico é obrigatório'),
  especialidadeId: Yup.number()
    .transform(value => (value === '' ? null : value)) //
    .nullable(true) //
    .integer('Selecione uma Especialidade válida'),
});

const AppointmentForm = ({ initialValues, onSubmit, isEditing = false, loading = false }) => {
  const [showDatePicker, setShowDatePicker] = useState(false); //
  const [pickerMode, setPickerMode] = useState('date'); //
  const [currentPickerFor, setCurrentPickerFor] = useState(''); // 'date' or 'time'

  // Estados para listas de seleção (em uma aplicação real, viriam de chamadas à API)
  const [patients, setPatients] = useState([]); //
  const [doctors, setDoctors] = useState([]); //
  const [specialties, setSpecialties] = useState([]); //
  const [dataLoading, setDataLoading] = useState(false); //

  useEffect(() => {
    const loadSelectionData = async () => {
      setDataLoading(true); //
      try {
        // Exemplo de como você chamaria seus serviços para buscar os dados:
        // const patientsData = await getAllPatients();
        // setPatients(patientsData);
        // const doctorsData = await getAllDoctors();
        // setDoctors(doctorsData);
        // const specialtiesData = await getAllSpecialties();
        // setSpecialties(specialtiesData);

        // Para este exemplo, usaremos dados mockados:
        setPatients([ //
          { pacienteId: 1, nome: 'Alice Silva' },
          { pacienteId: 2, nome: 'Bruno Costa' },
        ]);
        setDoctors([ //
          { crm: '123456-SP', nome: 'Dr. João Pedro' },
          { crm: '654321-RJ', nome: 'Dra. Maria Clara' },
        ]);
        setSpecialties([ //
          { especialidadeId: 1, nome: 'Clínico Geral' },
          { especialidadeId: 2, nome: 'Ortodontia' },
          { especialidadeId: 3, nome: 'Endodontia' },
        ]);

      } catch (error) { //
        console.error("Erro ao carregar dados para seleção:", error); //
        Alert.alert("Erro", "Não foi possível carregar listas para agendamento."); //
      } finally { //
        setDataLoading(false); //
      }
    };
    loadSelectionData(); //
  }, []); //

  const handleDateTimeChange = (event, selectedValue, setFieldValue, values) => {
    setShowDatePicker(false); //
    if (selectedValue) { //
      let currentDateTime = values.dataConsulta ? moment(values.dataConsulta, 'DD/MM/YYYY HH:mm') : moment(); //

      if (currentPickerFor === 'date') { //
        currentDateTime.year(moment(selectedValue).year()); //
        currentDateTime.month(moment(selectedValue).month()); //
        currentDateTime.date(moment(selectedValue).date()); //
      } else if (currentPickerFor === 'time') { //
        currentDateTime.hour(moment(selectedValue).hour()); //
        currentDateTime.minute(moment(selectedValue).minute()); //
      }
      setFieldValue('dataConsulta', currentDateTime.format('DD/MM/YYYY HH:mm')); //
    }
  };

  const showPickerModal = (mode, forField) => {
    setCurrentPickerFor(forField); //
    setPickerMode(mode); //
    setShowDatePicker(true); //
  };

  const parseAndSubmit = (values) => {
    const formattedDataConsulta = moment(values.dataConsulta, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ss'); //
    
    const formattedValues = { //
      ...values, //
      dataConsulta: formattedDataConsulta, //
      // Se o Picker envia '', transformamos para null para o backend, se ele aceitar null para opcional
      pacienteId: values.pacienteId === '' ? null : parseInt(values.pacienteId, 10), //
      especialidadeId: values.especialidadeId === '' ? null : parseInt(values.especialidadeId, 10), //
    };
    onSubmit(formattedValues); //
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {dataLoading ? ( //
        <ActivityIndicator size="large" color="#007BFF" /> //
      ) : (
        <Formik
          initialValues={initialValues} //
          validationSchema={AppointmentSchema} //
          onSubmit={parseAndSubmit} //
          enableReinitialize //
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => ( //
            <View style={styles.form}>
              {/* Campo de Data e Hora da Consulta */}
              {Platform.OS === 'web' ? ( //
                <PaperTextInput //
                  label="Data e Hora da Consulta"
                  value={values.dataConsulta ? moment(values.dataConsulta, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm') : ''} //
                  onChangeText={(text) => { //
                    // A entrada datetime-local HTML é YYYY-MM-DDTHH:mm
                    setFieldValue('dataConsulta', moment(text).format('DD/MM/YYYY HH:mm')); //
                  }}
                  onBlur={handleBlur('dataConsulta')} //
                  type="datetime-local" //
                  style={styles.input} //
                  error={touched.dataConsulta && !!errors.dataConsulta} //
                />
              ) : (
                // Seu código existente para iOS/Android
                <>
                  <InputField //
                    label="Data e Hora da Consulta (DD/MM/YYYY HH:mm)"
                    value={values.dataConsulta} //
                    onFocus={() => showPickerModal('date', 'date')} //
                    showSoftInputOnFocus={false} //
                    error={touched.dataConsulta && !!errors.dataConsulta} //
                    helperText={touched.dataConsulta && errors.dataConsulta} //
                    right={<PaperTextInput.Icon icon="calendar-month-outline" onPress={() => showPickerModal('date', 'date')} />} //
                  />
                  <Button //
                    mode="outlined"
                    onPress={() => showPickerModal('time', 'time')} //
                    style={styles.timePickerButton} //
                  >
                    Selecionar Hora
                  </Button>
                </>
              )}
              {touched.dataConsulta && errors.dataConsulta && Platform.OS === 'web' && ( //
                <HelperText type="error" visible={true}>{errors.dataConsulta}</HelperText> //
              )}

              {showDatePicker && Platform.OS !== 'web' && ( // // Apenas mostra o picker nativo se não for web
                <DateTimePicker //
                  value={values.dataConsulta ? moment(values.dataConsulta, 'DD/MM/YYYY HH:mm').toDate() : new Date()} //
                  mode={pickerMode} //
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} //
                  onChange={(event, selectedValue) => handleDateTimeChange(event, selectedValue, setFieldValue, values)} //
                />
              )}

              {/* Picker para Paciente */}
              <Text style={styles.pickerLabel}>Paciente:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.pacienteId}
                  onValueChange={(itemValue) => setFieldValue('pacienteId', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione um Paciente" value="" /> {/* <-- CORRIGIDO AQUI */}
                  {patients.map(p => (
                    <Picker.Item key={p.pacienteId} label={p.nome} value={p.pacienteId} />
                  ))}
                </Picker>
              </View>
              {touched.pacienteId && errors.pacienteId && (
                <HelperText type="error" visible={true}>
                  {errors.pacienteId}
                </HelperText>
              )}

              {/* Picker para Médico */}
              <Text style={styles.pickerLabel}>Médico:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.medicoId}
                  onValueChange={(itemValue) => setFieldValue('medicoId', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione um Médico" value="" /> {/* <-- CORRIGIDO AQUI */}
                  {doctors.map(d => (
                    <Picker.Item key={d.crm} label={d.nome} value={d.crm} />
                  ))}
                </Picker>
              </View>
              {touched.medicoId && errors.medicoId && (
                <HelperText type="error" visible={true}>
                  {errors.medicoId}
                </HelperText>
              )}

              {/* Picker para Especialidade */}
              <Text style={styles.pickerLabel}>Especialidade (Opcional):</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.especialidadeId}
                  onValueChange={(itemValue) => setFieldValue('especialidadeId', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Nenhuma Especialidade" value="" /> {/* <-- CORRIGIDO AQUI */}
                  {specialties.map(s => (
                    <Picker.Item key={s.especialidadeId} label={s.nome} value={s.especialidadeId} />
                  ))}
                </Picker>
              </View>
              {touched.especialidadeId && errors.especialidadeId && (
                <HelperText type="error" visible={true}>
                  {errors.especialidadeId}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              >
                {isEditing ? 'Atualizar Consulta' : 'Agendar Consulta'}
              </Button>
            </View>
          )}
        </Formik>
      )}
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
  timePickerButton: {
    marginTop: -5,
    marginBottom: 10,
    borderColor: '#007BFF',
    borderWidth: 1,
    paddingVertical: 5,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
  },
  input: { // Estilo para o PaperTextInput no web
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default AppointmentForm;