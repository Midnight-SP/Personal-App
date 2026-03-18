import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Appearance, type ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
export type AppLanguage = 'en' | 'pl';

type PreferencesContextValue = {
  themePreference: ThemePreference;
  setThemePreference: (value: ThemePreference) => Promise<void>;
  colorScheme: NonNullable<ColorSchemeName>;
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => Promise<void>;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
};

const THEME_KEY = 'app.themePreference';
const LANGUAGE_KEY = 'app.language';
const NOTIFICATIONS_ENABLED_KEY = 'app.notificationsEnabled';
const memoryStorage = new Map<string, string>();
const FALLBACK_FILE = new FileSystem.File(FileSystem.Paths.document, 'preferences.json');

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

async function readFallbackStorage(): Promise<Record<string, string>> {
  try {
    const raw = await FALLBACK_FILE.text();
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return Object.entries(parsed as Record<string, unknown>).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
  } catch {
    return {};
  }
}

async function writeFallbackStorage(values: Record<string, string>): Promise<void> {
  try {
    FALLBACK_FILE.write(JSON.stringify(values));
  } catch {
    // Ignore persistence errors
  }
}

async function safeGetItem(key: string): Promise<string | null> {
  let asyncStorageValue: string | null = null;

  try {
    asyncStorageValue = await AsyncStorage.getItem(key);
    if (asyncStorageValue !== null) {
      memoryStorage.set(key, asyncStorageValue);
      return asyncStorageValue;
    }
  } catch {
    // Continue to fallback storage
  }

  const memoryValue = memoryStorage.get(key);
  if (memoryValue !== undefined) {
    return memoryValue;
  }

  const fallbackValues = await readFallbackStorage();
  const fallbackValue = fallbackValues[key];
  if (fallbackValue !== undefined) {
    memoryStorage.set(key, fallbackValue);
    return fallbackValue;
  }

  return null;
}

async function safeSetItem(key: string, value: string): Promise<void> {
  memoryStorage.set(key, value);

  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Ignore persistence errors (e.g. AsyncStorage native module unavailable)
  }

  const fallbackValues = await readFallbackStorage();
  fallbackValues[key] = value;
  await writeFallbackStorage(fallbackValues);
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [savedTheme, savedLanguage, savedNotificationsEnabled] = await Promise.all([
        safeGetItem(THEME_KEY),
        safeGetItem(LANGUAGE_KEY),
        safeGetItem(NOTIFICATIONS_ENABLED_KEY),
      ]);

      if (savedTheme === 'system' || savedTheme === 'light' || savedTheme === 'dark') {
        setThemePreferenceState(savedTheme);
      }

      if (savedLanguage === 'en' || savedLanguage === 'pl') {
        setLanguageState(savedLanguage);
      }

      if (savedNotificationsEnabled === 'true') {
        setNotificationsEnabledState(true);
      }

      if (savedNotificationsEnabled === 'false') {
        setNotificationsEnabledState(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    try {
      Appearance.setColorScheme(themePreference === 'system' ? null : themePreference);
    } catch {
      // no-op on platforms where overriding appearance is unsupported
    }
  }, [themePreference]);

  const colorScheme: NonNullable<ColorSchemeName> =
    themePreference === 'system' ? (systemColorScheme ?? 'light') : themePreference;

  const value = useMemo<PreferencesContextValue>(
    () => ({
      themePreference,
      setThemePreference: async (nextTheme) => {
        setThemePreferenceState(nextTheme);
        await safeSetItem(THEME_KEY, nextTheme);
      },
      colorScheme,
      language,
      setLanguage: async (nextLanguage) => {
        setLanguageState(nextLanguage);
        await safeSetItem(LANGUAGE_KEY, nextLanguage);
      },
      notificationsEnabled,
      setNotificationsEnabled: async (nextValue) => {
        setNotificationsEnabledState(nextValue);
        await safeSetItem(NOTIFICATIONS_ENABLED_KEY, String(nextValue));
      },
    }),
    [themePreference, colorScheme, language, notificationsEnabled]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }

  return context;
}
