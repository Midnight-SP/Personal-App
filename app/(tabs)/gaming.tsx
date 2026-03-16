import { ScrollView, StyleSheet, View } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const gamingSections = [
  'Steam profile summary',
  'Most played games',
  'Recent activity and badges',
];

export default function GamingScreen() {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>Gaming</ThemedText>
          <ThemedText type="title">Games, stats, and current activity.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.card}>
          {gamingSections.map((item) => (
            <View key={item} style={styles.row}>
              <View style={styles.dot} />
              <ThemedText>{item}</ThemedText>
            </View>
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
  card: {
    borderRadius: 10,
    padding: 18,
    gap: 14,
    backgroundColor: 'rgba(46, 91, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(46, 91, 255, 0.18)',
    shadowColor: '#2E5BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#2E5BFF',
  },
});