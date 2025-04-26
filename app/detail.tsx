import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

export default function DetailScreen() {
  const { animeId } = useLocalSearchParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const res = await fetch('https://api.jikan.moe/v4/anime/${animeId}');
        const json = await res.json();
        setAnime(json.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal ambil detail:', error);
      }
    };
    fetchAnimeDetail();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: anime.images.jpg.image_url }} style={styles.image} />
      <Text style={styles.title}>{anime.title}</Text>
      <Text style={styles.synopsis}>{anime.synopsis}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fce4ec' },
  image: { width: '100%', height: 300, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  synopsis: { fontSize: 16, color: '#555' },
});
