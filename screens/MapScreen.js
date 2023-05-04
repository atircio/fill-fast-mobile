import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapScreenFooter from '../components/MapScreenFooter';
import {
   requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';

const { width, height } = Dimensions.get('window');

const INITIAL_POSITION = {
  latitude: -22.9035,
  longitude: -43.2096,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MapScreen = () => {

  const [location, setLocation] = useState(null);

  async function requestLcationPermission() {
    const permission = await requestForegroundPermissionsAsync();

    if (permission.granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log(currentPosition)
    }
  }

  useEffect(() => {
    requestLcationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      console.log("NOVA LOCALIZAÇÃO =>", response);
      setLocation(response);
    });
  },[]);


  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}>
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}/>
      </MapView>
      <MapScreenFooter />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
