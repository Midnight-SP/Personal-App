import { ScrollView, StyleSheet } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const highlights = [
  { label: 'Recently played', value: 'Spotify integration placeholder' },
  { label: 'Top artists', value: 'Ready for API-backed cards' },
  { label: 'Top tracks', value: 'Good fit for a swipeable list later' },
];

export default function MusicScreen() {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>Music</ThemedText>
          <ThemedText type="title">Listening profile and recent tracks.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.grid}>
          {highlights.map((item) => (
            <ThemedView key={item.label} style={styles.card}>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
              <ThemedText>{item.value}</ThemedText>
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
    backgroundColor: 'rgba(183, 63, 107, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(183, 63, 107, 0.18)',
    shadowColor: '#b73f6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});