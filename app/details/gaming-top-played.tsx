import { useEffect, useState } from 'react';
import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type TopPlayedGame = {
  appid: number;
  name: string;
  hours: number;
  developers?: string[];
  publishers?: string[];
};

type SteamResponse = {
  topPlayed: TopPlayedGame[];
};

const API_URL = 'https://midnight-sp.vercel.app/api/steam-gaming';

export default function GamingTopPlayedScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<TopPlayedGame[]>([]);

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
        setGames(data.topPlayed || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching top played games.');
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
      emptyText="No top played games found."
      rows={games.map<DetailListRow>((game, index) => ({
        id: String(game.appid),
        title: `#${index + 1} ${game.name}`,
        lines: [
          `${game.hours} hours`,
          game.developers && game.developers.length > 0 ? `Developer: ${game.developers.join(', ')}` : 'Developer: Unknown',
          game.publishers && game.publishers.length > 0 ? `Publisher: ${game.publishers.join(', ')}` : 'Publisher: Unknown',
        ],
        thumbnailUrl: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/capsule_184x69.jpg`,
        thumbnailVariant: 'landscape',
      }))}
    />
  );
}
