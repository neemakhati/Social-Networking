import React, { useEffect, useState } from 'react';
import { View,Image, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('kathmandu');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    // Make API call to fetch events based on the search keyword
    fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvents?location=${searchKeyword}`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        console.log('Error fetching events:', error);
      });
  };

  const renderCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.card}>
        <Image source={{ uri: item.Images }} style={styles.eventImage} />
          <Text style={styles.eventName}>{item.Workshop}</Text>
          <Text style={styles.eventLocation}>{item.College}</Text>
  
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchKeyword}
        onChangeText={text => setSearchKeyword(text)}
        placeholder="Enter search keyword"
        onSubmitEditing={fetchEvents}
      />
      <FlatList
        data={events}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666666',
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666666',
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
  },
  eventImage: {
    aspectRatio: 1,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  }
});





export default EventsScreen;
