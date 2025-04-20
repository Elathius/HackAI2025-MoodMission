import { StyleSheet, Image } from 'react-native';

import React from 'react'
import { Text, View } from '@/components/Themed';
import CourseLevelLabel from '@/components/CourseLevelLabel'
import { Audio } from 'expo-av';
import { useEffect } from 'react';

type LevelLabelData = {
  id: string,
  name: string
  styles: {}
}

export default function LearnHome() {
  useEffect(() => {
    let sound: Audio.Sound;

    const loadAndPlay = async () => {
      // Load sound from local or remote source
      sound = new Audio.Sound();
      await sound.loadAsync(require('@/assets/images/soundrawambient.mp3')); // or { uri: 'https://...' }
      await sound.setIsLoopingAsync(true); // 🔁 loop it
      await sound.playAsync(); // ▶️ start playing
    };

    loadAndPlay();

    return () => {
      if (sound) {
        sound.unloadAsync(); // 💥 cleanup when component unmounts
      }
    };
  }, []);
  
  return (
    <View style={[styles.container, {position: 'absolute'}]}>
      <Image
        source={ require('@/assets/images/man-map.png') }
        style={{ width: 60, height: 60, marginLeft: '0%'}}
      />
      <CourseLevelLabel id='1' name='What is mental health?' addedStyles={{marginLeft: '12%', width: '58%', bottom: "4%"}}/>
      <Image
        source={ require('@/assets/images/road-0.png') }
        style={{ width: 150, height: 114, marginLeft: '25%', bottom: "7%"}}
      />
      <CourseLevelLabel id='2' name='Copping Mechanisms' addedStyles={{marginLeft: '55%', bottom: "10%"}}/>
      <Image
        source={ require('@/assets/images/road-1.png') }
        style={{ width: 100, height: 110, marginLeft: '30%', bottom: "12%"}}
      />
      <CourseLevelLabel id='3' name='Relationships + Boundaries' addedStyles={{marginLeft: '25%', width: '60%', bottom: "13%"}}/>
      <Image
        source={ require('@/assets/images/road-2.png') }
        style={{ width: 130, height: 100, marginLeft: '32%', bottom: "13.5%"}}
      />
      <CourseLevelLabel id='4' name='When to Get Help + Mental Health Advocacy' addedStyles={{marginLeft: '8%', width: '70%', bottom: "16%"}} reverse={true}/>
      <Image
        source={ require('@/assets/images/road-3.png') }
        style={{ width: 120, height: 120, marginLeft: '38%', bottom: "17%"}}
      />
      <CourseLevelLabel id='5' name='Conclusion' addedStyles={{marginLeft: '60%', width: '42%', bottom: "22%"}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24, // makes it a circle
    borderColor: '#ffffff',
    borderWidth: 100,
    backgroundColor: '#4F46E5', // indigo or whatever you prefer
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  idText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: '#000000',
    flexShrink: 1,
  },
});