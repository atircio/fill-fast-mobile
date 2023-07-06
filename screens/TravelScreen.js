import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync } from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS } from '../src/theme/theme';
import imagePath from '../src/constants/imagePath';


const TravelScreen = ({ route }) => {
  const { lat, lon } = route.params;

  const YOUR_GOOGLE_MAPS_API_KEY = 'AIzaSyAt9UZDa-5DO4Kav_aRyyA1kOB83NEz0xY';
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [directions, setDirections] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(null);


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

  useEffect(() => {
    const updateLocation = (newLocation) => {
      setLocation(newLocation);
    };

    const watchUserPosition = async () => {
      const positionWatcher = await watchPositionAsync(
        {
          accuracy: 6,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (newLocation) => {
          updateLocation(newLocation);
        }
      );

      return () => {
        if (positionWatcher) {
          positionWatcher.remove();
        }
      };
    };

    if (location) {
      watchUserPosition();
    }
  }, []);

  useEffect(() => {
    if (location) {
      const origin = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      const destination = {
        latitude: lat,
        longitude: lon,
      };

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const leg = route.legs[0];
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);

            const directions = (
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={YOUR_GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="hotpink"
                optimizeWaypoints={true}
                onReady={result => {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      bottom: 300,
                      right:30,
                      letf: 30,
                      top:100
                    }
                  })
                }}
              />
            );
            setDirections(directions);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [location]);

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
        {directions && directions}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Distância: {distance}</Text>
        <Text style={styles.infoText}>Tempo Restante: {duration}</Text>
      </View>
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
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carMarker: {
    width: 1, // Defina a largura desejada
    height: 1, // Defina a altura desejada
  },
});

export default TravelScreen;
