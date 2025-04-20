import React, { useState } from 'react';
import {View, Text} from '@/components/Themed'
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable
} from 'react-native';

export default function Quiz(props: {question:string, answerChoices:any[], returnFunction: any}) {
  return (
    <View style={styles.gridContainer}>
        <Text style={styles.question}>{props.question}</Text>        
        {props.answerChoices.map((answer, index) => {
            return <Pressable key={index} onPress={() => {
                props.returnFunction(index);
            }}
                    style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? '#241f69' : '#4F46E5',
                    },styles.gridItem]}>
                <Text style={styles.text}>{answer.text}</Text>
            </Pressable>
        })}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      marginInline: 'auto',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    question: {
        marginInline: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%',
        fontSize: 24,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 16,
    },
    gridItem: {
      width: '48%', // roughly half width with space-between
      aspectRatio: 1/2, // square
      borderRadius: 8,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
     },
    text: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

