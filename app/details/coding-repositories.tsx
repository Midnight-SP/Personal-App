import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type Repository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
};

const API_URL = 'https://midnight-sp.vercel.app/api/github-repos';

export default function CodingRepositoriesScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status})`);
        }

        const data = (await response.json()) as Repository[];
        setRepositories(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching repositories.');
      } finally {
        setLoading(false);
      }
    };

    void loadRepositories();
  }, []);

  return (
    <DetailListScreen
      loading={loading}
      error={error}
      loadingText="Loading repositories..."
      emptyText="No repositories found."
      rows={repositories.map<DetailListRow>((repository) => ({
        id: String(repository.id),
        title: repository.name,
        lines: repository.description ? [repository.description] : undefined,
        badges: [
          `★ ${repository.stargazers_count}`,
          repository.language ? repository.language : 'No language',
        ],
        onPress: () => void Linking.openURL(repository.html_url),
      }))}
    />
  );
}
