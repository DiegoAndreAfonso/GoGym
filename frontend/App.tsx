import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/context/ThemeContext';
import { useFonts } from './src/hooks/useFonts';
import { ToastContextProvider } from './src/context/ToastContext'

import 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const { fontsLoaded } = useFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ToastContextProvider>
      <ThemeProvider>
        <PaperProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <AppNavigator />
        </PaperProvider>
      </ThemeProvider>
    </ToastContextProvider>
  );
}