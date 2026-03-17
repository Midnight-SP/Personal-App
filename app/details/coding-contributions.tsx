import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type Contribution = {
  id: number;
  name: string;
  owner: string;
  description: string | null;
  html_url: string;
};

const API_URL = 'https://midnight-sp.vercel.app/api/github-contributions';

export default function CodingContributionsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status})`);
        }

        const data = (await response.json()) as Contribution[];
        setContributions(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching contributions.');
      } finally {
        setLoading(false);
      }
    };

    void loadContributions();
  }, []);

  return (
    <DetailListScreen
      loading={loading}
      error={error}
      loadingText="Loading contributions..."
      emptyText="No contributions found."
      rows={contributions.map<DetailListRow>((contribution) => ({
        id: String(contribution.id),
        title: `${contribution.owner}/${contribution.name}`,
        lines: contribution.description ? [contribution.description] : undefined,
        onPress: () => void Linking.openURL(contribution.html_url),
      }))}
    />
  );
}
