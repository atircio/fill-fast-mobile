import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, sendEmailVerification } from '../firebase';
import { COLORS } from '../src/theme/theme';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      // Cria o usuário com email e senha
      const userCredentials = await createUserWithEmailAndPassword(email, password);
      const user = userCredentials.user;

      // Envia o link de autenticação por email
      await sendEmailVerification(user);

      console.log('Link de autenticação enviado para o email:', email);
      // ...
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
      navigation.replace('Tab');
    }
  };



  // Restante do código...

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInWithGoogle()
      .then(() => {
        console.log('Logged in with Google');
        navigation.replace('Tab');
      })
      .catch(error => {
        alert(error.message);
        setLoading(false);
      });
  }

  // Handler para o login com Apple
const handleAppleSignIn = () => {
  // Implemente a lógica para o login com Apple aqui
  // Por exemplo, você pode chamar uma função de autenticação ou exibir um alerta de login com Apple não suportado
  console.log('Login com Apple');
};

// Handler para o login com Facebook
const handleFacebookSignIn = () => {
  // Implemente a lógica para o login com Facebook aqui
  // Por exemplo, você pode chamar uma função de autenticação ou abrir uma página da web para redirecionar para o login do Facebook
  console.log('Login com Facebook');
};



const handleLogin = async () => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;

    // Verifica se o email foi verificado
    if (!user.emailVerified) {
      throw new Error("Email não verificado. Por favor, verifique seu email antes de fazer login.");
    }

    const userInstance = new CurrentUser();
    await userInstance.insertUser(user);

    const retrievedUser = await getUser();
    LoginCredentialData.push(await retrievedUser);

    setLoading(false);
    navigation.replace('Tab');
  } catch (error) {
    console.log(error);
    alert(error.message);
    setLoading(false);
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
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText} >Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
            <Text style={styles.buttonRe}>Criar conta</Text>
          </TouchableOpacity>

    <View style={styles.socialButtonsContainer}>
  <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
    <Image source={require('../assets/google.png')} style={styles.socialLogo} />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
    <Image source={require('../assets/apple.png')} style={styles.socialLogo} />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignIn}>
    <Image source={require('../assets/facebook.png')} style={styles.socialLogo} />
  </TouchableOpacity>
</View>
        

        </View>

      </View>
    </View>
  );
};
export default SignInScreen;

const styles = StyleSheet.create({
  googleButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueWithGoogle: {
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 15,
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
  loginMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.dark,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#EAB963',
    minWidth: 80,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 20,
  },
  registerButton: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#EAB963',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 20, // Mesmo valor de borderRadius usado no registerButton
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    borderColor: 'white', // Cor da borda amarela
    borderWidth: 2, // Largura da borda
    backgroundColor: '#FDFDFD', // Cor interna da borda (branco suave)
  },

 
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  socialLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  
  socialButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },

  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
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

