import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapScreen';
import SplashScreen from './SplashScreen';

const Tab = createBottomTabNavigator(); 

const TabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={SplashScreen} />
    </Tab.Navigator>
  )
}
  

export default TabsNavigator

const styles = StyleSheet.create({})