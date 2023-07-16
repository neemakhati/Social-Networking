import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const EditEventScreen = ({ route, navigation }) => {
  const { event } = route.params;

  const [Description, setDescription] = useState('');
  const [Images, setImages] = useState('');
  const [College, setCollege] = useState('');
  const [Workshop, setWorkshop] = useState('');
  const [Genre, setGenre] = useState('');
  const [Location, setLocation] = useState('');
console.log(event.id);
  // Fetch event details on component mount
  useEffect(() => {
    fetchEventDetails(event.id);
  }, []);

  const fetchEventDetails = (eventId) => {
    fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvent?id=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Event details:', data.Description);
        setDescription(data.Description);
        setImages(data.Images);
        setCollege(data.College);
        setWorkshop(data.Workshop);
        setGenre(data.Genre);
        setLocation(data.Location);
      })
      .catch((error) => {
        console.log('Error fetching event details:', error);
      });
  };

  const handleSave = () => {
    // Make API call to update the event with the entered values
    fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/updateEvent?id=${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Description,
        Images,
        College,
        Workshop,
        Genre,
        Location,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Event updated successfully:', data);
        console.log('Event of Id:', event.id);
        // Navigate back to the previous screen after successful update
        navigation.goBack();
      })
      .catch((error) => {
        console.log('Error updating event:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={Description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        value={Images}
        onChangeText={setImages}
        placeholder="Images"
      />
      <TextInput
        style={styles.input}
        value={College}
        onChangeText={setCollege}
        placeholder="College"
      />
      <TextInput
        style={styles.input}
        value={Workshop}
        onChangeText={setWorkshop}
        placeholder="Workshop"
      />
      <TextInput
        style={styles.input}
        value={Genre}
        onChangeText={setGenre}
        placeholder="Genre"
      />
      <TextInput
        style={styles.input}
        value={Location}
        onChangeText={setLocation}
        placeholder="Location"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default EditEventScreen;
