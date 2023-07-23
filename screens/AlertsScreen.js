import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");

const AlertsScreen = () => {
  const navigation = useNavigation();
  const Press = () => {
    navigation.replace("Tab");
  };

  const userWithEmail = LoginCredentialData.find((item) => item && item.uid);
  const result = userWithEmail || null;

  const goToVehicleBuild = ({ item }) => {
    navigation.navigate("AlertsList", {
      carID: item.id,
      uid: result.uid,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getVehiclesByUserID(); 
    });

    return unsubscribe;
  }, [navigation]);

  const goToVehicleBuildEmpty = () => {
    navigation.navigate("VehicleBuild");
  };

  const [data, setData] = useState([]);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getVehiclesByUserID = async () => {
    try {
      const querySnapshot = await db
        .collection("users")
        .doc(result.uid)
        .collection("veiculos")
        .get();

      const vehicles = [];

      querySnapshot.forEach((doc) => {
        const vehicleData = doc.data();
        console.log(vehicleData);
        vehicles.push(vehicleData);
      });

      setData(vehicles); 
    } catch (error) {
      console.error("Erro ao obter os veículos: ", error);
    }
  };

  useEffect(() => {
    if (result) {
      getVehiclesByUserID();
    }
  }, [result]);

  const deleteVehicle = async (vehicleId) => {
    try {
      await db
        .collection("users")
        .doc(result.uid)
        .collection("veiculos")
        .doc(vehicleId)
        .delete();

   
      getVehiclesByUserID();
    } catch (error) {
      console.error("Erro ao eliminar veículo: ", error);
    }
  };

  const confirmDeleteVehicle = (item) => {
    Alert.alert(
      "Eliminar Veículo",
      `Deseja eliminar o veículo ${item.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => deleteVehicle(item.id),
        },
      ],
      { cancelable: false }
    );
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={{}}
      onPress={() => goToVehicleBuild({ item })}
      onLongPress={() => confirmDeleteVehicle(item)}
    >
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
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDescription}>
            Modificado à: {getElapsedTimeFromUTC(item.createdAt)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.itemButton}
          onPress={() => goToVehicleBuild({ item })}
        >
          <AntDesign name="arrowright" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (result) {
    return (
      <View style={{ backgroundColor: COLORS.bg, height: "100%" }}>
        <View style={styles.container}>
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Image
              source={require("../assets/notification.gif")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.title}>
              Crie lembretes para os seus veiculos
            </Text>
          </View>
          <FlatList
            data={data.slice().sort((a, b) => b.createdAt - a.createdAt)}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            numColumns={2} 
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    );
  } else {
    return <NotAuthorized />;
  }
};

export default AlertsScreen;

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
  listContent: {
    paddingHorizontal: 16, 
    paddingTop: 12,
    paddingBottom: 50,
    justifyContent: "space-between",
    alignContent: "space-between",
    alignSelf: "flex-start",
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flexDirection: "column", 
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    width: (width - 50) / 2,
    marginLeft: 8,
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
