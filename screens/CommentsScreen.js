import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../src/theme/theme";
import { useNavigation } from "@react-navigation/native";
import { LoginCredentialData } from "../database/LoginCredential";
import { db, auth, storage, firebase } from "../firebase";
import Icon from "react-native-vector-icons/FontAwesome";

const CommentsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const { place_id } = route.params;

  useEffect(() => {
    getComments();
  }, []);

  // Função de validação do campo comment
  const validateComment = (comment) => {
    // Verifica se o comentário está vazio
    if (!comment.trim()) {
      Alert.alert("Erro de validação", "O comentário não pode estar vazio.");
      return false;
    }

    // Verifica se o comentário tem pelo menos 7 caracteres
    if (comment.length < 7) {
      Alert.alert(
        "Erro de validação",
        "O comentário deve conter pelo menos 7 caracteres."
      );
      return false;
    }

    // Verifica se o comentário não possui mais de 1 espaço entre as palavras
    const words = comment.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (words[i].trim().length === 0) {
        // Ignora espaços em branco extras entre palavras
        continue;
      }
      if (words[i].includes("  ")) {
        Alert.alert(
          "Erro de validação",
          "O comentário não pode conter mais de 1 espaço entre as palavras."
        );
        return false;
      }
    }

    return true;
  };
  const [data, setData] = useState([]);

  const saveDataToFirestore = async () => {
    // Validação do campo comment
    if (!validateComment(comment)) {
      return; // Interrompe a função de salvamento se a validação falhar
    }

    try {
      const userWithEmail = LoginCredentialData.find(
        (item) => item && item.email
      );
      const currentUserID = userWithEmail ? userWithEmail.uid : null;

      if (!currentUserID) {
        Alert.alert("Erro: Usuário não autenticado");
        return;
      }

      const currentUTC = firebase.firestore.Timestamp.now();

      const ref = db
        .collection("comments")
        .doc(place_id)
        .collection("dataComments")
        .doc();

      await ref.set({
        id: ref.id,
        currentUserID,
        comment,
        selectedStars,
        createdAt: currentUTC,
      });

      Alert.alert("Dados salvos com sucesso!");
      closeCommentModal();
      getComments();
    } catch (error) {
      Alert.alert("Erro ao salvar os dados: ", error.message);
      closeCommentModal();
    }
  };

  const getComments = async () => {
    try {
      const querySnapshot = await db
        .collection("comments")
        .doc(place_id)
        .collection("dataComments")
        .get();

      /* if (!querySnapshot.exists) {
        console.log("hjwsbhj")
        setData([]);
        setLoading(false);
        return;
      }*/

      const aux = [];

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const commentData = doc.data();
          const userSnapshot = await db
            .collection("users")
            .doc(commentData.currentUserID)
            .get();
          const userData = userSnapshot.data();
          aux.push({ ...commentData, userData });
        })
      );

      setData(aux);
      setLoading(false); // Define loading como false após os dados serem buscados
    } catch (error) {
      console.error("Error getting comments: ", error);
      setLoading(false); // Define loading como false também em caso de erro
    }
  };

  const renderCommentItem = ({ item }) => {
    if (!item) {
      return (
        <View style={styles.commentItemContainer}>
          <Text style={styles.noCommentsText}>Sem comentário</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity>
        <View style={styles.commentItemContainer}>
          <View style={styles.commentAvatar} />
          <View style={styles.commentTextContainer}>
            {item.userData && (
              <Text style={[styles.commentUserName, { color: COLORS.dark }]}>
                {item.userData.name}
              </Text>
            )}
            {item.selectedStars > 0 ? (
              <Text style={styles.commentStars}>
                {Array(item.selectedStars)
                  .fill()
                  .map((_, index) => (
                    <Icon key={index} name="star" style={styles.starIcon} />
                  ))}
              </Text>
            ) : (
              <Text style={styles.commentStars}>Sem estrelas</Text>
            )}
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const openCommentModal = () => {
    setShowModal(true);
  };

  const closeCommentModal = () => {
    setShowModal(false);
  };

  const handleStarPress = (starIndex) => {
    setSelectedStars(starIndex + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações do Posto</Text>
      <Image
        source={require("../assets/imgDefaultGas.jpg")}
        style={styles.image}
      />
      {data.length === 0 && !loading ? (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>Sem comentários</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : null
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text
            style={[styles.buttonText, styles.cancelButtonText]}
            onPress={() => {
              navigation.goBack();
            }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginLeft: 10 }]}
          onPress={openCommentModal}
        >
          <Text style={styles.buttonText}>Comentar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deixe a sua avaliação</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.starButton}
                  onPress={() => handleStarPress(index)}
                >
                  <Text
                    style={[
                      styles.starText,
                      selectedStars > index && styles.starTextFilled,
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Deixe o seu comentário"
              multiline
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeCommentModal}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={saveDataToFirestore}
              >
                <Text style={styles.buttonText}>Comentar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 15,
  },
  flatListContainer: {
    paddingBottom: 80,
  },
  commentItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUserName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentStars: {
    color: COLORS.secondary,
    marginBottom: 5,
  },
  commentText: {
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  starButton: {
    marginRight: 5,
  },
  starText: {
    fontSize: 24,
    color: COLORS.dark,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  starTextFilled: {
    color: COLORS.gold,
  },
  starIcon: {
    color: COLORS.gold,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCommentsText: {
    color: COLORS.dark,
    fontStyle: "italic",
  },
});
