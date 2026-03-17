import { Pressable, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
import { usePreferences } from '@/context/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  const router = useRouter();
  const { themePreference, setThemePreference, language, setLanguage } = usePreferences();

  const copy = language === 'pl'
    ? {
        eyebrow: 'Ustawienia',
        title: 'Preferencje i informacje o aplikacji',
        subtitle: 'Zarządzaj motywem, językiem i szybkim dostępem do linków.',
        general: 'Ogólne',
        theme: 'Motyw',
        themeDescription: 'Wybierz wygląd aplikacji.',
        language: 'Język',
        languageDescription: 'Wybierz język interfejsu.',
        links: 'Linki zewnętrzne',
        open: 'Otwórz',
        system: 'System',
        light: 'Jasny',
        dark: 'Ciemny',
        english: 'English',
        polish: 'Polski',
      }
    : {
        eyebrow: 'Settings',
        title: 'Preferences and app info',
        subtitle: 'Manage theme, language, and quick access links.',
        general: 'General',
        theme: 'Theme',
        themeDescription: 'Choose the app appearance.',
        language: 'Language',
        languageDescription: 'Choose the interface language.',
        links: 'External links',
        open: 'Open',
        system: 'System',
        light: 'Light',
        dark: 'Dark',
        english: 'English',
        polish: 'Polski',
      };

  const themeOptions = [
    { key: 'system', label: copy.system },
    { key: 'light', label: copy.light },
    { key: 'dark', label: copy.dark },
  ] as const;

  const languageOptions = [
    { key: 'en', label: copy.english },
    { key: 'pl', label: copy.polish },
  ] as const;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>{copy.eyebrow}</ThemedText>
          <ThemedText type="title">{copy.title}</ThemedText>
          <ThemedText style={styles.metaText}>{copy.subtitle}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">{copy.general}</ThemedText>

          <ThemedView style={styles.rowItem}>
            <ThemedText type="defaultSemiBold">{copy.theme}</ThemedText>
            <ThemedText style={styles.metaText}>{copy.themeDescription}</ThemedText>
            <ThemedView style={styles.toggleRow}>
              {themeOptions.map((option) => (
                <Pressable
                  key={option.key}
                  style={[styles.toggleOption, themePreference === option.key ? styles.toggleOptionActive : null]}
                  onPress={() => void setThemePreference(option.key)}>
                  <ThemedText
                    style={[styles.toggleText, themePreference === option.key ? styles.toggleTextActive : null]}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.rowItem}>
            <ThemedText type="defaultSemiBold">{copy.language}</ThemedText>
            <ThemedText style={styles.metaText}>{copy.languageDescription}</ThemedText>
            <ThemedView style={styles.toggleRow}>
              {languageOptions.map((option) => (
                <Pressable
                  key={option.key}
                  style={[styles.toggleOption, language === option.key ? styles.toggleOptionActive : null]}
                  onPress={() => void setLanguage(option.key)}>
                  <ThemedText style={[styles.toggleText, language === option.key ? styles.toggleTextActive : null]}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>

          <Pressable style={styles.actionRow} onPress={() => router.push('/details/settings-external-links')}>
            <ThemedText>{copy.links}</ThemedText>
            <ThemedText style={styles.metaText}>{copy.open}</ThemedText>
          </Pressable>
        </ThemedView>

        <AppFooter />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 12,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  section: {
    gap: 8,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.22)',
  },
  rowItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.22)',
    paddingVertical: 10,
    gap: 4,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.22)',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  toggleOption: {
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.25)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  toggleOptionActive: {
    borderColor: 'rgba(128, 128, 128, 0.6)',
    backgroundColor: 'rgba(128, 128, 128, 0.14)',
  },
  toggleText: {
    fontSize: 13,
    lineHeight: 16,
  },
  toggleTextActive: {
    fontWeight: '700',
  },
  metaText: {
    opacity: 0.72,
    fontSize: 13,
    lineHeight: 18,
  },
});