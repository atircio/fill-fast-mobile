import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../src/theme/theme";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import NotAuthorized from "./NotAuthorized";
import { LoginCredentialData } from "../database/LoginCredential";
import { db } from "../firebase";
import { decode, encode } from "base-64";
import { getElapsedTimeFromUTC } from "../src/helpers/dataFormater";

const AlertsList = ({ route }) => {
  const navigation = useNavigation();
  const [IdCar, setIdCar] = useState(null);

  useEffect(() => {
    if (route.params) {
      const { carID } = route.params;
      setIdCar(carID);
      console.log(carID);
      getAlertsByCarID(carID);
    }
  }, [route]);

  useEffect(() => {
    if (IdCar) {
      const unsubscribe = navigation.addListener("focus", () => {
        console.log(IdCar);
        getAlertsByCarID(IdCar); 
      });

      return unsubscribe;
    }
  }, [navigation, IdCar]);

  const Press = () => {
    navigation.replace("Tab");
  };

  const userWithEmail = LoginCredentialData.find((item) => item && item.uid);
  const result = userWithEmail || null;

  const goToAlertBuild = () => {
    navigation.navigate("AlertsBuild", {
      carID: IdCar,
      uid: result.uid,
    });
  };

  const [data, setData] = useState([]);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getAlertsByCarID = async (carID) => {
    try {
      const querySnapshot = await db
        .collection("users")
        .doc(result.uid)
        .collection("veiculos")
        .doc(carID)
        .collection("alerts")
        .get();

      const alerts = [];

      querySnapshot.forEach((doc) => {
        const vehicleData = doc.data();
        console.log(vehicleData);
        alerts.push(vehicleData);
      });

      console.log(alerts);

      setData(alerts); 
    } catch (error) {
      console.error("Erro ao obter os veículos: ", error);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await db
        .collection("users")
        .doc(result.uid)
        .collection("veiculos")
        .doc(IdCar)
        .collection("alerts")
        .doc(id)
        .delete();
      
      getAlertsByCarID();
    } catch (error) {
      console.error("Erro ao eliminar veículo: ", error);
    }
  };

  const confirmDeleteAlert = (item) => {
    Alert.alert(
      "Eliminar Lembrete",
      `Deseja eliminar o lembrete ${item.title}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => deleteAlert(item.id),
        },
      ],
      { cancelable: false }
    );
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity onLongPress={() => confirmDeleteAlert(item)}>
      <View style={styles.item}>
        <Image
          source={
            !imageError && item.imageURL !== ""
              ? { uri: item.imageURL }
              : require("../assets/carDefault.png")
          }
          onError={handleImageError}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>
            Modificado à: {getElapsedTimeFromUTC(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (result) {
    return (
      <View style={{ backgroundColor: COLORS.bg, height: "100%" }}>
        <View style={styles.container}>
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={styles.title}>Lembretes</Text>
          </View>
          <FlatList
            data={data.slice().sort((a, b) => b.createdAt - a.createdAt)}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={goToAlertBuild}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  } else {
    return <NotAuthorized />;
  }
};

export default AlertsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 5,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "black",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#888",
  },
  itemButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
