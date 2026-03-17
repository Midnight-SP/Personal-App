import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_BASE = 'https://midnight-sp.vercel.app/api';

type GitHubStats = {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  updated_at: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
};

type GitHubOrg = {
  id: number;
  login: string;
  description: string | null;
};

type GitHubContribution = {
  id: number;
  name: string;
  owner: string;
  description: string | null;
  html_url: string;
};

export default function CodingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, reposResponse, orgsResponse, contributionsResponse] = await Promise.all([
        fetch(`${API_BASE}/github-stats`),
        fetch(`${API_BASE}/github-repos`),
        fetch(`${API_BASE}/github-orgs`),
        fetch(`${API_BASE}/github-contributions`),
      ]);

      if (!statsResponse.ok || !reposResponse.ok || !orgsResponse.ok || !contributionsResponse.ok) {
        throw new Error('One or more API requests failed.');
      }

      const statsData = (await statsResponse.json()) as GitHubStats;
      const reposData = (await reposResponse.json()) as GitHubRepo[];
      const orgsData = (await orgsResponse.json()) as GitHubOrg[];
      const contributionsData = (await contributionsResponse.json()) as GitHubContribution[];

      setStats(statsData);
      setRepos(reposData);
      setOrgs(orgsData);
      setContributions(contributionsData);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error while fetching API data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.eyebrow}>Coding</ThemedText>
          <ThemedText type="title">GitHub activity</ThemedText>
          <ThemedText style={styles.metaText}>Live data from your personal website APIs.</ThemedText>
        </ThemedView>

        {loading ? <ThemedText>Loading coding data...</ThemedText> : null}

        {error ? (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Could not load API data</ThemedText>
            <ThemedText>{error}</ThemedText>
            <Pressable onPress={() => void loadData()} style={styles.linkButton}>
              <ThemedText type="link">Retry</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {!loading && !error ? (
          <ThemedView style={styles.grid}>
            {stats ? (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">GitHub Profile</ThemedText>
                <ThemedText style={styles.metaText}>@{stats.login}</ThemedText>
                <ThemedView style={styles.statsRow}>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.public_repos}</ThemedText>
                    <ThemedText style={styles.metaText}>Repos</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.followers}</ThemedText>
                    <ThemedText style={styles.metaText}>Followers</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.following}</ThemedText>
                    <ThemedText style={styles.metaText}>Following</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedText style={styles.metaText}>Updated: {new Date(stats.updated_at).toLocaleDateString()}</ThemedText>
              </ThemedView>
            ) : null}

            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">Explore Coding Data</ThemedText>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-repositories')}>
                <ThemedText>Repositories</ThemedText>
                <ThemedText style={styles.metaText}>{repos.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-organizations')}>
                <ThemedText>Organizations</ThemedText>
                <ThemedText style={styles.metaText}>{orgs.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-contributions')}>
                <ThemedText>Contributions</ThemedText>
                <ThemedText style={styles.metaText}>{contributions.length}</ThemedText>
              </Pressable>
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
    minWidth: 86,
  },
});