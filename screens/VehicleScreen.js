import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../src/theme/theme';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VehicleScreen = () => {

    const navigation = useNavigation();
  
    const Press = () => {
      navigation.replace('Tab')
    }
    const goToVehicleBuild = () => {
      navigation.navigate('VehicleBuild')
    }

  const data = [
    { id: '1', title: 'Veículo 1' },
    { id: '2', title: 'Veículo 2' },
    { id: '3', title: 'Veículo 3' },
    { id: '324', title: 'Veículo 3' },

    { id: '343', title: 'Veículo 3' },

  ];

  const renderListItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={require('../assets/carDefault.png')}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>Ano: 2022</Text>
      </View>
      <TouchableOpacity style={styles.itemButton} onPress={goToVehicleBuild}>
        <AntDesign name="arrowright" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: COLORS.bg, height: '100%' }}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Image source={require('../assets/CarS.gif')} style={{ width: 200, height: 200 }} />
          <Text style={styles.title}>Configure os seus veículos</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={goToVehicleBuild}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default VehicleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
  },
  itemButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});