import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';

const PaScreen = ({ route }) => {
  //const { id, name, rating, reviews, imageReference, address } = route.params;
  const API_KEY = 'AIzaSyA1elJaTMHC0I1_IyFlt4x31_lu-AoB_Vc';
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };

  const fuels = [
    {
      id: "1",
      name: "Gasolina",
      price: "160"
    },
    {
      id: "2",
      name: "Gasóleo",
      price: "160"
    }
  ]






  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <View >
          <Image
            style={styles.paImage}
            source={
          /*!imageError
            ? { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${styles.paImage.width}&photoreference=${imageReference}&key=${API_KEY}` }
            :*/ require('../assets/imgDefaultGas.jpg')
            }
            onError={handleImageError}
          />
        </View>


        <View style={styles.details}>
          <View style={styles.paRow}>
            <View style={{ justifyContent: 'space-around', flex: 1, }}>
              <Text style={[styles.paLabel, { width: '100%' }]} numberOfLines={1} ellipsizeMode='tail'>Posto da Sonangol</Text>
              <View style={styles.paRow}>
                <AntDesign name="staro" style={styles.paStars} />
                <Text style={{ color: COLORS.gold, marginLeft: 2, }}>4.5</Text>
                <Text style={{ color: COLORS.dark, marginLeft: 8 }}>355</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.favPa}>
              <AntDesign name="like2" style={styles.likeIcon} />
            </TouchableOpacity>
          </View>
          <View style={[styles.paColumn, { marginTop: 20 }]}>
            <View>
              <Text style={{ color: COLORS.grey, fontSize: 14 }}>Endereço</Text>
              <Text style={[{ marginTop: 6 }]}>Estrada Viana/Zango 1, Luanda</Text>
            </View>
            <TouchableOpacity style={styles.routeItemContainer}>
              <FontAwesome5 name="route" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={[{ marginTop: 20, flex: 0, justifyContent: 'space-between' }, styles.paRow]}>
            <View style={[styles.timeDistanceContainer, styles.paRow]}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="location-outline" size={20} color="black" />
              </View>
              <View>
                <Text style={{ color: COLORS.grey }}>Distância</Text>
                <Text style={{ color: COLORS.dark, fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>0.5km</Text>
              </View>
            </View>
            <View style={[styles.timeDistanceContainer, styles.paRow]}>
              <View style={styles.locationIconContainer}>
                <Feather name="clock" size={20} color="black" />
              </View>
              <View>
                <Text style={{ color: COLORS.grey }}>Status</Text>
                <Text style={{ color: COLORS.dark, fontWeight: '700', fontSize: 14, marginTop: 5 }}>ABERTO</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={{ color: COLORS.grey }}>Combustiveis</Text>
            <Text style={{color: COLORS.grey, marginTop:1, fontSize:18}}>Preço</Text>
            <Text style={{marginTop:2, color: COLORS.dark, fontWeight:'700'}}>160 kz/l</Text>
          </View>
          
          
          <FlatList
            horizontal={true}
            data={fuels}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity style={{ marginRight: 10, backgroundColor: COLORS.brown, flex: 0, borderRadius: 20, height: 30, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ color: COLORS.white }}>{item.name}</Text>
                </TouchableOpacity>

              </View>

            )}
          />
         



        </View>



      </View>
    </View>
  );
};

export default PaScreen;

const styles = StyleSheet.create({

  timeDistanceContainer: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    paddingTop: 10,
    flex: 0, justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20
  },

  container: {

  },
  paImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  details: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 1,

  },
  paRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    justifyContent: 'space-between',

  },

  paStars: {
    fontSize: 24,
    color: COLORS.gold
  },
  paLocation: {
    fontSize: 20,
    color: COLORS.grey
  },
  paLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginRight: 6,
  },
  favPa: {
    backgroundColor: COLORS.redSalmon,
    display: 'flex',
    color: COLORS.white,
    borderRadius: 50,
    width: 40,
    height: 41,
    padding: 7,
    position: 'relative',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'

  },
  routeItemContainer: {
    backgroundColor: COLORS.bg,
    display: 'flex',
    color: COLORS.white,
    borderRadius: 50,
    width: 40,
    height: 41,
    padding: 7,
    position: 'relative',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'

  },
  locationIconContainer: {
    backgroundColor: COLORS.white,
    display: 'flex',
    color: COLORS.white,
    borderRadius: 50,
    width: 40,
    height: 41,
    padding: 7,
    position: 'relative',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10

  },
  likeIcon: {
    fontSize: 25,
    color: COLORS.white,
  }


});
