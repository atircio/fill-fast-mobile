import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapScreenFooter from '../components/MapScreenFooter';
import {
  requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy
} from 'expo-location';

const GOOGLE_API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlu-t4x31_lAoB_Vc'

const MapScreen = () => {

  const mapRef = useRef(null)

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);


 

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log("Permita utlizar a localização");
        return;
      }

      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      //console.log(currentPosition)


    };
    getPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 10,
      distanceInterval: 10
    }, (response) => {
     // console.log("NOVA LOCALIZAÇÃO =>", response);
      setLocation(response);
    });
  }, [location]);



  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} region ={{
        latitude: location ? location.coords.latitude : 8,
        longitude: location ? location.coords.longitude : 13,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      >
        <Marker
          coordinate={{
            latitude: location ? location.coords.latitude : 0,
            longitude: location ? location.coords.longitude : 0
          }}
          title="Minha Localização"
        />




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
