import { View, Text } from './Themed';
import { StyleSheet, Button, Pressable } from 'react-native';
import {router} from 'expo-router'

type Properties = {
  id: string
}

export default function courseButton({id} : Properties) {
    return (
      <Pressable onPress={() => {router.push(`../levels/${id}`)}}
        style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#2c2782' : '#4F46E5',
          bottom: pressed ? '50%' : '0%',
        },
        styles.circle,
      ]}
    >
        <Text style={styles.idText}>{id}</Text>
      </Pressable>
    );
}
const styles = StyleSheet.create({
    container: {
      marginInline: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'transparent',
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 24, // makes it a circle
      //backgroundColor: '#4F46E5', // indigo or whatever you prefer
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    circleReversed: {
      width: 40,
      height: 40,
      borderRadius: 24, // makes it a circle
      //backgroundColor: '#4F46E5', // indigo or whatever you prefer
      justifyContent: 'center',
      alignItems: 'center',
    },
    idText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    message: {
      fontSize: 16,
      color: '#333',
      flexShrink: 1,
      textAlign: 'center',
      width: '80%',
    },
    messageReversed: {
      fontSize: 16,
      color: '#333',
      flexShrink: 1,
      textAlign: 'center',
      width: '70%',
      marginRight: 12,
    }
  });