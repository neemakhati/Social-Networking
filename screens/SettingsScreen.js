import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../config';

const SettingsScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the currently logged-in user information
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // User signed out successfully
        setUser(null); // Clear user state
      })
      .catch((error) => console.log('Error logging out: ', error));
  };

  return (
    <View style={styles.container}>
      <Icon name="person" size={80} color="#777" />
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.title}>Logged-in User</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      ) : (
        <Text style={styles.title}>Settings Screen</Text>
      )}
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
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
  userInfo: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
    width: 200,
    backgroundColor: '#6B61A9',
  },
});

export default SettingsScreen;
