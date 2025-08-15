import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';

/**
 * CONFIG:
 * - Set API_BASE to your backend host.
 *   * Android emulator (official AVD): use 10.0.2.2
 *   * Genymotion: use 10.0.3.2
 *   * iOS Simulator: use localhost
 *   * Physical device: use your machine's LAN IP (e.g. 192.168.0.12)
 *
 * Example:
 * const API_BASE = 'http://10.0.2.2:3000';
 */
const API_BASE = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

const API_ENDPOINT = `${API_BASE}/api/news`;

// Simple placeholder image (remote) to use if an item has no image
const PLACEHOLDER =
  'https://via.placeholder.com/300x200.png?text=No+Image';

const NewsCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(item)}>
    <Image
      source={{ uri: item.imageUrl || item.image || PLACEHOLDER }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={3}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await fetch(API_ENDPOINT, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }
      const data = await res.json();
      // We expect { status: 'ok', count: N, articles: [...] } from backend
      const list = Array.isArray(data.articles) ? data.articles : data;
      setArticles(list);
    } catch (err) {
      console.warn('Error fetching articles:', err.message);
      Alert.alert('Error', `Couldn't load news: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticles();
  };

  const handleCardPress = (item) => {
    // For now just show a quick alert — could navigate to details in a full app
    Alert.alert(item.title, item.description, [{ text: 'OK' }]);
  };

  const renderItem = ({ item }) => (
    <NewsCard item={item} onPress={handleCardPress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Top News</Text>

      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.loaderText}>Loading news...</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(i) => `${i.id || i.title}`.substring(0, 50)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No articles available.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f9' },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 32, paddingTop: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    // shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // elevation (Android)
    elevation: 3,
  },
  cardImage: { width: 118, height: 118 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardDesc: { fontSize: 13.5, color: '#444', lineHeight: 18 },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 14, color: '#333' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#666' },
});
