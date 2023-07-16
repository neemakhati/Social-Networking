import React,{useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecommendationScreen from './RecommendationScreen';
import SettingsScreen from './SettingsScreen';
import AdminCRUD from './AdminCRUD';
const Tab = createBottomTabNavigator();







const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HOME') {
          iconName = focused ? 'ios-home' : 'ios-home-outline';
        } else if (route.name === 'Recommendation') {
          iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'ios-settings' : 'ios-settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      
      headerShown: false, 
    })}
    tabBarOptions={{
      activeTintColor: '#6B61A9', // Set the active icon color
      inactiveTintColor: 'gray', // Set the inactive icon color
    }}
    >
      <Tab.Screen name="HOME" component={AdminCRUD} />
      <Tab.Screen name="Recommendation" component={RecommendationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      
    </Tab.Navigator>
  );
};

export const AdminHome = () => {
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


