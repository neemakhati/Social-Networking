import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdminHome } from '../screens';

const Stack = createStackNavigator();

export const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Admin' component={AdminHome} />
    </Stack.Navigator>
  );
};
