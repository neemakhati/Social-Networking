import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEventSelection } from '../redux/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminCRUD = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('Kathmandu');
  const selectedEvents = useSelector((state) => state.selectedEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    // Make API call to fetch events based on the search keyword
    fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvents?location=${searchKeyword}`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.log('Error fetching events:', error);
      });
  };

  const handleToggleSelection = (event) => {
    dispatch(toggleEventSelection(event));
  };

  const renderCard = ({ item }) => {
    const isEventSelected = selectedEvents.includes(item.id);

    return (
      <View style={styles.cardStyle}>
        <View style={styles.cardContent}>
          <Image source={{ uri: item.Images }} style={styles.eventImage} resizeMode="contain" />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{item.Workshop}</Text>
            <Text style={styles.eventLocation}>{item.College}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleSelection(item.id)}
          >
            <Icon
              name={isEventSelected ? 'heart' : 'heart-outline'}
              size={20}
              color={isEventSelected ? 'red' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleGoToRecommendationScreen = () => {
    navigation.navigate('Recommendation');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchKeyword}
        onChangeText={(text) => setSearchKeyword(text)}
        placeholder="Enter search keyword"
        onSubmitEditing={fetchEvents}
      />
      <FlatList
        data={events}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
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
  cardStyle: {
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
  recommendationButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  recommendationButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default AdminCRUD;
