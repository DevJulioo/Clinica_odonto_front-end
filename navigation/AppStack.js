// navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import PatientListScreen from '../screens/Patients/PatientListScreen';
import PatientDetailScreen from '../screens/Patients/PatientDetailScreen';
import PatientRegisterScreen from '../screens/Patients/PatientRegisterScreen';
import DoctorListScreen from '../screens/Doctors/DoctorListScreen';
import DoctorDetailScreen from '../screens/Doctors/DoctorDetailScreen';
import DoctorRegisterScreen from '../screens/Doctors/DoctorRegisterScreen';
import AppointmentListScreen from '../screens/Appointments/AppointmentListScreen';
import AppointmentRegisterScreen from '../screens/Appointments/AppointmentRegisterScreen';
import SpecialtyListScreen from '../screens/Specialties/SpecialtyListScreen';
import SpecialtyRegisterScreen from '../screens/Specialties/SpecialtyRegisterScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PatientList" component={PatientListScreen} />
      <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
      <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
      <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
      <Stack.Screen name="AppointmentList" component={AppointmentListScreen} />
      <Stack.Screen name="AppointmentRegister" component={AppointmentRegisterScreen} />
      <Stack.Screen name="SpecialtyList" component={SpecialtyListScreen} />
      <Stack.Screen name="SpecialtyRegister" component={SpecialtyRegisterScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;