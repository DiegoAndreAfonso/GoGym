import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

interface FontResources {
  [key: string]: any;
}

export const useFonts = (): { fontsLoaded: boolean; error: Error | null } => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
          'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
          'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
          'Montserrat-Black': require('../assets/fonts/Montserrat-Black.ttf'),
          'Blast-Dragon': require('../assets/fonts/Blast_Dragon_D.otf'),
        })

        setFontsLoaded(true);
      } catch (err) {
        setError(err as Error);
        console.error('Erro ao carregar fontes:', err);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
};