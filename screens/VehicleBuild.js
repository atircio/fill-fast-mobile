import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';

const VehicleBuild = () => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [hybrid, setHybrid] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const handleImagePicker = () => {
    // Lógica para abrir a galeria e selecionar uma imagem
  };

  const renderCardItem = ({ item }) => {
    return (
      <View style={styles.cardItem}>
        {item.type === 'input' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={item.placeholder}
              onChangeText={item.onChangeText}
              value={item.value}
            />
          </View>
        )}
        {item.type === 'text' && <Text style={styles.text}>{item.text}</Text>}
        {item.type === 'checkbox' && (
          <TouchableOpacity
            style={styles.checkboxButton}
            onPress={() => setHybrid(!hybrid)}
          >
            {hybrid ? (
              <AntDesign name="checksquare" size={24} color="black" />
            ) : (
              <AntDesign name="checksquareo" size={24} color="black" />
            )}
            <Text style={styles.checkboxLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const data = [
    {
      id: '1',
      type: 'input',
      placeholder: 'Nome',
      value: name,
      onChangeText: setName,
    },
    {
      id: '2',
      type: 'input',
      placeholder: 'Descrição',
      value: description,
      onChangeText: setDescription,
    },
    {
      id: '3',
      type: 'text',
      text: 'Tipo de Combustíveis',
    },
    {
      id: '4',
      type: 'input',
      placeholder: 'Veículo Híbrido (2 tanques)',
      value: fuelType,
      onChangeText: setFuelType,
    },
    {
      id: '5',
      type: 'checkbox',
      label: 'Veículo Híbrido (2 tanques)',
    },
    {
      id: '6',
      type: 'text',
      text: 'Sobre o Carro',
    },
    {
      id: '7',
      type: 'input',
      placeholder: 'Marca',
      value: brand,
      onChangeText: setBrand,
    },
    {
      id: '8',
      type: 'input',
      placeholder: 'Modelo',
      value: model,
      onChangeText: setModel,
    },
    {
      id: '9',
      type: 'input',
      placeholder: 'Ano',
      value: year,
      onChangeText: setYear,
    },
    {
      id: '10',
      type: 'input',
      placeholder: 'Matrícula',
      value: licensePlate,
      onChangeText: setLicensePlate,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center',alignContent: 'center', width: '90%',}}>
        <View style={styles.card}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>Adicione uma imagem</Text>
          )}
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
            <AntDesign name="picture" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    backgroundColor: '#f45'
  },
  card: {

    width: '100%',
    height: 250,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.white,
  },
  imageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContainer: {
    width: '100%',
    paddingHorizontal: 2,
    backgroundColor: '#ed3',
  },
  cardItem: {
    backgroundColor: COLORS.white,
    padding: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  input: {
    height: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});

export default VehicleBuild;
