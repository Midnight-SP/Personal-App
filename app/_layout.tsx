import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PreferencesProvider, usePreferences } from '@/context/preferences-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <RootLayoutContent />
    </PreferencesProvider>
  );
}

function RootLayoutContent() {
  const { colorScheme } = usePreferences();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Scratchpad' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
