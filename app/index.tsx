import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: Pokemon[];
}

export default function Index() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(res => res.json() as Promise<PokemonListResponse>)
      .then(data => {
        setPokemonList(data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderPokemonCard = ({ item }: { item: Pokemon }) => {
    const id = item.url.split('/').slice(-2, -1)[0];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
      <Link href={`/pokemon/${item.name}`} asChild>
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: imageUrl }} style={styles.sprite} />
          <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        </TouchableOpacity>
      </Link>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <FlatList
        data={pokemonList}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f4511e',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

