import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { usePreferences } from '@/context/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const { language } = usePreferences();
  const [now, setNow] = useState(() => new Date());

  const copy = language === 'pl'
    ? {
        greeting: {
          morning: 'Dzień dobry',
          afternoon: 'Dzień dobry',
          evening: 'Dobry wieczór',
          night: 'Dobranoc',
        },
        subtitle: 'Witaj w mojej aplikacji mobilnej! Miłego korzystania.',
        hero:
          'Ta mobilna wersja łączy wszystko w jednym miejscu: projekty, aktywność programistyczną, muzykę, gry i linki.',
        aboutTitle: 'O mnie',
        aboutBody:
          'Student informatyki na Uniwersytecie Gdańskim, mieszkający w Gdyni. Skupiam się głównie na frontendzie i gamedevie, ucząc się przez budowanie szybkich prototypów i większych projektów.',
      }
    : {
        greeting: {
          morning: 'Good Morning',
          afternoon: 'Good Afternoon',
          evening: 'Good Evening',
          night: 'Good Night',
        },
        subtitle: 'Welcome to my personal app! Have fun.',
        hero:
          'This mobile version keeps the same direction as the app: projects, coding activity, music, gaming, and personal links in one place.',
        aboutTitle: 'About Me',
        aboutBody:
          'Computer Science student at the University of Gdańsk, based in Gdynia, Poland. I focus mostly on frontend and game development and learn by building both quick prototypes and larger projects.',
      };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = useMemo(() => {
    const locale = language === 'pl' ? 'pl-PL' : 'en-US';

    const time = now.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const date = now.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    return `${time} • ${date}`;
  }, [now, language]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return copy.greeting.morning;
    if (hour >= 12 && hour < 17) return copy.greeting.afternoon;
    if (hour >= 17 && hour < 22) return copy.greeting.evening;
    return copy.greeting.night;
  }, [now, copy]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.heroSection}>
          <ThemedText style={styles.clock}>{timeString}</ThemedText>
          <ThemedText style={styles.homeTitle}>{greeting}</ThemedText>
          <ThemedText style={styles.subtitle}>{copy.subtitle}</ThemedText>
          <ThemedText style={styles.heroCopy}>{copy.hero}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.activityBox}>
          <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
            {copy.aboutTitle}
          </ThemedText>
          <ThemedText>{copy.aboutBody}</ThemedText>
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
