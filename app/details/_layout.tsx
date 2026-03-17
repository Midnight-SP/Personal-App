import { Stack } from 'expo-router';

import { usePreferences } from '@/context/preferences-context';

export default function DetailsLayout() {
  const { language } = usePreferences();

  const titles = language === 'pl'
    ? {
        repositories: 'Repozytoria',
        organizations: 'Organizacje',
        contributions: 'Kontrybucje',
        topPlayed: 'Najczęściej grane',
        recentPlayed: 'Ostatnio grane',
        topArtists: 'Top artyści',
        topTracks: 'Top utwory',
        externalLinks: 'Linki zewnętrzne',
      }
    : {
        repositories: 'Repositories',
        organizations: 'Organizations',
        contributions: 'Contributions',
        topPlayed: 'Top Played Games',
        recentPlayed: 'Recently Played Games',
        topArtists: 'Top Artists',
        topTracks: 'Top Tracks',
        externalLinks: 'External Links',
      };

  return (
    <Stack>
      <Stack.Screen name="coding-repositories" options={{ title: titles.repositories }} />
      <Stack.Screen name="coding-organizations" options={{ title: titles.organizations }} />
      <Stack.Screen name="coding-contributions" options={{ title: titles.contributions }} />
      <Stack.Screen name="gaming-top-played" options={{ title: titles.topPlayed }} />
      <Stack.Screen name="gaming-last-played" options={{ title: titles.recentPlayed }} />
      <Stack.Screen name="music-top-artists" options={{ title: titles.topArtists }} />
      <Stack.Screen name="music-top-tracks" options={{ title: titles.topTracks }} />
      <Stack.Screen name="settings-external-links" options={{ title: titles.externalLinks }} />
    </Stack>
  );
}
