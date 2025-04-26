import { View, Text, StyleSheet } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Favorit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
container: { 
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center', 
  backgroundColor: '#fce4ec' 
},
title: { 
  fontSize: 24, 
  fontWeight: 'bold', 
  color: '#333' 
},
});
