import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { COLORS } from '../src/theme/theme';
import { LocationAccuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';

const MapScreenFooter = () => {
  const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log("Permita utlizar a localização");
        return;
      }

      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log(currentPosition)


    };
    getPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1,
      distanceInterval: 10
    }, (response) => {
      console.log("NOVA LOCALIZAÇÃO dos postos =>", response);
      setLocation(response);
    });
  }, [location]);


  useEffect(() => {
    const API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlt4x31_lu-AoB_Vc';
    const radius = 5000; // 5km em metros



    if (location) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=gas_station&key=${API_KEY}`;
      console.log(url)
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const stations = data.results.map(result => ({
            id: result.place_id,
            name: result.name,
            rating: result.rating,
            reviews: result.user_ratings_total,
            distance: `${Math.round(result.distance / 100) / 10}km`,
          }));
          setStations(stations);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [location]);

  const renderStation = ({ item }) => (
    <View style={styles.paContainer}>
      <Image
        style={styles.paImage}
        source={{
          uri: item.imageUri,
        }}
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
    </View>
  );





  return (
    <View style={styles.footer}>
      <View>

        <Text style={styles.foundedStationFounded}>
          8 Postos encontrados{'\n'}
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
