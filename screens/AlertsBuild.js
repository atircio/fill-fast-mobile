import React, { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import moment from "moment";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../src/theme/theme";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { db, auth, storage, firebase } from "../firebase";
import { LoginCredentialData } from "../database/LoginCredential";
import carDefault from "../assets/carDefault.png";

const AlertsBuild = ({ route }) => {
  const [service, setService] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [repetition, setRepetition] = useState("unico");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [repeatOption, setRepeatOption] = useState("");

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  const [data, setData] = useState([]); // Initialize data with an empty array

  const [IdCar, setIdCar] = useState(null);

  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleNotification = (notification) => {
    // Aqui você pode tratar a notificação recebida, se necessário
    console.log(notification);
  };

  async function registerForPushNotificationsAsync() {
    // ... (Código de registro de notificações - mantido igual)
  }

  useEffect(() => {
    if (route.params) {
      const { carID } = route.params;
      setIdCar(carID);
      console.log(carID);
    }
  }, [route]);

  const validateTitle = (title) => {
    const titleRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    if (!titleRegex.test(title)) {
      Alert.alert(
        "Erro de validação",
        "O título deve conter apenas letras e permitir apenas 1 espaço em branco entre as palavras."
      );
      return false; // Interrompe a função de salvamento
    }
    return true; // Continua a execução da função de salvamento
  };

  const validateNote = (note) => {
    const noteRegex = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;
    if (!noteRegex.test(note)) {
      Alert.alert(
        "Erro de validação",
        "A nota deve conter apenas letras e números, e permitir apenas 1 espaço em branco entre as palavras."
      );
      return false; // Interrompe a função de salvamento
    }
    return true; // Continua a execução da função de salvamento
  };

  const validateYear = (year) => {
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      Alert.alert(
        "Erro de validação",
        "O ano deve conter apenas números e ter exatamente 4 caracteres."
      );
      return false; // Interrompe a função de salvamento
    }
    return true; // Continua a execução da função de salvamento
  };

  const validateDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert(
        "Erro de validação",
        "A data deve seguir o formato (YYYY-MM-DD) e conter apenas números e o caractere '-'."
      );
      return false; // Interrompe a função de salvamento
    }
    return true; // Continua a execução da função de salvamento
  };

  const validateTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      Alert.alert(
        "Erro de validação",
        "O horário deve seguir o formato (HH:mm) e conter apenas números e o caractere ':'."
      );
      return false; // Interrompe a função de salvamento
    }
    return true; // Continua a execução da função de salvamento
  };

  const saveDataToFirestore = async () => {
    try {
      if (!title) {
        Alert.alert("Erro de validação", "O campo título é obrigatório.");
        return;
      }

      if (!note) {
        Alert.alert("Erro de validação", "O campo nota é obrigatório.");
        return;
      }
      if (!startDate || !startTime) {
        alert("Por Favor, coloque a data e o horário");
        return;
      }

      const dateTime = new Date(`${startDate}T${startTime}`);

      if (isNaN(dateTime)) {
        alert(
          "Data ou horário inválidos. Por favor, verifique e tente novamente."
        );
        return;
      }

      const now = new Date();

      if (dateTime <= now) {
        alert(
          "Por favor, selecione uma data e horário futuros para a notificação."
        );
        return;
      }

      if (
        !validateTitle(title) ||
        !validateNote(note) ||
        !validateDate(startDate) ||
        !validateTime(startTime)
      ) {
        return; // Interrompe a função de salvamento se alguma validação falhar
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: note,
          data: { data: "goes here" },
        },
        trigger: { date: dateTime },
      });

      // Autenticar o usuário atual
      const userWithEmail = LoginCredentialData.find(
        (item) => item && item.email
      );
      const currentUserID = userWithEmail ? userWithEmail.uid : null;

      if (!currentUserID) {
        Alert.alert("Erro: Usuário não autenticado");
        return;
      }

      const currentUTC = firebase.firestore.Timestamp.now();

      // Criar um ID único para o lembrete
      const alertRef = db
        .collection("users")
        .doc(currentUserID)
        .collection("veiculos")
        .doc(IdCar)
        .collection("alerts")
        .doc();

      // Salvar informações do lembrete no documento do usuário
      await alertRef.set({
        id: alertRef.id,
        service,
        title,
        note,
        repetition,
        startDate,
        startTime,
        repeatOption,
        createdAt: currentUTC,
      });

      // Criar a notificação com base no lembrete
      if (repetition === "unico" && startDate && startTime) {
        const fireDateTime = moment(`${startDate}T${startTime}`).toDate();
        console.log("fireDateTime: " + fireDateTime);

        console.log("data: " + startDate);
        console.log("tempo: " + startTime);

        const trigger = fireDateTime.getTime() - Date.now();
        console.log("trigger: " + trigger);

        if (trigger > 0) {
          console.log("hbjkbjnhkhjkbj");
          // Agendar a notificação para o tempo especificado
          await Notifications.scheduleNotificationAsync({
            content: {
              title: title,
              body: note,
              data: { data: "goes here" },
            },
            trigger: { date: dateTime },
          });
        }
      }

      console.log("dgbdfghfhf");
      Alert.alert("Lembrete salvo com sucesso");
    } catch (error) {
      Alert.alert("Erro ao salvar o lembrete", error.message);
    }
  };

  if (route.params) {
    /* if (!isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }*/

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text> </Text>
          <AntDesign
            name="bars"
            size={24}
            color={COLORS.primary}
            style={styles.icon}
          />
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
          <AntDesign
            name="filetext1"
            size={24}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Título do serviço"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign
            name="filetext1"
            size={24}
            color={COLORS.primary}
            style={styles.icon}
          />
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
              status={repetition === "unico" ? "checked" : "unchecked"}
              onPress={() => setRepetition("unico")}
              color={COLORS.primary}
            />
            <Text style={styles.radioButtonLabel}>Único</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="repetir"
              status={repetition === "repetir" ? "checked" : "unchecked"}
              onPress={() => setRepetition("repetir")}
              color={COLORS.primary}
            />
            <Text style={styles.radioButtonLabel}>Repetir a cada</Text>
          </View>
        </View>

        {repetition === "unico" && (
          <View>
            <View style={styles.inputContainer}>
              <AntDesign
                name="calendar"
                size={24}
                color={COLORS.primary}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Data (AAAA-MM--DD)"
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign
                name="clockcircleo"
                size={24}
                color={COLORS.primary}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Hora (HH:MM)"
                value={startTime}
                onChangeText={(text) => setStartTime(text)}
              />
            </View>
          </View>
        )}

        {repetition === "repetir" && (
          <View>
            <View style={styles.inputContainer}>
              <AntDesign
                name="calendar"
                size={24}
                color={COLORS.primary}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Data de início (DD/MM/AAAA)"
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign
                name="clockcircleo"
                size={24}
                color={COLORS.primary}
                style={styles.icon}
              />
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
                  status={
                    repeatOption === "diariamente" ? "checked" : "unchecked"
                  }
                  onPress={() => setRepeatOption("diariamente")}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Diariamente</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="semanalmente"
                  status={
                    repeatOption === "semanalmente" ? "checked" : "unchecked"
                  }
                  onPress={() => setRepeatOption("semanalmente")}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Semanalmente</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="mensalmente"
                  status={
                    repeatOption === "mensalmente" ? "checked" : "unchecked"
                  }
                  onPress={() => setRepeatOption("mensalmente")}
                  color={COLORS.primary}
                />
                <Text style={styles.radioButtonLabel}>Mensalmente</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveDataToFirestore}
          >
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
    alignItems: "stretch",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  saveButton: {
    backgroundColor: "#EAB963",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 100,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 100,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.gold,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AlertsBuild;
