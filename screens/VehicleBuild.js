import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage, firebase } from '../firebase';
import { LoginCredentialData } from '../database/LoginCredential';
import carDefault from '../assets/carDefault.png'

const VehicleBuild = ({ route }) => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [hybrid, setHybrid] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const [data, setData] = useState([]); // Initialize data with an empty array
  const [isLoading, setIsLoading] = useState(true); // Adiciona a variável isLoading


  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };
  const backToFirstScreen = () => {
    navigation.navigate('Veiculo', { screen: 'VehicleBuild' });
  };

  useEffect(() => {
    if (route.params) {
      const { carName } = route.params;
      getVehiclesByUserID(carName);
    }
  }, [route]);


  const getVehiclesByUserID = async (carName) => {
    try {
      const userWithEmail = LoginCredentialData.find((item) => item && item.email);
      const currentUserID = userWithEmail ? userWithEmail.uid : null;

      if (!currentUserID) {
        console.error('Erro: Usuário não autenticado');
        return;
      }

      const querySnapshot = await db
        .collection('users')
        .doc(currentUserID)
        .collection('veiculos')
        .doc(carName)
        .get();

      const vehicleData = querySnapshot.data() || {};
      setData(vehicleData);
      setIsLoading(false); // Define isLoading como false após obter os 
      console.log(vehicleData);

      // Preencher Inputs com os dados do objeto data
      setName(vehicleData.name);
      setDescription(vehicleData.description);
      setFuelType(vehicleData.fuelType);
      setHybrid(vehicleData.hybrid);
      setBrand(vehicleData.brand);
      setModel(vehicleData.model);
      setYear(vehicleData.year);
      setLicensePlate(vehicleData.licensePlate);
      setImageUri(vehicleData.imageURL)

    } catch (error) {
      setIsLoading(false)
      console.error('Erro ao obter os veículos:', error);
    }
  };

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

  const saveDataToFirestore = async () => {
    if (name === '') {
      Alert.alert('Por favor, preencha todos os campos');
      return;
    }
  
    try {
      setIsLoading(true); // Show the loading indicator
  
      // Autenticar o usuário atual
      const userWithEmail = LoginCredentialData.find((item) => item && item.email);
      const currentUserID = userWithEmail ? userWithEmail.uid : null;
  
      if (!currentUserID) {
        setIsLoading(false); // Hide the loading indicator
        Alert.alert('Erro: Usuário não autenticado');
        return;
      }
  
      let imageURL = '';
  
      if (imageUri) {
        // Salvar a imagem no Firebase Storage
        const imageFileName = `${currentUserID}_${name}.jpg`; // Nome do arquivo com base no ID do usuário e no nome do veículo
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = storage.ref().child(imageFileName);
        await storageRef.put(blob);
  
        // Obter a URL da imagem salva no Firebase Storage
        imageURL = await storageRef.getDownloadURL();
      }
  
      const currentUTC = firebase.firestore.Timestamp.now();
  
      // Criar um ID único para o veículo
      const vehicleDocRef = db
        .collection('users')
        .doc(currentUserID)
        .collection('veiculos')
        .doc();
  
      // Salvar informações do veículo no documento do usuário
      await vehicleDocRef.set({
        id: vehicleDocRef.id, // Salvar o ID único do veículo
        name,
        description,
        fuelType,
        hybrid,
        brand,
        model,
        year,
        licensePlate,
        imageURL,
        createdAt: currentUTC
      });
  
      setIsLoading(false); // Hide the loading indicator
      Alert.alert('Dados salvos com sucesso!');
      backToFirstScreen();
    } catch (error) {
      setIsLoading(false); // Hide the loading indicator
      Alert.alert('Erro ao salvar os dados: ', error.message);
    }
  };
  
  
  if (route.params) {

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.cardItem}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            onChangeText={setName}
            value={data.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            onChangeText={(text) => setDescription(text.toString())}
            value={description}
          />
          <Text style={styles.text}>Tipo de Combustível</Text>
          <Picker
            style={styles.input}
            selectedValue={fuelType}
            onValueChange={setFuelType}
          >
            <Picker.Item label="Gasolina" value="gasolina" />
            <Picker.Item label="Álcool" value="alcool" />
            <Picker.Item label="Diesel" value="diesel" />
          </Picker>
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
          <TextInput
            style={styles.input}
            placeholder="Marca"
            onChangeText={setBrand}
            value={brand}
          />
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            onChangeText={setModel}
            value={model}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            onChangeText={setYear}
            value={year}
          />
          <TextInput
            style={styles.input}
            placeholder="Placa"
            onChangeText={setLicensePlate}
            value={licensePlate}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveDataToFirestore}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={backScreen}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else if (!route.params) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>Adicione fswfeuma imagem</Text>
          )}
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
            <AntDesign name="picture" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardItem}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            onChangeText={setName}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            onChangeText={(text) => setDescription(text.toString())}
            value={description}
          />
          <Text style={styles.text}>Tipo de Combustível</Text>
          <Picker
            style={styles.input}
            selectedValue={fuelType}
            onValueChange={setFuelType}
          >
            <Picker.Item label="Gasolina" value="gasolina" />
            <Picker.Item label="Álcool" value="alcool" />
            <Picker.Item label="Diesel" value="diesel" />
          </Picker>
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
          <TextInput
            style={styles.input}
            placeholder="Marca"
            onChangeText={setBrand}
            value={brand}
          />
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            onChangeText={setModel}
            value={model}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            onChangeText={setYear}
            value={year}
          />
          <TextInput
            style={styles.input}
            placeholder="Placa"
            onChangeText={setLicensePlate}
            value={licensePlate}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveDataToFirestore}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={backScreen}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
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
  cardItem: {
    width: '90%',
    backgroundColor: COLORS.white,
    padding: 10,
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
    borderRadius: 100,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleBuild;
