import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('Kathmandu');
  const [selectedWorkshops, setSelectedWorkshops] = useState([]);

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

  const handleSelectWorkshop = (workshop) => {
    // Handle workshop selection
  };

  const handleFavoriteWorkshop = (workshop) => {
    setSelectedWorkshops(prevSelectedWorkshops => {
      if (prevSelectedWorkshops.includes(workshop)) {
        return prevSelectedWorkshops.filter(selectedWorkshop => selectedWorkshop !== workshop);
      } else {
        return [...prevSelectedWorkshops, workshop];
      }
    });
  };

  const isWorkshopSelected = (workshop) => {
    return selectedWorkshops.includes(workshop);
  };

  const renderCard = ({ item }) => {
    const cardStyle = {
      margin: 16,
      backgroundColor: '#333333',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    return (
      <TouchableOpacity style={cardStyle}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.Images }}
            style={styles.eventImage}
            resizeMode="contain"
          />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{item.Workshop}</Text>
            <Text style={styles.eventLocation}>{item.College}</Text>
          </View>
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: isWorkshopSelected(item.Workshop) ? 'red' : 'transparent' }]}
            onPress={() => handleFavoriteWorkshop(item.Workshop)}
          >
            <Icon
              name={isWorkshopSelected(item.Workshop) ? 'heart' : 'heart-outline'}
              size={20}
              color={isWorkshopSelected(item.Workshop) ? 'white' : 'black'}
            />
          </TouchableOpacity>
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
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
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  eventDetails: {
    marginLeft: 16,
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 50,
  },
});

export default EventsScreen;
