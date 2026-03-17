import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type Track = {
  name: string;
  artist: string;
  album: string;
  spotifyUrl: string;
  albumImage?: string;
};

type SpotifyResponse = {
  topTracks: Track[];
};

const API_URL = 'https://midnight-sp.vercel.app/api/spotify-data';

export default function MusicTopTracksScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status})`);
        }

        const data = (await response.json()) as SpotifyResponse;
        setTracks(data.topTracks || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching top tracks.');
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  return (
    <DetailListScreen
      loading={loading}
      error={error}
      loadingText="Loading tracks..."
      emptyText="No top tracks found."
      rows={tracks.map<DetailListRow>((track, index) => ({
        id: `${track.name}-${track.artist}-${index}`,
        title: `#${index + 1} ${track.name}`,
        lines: [track.artist, track.album],
        thumbnailUrl: track.albumImage,
        onPress: () => void Linking.openURL(track.spotifyUrl),
      }))}
    />
  );
}
