import { Stack } from 'expo-router';

export default function DetailsLayout() {
  return (
    <Stack>
      <Stack.Screen name="coding-repositories" options={{ title: 'Repositories' }} />
      <Stack.Screen name="coding-organizations" options={{ title: 'Organizations' }} />
      <Stack.Screen name="coding-contributions" options={{ title: 'Contributions' }} />
      <Stack.Screen name="gaming-top-played" options={{ title: 'Top Played Games' }} />
      <Stack.Screen name="gaming-last-played" options={{ title: 'Recently Played Games' }} />
      <Stack.Screen name="music-top-artists" options={{ title: 'Top Artists' }} />
      <Stack.Screen name="music-top-tracks" options={{ title: 'Top Tracks' }} />
    </Stack>
  );
}
