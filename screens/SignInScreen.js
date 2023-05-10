import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../src/theme/theme'

const SignInScreen = () => {
  return (
    <View style={{backgroundColor: COLORS.bg, height:'100%'}}>
      <View style={{alignItems:'center', marginTop: 40}}>
        <Image
          source={require('../assets/ML.gif')}
          style={{ width: 250, height: 250 }}
        />
      </View>

    </View>
  )
}

export default SignInScreen

const styles = StyleSheet.create({})