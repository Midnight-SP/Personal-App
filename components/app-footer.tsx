import { Linking, Pressable, StyleSheet } from 'react-native';

import { usePreferences } from '@/context/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const footerLinks = [
  { label: 'GitHub', url: 'https://github.com/Midnight-SP' },
  { label: 'Website', url: 'https://midnight-sp.vercel.app' },
  { label: 'Twitter', url: 'https://x.com/m1dnight_skyy' },
  { label: 'Linktree', url: 'https://linktr.ee/midnightsp' },
];

export function AppFooter() {
  const { language } = usePreferences();

  const copy = language === 'pl'
    ? {
        description: 'Wersja mobilna strony — projekty, muzyka, gry i więcej.',
        rights: 'Wszelkie prawa zastrzeżone.',
        labels: { GitHub: 'GitHub', Website: 'Strona', Twitter: 'Twitter', Linktree: 'Linktree' },
      }
    : {
        description: 'Personal site on mobile — projects, music, gaming, and more.',
        rights: 'All rights reserved.',
        labels: { GitHub: 'GitHub', Website: 'Website', Twitter: 'Twitter', Linktree: 'Linktree' },
      };

  async function openUrl(url: string) {
    await Linking.openURL(url);
  }

  return (
    <ThemedView style={styles.footer}>
      <ThemedText style={styles.name}>Midnight-SP</ThemedText>
      <ThemedText style={styles.copy}>{copy.description}</ThemedText>
      <ThemedView style={styles.linkRow}>
        {footerLinks.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => openUrl(link.url)}
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          >
            <ThemedText style={styles.linkText}>{copy.labels[link.label as keyof typeof copy.labels]}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>
      <ThemedText style={styles.caption}>© {new Date().getFullYear()} Midnight-SP. {copy.rights}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    paddingTop: 22,
    paddingBottom: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.22)',
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  copy: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    opacity: 0.78,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'transparent',
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(128,128,128,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.24)',
  },
  linkButtonPressed: {
    backgroundColor: 'rgba(128,128,128,0.18)',
  },
  linkText: {
    fontWeight: '600',
    fontSize: 13,
  },
  caption: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
});