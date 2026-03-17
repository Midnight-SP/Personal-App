import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFooter } from '@/components/app-footer';
import { usePreferences } from '@/context/preferences-context';
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
  const { language } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);

  const copy = language === 'pl'
    ? {
        eyebrow: 'Kod',
        title: 'Aktywność GitHub',
        subtitle: 'Dane na żywo z API Twojej strony.',
        loading: 'Ładowanie danych programistycznych...',
        errorTitle: 'Nie udało się pobrać danych API',
        retry: 'Ponów',
        profile: 'Profil GitHub',
        repos: 'Repozytoria',
        followers: 'Obserwujący',
        following: 'Obserwowani',
        updated: 'Aktualizacja',
        explore: 'Przeglądaj dane programistyczne',
        organizations: 'Organizacje',
        contributions: 'Kontrybucje',
      }
    : {
        eyebrow: 'Coding',
        title: 'GitHub activity',
        subtitle: 'Live data from your personal website APIs.',
        loading: 'Loading coding data...',
        errorTitle: 'Could not load API data',
        retry: 'Retry',
        profile: 'GitHub Profile',
        repos: 'Repos',
        followers: 'Followers',
        following: 'Following',
        updated: 'Updated',
        explore: 'Explore Coding Data',
        organizations: 'Organizations',
        contributions: 'Contributions',
      };

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
          <ThemedText style={styles.eyebrow}>{copy.eyebrow}</ThemedText>
          <ThemedText type="title">{copy.title}</ThemedText>
          <ThemedText style={styles.metaText}>{copy.subtitle}</ThemedText>
        </ThemedView>

        {loading ? <ThemedText>{copy.loading}</ThemedText> : null}

        {error ? (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">{copy.errorTitle}</ThemedText>
            <ThemedText>{error}</ThemedText>
            <Pressable onPress={() => void loadData()} style={styles.linkButton}>
              <ThemedText type="link">{copy.retry}</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {!loading && !error ? (
          <ThemedView style={styles.grid}>
            {stats ? (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">{copy.profile}</ThemedText>
                <ThemedText style={styles.metaText}>@{stats.login}</ThemedText>
                <ThemedView style={styles.statsRow}>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.public_repos}</ThemedText>
                    <ThemedText style={styles.metaText}>{copy.repos}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.followers}</ThemedText>
                    <ThemedText style={styles.metaText}>{copy.followers}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.statPill}>
                    <ThemedText type="defaultSemiBold">{stats.following}</ThemedText>
                    <ThemedText style={styles.metaText}>{copy.following}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedText style={styles.metaText}>{copy.updated}: {new Date(stats.updated_at).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}</ThemedText>
              </ThemedView>
            ) : null}

            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">{copy.explore}</ThemedText>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-repositories')}>
                <ThemedText>{copy.repos}</ThemedText>
                <ThemedText style={styles.metaText}>{repos.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-organizations')}>
                <ThemedText>{copy.organizations}</ThemedText>
                <ThemedText style={styles.metaText}>{orgs.length}</ThemedText>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => router.push('/details/coding-contributions')}>
                <ThemedText>{copy.contributions}</ThemedText>
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