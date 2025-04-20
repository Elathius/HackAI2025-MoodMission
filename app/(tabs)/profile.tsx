import React from 'react';
import { StyleSheet, Image, FlatList, ListRenderItemInfo } from 'react-native';
import { Text, View } from '@/components/Themed';

// Data for rows: icon + label
type LineItem = {
  id: string;
  label: string;
  icon: any; // ImageSourcePropType
};

const SETTINGS_DATA: LineItem[] = [
  { id: '1', label: 'Notifications', icon: require('@/assets/images/notification.png') },
  { id: '2', label: 'Privacy',       icon: require('@/assets/images/privacy.png') },
  { id: '3', label: 'Help',          icon: require('@/assets/images/help.svg') },
  { id: '4', label: 'Share',          icon: require('@/assets/images/share.png') },
  { id: '5', label: 'About Us',          icon: require('@/assets/images/about_us.png') },
];

export default function TabTwoScreen() {
  const renderItem = ({ item }: ListRenderItemInfo<LineItem>) => (
    <View style={styles.row}>
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.separator} />

      {/* Profile header */}
      <View style={styles.profileRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('@/assets/images/pikachu.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Michael Smith</Text>
          <Text style={styles.email}>MTS240034@utdallas.edu</Text>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Settings list */}
      <FlatList
        data={SETTINGS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        
      />
    </View>
  );
}

const AVATAR_SIZE = 120;
const ICON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    marginLeft: 20,
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
  list: {
    
    width: '100%',
    paddingHorizontal: 20,
    
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    marginRight: 200,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 12,
    resizeMode: 'contain',
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
