import { useEffect, useState } from 'react';
import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type LastPlayedGame = {
  appid: number;
  name: string;
  lastPlayed: string;
  developers?: string[];
  publishers?: string[];
};

type SteamResponse = {
  lastPlayedGames: LastPlayedGame[];
};

const API_URL = 'https://midnight-sp.vercel.app/api/steam-gaming';

export default function GamingLastPlayedScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<LastPlayedGame[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status})`);
        }

        const data = (await response.json()) as SteamResponse;
        setGames(data.lastPlayedGames || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching recently played games.');
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
      loadingText="Loading games..."
      emptyText="No recently played games found."
      rows={games.map<DetailListRow>((game) => ({
        id: String(game.appid),
        title: game.name,
        lines: [
          new Date(game.lastPlayed).toLocaleString(),
          game.developers && game.developers.length > 0 ? `Developer: ${game.developers.join(', ')}` : 'Developer: Unknown',
          game.publishers && game.publishers.length > 0 ? `Publisher: ${game.publishers.join(', ')}` : 'Publisher: Unknown',
        ],
        thumbnailUrl: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/capsule_184x69.jpg`,
        thumbnailVariant: 'landscape',
      }))}
    />
  );
}
