import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const VehicleBuild = () => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [hybrid, setHybrid] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack()
  }

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const saveDataToFirestore = () => {
    // Verificar se todos os campos foram preenchidos
    if (
      name === '' ||
      description === null ||
      fuelType === null ||
      brand === null ||
      model === null ||
      year === null ||
      licensePlate === null
    ) {
      Alert.alert('Por favor, preencha todos os campos');
      return;
    }


    // Obter o ID do usuário atual (supondo que você já tenha implementado a autenticação)
    const currentUserID = firebase.auth().currentUser.uid;

    // Criar um novo documento no Firestore
    db.collection('vehicles')
      .add({
        userId: currentUserID,
        name,
        description,
        fuelType,
        hybrid,
        brand,
        model,
        year,
        licensePlate,
        imageUri,
      })
      .then(() => {
        Alert.alert('Dados salvos com sucesso!');
      })
      .catch((error) => {
        Alert.alert('Erro ao salvar os dados: ', error);
      });
  };


  const renderCardItem = () => {
    return (
      <>
        <View style={styles.cardItem}>
        <TextInput
            placeholder="Email"
            style={styles.input}
            onTextInput={setName}
            value={name}

          />
        </View>
        <View style={styles.cardItem}>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            onTextInput={setDescription}
            value={description}
          />
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.text}>Tipo de Combustíveis</Text>
          <Picker
            style={styles.input}
            selectedValue={selectedFuelType}
            onValueChange={(itemValue) => setSelectedFuelType(itemValue)}
          >
            <Picker.Item label="Gasolina" value="gasolina" />
            <Picker.Item label="Álcool" value="alcool" />
            <Picker.Item label="Diesel" value="diesel" />
          </Picker>
        </View>

        <View style={styles.cardItem}>
          <Text style={styles.text}>Tipo de Combustíveis</Text>
          <TextInput
            style={styles.input}
            placeholder="Veículo Híbrido (2 tanques)"
            onTextInput={setFuelType}
            value={fuelType}
          />
        </View>
        <View style={styles.cardItem}>
          <TouchableOpacity
            style={styles.checkboxButton}
            onPress={() => setHybrid(!hybrid)}
          >
            {hybrid ? (
              <AntDesign name="checksquare" size={24} color="black" />
            ) : (
              <AntDesign name="checksquareo" size={24} color="black" />
            )}
            <Text style={styles.checkboxLabel}>Veículo Híbrido (2 tanques)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.text}>Sobre o Carro</Text>
          <TextInput
            style={styles.input}
            placeholder="Marca"
            onTextInput={setBrand}
            value={brand}
          />
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            onTextInput={setModel}
            value={model}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            onTextInput={setYear}
            value={year}
          />
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            onTextInput={setLicensePlate}
            value={licensePlate}
          />
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '100%' }}>
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
        ListHeaderComponent={renderCardItem}
        contentContainerStyle={styles.flatListContainer}
        keyboardShouldPersistTaps="always" // Adicionado para manter o teclado visível
        keyboardDismissMode="on-drag" // Opcional, controla como o teclado é descartado


     
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={backScreen}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    backgroundColor: COLORS.bg,
  },
  card: {
    width: '90%',
    height: 150,
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
  },
  cardItem: {
    backgroundColor: COLORS.white,
    padding: 10,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100
    ,
  },
  saveButton: {
    backgroundColor: '#EAB963',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EAB963',
    width: 100,
    alignItems: 'center',

  },
  cancelButtonText: {
    color: '#EAB963',
    fontWeight: 'bold',
  },
});

export default VehicleBuild;
