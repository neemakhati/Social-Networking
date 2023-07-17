import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

const RecommendationScreen = () => {
  const selectedEvents = useSelector((state) => state.selectedEvents);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  useEffect(() => {
    fetchRecommendedEvents();
  }, [selectedEvents]);

  const fetchRecommendedEvents = async () => {
    try {
      if (selectedEvents.length === 0) {
        setRecommendedEvents([]);
        return;
      }
  
      const id = selectedEvents.join(',');
      const response = await fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getRecommendations?ids=${id}`);
      const data = await response.json();
      console.log(data); // Add this line to check the response data
      setRecommendedEvents(data);
    } catch (error) {
      console.log('Error fetching recommended events:', error);
    }
  };
  
  const renderCard = (event, index) => {
    if (!event || !event.selectedEvent) {
      return null;
    }
  
    const recommendedEvents = event.recommendations;
  
    return recommendedEvents.map((recommendedEvent, index) => (
      <View key={`${recommendedEvent.id}_${index}`} style={styles.cardStyle}>
        <View style={styles.cardContent}>
          <Image source={{ uri: recommendedEvent.Images }} style={styles.eventImage} resizeMode="contain" />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{recommendedEvent.Workshop}</Text>
            <Text style={styles.eventLocation}>{recommendedEvent.College}</Text>
          </View>
        </View>
      </View>
    ));
  };

  const handleRefresh = () => {
    fetchRecommendedEvents();
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity> */}
      <ScrollView style={styles.eventList}>
        {selectedEvents.length === 0 ? (
          <Text>No Recommendations Available</Text>
        ) : (
          recommendedEvents.map((event, index) => renderCard(event, index))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  eventList: {
    flex: 1,
  },
  cardStyle: {
    marginVertical: 8,
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    color:"black",
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
    color: 'black',
  },
  refreshButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333333',
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default RecommendationScreen;
