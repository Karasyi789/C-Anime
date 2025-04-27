import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Animated 
} from 'react-native';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heartScales, setHeartScales] = useState<{ [key: number]: Animated.Value }>({}); // Animasi per item
  const router = useRouter();

  useEffect(() => {
    fetchDefaultAnime();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };

  const fetchAnime = async () => {
  if (query.trim() === '') {
    await fetchDefaultAnime();
    return;
  }
  setLoading(true);
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw=true`);
    const data = await res.json();
    setAnimeList(data.data || []);
  } catch (error) {
    console.error('Gagal ambil data:', error);
  } finally {
    setLoading(false);
  }
};


  const toggleFavorite = async (anime: Anime) => {
    const isFavorite = favorites.find((fav) => fav.mal_id === anime.mal_id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.mal_id !== anime.mal_id);
    } else {
      newFavorites = [...favorites, anime];
    }

    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));

    // Animasi heart per item
    const existingHeartScale = heartScales[anime.mal_id] || new Animated.Value(1);
      setHeartScales(prev => ({
        ...prev,
        [anime.mal_id]: existingHeartScale,
      }));
    // Animasi heart saat menambahkan ke favorit atau menghapusnya
      Animated.sequence([
        Animated.spring(existingHeartScale, {
          toValue: 1.2, // membesarkan ukuran heart
          useNativeDriver: true,
        }),
        Animated.spring(existingHeartScale, {
          toValue: 1, // mengembalikan ukuran heart
          useNativeDriver: true,
        }),
      ]).start();
    
  };

  const fetchDefaultAnime = async () => {
    setLoading(true);    
    try {
      const res = await fetch('https://api.jikan.moe/v4/anime?q=kids&sfw=true');
      const json = await res.json();
      setAnimeList(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kids Anime</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari Anime..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text.trim() === '') {
              fetchDefaultAnime();
            }
          }}
          style={styles.input}
        />
        <TouchableOpacity 
          onPress={fetchAnime} 
          style={[styles.searchButton, { opacity: query.trim() ? 1 : 0.5 }]}
          disabled={!query.trim()}
        >
        <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowFavorites(!showFavorites)}
          style={styles.favoritesButton}
        >
          <Ionicons name="heart" size={20} color="#f06292" style={{ marginRight: 6 }} />
          <Text style={styles.favoritesButtonText}>
            {showFavorites ? 'Lihat Semua' : 'Lihat Favorit'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#f06292" style={{ marginVertical: 20 }} />}

      <FlatList
        data={showFavorites ? favorites : animeList}
        keyExtractor={(item) => item.mal_id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            {showFavorites ? 'Belum ada anime favorit.' : 'Tidak ada anime ditemukan.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/detail', params: { animeId: item.mal_id.toString() } })}
              style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
            >
              <Image source={{ uri: item.images.jpg.image_url }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Animated.View style={{ transform: [{ scale: heartScales[item.mal_id] || 1 }] }}>
                <Ionicons
                  name={favorites.find((fav) => fav.mal_id === item.mal_id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorites.find((fav) => fav.mal_id === item.mal_id) ? '#f06292' : '#ccc'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fce4ec', 
    paddingTop: 40, 
    paddingHorizontal: 12 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f06292',
    padding: 16,
    borderRadius: 10,
  },
  headerText: { 
    fontSize: 24, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#f06292',
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { 
    width: 60, 
    height: 90, 
    borderRadius: 6, 
    marginRight: 12 
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold',
    flexShrink: 1 
  },
  favoritesButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  favoritesButtonText: {
    color: '#f06292',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

