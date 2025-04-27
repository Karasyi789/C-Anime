import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Linking, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

type AnimeDetail = {
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
  episodes: number;
  score: number;
  status: string;
};
export default function DetailScreen() {
  const { animeId } = useLocalSearchParams();
  const id = Array.isArray(animeId) ? animeId[0] : animeId;
  const [anime, setAnime] = useState<any | AnimeDetail | null>(null);
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

  const openTrailer = async () => {
    if (anime?.trailer?.url) {
      await WebBrowser.openBrowserAsync(anime.trailer.url);
    }
  };

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
          <Text style={{ color: '#f06292', fontWeight: 'bold' }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tombol kembali */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>
      {/* Gambar */}
      <Image source={{ uri: anime.images.jpg.image_url }} style={styles.image} />
      {/* Judul dan info */}
      <Text style={styles.title}>{anime.title}</Text>
      <Text style={styles.meta}>
        🎞️ {anime.episodes} eps | ⭐ {anime.score} | 📺 {anime.status}
      </Text>
      {/* Sinopsis */}
      <Text style={styles.synopsis}>{anime.synopsis || 'Tidak ada sinopsis.'}</Text>
      {/* Link ke MyAnimeList */}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL(`https://myanimelist.net/anime/${id}`)}
      >
        Lihat di MyAnimeList
      </Text>
      {anime.trailer?.url && (
        <TouchableOpacity onPress={openTrailer} style={styles.trailerButton}>
          <Ionicons name="logo-youtube" size={20} color="#fff" />
          <Text style={styles.trailerText}>Tonton Trailer</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fce4ec',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  meta: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  synopsis: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#555',
    marginBottom: 16,
  },
  info: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f06292',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  trailerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  backText: {
    color: '#f06292',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
