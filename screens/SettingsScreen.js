import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config';

const SettingsScreen = () => {
 const handleLogout = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
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

export default SettingsScreen;
