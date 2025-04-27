import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetailScreen() {
  const { animeId } = useLocalSearchParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const json = await res.json();
        setAnime(json.data);
      } catch (error) {
        console.error('Gagal ambil detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetail();
  }, [animeId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!anime) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 20 }}>
          Gagal memuat detail anime.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#f06292" />
          <Text style={{ color: '#f06292', fontWeight: 'bold', marginLeft: 6 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tombol back di atas */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="#f06292" />
        <Text style={{ color: '#f06292', fontWeight: 'bold', marginLeft: 6 }}>Kembali</Text>
      </TouchableOpacity>

      <Image source={{ uri: anime.images.jpg.image_url }} style={styles.image} />
      <Text style={styles.title}>{anime.title}</Text>
      <Text style={styles.synopsis}>{anime.synopsis}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fce4ec',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  synopsis: {
    fontSize: 16,
    color: '#555',
  },
});
