import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />; //shorthand for: name={props.name} color={props.color}
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <TabBarIcon name="inbox" color={color} />,
        
          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{backgroundColor: '#ffffffs', marginLeft: 15, opacity: pressed ? 0.5 : 1 ,color: 'white', fontSize: 30 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        
        }}
      />
      <Tabs.Screen
        name="learn-home"
        options={{
          title: 'Course Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,

          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="book"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{backgroundColor: '#ffffffs', marginLeft: 15, opacity: pressed ? 0.5 : 1 ,color: 'white', fontSize: 30 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,

          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="book"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{backgroundColor: '#ffffffs', marginLeft: 15, opacity: pressed ? 0.5 : 1 ,color: 'white', fontSize: 30 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
