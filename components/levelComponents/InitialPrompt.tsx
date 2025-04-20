import React, { useState } from 'react';
import {View, Text} from '@/components/Themed'
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function MoodSelector(props:{setSelected:any}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>


      <Text style={styles.subtitle}>Choose your mood (1 = 😞, 10 = 😁):</Text>

      {Array.from({ length: 10 }, (_, i) => {
        const value = i + 1;
        return (
          <View>
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => {
                setSelected(value);
                props.setSelected(value);
              }}
            >
              <View style={[styles.radioCircle, selected === value && styles.selected]} />
              <Text style={styles.radioLabel}>{value}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    minHeight: 80,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  radioRow: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200EE',
    marginRight: 12,
  },
  selected: {
    backgroundColor: '#6200EE',
  },
  radioLabel: {
    fontSize: 16,
  },
});
