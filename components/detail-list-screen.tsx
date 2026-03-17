import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type DetailListRow = {
  id: string;
  title: string;
  lines?: string[];
  thumbnailUrl?: string;
  thumbnailVariant?: 'square' | 'landscape';
  badges?: string[];
  onPress?: () => void;
};

type DetailListScreenProps = {
  loading: boolean;
  error: string | null;
  loadingText: string;
  emptyText: string;
  rows: DetailListRow[];
};

export function DetailListScreen({ loading, error, loadingText, emptyText, rows }: DetailListScreenProps) {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? <ThemedText>{loadingText}</ThemedText> : null}
        {error ? <ThemedText>{error}</ThemedText> : null}

        {!loading && !error && rows.length === 0 ? <ThemedText style={styles.metaText}>{emptyText}</ThemedText> : null}

        {!loading && !error
          ? rows.map((row) => {
              const Container = row.onPress ? Pressable : ThemedView;

              return (
                <Container key={row.id} style={styles.item} {...(row.onPress ? { onPress: row.onPress } : {})}>
                  <ThemedView style={styles.rowLayout}>
                    {row.thumbnailUrl ? (
                      <Image
                        source={{ uri: row.thumbnailUrl }}
                        style={[
                          styles.thumbnail,
                          row.thumbnailVariant === 'landscape' ? styles.thumbnailLandscape : styles.thumbnailSquare,
                        ]}
                      />
                    ) : null}

                    <ThemedView style={styles.rowContent}>
                      <ThemedText type="defaultSemiBold">{row.title}</ThemedText>
                      {row.lines?.map((line, index) => (
                        <ThemedText key={`${row.id}-${index}`} style={styles.metaText}>
                          {line}
                        </ThemedText>
                      ))}

                      {row.badges && row.badges.length > 0 ? (
                        <ThemedView style={styles.badgeRow}>
                          {row.badges.map((badge, index) => (
                            <ThemedView key={`${row.id}-badge-${index}`} style={styles.badge}>
                              <ThemedText style={styles.badgeText}>{badge}</ThemedText>
                            </ThemedView>
                          ))}
                        </ThemedView>
                      ) : null}
                    </ThemedView>
                  </ThemedView>
                </Container>
              );
            })
          : null}
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
    gap: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.22)',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  rowLayout: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  thumbnail: {
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    resizeMode: 'cover',
  },
  thumbnailSquare: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  thumbnailLandscape: {
    width: 96,
    height: 36,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
  metaText: {
    opacity: 0.72,
    fontSize: 13,
    lineHeight: 18,
  },
});
