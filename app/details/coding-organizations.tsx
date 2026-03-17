import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';

type Organization = {
  id: number;
  login: string;
  description: string | null;
  avatar_url: string;
};

const API_URL = 'https://midnight-sp.vercel.app/api/github-orgs';

export default function CodingOrganizationsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status})`);
        }

        const data = (await response.json()) as Organization[];
        setOrganizations(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching organizations.');
      } finally {
        setLoading(false);
      }
    };

    void loadOrganizations();
  }, []);

  return (
    <DetailListScreen
      loading={loading}
      error={error}
      loadingText="Loading organizations..."
      emptyText="No organizations found."
      rows={organizations.map<DetailListRow>((organization) => ({
        id: String(organization.id),
        title: organization.login,
        lines: organization.description ? [organization.description] : undefined,
        thumbnailUrl: organization.avatar_url,
        onPress: () => void Linking.openURL(`https://github.com/${organization.login}`),
      }))}
    />
  );
}
