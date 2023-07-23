import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { COLORS } from "../src/theme/theme";
import { Picker } from "@react-native-picker/picker"; // Import the Picker from the correct package

const FuelCalculatorScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tankCapacity, setTankCapacity] = useState("");
  const [desiredLiters, setDesiredLiters] = useState("");
  const [desiredPrice, setDesiredPrice] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("Gasolina");

  const fuelData = [{ id: 1, type: "CALCULAR", price: 160 }];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => openModal(item)}
    >
      <Text style={styles.itemText}>{item.type}</Text>
    </TouchableOpacity>
  );

  const openModal = (item) => {
    setModalVisible(true);
    setTankCapacity("");
    setDesiredLiters("");
    setDesiredPrice(item.price.toString());
    setSelectedFuel(item.type);
  };

  const calculatePrice = () => {
    const liters = parseFloat(desiredLiters);
    const price = parseFloat(desiredPrice);

    if (liters && price) {
      return (liters * price).toFixed(2);
    }
    return "";
  };

  const calculateLiters = () => {
    const price = parseFloat(desiredPrice);
    if (price > 0) {
      const liters = price / (selectedFuel === "Gasolina" ? 300 : 160);
      return liters.toFixed(2);
    }
    return "";
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={fuelData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 100 }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calcular Combustível</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Litros desejados:</Text>
              <TextInput
                style={styles.input}
                value={desiredLiters}
                onChangeText={setDesiredLiters}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Preço (por litro):</Text>
              <TextInput
                style={styles.input}
                value={desiredPrice}
                onChangeText={setDesiredPrice}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.totalPriceLabel}>
              Preço total: {calculatePrice()}Kz
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FuelCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  fuelPicker: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    marginBottom: 20,
  },

  itemContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
  },
  itemText: {
    color: COLORS.white,
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: "center",
  },
});
