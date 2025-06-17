// navigation/index.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { getToken } from '../utils/authStorage';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setUserToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userToken ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;