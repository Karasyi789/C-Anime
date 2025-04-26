import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router'; 

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
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
  })

const fetchAnime = async () => {
  if (query.trim() === '') return;
  setLoading(true);
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw=true`);
    const data = await res.json();
    if (data && data.data) {
      setAnimeList(data.data);
    } else {
      console.error('Data tidak valid:', data);
    }
  } catch (error) {
    console.error('Gagal ambil data:', error);
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
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableOpacity onPress={fetchAnime} style={styles.searchButton}>
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#f06292" style={{ marginVertical: 20 }} />}


      <FlatList
        data={animeList}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/detail', params: { animeld: item.mal_id } } as any)}
            style={styles.card}
          >
            <Image source={{ uri: item.images.jpg.image_url }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      {!loading && animeList.length === 0 && (
      <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' }}>
        Anime tidak ditemukan.
      </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fce4ec', paddingTop: 40, paddingHorizontal: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f06292',
    padding: 16,
    borderRadius: 10,
  },
  headerText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
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
  overflow: 'hidden', // Tambahan supaya gambar lebih rapi
},

  image: { width: 60, height: 90, borderRadius: 6, marginRight: 12 },
  title: { fontSize: 16, fontWeight: 'bold', flexShrink: 1 },
});