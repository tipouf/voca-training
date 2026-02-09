import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Button, RefreshControl, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getWords } from '@/src/utils/storage';
import { Word } from '@/src/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadWords = async () => {
    const data = await getWords();
    setWords(data);
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

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={styles.card}>
      <ThemedText style={styles.word}>{item.word}</ThemedText>
      <ThemedText style={styles.translation}>{item.translation}</ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Vocabulary</ThemedText>
        {words.length > 0 && <Button title="Start Quiz" onPress={handleStartQuiz} />}
      </ThemedView>

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>No words added yet.</ThemedText>
            <ThemedText>Go to the 'Add Word' tab to start.</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Consider theming this
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
  },
  translation: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
