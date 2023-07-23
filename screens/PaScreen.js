import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { useNavigation } from '@react-navigation/native';

const PaScreen = ({ route }) => {
  const { id, name, rating, reviews, imageReference, address, latitude2, longitude2, opened } = route.params;
  const API_KEY = 'YOUR_API_KEY';

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleImageError = () => {
    setImageError(true);
  };
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const showItemDetails = (item) => {
    setSelectedItem(item);
    setPopupVisible(true);
  };
  const closeItemDetails = () => {
    setPopupVisible(false);
  };
  const fuels = [
    {
      id: "1",
      name: "Gasolina",
      details: "300 kz/L"
    },
    {
      id: "2",
      name: "Gasóleo",
      details: "160  kz/L"
    },
    {
      id: "3",
      name: "Loja de conveniência 24h",
      details: "Compre o seu refrigerante, almoço, óleo do carro e muito mais"
    },
    {
      id: "4",
      name: "Casa de Banho",
      details: "***"
    }
  ];
  const navigation = useNavigation();

  const pressToTravel = () => {
    navigation.navigate('PaScreen', {
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };

  const services = [
    { id: "1", name: "Serviço 1" },
    { id: "2", name: "Serviço 2" },
    { id: "3", name: "Serviço 3" },
    // Adicione mais serviços aqui, se necessário
  ];

  const Press = () => {
    navigation.navigate('TravelScreen', {
      lat: latitude2,
      lon: longitude2,
    });
  };

  const goToAvaliar = () => {
    navigation.navigate('CommentsScreen', {
      place_id: id,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ width: '100%' }}>
        <View>
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
            <View style={{ justifyContent: 'space-around', flex: 1 }}>
              <Text style={[styles.paLabel, { width: '100%' }]} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
              <View style={styles.paRow}>
                <AntDesign name="staro" style={styles.paStars} />
                <Text style={{ color: COLORS.gold, marginLeft: 2 }}>{rating}</Text>
                <Text style={{ color: COLORS.dark, marginLeft: 8 }}>({reviews})</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.favPa} onPress={goToAvaliar}>
              <AntDesign name="like2" style={styles.likeIcon} />
            </TouchableOpacity>
          </View>
          <View style={[styles.paColumn, { marginTop: 20 }]}>
            <View>
              <Text style={{ color: COLORS.grey, fontSize: 14 }}>Endereço</Text>
              <Text style={[{ marginTop: 6 }]}>{address}</Text>
            </View>
            <TouchableOpacity style={styles.routeItemContainer} onPress={Press}>
              <FontAwesome5 name="route" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={[{ marginTop: 20, flex: 0, justifyContent: 'space-between' }, styles.paRow]}>
            <View style={[styles.timeDistanceContainer, styles.paRow]}>
              <View style={styles.locationIconContainer}>
                <Feather name="clock" size={20} color="black" />
              </View>
              <View>
                <Text style={{ color: COLORS.grey }}>Espera</Text>
                <Text style={{ color: COLORS.dark, fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>7min </Text>
              </View>
            </View>
            <View style={[styles.timeDistanceContainer, styles.paRow]}>
              <View style={styles.locationIconContainer}>
                <FontAwesome5 name="door-open" size={24} color="black" />
              </View>
              <View>
                <Text style={{ color: COLORS.grey }}>Status</Text>
                <Text style={{ color: COLORS.dark, fontWeight: '700', fontSize: 14, marginTop: 5 }}>
                  {opened === true ? 'Aberto' : opened === false ? 'Fechado' : 'Desconhecido'}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: COLORS.grey }}>Combustíveis</Text>
            <Text style={{ color: COLORS.grey, marginTop: 1, fontSize: 18 }}>Preço</Text>
            <Text style={{ marginTop: 2, color: COLORS.dark, fontWeight: '700' }}>300 kz/l</Text>
          </View>
          <FlatList
            horizontal={true}
            data={fuels}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginRight: 10, backgroundColor: COLORS.brown, flex: 0, borderRadius: 20, height: 30, paddingHorizontal: 10, paddingVertical: 5 }}
                onPress={() => showItemDetails(item)} // Ao pressionar o item, mostrar os detalhes
                onLongPress={() => showItemDetails(item)} // Ao pressionar o item por um longo período, mostrar os detalhes
              >
                <Text style={{ color: COLORS.white }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Modal para exibir informações detalhadas */}
          <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedItem && (
                  <View>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    <Text style={styles.modalDetails}>{selectedItem.details}</Text>
                    {/* ...outros detalhes do item */}
                  </View>
                )}
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeItemDetails}>
                  <Text style={styles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaScreen;

const styles = StyleSheet.create({
  timeDistanceContainer: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    paddingTop: 10,
    flex: 0,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
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
  },
  serviceCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  serviceName: {
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
