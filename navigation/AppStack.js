import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen,AdminHome } from '../screens';
import SettingsScreen from '../screens/SettingsScreen';
import DisplayScreen from '../screens/DisplayScreen';
import MapsScreen from '../screens/MapsScreen';
const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Admin' component={AdminHome} />
      <Stack.Screen name='DisplayScreen'component={DisplayScreen}/>
      <Stack.Screen name='MapsScreen' component={MapsScreen}/>
    </Stack.Navigator>
  );
};