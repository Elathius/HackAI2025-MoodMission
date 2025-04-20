//login

import { Link, Stack, router } from 'expo-router';
import { StyleSheet, Button } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function happy() {
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Oh! Yay! Tell us about</Text>
          <Text style={styles.title}>what made you happy.</Text>
        </View>
        {/*
        <Link href="/modal" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
        */}
        
      </View>
    </>
  );
}

export const options =  {
  headerLeft: () => null

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
