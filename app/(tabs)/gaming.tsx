import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
import { usePreferences } from '@/context/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_URL = 'https://midnight-sp.vercel.app/api/steam-gaming';

type SteamProfile = {
  name: string;
  profileUrl: string;
  accountCreated: string;
  avatar?: string;
};

type LastPlayedGame = {
  appid: number;
  name: string;
  lastPlayed: string;
};

type TopPlayedGame = {
  appid: number;
  name: string;
  hours: number;
};

type SteamGamingData = {
  total: number;
  totalBadges: number;
  steamLevel: number;
  fetchedAt: string;
  playerProfile: SteamProfile;
  lastPlayedGames: LastPlayedGame[];
  topPlayed: TopPlayedGame[];
};

export default function GamingScreen() {
  const router = useRouter();
  const { language } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamingData, setGamingData] = useState<SteamGamingData | null>(null);

  const copy = language === 'pl'
    ? {
        eyebrow: 'Gry',
        title: 'Aktywność Steam',
        subtitle: 'Dane na żywo z API Steam.',
        loading: 'Ładowanie danych gamingowych...',
        errorTitle: 'Nie udało się pobrać danych API',
        retry: 'Ponów',
        profile: 'Profil Steam',
        level: 'Poziom',
        badges: 'Odznaki',
        games: 'Gry',
        since: 'Od',
        topPlayed: 'Najczęściej grane',
        recent: 'Ostatnio grane',
        updated: 'Aktualizacja',
      }
    : {
        eyebrow: 'Gaming',
        title: 'Steam activity',
        subtitle: 'Live data from your Steam gaming API.',
        loading: 'Loading gaming data...',
        errorTitle: 'Could not load API data',
        retry: 'Retry',
        profile: 'Steam Profile',
        level: 'Level',
        badges: 'Badges',
        games: 'Games',
        since: 'Since',
        topPlayed: 'Top Played Games',
        recent: 'Recently Played Games',
        updated: 'Updated',
      };

  const loadGamingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
      }

      const data = (await response.json()) as SteamGamingData;
      setGamingData(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching gaming data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGamingData();
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>{copy.eyebrow}</ThemedText>
          <ThemedText type="title">{copy.title}</ThemedText>
          <ThemedText style={styles.metaText}>{copy.subtitle}</ThemedText>
        </ThemedView>

        {loading ? <ThemedText>{copy.loading}</ThemedText> : null}

        {error ? (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">{copy.errorTitle}</ThemedText>
            <ThemedText>{error}</ThemedText>
            <Pressable onPress={() => void loadGamingData()} style={styles.linkButton}>
              <ThemedText type="link">{copy.retry}</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {!loading && !error && gamingData ? (
          <ThemedView style={styles.grid}>
            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">{copy.profile}</ThemedText>
              {gamingData.playerProfile.avatar ? (
                <Image source={{ uri: gamingData.playerProfile.avatar }} style={styles.profileAvatar} />
              ) : null}
              <ThemedText style={styles.profileName}>{gamingData.playerProfile.name}</ThemedText>
              <ThemedView style={styles.statsRow}>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.steamLevel}</ThemedText>
                  <ThemedText style={styles.metaText}>{copy.level}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.totalBadges}</ThemedText>
                  <ThemedText style={styles.metaText}>{copy.badges}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.total}</ThemedText>
                  <ThemedText style={styles.metaText}>{copy.games}</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.metaText}>
                {copy.since}: {new Date(gamingData.playerProfile.accountCreated).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
              </ThemedText>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/gaming-top-played')}>
                <ThemedText>{copy.topPlayed}</ThemedText>
                <ThemedText style={styles.metaText}>{gamingData.topPlayed.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/gaming-last-played')}>
                <ThemedText>{copy.recent}</ThemedText>
                <ThemedText style={styles.metaText}>{gamingData.lastPlayedGames.length}</ThemedText>
              </Pressable>
              <ThemedText style={styles.metaText}>{copy.updated}: {new Date(gamingData.fetchedAt).toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US')}</ThemedText>
            </ThemedView>
          </ThemedView>
        ) : null}

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
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.22)',
  },
  profileName: {
    fontSize: 18,
    lineHeight: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.16)',
  },
  metaText: {
    opacity: 0.72,
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statPill: {
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.24)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
    minWidth: 80,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.22)',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
});