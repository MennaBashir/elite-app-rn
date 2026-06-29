import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'GermaniaOne-Regular': require('../../assets/fonts/GermaniaOne-Regular.ttf'),
    'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Italic': require('../../assets/fonts/PlayfairDisplay-Italic.ttf'),
    'PlayfairDisplay-Medium': require('../../assets/fonts/PlayfairDisplay-Medium.ttf'),
    'PlayfairDisplay-MediumItalic': require('../../assets/fonts/PlayfairDisplay-MediumItalic.ttf'),
    'PlayfairDisplay-SemiBold': require('../../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-SemiBoldItalic': require('../../assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf'),
    'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-BoldItalic': require('../../assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
    'PlayfairDisplay-ExtraBold': require('../../assets/fonts/PlayfairDisplay-ExtraBold.ttf'),
    'PlayfairDisplay-ExtraBoldItalic': require('../../assets/fonts/PlayfairDisplay-ExtraBoldItalic.ttf'),
    'PlayfairDisplay-Black': require('../../assets/fonts/PlayfairDisplay-Black.ttf'),
    'PlayfairDisplay-BlackItalic': require('../../assets/fonts/PlayfairDisplay-BlackItalic.ttf'),
    'Geist-Black': require('../../assets/fonts/Geist-Black.ttf'),
    'Geist-Bold': require('../../assets/fonts/Geist-Bold.ttf'),
    'Geist-SemiBold': require('../../assets/fonts/Geist-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <Text>Loading...</Text>;
  }
  console.log(loaded, error);

  return <Stack screenOptions={{ headerShown: false }} />;
}
