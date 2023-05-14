import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../src/theme/theme';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session'

/*type AuthResponse = {
  params: {
    access_token: string
  }
}*/


const SignInScreen = () => {
  const navigation = useNavigation();

  async function handleGoogleSignIn(){
    try {
      const CLIENT_ID = "223371228008-i1smj6f8vv10utk30q61rt1d5ssdolif.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@atircio/fill-fast";
      const SCOPE = encodeURI("profile email");
      const RESPONSE_TYPE = "token";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;


      const result = await AuthSession.startAsync({ authUrl });
    //console.log(result.type, result.params);


    } catch (error) {
      
    }
  }
  

  const Press = () => {
    handleGoogleSignIn();
  }

  /*async function handleGoogleSignIn(){
    try {

      const CLIENT_ID = "223371228008-i1smj6f8vv10utk30q61rt1d5ssdolif.apps.googleusercontent.com";
      const REDIRECT_URI = "";
      const SCOPE = "";
      const RESPONSE_TYPE = "";

      const authUrl= `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

      
    } catch (error) {
      console.log(error)
      
    }
  }
*/
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
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity>
          <Text style={styles.continueWithGoogle} onPress={Press}>Continuar com Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
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
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginTop: 40,
    marginBottom: 20,
  },
  continueWithGoogle: {
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: '700'
  },
  loginMessage: {
    color: COLORS.dark,
    fontWeight: 'bold',
    marginBottom: 20,
  },

});
