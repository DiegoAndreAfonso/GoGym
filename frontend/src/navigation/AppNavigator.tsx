import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { RootStackParamList } from 'src/navigation/types';

import Login from '@/screens/Auth/Login';
import Register from '@/screens/Auth/Register';
import ForgotPassword from '@/screens/Auth/ForgotPassword'


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme } = useTheme();

  const navigationTheme = {
    dark: theme.background === '#260635ff', 
    colors: {
      primary: theme.text.link,
      background: theme.background,
      card: theme.background,
      text: theme.text.primary,
      border: theme.input.border,
      notification: theme.text.primary,
    },
  };

  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
     
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            gestureEnabled: false, 
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={Register}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword}
        />       
      </Stack.Navigator>
    </NavigationContainer>
  );
}