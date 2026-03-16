import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const footerLinks = [
  { label: 'GitHub', url: 'https://github.com/Midnight-SP' },
  { label: 'Website', url: 'https://midnight-sp.vercel.app' },
  { label: 'Twitter', url: 'https://x.com/m1dnight_skyy' },
  { label: 'Linktree', url: 'https://linktr.ee/midnightsp' },
];

export function AppFooter() {
  async function openUrl(url: string) {
    await Linking.openURL(url);
  }

  return (
    <View style={styles.footer}>
      <Text style={styles.name}>Midnight-SP</Text>
      <Text style={styles.copy}>
        Personal site on mobile — projects, music, gaming, and more.
      </Text>
      <View style={styles.linkRow}>
        {footerLinks.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => openUrl(link.url)}
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.caption}>
        © {new Date().getFullYear()} Midnight-SP. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    paddingTop: 22,
    paddingBottom: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17,24,28,0.14)',
    backgroundColor: 'transparent',
  },
  name: {
    color: '#2d3340',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  copy: {
    color: '#555e6a',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(102,126,234,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.16)',
  },
  linkButtonPressed: {
    backgroundColor: 'rgba(102,126,234,0.16)',
  },
  linkText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  caption: {
    color: '#7a8290',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});