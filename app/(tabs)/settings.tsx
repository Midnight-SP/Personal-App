import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const settingsRows = [
  { label: 'Theme', description: 'Prepare dark and light mode controls here.' },
  { label: 'Language', description: 'Add English and Polish switching here when translations land.' },
  { label: 'External links', description: 'Keep personal links and app metadata in one place.' },
];

export default function SettingsScreen() {
  async function openAppReference() {
    await Linking.openURL('https://midnight-sp.vercel.app');
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>Settings</ThemedText>
          <ThemedText type="title">Preferences, app state, and support links.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.list}>
          {settingsRows.map((row) => (
            <ThemedView key={row.label} style={styles.rowCard}>
              <ThemedText type="defaultSemiBold">{row.label}</ThemedText>
              <ThemedText>{row.description}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        <Pressable onPress={openAppReference} style={styles.linkButton}>
          <ThemedText style={styles.linkText}>Open app reference</ThemedText>
        </Pressable>
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
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.72,
  },
  section: {
    gap: 10,
  },
  list: {
    gap: 14,
  },
  rowCard: {
    borderRadius: 10,
    padding: 18,
    gap: 10,
    backgroundColor: 'rgba(118, 75, 162, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(118, 75, 162, 0.18)',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  linkButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#764ba2',
  },
  linkText: {
    fontWeight: '700',
    color: '#ffffff',
  },
});