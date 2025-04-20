import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'mood-log.json';

import { Link, router } from 'expo-router';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

import Happy from '@/components/pageComponents/Happy';
import Sad from '@/components/pageComponents/sad';

export default function Feeling() {
  const [feeling, setFeeling] = useState<'nothing' | 'Happy' | 'Sad'>('nothing');
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async () => {
    const entry = {
      timestamp: new Date().toISOString(),
      feeling,
      note: userInput,
    };

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      let existingData: any[] = [];

      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        existingData = JSON.parse(fileContent);
      }

      existingData.push(entry);

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData, null, 2));
      console.log('✅ Mood saved to:', fileUri);

      // Optional alert for feedback
      Alert.alert('Submitted!', 'Your mood has been logged.', [
        {
          text: 'OK',
          onPress: () => router.push('/learn-home'),
        },
      ]);

      // Reset state
      setFeeling('nothing');
      setUserInput('');
    } catch (err) {
      console.error('❌ Error saving mood:', err);
      Alert.alert('Error', 'Failed to save your mood.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {feeling === 'nothing' && (
          <>
            <Text style={styles.title}>Hello! How are you feeling?</Text>
          </>
        )}

        {feeling === 'Happy' && <Happy />}
        {feeling === 'Sad' && <Sad />}

        {feeling === 'nothing' && (
          <View style={styles.imageRow}>
            <Pressable onPress={() => setFeeling('Happy')} style={styles.imageButton}>
              <Image
                source={require('@/assets/images/happy.png')}
                style={styles.moodImage}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable onPress={() => setFeeling('nothing')} style={styles.imageButton}>
              <Image
                source={require('@/assets/images/angry.png')}
                style={styles.moodImage}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable onPress={() => setFeeling('Sad')} style={styles.imageButton}>
              <Image
                source={require('@/assets/images/sad.png')}
                style={styles.moodImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        )}

        {feeling !== 'nothing' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Tell us more about why you're feeling {feeling.toLowerCase()}:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Type your thoughts here..."
                value={userInput}
                onChangeText={setUserInput}
                multiline
              />
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const options = {
  headerLeft: () => null,
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
    justifyContent: 'center',
  },
  imageButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  moodImage: {
    width: 80,
    height: 80,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
