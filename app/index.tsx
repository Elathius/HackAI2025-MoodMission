// login

import { Link, Stack, router } from 'expo-router';
import { StyleSheet, Pressable, TextInput, Alert, Image } from 'react-native';
import { useState } from 'react';

import { Text, View } from '@/components/Themed';

export default function index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert(
      'Login Successful',
      `Welcome back, ${username}!`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/Feeling'),
        },
      ]
    );
  };
  

  const handleGoogleLogin = () => {
    console.log('Login with Google pressed');
    // Add Google login logic here
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Mood Mission!</Text>

        <Image
          source={require('@/assets/images/pikachu.png')} // adjust this path to your image
          style={styles.logo}
        />

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
        />

        
        <Pressable style={styles.loginButton} onPress={handleLogin} >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
        

        <View style={styles.spacer} />

        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </Pressable>

        <Link href="/Feeling" style={styles.link}>
          <Text style={styles.linkText}>Go to Feeling file!</Text>
        </Link>
      </View>
    </>
  );
}

export const options = {
  headerLeft: () => null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#2e78b7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain', // keeps the aspect ratio
  },
});
