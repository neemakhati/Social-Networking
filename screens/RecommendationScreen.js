import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

const RecommendationScreen = () => {
  const selectedEvents = useSelector((state) => state.selectedEvents);
  const [eventData, setEventData] = useState([]);
  console.log('selectedEvents', selectedEvents);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const eventPromises = selectedEvents.map((eventId) =>
        fetch(`https://us-central1-eventsnet-fa0f0.cloudfunctions.net/getEvent?id=${eventId}`)
          .then((response) => response.json())
          .then((data) => data)
      );
      const eventDataList = await Promise.all(eventPromises);
      const userFeatures = eventDataList.map((event) => [event.Genre, event.Location, event.Ratings]);

      // Calculate similarity scores for each event
      const scores = eventDataList.map((event, index) => ({
        id: event.id,
        score: calculateSimilarityScore(userFeatures[index], selectedEvents.map((_, i) => userFeatures[i])),
      }));

      // Sort events based on similarity score and ratings
      const recommendedEvents = scores
        .sort((a, b) => b.score - a.score || b.ratings - a.ratings)
        .map((score) => eventDataList.find((event) => event.id === score.id));

      setEventData(recommendedEvents);
    } catch (error) {
      console.log('Error fetching event data:', error);
    }
  };

  const calculateSimilarityScore = (features1, features2) => {
    const dotProduct = features1.reduce((acc, value, index) => acc + value * features2[index], 0);
    const magnitude1 = Math.sqrt(features1.reduce((acc, value) => acc + value ** 2, 0));
    const magnitude2 = Math.sqrt(features2.reduce((acc, value) => acc + value ** 2, 0));
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
    return dotProduct / (magnitude1 * magnitude2);
  };

  const renderCard = (event) => {
    if (!event) {
      return null;
    }
    return (
      <View key={event.id} style={styles.cardStyle}>
        <View style={styles.cardContent}>
          <Image source={{ uri: event.Images }} style={styles.eventImage} resizeMode="contain" />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{event.Workshop}</Text>
            <Text style={styles.eventLocation}>{event.College}</Text>
            <Text style={styles.eventRatings}>Ratings: {event.Ratings}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleRefresh = () => {
    fetchEventData();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <ScrollView style={styles.eventList}>
        {eventData.map((event) => renderCard(event))}
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
    color: '#FFFFFF',
  },
  eventRatings: {
    fontSize: 14,
    color: '#FFFFFF',
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
