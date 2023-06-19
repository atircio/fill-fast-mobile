import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage, firebase } from '../firebase';
import { LoginCredentialData } from '../database/LoginCredential';
import carDefault from '../assets/carDefault.png'

const AlertsBuild = ({ route }) => {
  const [service, setService] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [repetition, setRepetition] = useState('unico');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [repeatOption, setRepeatOption] = useState('');

  const [data, setData] = useState([]); // Initialize data with an empty array
  const [isLoading, setIsLoading] = useState(true); // Adiciona a variável isLoading

  const [IdCar, setIdCar] = useState(null);

  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params) {
      const { carID } = route.params;
      setIdCar(carID);
      console.log(carID)
      //fetchData(carID);  
      }

  }, [route]);



  const fetchData = () => {
    // Code to fetch data from Firestore
    // Example:
    db.collection('alerts')
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
        setIsLoading(false); // Set isLoading to false when data fetching is complete
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
        setIsLoading(false); // Set isLoading to false even if there's an error
      });
  };

  const updateDataInFirestore = () => {
    // Code to update data in Firestore
    // Example:
    db.collection('alerts')
      .doc('exampleId')
      .update({
        service,
        title,
        note,
        repetition,
        startDate,
        startTime,
        repeatOption,
      })
      .then(() => {
        console.log('Document successfully updated!');
        fetchData(); // Fetch updated data after successful update
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };

  const saveDataToFirestore = async () => {
    
  
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
  

      const currentUTC = firebase.firestore.Timestamp.now();
  
      // Criar um ID único para o veículo
      const alertsRed = db
        .collection('users')
        .doc(currentUserID)
        .collection('veiculos')
        .doc('BoeWoV8KUTBdKcipLmyO')
        .collection('alerts')
        .doc();
  
      // Salvar informações do veículo no documento do usuário
      await alertsRed.set({
        id: alertsRed.id,
        service,
        title,
        note,
        repetition,
        startDate,
        startTime,
        repeatOption,
        createdAt: currentUTC
      });
  
      setIsLoading(false); // Hide the loading indicator
      Alert.alert('Dados salvos com sucesso!');
      backScreen();
    } catch (error) {
      setIsLoading(false); // Hide the loading indicator
      Alert.alert('Erro ao salvar os dados: ', error.message);
      backScreen();

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
        <View style={styles.inputContainer}>
          <AntDesign name="bars" size={24} color={COLORS.primary} style={styles.icon} />
          <Picker
            style={styles.input}
            selectedValue={service}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            <Picker.Item label="Serviço" value="servico" />
            <Picker.Item label="Manutenção" value="manutencao" />
            <Picker.Item label="Estacionamento" value="estacionamento" />
            <Picker.Item label="Lavagem" value="lavagem" />
            <Picker.Item label="Portagens" value="portagens" />
            <Picker.Item label="Multas" value="multas" />
            <Picker.Item label="Tuning" value="tuning" />
            <Picker.Item label="Seguro" value="seguro" />
            <Picker.Item label="Taxa" value="taxa" />
            <Picker.Item label="Documento" value="documento" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="filetext1" size={24} color={COLORS.primary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Título do serviço"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="filetext1" size={24} color={COLORS.primary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nota adicional"
            value={note}
            onChangeText={(text) => setNote(text)}
          />
        </View>
        <Text style={styles.title}>Repetições</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="unico"
              status={repetition === 'unico' ? 'checked' : 'unchecked'}
              onPress={() => setRepetition('unico')}
              color={COLORS.primary}
            />
            <Text style={styles.radioButtonLabel}>Único</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="repetir"
              status={repetition === 'repetir' ? 'checked' : 'unchecked'}
              onPress={() => setRepetition('repetir')}
              color={COLORS.primary}
            />
            <Text style={styles.radioButtonLabel}>Repetir a cada</Text>
          </View>
        </View>

        {repetition === 'unico' && (
          <View>
            <View style={styles.inputContainer}>
              <AntDesign name="calendar" size={24} color={COLORS.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Data (DD/MM/AAAA)"
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="clockcircleo" size={24} color={COLORS.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Hora (HH:MM)"
                value={startTime}
                onChangeText={(text) => setStartTime(text)}
              />
            </View>
          </View>
        )}

        {repetition === 'repetir' && (
          <View>
            <View style={styles.inputContainer}>
              <AntDesign name="calendar" size={24} color={COLORS.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Data de início (DD/MM/AAAA)"
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="clockcircleo" size={24} color={COLORS.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Hora de início (HH:MM)"
                value={startTime}
                onChangeText={(text) => setStartTime(text)}
              />
            </View>
            <Text style={styles.title}>Repetir:</Text>
            <View style={styles.radioContainer}>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="diariamente"
                  status={repeatOption === 'diariamente' ? 'checked' : 'unchecked'}
                  onPress={() => setRepeatOption('diariamente')}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Diariamente</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="semanalmente"
                  status={repeatOption === 'semanalmente' ? 'checked' : 'unchecked'}
                  onPress={() => setRepeatOption('semanalmente')}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Semanalmente</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="mensalmente"
                  status={repeatOption === 'mensalmente' ? 'checked' : 'unchecked'}
                  onPress={() => setRepeatOption('mensalmente')}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Mensalmente</Text>
              </View>
            </View>
          </View>
        )}

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
    alignItems: 'stretch',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
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
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 100,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlertsBuild;
