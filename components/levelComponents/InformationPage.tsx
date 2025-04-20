import React from 'react';
import { StyleSheet, Pressable, FlatList, ListRenderItemInfo } from 'react-native';
import { Text, View } from '@/components/Themed';

type Properties = {
    title: string,
    description: string,
    returnFunction: any,
}

export default function Information({title, description}: Properties) {

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          <Pressable 
                              style={({ pressed }) => [
                              {
                                backgroundColor: pressed ? '#241f69' : '#4F46E5',
                              },styles.button]}>
                          <Text style={styles.text}>Next</Text>
                      </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'purple',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  description: {
    color: '#ffffff',
    fontSize: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#000',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginLeft: 20,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    marginRight: 200,
  },
  label: {
    fontSize: 18,
  },
  innerSeparator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
  },
});