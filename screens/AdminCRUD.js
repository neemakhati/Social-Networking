

  import React, { useEffect, useState } from 'react';
  import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
  } from 'react-native';
  import { useDispatch, useSelector } from 'react-redux';
  import { toggleEventSelection } from '../redux/actions';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  const AdminCRUD = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('Kathmandu');
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState('');
    const [college, setCollege] = useState('');
    const [workshop, setWorkshop] = useState('');
    const [genre, setGenre] = useState('');
    const [location, setLocation] = useState('');
    const selectedEvents = useSelector((state) => state.selectedEvents);


    const [deleteItemId, setDeleteItemId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [editingEvent, setEditingEvent] = useState(null);
    const [editMode, setEditMode] = useState(false); 

    const setDeleteConfirmation = (itemId) => {
      setDeleteItemId(itemId);
      setModalVisible(true);
    };


    const handleDeleteConfirmation = () => {
      
      handleDeleteEvent(deleteItemId);
      setDeleteItemId(null);
      setModalVisible(false);
    };
    


    const dispatch = useDispatch();
    useEffect(() => {
      fetchEvents();
    }, []);
    const fetchEvents = () => {
      fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvents?location=${searchKeyword}&orderBy=timestamp`)
        .then((response) => response.json())
        .then((data) => {
          const sortedEvents = data.sort((a, b) => b.timestamp - a.timestamp);
          setEvents(sortedEvents);
        })
        .catch((error) => {
          console.log('Error fetching events:', error);
        });
    };
    
    
    const handleDeleteEvent = (eventId) => {
      fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/deleteEvent?id=${eventId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Event deleted successfully with ID ' + eventId, data);
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        })
        .catch((error) => {
          console.log('Error deleting event:', error);
        });
    };
    
    
    const handleEditEvent = (event) => {
      setEditMode(true); // Set the mode to Edit
      setEditingEvent(event);
      // Fetch the details of the event to be edited
      fetchEventDetails(event.id);
      setModalVisible(true);
    };

    const fetchEventDetails = (eventId) => {
      fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvent?id=${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Event details:', data);
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
      if (
        !description.trim() ||
        !images.trim() ||
        !college.trim() ||
        !workshop.trim() ||
        !genre.trim() ||
        !location.trim()
      ) {
        setErrorMessage('Please fill in all the fields.');
        return;
      }
    
      setErrorMessage('');

      
      if (editMode) {
       
        fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/updateEvent?id=${editingEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Description: description,
            Images: images,
            College: college,
            Workshop: workshop,
            Genre: genre,
            Location: location,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Event updated successfully:', data);
            console.log('Event of Id:', editingEvent.id);
            fetchEvents();
           
            setEvents((prevEvents) =>
              prevEvents.map((event) => (event.id === editingEvent.id ? { ...event, ...data } : event))
            );
            setModalVisible(false);
            setEditMode(false); 
          })
          .catch((error) => {
            console.log('Error updating event:', error);
          });
      } else {
       
        fetch('https://us-central1-eventsnet-fa0f0.cloudfunctions.net/createEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Description: description,
          Images: images,
          College: college,
          Workshop: workshop,
          Genre: genre,
          Location: location,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Event created successfully:', data);
            setEvents((prevEvents) => [...prevEvents, data]);
            setModalVisible(false);
            setDescription('');
            setImages('');
            setCollege('');
            setWorkshop('');
            setGenre('');
            setLocation('');
          })
          .catch((error) => {
            console.log('Error creating event:', error);
          });
      }
    };

    const handleCardPress = (item) => {

      console.log(item.id);
    }


    const handleToggleSelection = (event) => {
      dispatch(toggleEventSelection(event));
    };
    const handleCreateEvent = () => {
      
      fetch('https://us-central1-eventsnet-fa0f0.cloudfunctions.net/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          images,
          college,
          workshop,
          genre,
          location,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Event created successfully:', data);
          
          setModalVisible(false);
          
          fetchEvents();
        })
        .catch((error) => {
          console.log('Error creating event:', error);
        });
    };
    const renderCard = ({ item }) => {
      const isEventSelected = selectedEvents.includes(item.id);
      return (
        <TouchableOpacity onPress={()=>handleCardPress(item)}>
        <View style={styles.cardStyle}>
        <View style={styles.cardContent}>
            <Image source={{ uri: item.Images }} style={styles.eventImage} resizeMode="contain" />
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{item.Workshop}</Text>
              <Text style={styles.eventLocation}>{item.College}</Text>
            </View>



            <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEditEvent(item)}>
              <Icon name="pencil" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteConfirmation(item.id)}>
              <Icon name="delete" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleSelection(item.id)}>
              <Icon
                name={isEventSelected ? 'heart' : 'heart-outline'}
                size={20}
                color={isEventSelected ? 'red' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={24} color="black" />
        </TouchableOpacity>
        
        <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    {deleteItemId ? (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Delete</Text>
          <Text style={styles.modalText}>Are you sure you want to delete this event?</Text>
          <View style={styles.modalButtonsContainer}>
            <Pressable style={styles.modalButton} onPress={handleDeleteConfirmation}>
              <Text style={styles.modalButtonText}>YES</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                setDeleteItemId(null);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>NO</Text>
            </Pressable>
          </View>
        </View>
      </View>
    ) :(
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.modalInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />
          <TextInput
            style={styles.modalInput}
            value={images}
            onChangeText={setImages}
            placeholder="Images"
          />
          <TextInput
            style={styles.modalInput}
            value={college}
            onChangeText={setCollege}
            placeholder="College"
          />
          <TextInput
            style={styles.modalInput}
            value={workshop}
            onChangeText={setWorkshop}
            placeholder="Workshop"
          />
          <TextInput
            style={styles.modalInput}
            value={genre}
            onChangeText={setGenre}
            placeholder="Genre"
          />
          <TextInput
            style={styles.modalInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
          />
          <View style={styles.modalButtonsContainer}>
            <Pressable style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                setEditMode(false); 
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )}
  </Modal>
        <TextInput
          style={styles.searchInput}
          value={searchKeyword}
          onChangeText={(text) => setSearchKeyword(text)}
          placeholder="Enter search keyword"
          onSubmitEditing={fetchEvents}
        />
        <FlatList data={events} renderItem={renderCard} keyExtractor={(item) => item.id.toString()} />
    
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
      borderRadius: 8,
    },
    cardStyle: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16, 
      shadowColor: '#000',
      color: 'black',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      color: 'black',
      
    },
    addButtonWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    addButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: '#6B61A9',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      zIndex: 2
    },  
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Use a semi-transparent color for the modal container
      zIndex: 1, // Ensure the modal appears above other content
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      width: '80%',
    },
    modalInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20, // Add marginTop to create space between input fields and buttons
    },
    modalButton: {
      padding: 10,
      backgroundColor: '#6B61A9',
      borderRadius: 8,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
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
      color: 'black',
    },
    eventLocation: {
      fontSize: 14,
      marginBottom: 8,
      color: 'gray',
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