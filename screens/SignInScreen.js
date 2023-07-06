import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../src/theme/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import User from '../modules/mobileUser';
import { CurrentUser, checkAsyncStorageData, getUser } from '../database/Database';
import { LoginCredentialData } from '../database/LoginCredential';
const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const goToSignIn = () => {
    navigation.navigate('SignInScreen');
  };

  const goToCreateAccountScreen = () => {
    navigation.navigate('createAccountScreen');
  };

  const handleSignUp = async () => {
    try {
      // Criar a conta de usuário
      const userCredentials = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredentials.user;

      console.log('Registered with:', user.email);

      // Sucesso na criação da conta
      Alert.alert('Conta de usuário criada com sucesso!');

      navigation.replace('Tab');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      // Fazer o login do usuário
      const userCredentials = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredentials.user;

      console.log('Logged in with:', user.email);

      navigation.replace('Tab');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      // Enviar e-mail de recuperação de senha
      if (email) {
        await auth.sendPasswordResetEmail(email);
        Alert.alert('E-mail de recuperação de senha enviado com sucesso!');
      } else {
        Alert.alert('Por favor, insira um e-mail válido.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao enviar o e-mail de recuperação de senha.');
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.bg, height: '100%' }}>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Image source={require('../assets/ML.gif')} style={{ width: 250, height: 250 }} />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ marginTop: 40 }}>
          <Text style={styles.loginMessage}>Faça login na FillFast para melhor experiência</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={text => setEmail(text.trim())}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <TextInput
            placeholder="Palavra-passe"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={handlePasswordReset}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText} >Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={goToCreateAccountScreen}>
            <Text style={styles.buttonRe}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  continueWithGoogle: {
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: '700'
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    height: 50,
  },
  forgotPassword: {
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: COLORS.lightGray,
    marginTop: 10,
    marginBottom: 2,
  },
  continueWithGoogle: {
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 15
  },
  loginMessage: {
    color: COLORS.dark,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  loginButton: {
    backgroundColor: '#EAB963',
    minWidth: 100,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#EAB963',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#F5F7F9',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRe: {
    color: '#EAB963',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
