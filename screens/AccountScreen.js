import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Linking } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { CurrentUser, getUser } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';
import { LoginCredentialData } from '../database/LoginCredential';
import NotAuthorized from './NotAuthorized';
import Swiper from 'react-native-swiper';

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const existingUser = await getUser();
      if (existingUser && existingUser.email) {
        const userSnapshot = await db.collection('users').where('email', '==', existingUser.email).get();
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUser({ ...existingUser, name: userData.name });
        } else {
          setUser(existingUser);
        }
      } else {
        setUser(existingUser);
      }
    };

    fetchUser();
  }, []);

  /*useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      console.log(user);
      navigation.replace('NotAuthorized');
    }
  }, [user, navigation]);*/


  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      await AsyncStorage.removeItem('user');
      LoginCredentialData.splice(0, LoginCredentialData.length);
      Alert.alert('Está sendo redirecionado para a tela principal') // Remove user data from AsyncStorage
      navigation.replace('WelcomeScreen'); // Navigate back to the login or desired screen
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error if necessary
    }
  };



  const handlePasswordReset = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
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
          <Text style={styles.email}>{user ? user.name : 'Faça Login'}</Text>
        </View>

        <View style={styles.separator} />

        {/* Options list */}
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <AntDesign name="staro" size={24} color="black" />
            <Text style={styles.optionText}>Postos Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="cog" size={24} color="black" />
            <Text style={styles.optionText}>Definições</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.option} onPress={handlePasswordReset}>
          <AntDesign name="unlock" size={24} color="black" />
          <Text style={styles.optionText}>Recuperar Senha</Text>
        </TouchableOpacity>


        <Swiper
          style={styles.swiperContainer}
          autoplay
          autoplayTimeout={1000} GPS
          loop
        >
          <Image source={require('../assets/gps.gif')} style={{ width: 100, height: 100 }} />
        </Swiper>

        {/* Contact buttons */}
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactButton} onPress={''}>
            <FontAwesome5 name="whatsapp" size={24} color={COLORS.black} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={''}>
            <FontAwesome5 name="envelope" size={24} color={COLORS.black} />

          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={''}>
            <FontAwesome5 name="linkedin" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
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
