import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Quiz(props: {question: string, answerChoices: any[], returnFunction: any}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const handleSubmit = () => {
    if (selectedIndex !== null) {
      props.returnFunction(selectedIndex);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{props.question}</Text>
      
      <View style={styles.optionsContainer}>
      {props.answerChoices.map((answer, index) => (
        <TouchableOpacity 
        key={index} 
        onPress={() => setSelectedIndex(index)}
        activeOpacity={0.8}
    >
            <LinearGradient
              colors={['#8A2BE2', '#4B0082']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={[
                styles.optionButton,
                selectedIndex === index && styles.selectedOption
              ]}>
                <Text style={styles.optionText}>{answer.text}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={selectedIndex === null}
      >
        <LinearGradient
          colors={['#8A2BE2', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitGradient}
        >
            
          <Text style={styles.submitText}>Submit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)', // Semi-transparent purple
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  submitButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 120,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});