import React,{useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecommendationScreen from './RecommendationScreen';
import SettingsScreen from './SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AdminCRUD from './AdminCRUD';
import EditEventScreen from './EditEventScreen';
const Tab = createBottomTabNavigator();







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
      <Tab.Screen name="HOME" component={AdminCRUD} />
      <Tab.Screen name="Recommendation" component={RecommendationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen
        name="EditEventScreen"
        component={EditEventScreen}
        options={{
          tabBarLabel: 'Edit Event',
          tabBarIcon: ({ color, size }) => <Icon name="pencil" color={color} size={size} />,
        }}
      />
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


