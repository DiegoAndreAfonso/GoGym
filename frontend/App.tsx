import { Provider as PaperProvider } from 'react-native-paper'
import Login from './src/screens/Login'
import { ThemeProvider } from './src/context/ThemeContext'
import { useFonts } from './src/hooks/useFonts'

export default function App() {
 const { fontsLoaded } = useFonts()

if (!fontsLoaded) {
  return null
}

  return (
    <ThemeProvider>
      <PaperProvider>
        <Login />
      </PaperProvider>
    </ThemeProvider>
  )
}
