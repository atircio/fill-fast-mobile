import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../src/theme/theme'
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../database/Database';
import { LoginCredentialData } from '../database/LoginCredential';


const WelcomeScreen = () => {
  const navigation = useNavigation();

  const Press = () => {
    navigation.replace('Tab')
  }
  const goToSignIn = () => {
    navigation.navigate('SignInScreen')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const existingUser = await getUser();
      console.log(existingUser)
      LoginCredentialData.push(await existingUser)
    };

    fetchUser();
  }, []);


  return (
    <View style={{
      backgroundColor: COLORS.bg, height: '100%'
    }}>
      <View style={{ backgroundColor: COLORS.bg, height: '65%' }}>
        <Image
          style={styles.paImage}
          source={
            require('../assets/welcome.jpg')
          }
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.mainText}>
          Encontre o posto mais{'\n'} próximo com o FillFast
        </Text>
        <TouchableOpacity style={{ marginTop: 15, backgroundColor: COLORS.brown, padding: 15, borderRadius: 30, paddingHorizontal: 40 }} onPress={Press}>
          <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Obter Direção</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{color: COLORS.grey,marginTop: 8, textDecorationLine: 'underline'}} onPress={goToSignIn}>Ou faça login</Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  paImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,


  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  mainText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },

})