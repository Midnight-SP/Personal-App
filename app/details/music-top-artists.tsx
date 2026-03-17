import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type Artist = {
  name: string;
  spotifyUrl: string;
  followers: number;
  image?: string;
  genres?: string[];
};

type SpotifyResponse = {
  topArtists: Artist[];
};

const API_URL = 'https://midnight-sp.vercel.app/api/spotify-data';

export default function MusicTopArtistsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);

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
        setArtists(data.topArtists || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching top artists.');
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
      loadingText="Loading artists..."
      emptyText="No top artists found."
      rows={artists.map<DetailListRow>((artist, index) => ({
        id: `${artist.name}-${index}`,
        title: `#${index + 1} ${artist.name}`,
        lines: [`${artist.followers.toLocaleString()} followers`],
        thumbnailUrl: artist.image,
        badges: artist.genres && artist.genres.length > 0 ? artist.genres.slice(0, 4) : ['No genres'],
        onPress: () => void Linking.openURL(artist.spotifyUrl),
      }))}
    />
  );
}
