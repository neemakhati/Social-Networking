import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const DisplayScreen = ({ route }) => {
  const { selectedEvent } = route.params;
  const navigation = useNavigation();

  // Function to handle navigation to Maps Screen
  const handleOpenMap = () => {
    navigation.navigate('MapsScreen', {
      latitude: selectedEvent.Latitude,
      longitude: selectedEvent.Longitude,
      locationName: selectedEvent.Location,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: selectedEvent.Images }} style={styles.eventImage} resizeMode="contain" />
        <Text style={styles.eventName}>{selectedEvent.Workshop}</Text>
        <Text style={styles.eventLocation}>{selectedEvent.College}</Text>
        {/* Additional Details */}
        <Text style={styles.eventDescription}>{selectedEvent.Description}</Text>
        <Text style={styles.eventGenre}>Genre: {selectedEvent.Genre}</Text>
        <Text style={styles.eventDate}>Date: {new Date(selectedEvent.Date).toLocaleDateString()}</Text>
    
     
      </View>

      <Text style={styles.showMap}>Show Map:</Text>

      <TouchableOpacity style={styles.navigateButton} onPress={handleOpenMap}>
      <Icon name="map" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  showMap: {
    fontSize: 15,
    marginTop:15,
    marginBottom: 8,
    textAlign: 'center',
  },
  eventGenre: {
    fontSize: 14,
    marginBottom: 4,
    color: '#888',
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    color: '#888',
  },
  eventRatings: {
    fontSize: 14,
    marginBottom: 4,
    color: '#888',
  },
  coordinatesText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#888',
  },
  mapButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 24,
    padding: 8,
  },
  navigateButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  navigateButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default DisplayScreen;
