import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Perform logout logic here, e.g., clear user session, remove tokens, etc.
    
    // Navigate to the "Login" screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
