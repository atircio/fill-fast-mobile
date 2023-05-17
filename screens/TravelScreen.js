import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

const TravelScreen = ({ route }) => {
  const { lat, lon} = route.params;

  const YOUR_GOOGLE_MAPS_API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlu-t4x31_lAoB_Vc'
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permita utlizar a localização');
        return;
      }

      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    };

    getPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        region={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Minha Localização"
          />
        )}
        {location && (
          <MapViewDirections
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={{
              latitude: lat,
              longitude: lon,
            }}
            language="pt"

            apikey='AIzaSyA1elJaTMHC0I1_IyFlt4x31_lu-AoB_Vc'
            strokeWidth={4}
            strokeColor="hotpink"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default TravelScreen;
