import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
import { usePreferences } from '@/context/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_URL = 'https://midnight-sp.vercel.app/api/spotify-data';

type RecentTrack = {
  name: string;
  artist: string;
  album: string;
  spotifyUrl: string;
  playedAt: string;
  albumImage?: string;
};

type Artist = {
  name: string;
  spotifyUrl: string;
  followers: number;
  genres?: string[];
};

type Track = {
  name: string;
  artist: string;
  album: string;
  spotifyUrl: string;
};

type SpotifyData = {
  recentTrack: RecentTrack | null;
  topArtists: Artist[];
  topTracks: Track[];
  error?: string;
};

export default function MusicScreen() {
  const router = useRouter();
  const { language } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [musicData, setMusicData] = useState<SpotifyData | null>(null);

  const copy = language === 'pl'
    ? {
        eyebrow: 'Muzyka',
        title: 'Aktywność Spotify',
        subtitle: 'Dane na żywo z API Spotify.',
        loading: 'Ładowanie danych muzycznych...',
        errorTitle: 'Nie udało się pobrać danych API',
        retry: 'Ponów',
        recent: 'Ostatnio odtwarzane',
        topGenres: 'Top gatunki',
        topArtists: 'Top artyści',
        topTracks: 'Top utwory',
        noRecent: 'Brak ostatnio odtwarzanego utworu.',
      }
    : {
        eyebrow: 'Music',
        title: 'Spotify activity',
        subtitle: 'Live data from your Spotify API.',
        loading: 'Loading music data...',
        errorTitle: 'Could not load API data',
        retry: 'Retry',
        recent: 'Recently Played',
        topGenres: 'Top genres',
        topArtists: 'Top Artists',
        topTracks: 'Top Tracks',
        noRecent: 'No recent track available.',
      };

  const topGenres = (musicData?.topArtists || [])
    .flatMap((artist) => artist.genres || [])
    .filter(Boolean)
    .reduce<Record<string, number>>((accumulator, genre) => {
      accumulator[genre] = (accumulator[genre] || 0) + 1;
      return accumulator;
    }, {});

  const topGenreList = Object.entries(topGenres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const loadMusicData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
      }

      const data = (await response.json()) as SpotifyData;
      if (data.error) {
        throw new Error(data.error);
      }

      setMusicData(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching music data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMusicData();
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
            <Pressable onPress={() => void loadMusicData()} style={styles.linkButton}>
              <ThemedText type="link">{copy.retry}</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {!loading && !error && musicData ? (
          <ThemedView style={styles.grid}>
            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">{copy.recent}</ThemedText>
              {musicData.recentTrack ? (
                <>
                  {musicData.recentTrack.albumImage ? (
                    <Image source={{ uri: musicData.recentTrack.albumImage }} style={styles.albumCover} />
                  ) : null}
                  <ThemedText type="defaultSemiBold">{musicData.recentTrack.name}</ThemedText>
                  <ThemedText style={styles.metaText}>{musicData.recentTrack.artist}</ThemedText>
                  <ThemedText style={styles.metaText}>{musicData.recentTrack.album}</ThemedText>
                  <ThemedText style={styles.metaText}>{new Date(musicData.recentTrack.playedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}</ThemedText>
                  {topGenreList.length > 0 ? <ThemedText style={styles.metaText}>{copy.topGenres}: {topGenreList.join(', ')}</ThemedText> : null}
                  <Pressable style={styles.actionRow} onPress={() => router.push('/details/music-top-artists')}>
                    <ThemedText>{copy.topArtists}</ThemedText>
                    <ThemedText style={styles.metaText}>{musicData.topArtists.length}</ThemedText>
                  </Pressable>
                  <Pressable style={styles.actionRow} onPress={() => router.push('/details/music-top-tracks')}>
                    <ThemedText>{copy.topTracks}</ThemedText>
                    <ThemedText style={styles.metaText}>{musicData.topTracks.length}</ThemedText>
                  </Pressable>
                </>
              ) : (
                <ThemedText style={styles.metaText}>{copy.noRecent}</ThemedText>
              )}
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
  metaText: {
    opacity: 0.72,
    fontSize: 13,
    lineHeight: 18,
  },
  albumCover: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.16)',
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