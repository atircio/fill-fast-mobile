import { StyleSheet, Text, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';



const SplashScreen = () => {
  const navigation = useNavigation();

  const [authoLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAuthLoaded(true)
    }, 5000)
  },[]);

  useEffect(() =>{
    if(authoLoaded){
      navigation.replace('MapScreen')
    }
  }, [authoLoaded])

  return (
    <View style={styles.root}>
    <Lottie source={require('../assets/SplashScreen.json')} autoPlay loop />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  root: {
    flex:1,
    alignItems: 'center',
    justifyContent : 'center'
  }

})