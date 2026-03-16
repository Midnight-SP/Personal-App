import { ScrollView, StyleSheet } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const sections = [
  {
    title: 'GitHub activity',
    description: 'Live profile activity and contribution stream from your GitHub account.',
  },
  {
    title: 'Repositories',
    description: 'Key repos you want to surface from personal and public work.',
  },
  {
    title: 'Organizations',
    description: 'Organizations you are part of and related projects under those groups.',
  },
];

export default function CodingScreen() {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>Coding</ThemedText>
          <ThemedText type="title">GitHub hub for coding activity.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.grid}>
          {sections.map((section) => (
            <ThemedView key={section.title} style={styles.card}>
              <ThemedText type="defaultSemiBold">{section.title}</ThemedText>
              <ThemedText>{section.description}</ThemedText>
            </ThemedView>
          ))}
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
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 10,
    padding: 18,
    gap: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.18)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});