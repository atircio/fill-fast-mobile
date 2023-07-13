import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Linking } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { CurrentUser, getUser } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';
import { LoginCredentialData } from '../database/LoginCredential';
import NotAuthorized from './NotAuthorized';
import Swiper from 'react-native-swiper';
import { db } from '../firebase'; // Import the Firestore database instance


const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const existingUser = await getUser();
      console.log(LoginCredentialData)
      setUser(existingUser);
    };

    fetchUser();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    const userWithEmail = LoginCredentialData.find((item) => item && item.uid);
    const currentUserID = userWithEmail ? userWithEmail.uid : null;
    console.log("++++++++++++++++++++++" + currentUserID)
    getUserFirebase(currentUserID)
  }, [])

  const FuelScreenCalc = () => {
    navigation.navigate('FuelCalculatorScreen');
  };


  const getUserFirebase = async (id) => {
    try {
      const doc = await db.collection('users').doc(id).get();
      if (doc.exists) {
        const user = doc.data();
        console.log(user);
        setData(user);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

=======
  const handleSendEmailVerification = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.sendEmailVerification();
        Alert.alert('Email de verificação enviado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível encontrar o usuário atual.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao enviar o email de verificação.');
    }
  };
  
  
>>>>>>> teste

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      LoginCredentialData.splice(0, LoginCredentialData.length);
      Alert.alert('Está sendo redirecionado para a tela principal')
      navigation.replace('WelcomeScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  const handlePasswordReset = async () => {
    try {
      await auth.sendPasswordResetEmail(user.email);
      Alert.alert('E-mail de recuperação de senha enviado com sucesso!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao enviar o e-mail de recuperação de senha.');
    }
  };

  const userWithEmail = LoginCredentialData.find((item) => item && item.email);
  const result = userWithEmail || null;


  if (result) {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/profile-pic.png')} style={styles.profileImage} />
          <Text style={styles.email}>{data ? data.name : 'Faça Login'}</Text>
        </View>

        <View style={styles.separator} />

        {/* Options list */}
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <AntDesign name="staro" size={24} color="black" />
            <Text style={styles.optionText}>Postos Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} >
            <FontAwesome5 name="cog" size={24} color="black" />
            <Text style={styles.optionText}>Definições</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.option} onPress={FuelScreenCalc}>
            <MaterialCommunityIcons name="fuel" size={24} color="black" />
            <Text style={styles.optionText}>Calcular Combustível</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.option} onPress={handlePasswordReset}>
          <AntDesign name="unlock" size={24} color="black" />
          <Text style={styles.optionText}>Alterar Senha</Text>
        </TouchableOpacity>


       
       
      </View>

    );
  } else {
    return (
      <NotAuthorized />
    );
  }


};

export default AccountScreen;

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  swiperContainer: {
    height: 100,

  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginRight: 5,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.gray,
    marginBottom: 20,
  },
  optionContainer: {
    paddingVertical: 10,
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  contactButton: {
    marginHorizontal: 10,
  },
});
