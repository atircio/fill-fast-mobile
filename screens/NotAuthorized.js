import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../src/theme/theme'
import { useNavigation } from '@react-navigation/native';

const NotAuthorized = () => {
  const navigation = useNavigation();

  const Press = () => {
    navigation.replace('WelcomeScreen')
  }

  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.bg,
      alignItems: 'center',
    }}>
      <View>
        <Image
          source={require('../assets/401.gif')}
          style={styles.itemImage}
        />
      </View>
      <View style={{ alignItems: 'center', width: '75%', justifyContent: 'center' }}>
        <Text style={{fontWeight: 'bold', fontSize: 25, marginTop: 20, marginBottom: 20,}} >Oops! não autorizado.</Text>
        <Text style={styles.textInform}>Precisa criar uma conta ou fazer</Text>
        <Text style={styles.textInform}>login para utilizar está funcionalidade.</Text>
        <TouchableOpacity style={{
              backgroundColor: COLORS.brown,
              minWidth: 100,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignItems: 'center', marginTop: 30
        }}>
          <Text style={{color : COLORS.white}}
          onPress={Press}
          >Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
      
}

export default NotAuthorized

const styles = StyleSheet.create({
  itemImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  textInform: {
    color: COLORS.grey
  }
})