import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { COLORS } from '../src/theme/theme';
import { LocationAccuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';

const API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlt4x31_lu-AoB_Vc';


const MapScreenFooter = () => {
  const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [numberOfStations, setNumberOfStations] = useState(0);


  const handleImageError = () => {
    setImageError(true);
  };


  useEffect(() => {
    let isMounted = true;

    const startWatchingPosition = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          // Tratar a permissão negada aqui, se necessário.
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        
        if (isMounted) {
          setLocation(location);
        }
      } catch (error) {
        // Tratar erros de obtenção de localização aqui.
      }
    };

    startWatchingPosition();

    return () => {
      isMounted = false;
      Location.stopLocationUpdatesAsync(/* taskName, se aplicável */);
    };
  }, []);

 /* useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000000000000,
      distanceInterval: 10000000000
    }, (response) => {
      console.log("NOVA LOCALIZAÇÃO dos postos =>", response);
      setLocation(response);
    });
  }, []);*/


  useEffect(() => {
    const radius = 200000; // 5km em metros



    if (location) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=gas_station&key=${API_KEY}`;
      console.log(url)
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const stations = data.results.map(result => {
            const imageReference = result.photos && result.photos.length > 0 ? result.photos[0].photo_reference : '';
            return {
              id: result.place_id,
              name: result.name,
              rating: result.rating,
              reviews: result.user_ratings_total,
              distance: result.distance ? `${Math.round(result.distance / 100) / 10}km,` : `${0}km,`,
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
              imageReference: imageReference,
              address: result.vicinity
            }
          });
          console.log(stations)
          console.log("++++" + stations.imageReference)
          setStations(stations);
          setNumberOfStations(stations.length);
        })
        .catch(error => {
          console.log(error);
        });
    }

  }, [location]);
  const navigation = useNavigation();


  const renderStation = ({ item }) => {
    const destination = {
      latitude: item.latitude,
      longitude: item.longitude,
    };

    const Press = () => {
      navigation.navigate('PaScreen',
        {
          id: item.id,
          name: item.name,
          rating: item.rating,
          reviews: item.reviews,
          imageReference: item.imageReference,
          address: item.address,
          latitude2: item.latitude,
          longitude2: item.longitude,
        })
    }

    return (
      <TouchableOpacity onPress={Press}>
        <View style={styles.paContainer}>
          <Image
            style={styles.paImage}
            source={
              !imageError
                ? { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${styles.paImage.width}&photoreference=${item.imageReference}&key=${API_KEY}` }
                : require('../assets/imgDefaultGas.jpg')
            }
            onError={handleImageError}
          />
          <Text style={[styles.paLabel, { width: '100%' }]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
          <View style={styles.paRow}>
            <AntDesign name="staro" style={styles.paStars} />
            <Text style={{ color: COLORS.gold, marginLeft: 2 }}>{item.rating}</Text>
            <Text style={{ color: COLORS.dark, marginLeft: 8 }}>({item.reviews})</Text>
          </View>
          <View style={styles.paRow}>
            <Ionicons name="ios-location-outline" style={styles.paLocation} />
            <Text style={{ color: COLORS.grey, marginLeft: 2 }}>{item.distance}</Text>
            <AntDesign name="clockcircleo" size={18} style={{ marginLeft: 8, color: COLORS.grey }} />
            <Text style={{ color: COLORS.grey, marginLeft: 5 }}>{item.time}</Text>
          </View>
          <MapViewDirections
            origin={location.coords ? location.coords : {
              latitude: 13.2413602,
              longitude: -8.9444613
            }}
            destination={{
              latitude: -8.8260679,
              longitude: 13.2449049
            }}
            apikey={API_KEY}
            strokeWidth={3}
            strokeColor={COLORS.primary}
            onReady={result => {
              const distance = `${Math.round(result.distance / 100) / 10}km`;
              const time = `${Math.round(result.duration / 60)} min`;
              const updatedStations = stations.map(station => {
                if (station.id === item.id) {
                  return {
                    ...station,
                    distance,
                    time,
                  };
                }
                return station;
              });
              setStations(updatedStations);
            }}
          />
        </View>
      </TouchableOpacity>

    )
  };





  return (
    <View style={styles.footer}>
      <View>

        <Text style={styles.foundedStationFounded}>
          {numberOfStations} Postos
          perto de você
        </Text>
      </View>
      <FlatList
        horizontal={true}
        data={stations}
        keyExtractor={item => item.id}
        renderItem={renderStation}
        contentContainerStyle={styles.stationsList}
      />
    </View>
  );
};

export default MapScreenFooter;

const styles = StyleSheet.create({
  paContainer: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 20,
    width: 135,

    marginRight: 15
  },
  paImage: {
    width: 'auto',
    height: 65,
    resizeMode: 'cover',
    borderRadius: 12,

  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 1,
  },
  foundedStationFounded: {
    fontSize: 18,
    paddingTop: 8,
  },
  paInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  paLabel: {
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginRight: 6,
  },
  paStars: {
    fontSize: 24,
    color: COLORS.gold
  },
  paRow: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paLocation: {
    fontSize: 20,
    color: COLORS.grey
  },
});
