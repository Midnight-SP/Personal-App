import { usePreferences } from '@/context/preferences-context';

export function useColorScheme() {
  const { colorScheme } = usePreferences();
  return colorScheme;
}
