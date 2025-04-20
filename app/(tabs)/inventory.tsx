import React from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {View, Text} from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const ITEM_SIZE = (width - 20 /* total horizontal padding */) / NUM_COLUMNS;

type InventoryItem = {
  id: string;
  name: string;
  image: any;  // more specific with ImageSourcePropType
};

const sampleItems: InventoryItem[] = [
  
  { id: '1', name:"Pikachu", image: require('@/assets/images/pikachu.png') },
  { id: '2', name:"Eevee", image: require('@/assets/images/eevee.jpeg') },
  { id: '3', name:"Charmander", image: require('@/assets/images/charmander.jpeg') },
   
  
];

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sampleItems}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View>
            <View style={styles.slot}>
              <Image
                source={item.image}
                style={styles.itemImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  grid: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  slot: {
    width: ITEM_SIZE - 10,
    height: ITEM_SIZE - 10,
    margin: 5,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  nameContainer: {
    alignItems: 'center',
    paddingBlock: 1,
    justifyContent: 'center',
  },
  name: {
    backgroundColor: '#ffffff',
    textAlign: 'center', 
    borderWidth: 1, 
    borderRadius: 6,
    width: '82%',
    bottom: '100%',
    fontSize: 12,
  },
  itemImage: {
    width: ITEM_SIZE * 0.7,   // 70% of slot size
    height: ITEM_SIZE * 0.7,
  },
});
