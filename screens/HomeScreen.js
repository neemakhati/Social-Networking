import React,{useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventsScreen from './EventsScreen';
import RecommendationScreen from './RecommendationScreen';
const Tab = createBottomTabNavigator();






const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Events') {
          iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
        } else if (route.name === 'Recommendation') {
          iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'ios-settings' : 'ios-settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false, 
    })}
    >
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Recommendation" component={RecommendationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const HomeScreen = () => {
  return <TabNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});


