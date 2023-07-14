import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen,AdminHome } from '../screens';
import SettingsScreen from '../screens/SettingsScreen';
const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Admin' component={AdminHome} />
    </Stack.Navigator>
  );
};