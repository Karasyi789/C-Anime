// app/splash.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Menunggu 3 detik sebelum menuju ke HomeScreen
    setTimeout(() => {
      router.push('/(tabs)');  // Arahkan ke HomeScreen setelah 3 detik
    }, 3000);  // 3000ms = 3 detik
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash/logo.png')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#f06292" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec', 
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
