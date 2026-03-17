import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamingData, setGamingData] = useState<SteamGamingData | null>(null);

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
          <ThemedText style={styles.eyebrow}>Gaming</ThemedText>
          <ThemedText type="title">Steam activity</ThemedText>
          <ThemedText style={styles.metaText}>Live data from your Steam gaming API.</ThemedText>
        </ThemedView>

        {loading ? <ThemedText>Loading gaming data...</ThemedText> : null}

        {error ? (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Could not load API data</ThemedText>
            <ThemedText>{error}</ThemedText>
            <Pressable onPress={() => void loadGamingData()} style={styles.linkButton}>
              <ThemedText type="link">Retry</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {!loading && !error && gamingData ? (
          <ThemedView style={styles.grid}>
            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">Steam Profile</ThemedText>
              {gamingData.playerProfile.avatar ? (
                <Image source={{ uri: gamingData.playerProfile.avatar }} style={styles.profileAvatar} />
              ) : null}
              <ThemedText style={styles.profileName}>{gamingData.playerProfile.name}</ThemedText>
              <ThemedView style={styles.statsRow}>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.steamLevel}</ThemedText>
                  <ThemedText style={styles.metaText}>Level</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.totalBadges}</ThemedText>
                  <ThemedText style={styles.metaText}>Badges</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statPill}>
                  <ThemedText type="defaultSemiBold">{gamingData.total}</ThemedText>
                  <ThemedText style={styles.metaText}>Games</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.metaText}>
                Since: {new Date(gamingData.playerProfile.accountCreated).toLocaleDateString()}
              </ThemedText>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/gaming-top-played')}>
                <ThemedText>Top Played Games</ThemedText>
                <ThemedText style={styles.metaText}>{gamingData.topPlayed.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/gaming-last-played')}>
                <ThemedText>Recently Played Games</ThemedText>
                <ThemedText style={styles.metaText}>{gamingData.lastPlayedGames.length}</ThemedText>
              </Pressable>
              <ThemedText style={styles.metaText}>Updated: {new Date(gamingData.fetchedAt).toLocaleString()}</ThemedText>
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