import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface PokemonDetail {
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: { name: string };
  }>;
}

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json() as Promise<PokemonDetail>)
      .then(data => {
        setPokemon(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text>Pokemon not found</Text>
      </View>
    );
  }

  const typeColors: Record<string, string> = {
    fire: '#f4511e',
    water: '#2196f3',
    grass: '#4caf50',
    electric: '#ffeb3b',
    normal: '#9e9e9e',
    // Add more as needed
  };

  const getTypeColor = (typeName: string) => typeColors[typeName as keyof typeof typeColors] || '#757575';

  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
        <Image
          source={{ uri: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default }}
          style={styles.artwork}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types</Text>
        <FlatList
          data={pokemon.types}
          renderItem={({ item }) => (
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type.name) }]}>
              <Text style={styles.typeText}>{item.type.name.charAt(0).toUpperCase() + item.type.name.slice(1)}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeList}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        {pokemon.stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>{statNames[stat.stat.name] || stat.stat.name}</Text>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical</Text>
        <View style={styles.physicalRow}>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Height</Text>
            <Text style={styles.physicalValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Weight</Text>
            <Text style={styles.physicalValue}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        {pokemon.abilities.slice(0, 2).map((ability, index) => (
          <Text key={index} style={styles.ability}>{ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  artwork: {
    width: 200,
    height: 200,
  },
  section: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 12,
  },
  typeList: {
    paddingVertical: 4,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statName: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  physicalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  physicalItem: {
    alignItems: 'center',
    flex: 1,
  },
  physicalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ability: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

