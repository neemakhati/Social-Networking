import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapsScreen = ({ route }) => {
  const { latitude, longitude, locationName } = route.params;

  // Helper function to parse the latitude/longitude from the given format
  const parseLatLong = (value) => {
    const numericValue = Number(value.split('°')[0].trim());
    return value.includes('S') || value.includes('W') ? -numericValue : numericValue;
  };

  const region = {
    latitude: parseLatLong(latitude),
    longitude: parseLatLong(longitude),
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={region} title={locationName} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapsScreen;
