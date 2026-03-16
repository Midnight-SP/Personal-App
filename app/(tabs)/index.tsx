import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = useMemo(() => {
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    return `${time} • ${date}`;
  }, [now]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  }, [now]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.heroSection}>
          <ThemedText style={styles.clock}>{timeString}</ThemedText>
          <ThemedText style={styles.homeTitle}>{greeting}</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome to my personal app! Have fun.</ThemedText>
          <ThemedText style={styles.heroCopy}>
            This mobile version keeps the same direction as the app: projects, coding activity,
            music, gaming, and personal links in one place.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.activityBox}>
          <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
            About Me
          </ThemedText>
          <ThemedText>
            Computer Science student at the University of Gdańsk, based in Gdynia, Poland. I focus
            mostly on frontend and game development and learn by building both quick prototypes and
            larger projects.
          </ThemedText>
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
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 380,
    paddingVertical: 28,
    paddingHorizontal: 8,
  },
  clock: {
    fontSize: 13,
    letterSpacing: 0.5,
    opacity: 0.9,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.25)',
    backgroundColor: 'rgba(102, 126, 234, 0.10)',
  },
  homeTitle: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '600',
    maxWidth: 680,
  },
  heroCopy: {
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 700,
    textAlign: 'center',
    opacity: 0.9,
  },
  primaryAction: {
    marginTop: 6,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007bff',
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  activityBox: {
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.18)',
    backgroundColor: 'rgba(102, 126, 234, 0.06)',
    padding: 16,
    gap: 10,
  },
  activityTitle: {
    fontSize: 18,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickLink: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(118, 75, 162, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(118, 75, 162, 0.22)',
  },
  quickLinkText: {
    fontWeight: '600',
    color: '#764BA2',
  },
});
