import { StyleSheet, Text, View, Animated, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapScreen';
import SplashScreen from './SplashScreen';
import VehicleScreen from './VehicleScreen';
import AlertsScreen from './AlertsScreen';
import AccountScreen from './AccountScreen';
import { } from '@expo/vector-icons'

const Tab = createBottomTabNavigator();



const Home = () => {
  return (
    <View>
      <Text>Tab</Text>
    </View>
  )
}



const TabsNavigator = () => {
  const opacity = React.useRef(new Animated.Value(1)).current;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MapScreen}
       


      />
      <Tab.Screen name="Veiculo" component={VehicleScreen} />
      <Tab.Screen name="Alertas" component={AlertsScreen} />
      <Tab.Screen name="Conta" component={AccountScreen} />

    </Tab.Navigator>
  )
}


export default TabsNavigator

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    padding: 2,
    left: 2,
    right: 2,
    bottom: 6,
    backgroundColor: '#F8FAFB',
    elevation: 0,
    borderRadius: 16,
    borderTopColor: 'transparent'

  }
})