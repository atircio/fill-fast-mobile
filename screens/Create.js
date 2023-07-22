import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../src/theme/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import User from '../modules/mobileUser';
import { CurrentUser, checkAsyncStorageData, getUser } from '../database/Database';
import { LoginCredentialData } from '../database/LoginCredential';


const Create = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nome, setName] = useState('');
    const [loading, setLoading] = useState(false);
  
    const navigation = useNavigation();
  
    const handleSignUp = async () => {
    
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          Alert.alert(
            'Erro',
            'A senha deve ter no mínimo 8 caracteres e conter pelo menos 1 letra maiúscula, 1 letra minúscula e 1 número.'
          );
          return;
        }
      
        if (password !== confirmPassword) {
          Alert.alert('Erro', 'As senhas não coincidem.');
          return;
        }
      
        try {
          setLoading(true);
          const userCredentials = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredentials.user;
      
          
          auth.languageCode = 'pt';
          auth.useDeviceLanguage();
      
          await user.sendEmailVerification();
          Alert.alert('Sucesso', 'Um email de verificação foi enviado para o seu endereço de email.');
      
          console.log('Registrado com:', user.email + user.name);
      
          const userInstance = new CurrentUser();
          await userInstance.insertUser(user);
      
          const retrievedUser = await getUser();
          LoginCredentialData.push(await retrievedUser);
      
          const userID = user.uid;
      
          await db.collection('users').doc(userID).set({
            name: nome,
            email: user.email
           
          });
      
          navigation.replace('SignInScreen', { email: user.email, password });
        } catch (error) {
          console.log(error);
      
     
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Erro', 'O email fornecido já está em uso. Tente fazer login ou use um email diferente.');
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Erro', 'O email fornecido é inválido. Verifique o formato do email digitado.');
          } else {
            Alert.alert('Erro', error.message);
          }
        } finally {
          setLoading(false);
        }
      };
      
      
  
    const goToSignScreen = () => {
      navigation.navigate('SignInScreen')
    }

    




    return (
        <ScrollView>
            <View style={{ backgroundColor: COLORS.bg, height: '100%' }}>
            <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Image
                    source={require('../assets/Signup.gif')}
                    style={{ width: 90, height: 90, backgroundColor: 'transparent' }}
                />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ marginTop: 40 }}>
                    <Text style={styles.loginMessage}>Crie uma conta na FillFast para melhor experiência</Text>

                    <TextInput
                        placeholder="Digite o Nome"
                        style={styles.input}
                        onChangeText={text => setName(text.trim())}
                    />



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

                <View style={{ marginTop: 20 }}>
                    <TextInput
                        placeholder="Repita a palavra-passe"
                        secureTextEntry={true}
                        style={styles.input}
                        onChangeText={text => setConfirmPassword(text)}
                    />
                </View>

                <View style={styles.separator} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={goToSignScreen}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                        <Text style={styles.buttonRe}>Criar conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>
        
    );
};

export default Create;

const styles = StyleSheet.create({
    continueWithGoogle: {
        color: COLORS.gold,
        textAlign: 'center',
        fontWeight: '700',
    },
    inputContainer: {
        marginTop: 40,
    },
    input: {
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 8,
        height: 50,
        marginBottom: 20,
        marginTop: 10,
        borderRadius: 8,

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
    loginMessage: {
        color: COLORS.dark,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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

