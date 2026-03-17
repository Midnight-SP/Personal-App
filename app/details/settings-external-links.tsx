import { Linking } from 'react-native';

import { DetailListScreen, type DetailListRow } from '@/components/detail-list-screen';
import { usePreferences } from '@/context/preferences-context';

export default function SettingsExternalLinksScreen() {
  const { language } = usePreferences();

  const externalLinks: DetailListRow[] = [
    {
      id: 'website',
      title: language === 'pl' ? 'Strona' : 'Website',
      lines: ['midnight-sp.vercel.app'],
      onPress: () => void Linking.openURL('https://midnight-sp.vercel.app/'),
    },
    {
      id: 'github',
      title: 'GitHub',
      lines: ['github.com/Midnight-SP'],
      onPress: () => void Linking.openURL('https://github.com/Midnight-SP'),
    },
    {
      id: 'twitter',
      title: 'Twitter / X',
      lines: ['x.com/m1dnight_skyy'],
      onPress: () => void Linking.openURL('https://x.com/m1dnight_skyy'),
    },
    {
      id: 'linktree',
      title: 'Linktree',
      lines: ['linktr.ee/midnightsp'],
      onPress: () => void Linking.openURL('https://linktr.ee/midnightsp'),
    },
    {
      id: 'discord',
      title: 'Discord',
      lines: ['discord.com/users/363960345762463754'],
      onPress: () => void Linking.openURL('https://discord.com/users/363960345762463754'),
    },
    {
      id: 'steam',
      title: 'Steam',
      lines: ['steamcommunity.com/profiles/76561198418712332'],
      onPress: () => void Linking.openURL('https://steamcommunity.com/profiles/76561198418712332/'),
    },
    {
      id: 'spotify',
      title: 'Spotify',
      lines: ['open.spotify.com/user/31cjkd3r4km5iehmzsllyfyyf5hy'],
      onPress: () => void Linking.openURL('https://open.spotify.com/user/31cjkd3r4km5iehmzsllyfyyf5hy'),
    },
  ];

  return (
    <DetailListScreen
      loading={false}
      error={null}
      loadingText={language === 'pl' ? 'Ładowanie linków...' : 'Loading links...'}
      emptyText={language === 'pl' ? 'Brak dostępnych linków.' : 'No links available.'}
      rows={externalLinks}
    />
  );
}
