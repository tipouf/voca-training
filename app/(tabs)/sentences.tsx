import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Animated, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSentences, deleteSentence, updateSentence } from '@/src/utils/storage';
import { Sentence } from '@/src/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EditModal } from '@/components/ui/EditModal';
import { Colors, Spacing, Typography, BorderRadius } from '@/src/constants/theme';

export default function SentencesScreen() {
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [filteredSentences, setFilteredSentences] = useState<Sentence[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
    const router = useRouter();

    const loadSentences = async () => {
        const data = await getSentences();
        setSentences(data);
        setFilteredSentences(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadSentences();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadSentences();
        setRefreshing(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredSentences(sentences);
        } else {
            const filtered = sentences.filter(
                (sentence) =>
                    sentence.sentence.toLowerCase().includes(query.toLowerCase()) ||
                    sentence.translation.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSentences(filtered);
        }
    };

    const handleStartQuiz = () => {
        router.push('/quiz-setup');
    };

    const handleDeleteSentence = (id: string, sentence: string) => {
        Alert.alert(
            'Delete Sentence',
            `Are you sure you want to delete this sentence?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteSentence(id);
                        await loadSentences();
                    },
                },
            ]
        );
    };

    const handleEditSentence = (item: Sentence) => {
        setEditingSentence(item);
        setEditModalVisible(true);
    };

    const handleSaveEdit = async (sentence: string, translation: string) => {
        if (editingSentence) {
            await updateSentence(editingSentence.id, {
                sentence: sentence,
                translation: translation,
            });
            await loadSentences();
            setEditModalVisible(false);
            setEditingSentence(null);
        }
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
        setEditingSentence(null);
    };

    const handleToggleIncludeInQuiz = async (id: string, currentValue?: boolean) => {
        const newValue = currentValue === false ? true : false;
        await updateSentence(id, { includeInQuiz: newValue });
        await loadSentences();
    };

    const renderItem = ({ item }: { item: Sentence }) => {
        const isExcluded = item.includeInQuiz === false;
        return (
            <Animated.View style={[styles.cardWrapper, isExcluded && styles.excludedCard]}>
                <Card elevation="sm" style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.sentenceContainer}>
                            <ThemedText style={styles.sentence} numberOfLines={0}>{item.sentence}</ThemedText>
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
                                onPress={() => handleEditSentence(item)}
                            >
                                <Ionicons name="pencil" size={20} color={Colors.primary[500]} />
                                <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => handleDeleteSentence(item.id, item.sentence)}
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
                    Sentences
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    {sentences.length} {sentences.length === 1 ? 'sentence' : 'sentences'}
                </ThemedText>
            </LinearGradient>

            <ThemedView style={styles.content}>
                <View style={styles.searchContainer}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search sentences..."
                        style={styles.searchBar}
                    />
                </View>

                {sentences.length > 0 && (
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
                    data={filteredSentences}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ThemedText style={styles.emptyTitle}>
                                {searchQuery ? 'No results found' : 'No sentences yet'}
                            </ThemedText>
                            <ThemedText style={styles.emptySubtitle}>
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Go to the "Add Sentence" tab to start building your sentence collection'}
                            </ThemedText>
                        </View>
                    }
                />
            </ThemedView>

            <EditModal
                visible={editModalVisible}
                title="Edit Sentence"
                firstLabel="Vietnamese Sentence"
                secondLabel="English Translation"
                firstValue={editingSentence?.sentence || ''}
                secondValue={editingSentence?.translation || ''}
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
    sentenceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    sentence: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.text.light.primary,
        flex: 1,
        lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    },
    badge: {
        backgroundColor: Colors.secondary[100],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginLeft: Spacing.sm,
    },
    badgeText: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.secondary[600],
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray[200],
        marginVertical: Spacing.md,
    },
    translation: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
        lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
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
