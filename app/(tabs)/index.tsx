import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Platform, Animated, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getWords, deleteWord, updateWord } from '@/src/utils/storage';
import { Word } from '@/src/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EditModal } from '@/components/ui/EditModal';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/src/constants/theme';

export default function HomeScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const router = useRouter();

  const loadWords = async () => {
    const data = await getWords();
    setWords(data);
    setFilteredWords(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWords();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredWords(words);
    } else {
      const filtered = words.filter(
        (word) =>
          word.word.toLowerCase().includes(query.toLowerCase()) ||
          word.translation.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  };

  const handleStartQuiz = () => {
    router.push('/quiz-setup');
  };

  const handleDeleteWord = (id: string, word: string) => {
    Alert.alert(
      'Delete Word',
      `Are you sure you want to delete "${word}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteWord(id);
            await loadWords();
          },
        },
      ]
    );
  };

  const handleEditWord = (item: Word) => {
    setEditingWord(item);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (word: string, translation: string) => {
    if (editingWord) {
      await updateWord(editingWord.id, {
        word: word,
        translation: translation,
      });
      await loadWords();
      setEditModalVisible(false);
      setEditingWord(null);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingWord(null);
  };

  const handleToggleIncludeInQuiz = async (id: string, currentIncludeInQuiz?: boolean) => {
    await updateWord(id, { includeInQuiz: !currentIncludeInQuiz });
    await loadWords();
  };

  const renderItem = ({ item, index }: { item: Word; index: number }) => {
    const isExcluded = item.includeInQuiz === false;
    return (
      <Animated.View style={[styles.cardWrapper, isExcluded && styles.excludedCard]}>
        <Card elevation="sm" style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.wordContainer}>
              <ThemedText style={styles.word} numberOfLines={0}>{item.word}</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>VN</ThemedText>
              </View>
            </View>
            <View style={styles.divider} />
            <ThemedText style={styles.translation} numberOfLines={0}>{item.translation}</ThemedText>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.toggleButton]}
                onPress={() => handleToggleIncludeInQuiz(item.id, item.includeInQuiz)}
              >
                <Ionicons
                  name={isExcluded ? "eye-off" : "eye"}
                  size={20}
                  color={isExcluded ? Colors.gray[400] : Colors.info}
                />
                <ThemedText style={[styles.actionButtonText, isExcluded && styles.excludedText]}>
                  {isExcluded ? 'Excluded' : 'Included'}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditWord(item)}
              >
                <Ionicons name="pencil" size={20} color={Colors.primary[500]} />
                <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteWord(item.id, item.word)}
              >
                <Ionicons name="trash" size={20} color={Colors.error} />
                <ThemedText style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.secondary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Jenny's English
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {words.length} {words.length === 1 ? 'word' : 'words'}
        </ThemedText>
      </LinearGradient>

      <ThemedView style={styles.content}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search vocabulary..."
            style={styles.searchBar}
          />
        </View>

        {words.length > 0 && (
          <View style={styles.buttonContainer}>
            <Button
              title="Start Quiz"
              onPress={handleStartQuiz}
              size="large"
              fullWidth
              icon={<Ionicons name="play-circle" size={24} color={Colors.white} />}
            />
          </View>
        )}

        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyTitle}>
                {searchQuery ? 'No results found' : 'No words yet'}
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Go to the "Add Word" tab to start building your vocabulary'}
              </ThemedText>
            </View>
          }
        />
      </ThemedView>

      <EditModal
        visible={editModalVisible}
        title="Edit Word"
        firstLabel="Vietnamese Word"
        secondLabel="English Translation"
        firstValue={editingWord?.word || ''}
        secondValue={editingWord?.translation || ''}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
    ...Shadows.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  list: {
    padding: Spacing.base,
    paddingTop: Spacing.sm,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
  },
  card: {
    padding: 0,
  },
  cardContent: {
    padding: Spacing.base,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  word: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.light.primary,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[600],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: Spacing.md,
  },
  translation: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.light.secondary,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  emptyContainer: {
    padding: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.light.secondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary[50],
    gap: Spacing.xs,
    minWidth: '30%',
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary[500],
  },
  toggleButton: {
    backgroundColor: Colors.info + '10',
  },
  deleteButton: {
    backgroundColor: Colors.error + '10',
  },
  deleteButtonText: {
    color: Colors.error,
  },
  excludedCard: {
    opacity: 0.5,
  },
  excludedText: {
    color: Colors.gray[400],
  },
});
