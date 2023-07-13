import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { Colors, auth } from '../config';

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export const HomeScreen = () => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetch('https://us-central1-contactview-6814b.cloudfunctions.net/api/niagara77')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.log('Error fetching data: ', error));
  }, []);

  const renderCards = () => {
    if (data) {
      return (
        <View>
        <View style={styles.refreshContainer}>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="black" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        {data.map(item => (
          <Card
            key={item.id}
            email={item.email}
            message={item.message}
            name={item.name}
            phone={item.phone}
            source={item.source}
            timestamp={item.timestamp}
          />
        ))}
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};


  const handleRefresh = () => {
    setRefreshing(true);
    fetch('https://us-central1-contactview-6814b.cloudfunctions.net/api/niagara77')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        setRefreshing(false);
      })
      .catch(error => {
        console.log('Error fetching data: ', error);
        setRefreshing(false);
      });
  };
  
  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  return (
    <View style={styles.container}>
      {renderCards()}
      <Button title='Sign Out' onPress={handleLogout} color={Colors.sixdesign}/>
    </View>
  );
};

const Card = ({ email, message, name, phone, source, timestamp }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name} onPress={toggleDetails}>
        {name}
      </Text>
      <Text style={styles.source}>{source}</Text>
      <Text style = {styles.timestamp}>{timestamp}</Text>

      {showDetails && (
        <View style={styles.details}>
          <Text>Email: {email}</Text>
          <Text>Message: {message}</Text>
          <Text>Phone: {phone}</Text>
          <Text>Source: {source}</Text>
          <Text>Timestamp: {timestamp}</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  details: {
    marginTop: 8,
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 8,
    marginRight: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    marginLeft: 4,
    color: '#333333',
  },
  source: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
    color: '#666666',
  },
  timestamp: {
    fontSize: 10,
    fontWeight: 'normal',
    marginBottom: 8,
    color: '#666666',
  },
});
