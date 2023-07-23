import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapScreenFooter from '../components/MapScreenFooter';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location';
import imagePath from '../src/constants/imagePath';

const GOOGLE_API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlu-t4x31_lAoB_Vcc'

const MapScreen = () => {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permita utilizar a localização');
        return;
      }

      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    };
    getPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 10,
        distanceInterval: 10,
      },
      (response) => {
        setLocation(response);
      }
    );
  }, []);

  const handleButtonPress = () => {
    if (mapRef.current) {
      const { latitude, longitude } = location.coords;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location ? location.coords.latitude : 8,
          longitude: location ? location.coords.longitude : 13,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location ? location.coords.latitude : 0,
            longitude: location ? location.coords.longitude : 0,
          }}
          title="Minha Localização"
          image={imagePath.CurLoc}
        />
      </MapView>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleButtonPress}
      >
        <View style={styles.button}>
          <MaterialCommunityIcons
            name="navigation-variant"
            size={24}
            color="red"
          />
        </View>
      </TouchableOpacity>

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
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
});
