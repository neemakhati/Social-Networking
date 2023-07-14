import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const RecommendationScreen = () => {
  const selectedEvents = useSelector((state) => state.selectedEvents);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Events</Text>
      <View style={styles.eventList}>
        {selectedEvents.map((eventId) => (
          <Text key={eventId} style={styles.eventName}>
            Event ID: {eventId}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles...
});

export default RecommendationScreen;
