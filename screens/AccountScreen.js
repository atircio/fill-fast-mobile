import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { CurrentUser, getUser } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';
import { LoginCredentialData } from '../database/LoginCredential';
import NotAuthorized from './NotAuthorized';


const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const existingUser = await getUser();
      console.log(LoginCredentialData)
      setUser(existingUser);
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
      await auth.signOut(); // Sign out from Firebase
      await AsyncStorage.removeItem('user');
      LoginCredentialData.splice(0, LoginCredentialData.length);
      Alert.alert('Está sendo redirecionado para a tela principal') // Remove user data from AsyncStorage
      navigation.replace('WelcomeScreen'); // Navigate back to the login or desired screen
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error if necessary
    }
  };

  const userWithEmail = LoginCredentialData.find((item) => item && item.email);
  const result = userWithEmail || null;


  if (result) {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/profile-pic.png')} style={styles.profileImage} />
          <Text style={styles.email}>{user ? user.email : 'Faça Login'}</Text>
          <Text style={styles.email}>{user ? user.email : 'Faça Login'}</Text>
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
      </View>
    );
  }else{
    return (
      <NotAuthorized />
    );
  }


};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    flex: 1,
    alignItems: 'flex-start',
  },
  profileContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  optionContainer: {
    padding: 10,
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    padding: 10,
    width: '100%',
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 2,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
