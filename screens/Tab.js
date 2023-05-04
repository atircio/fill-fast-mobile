import { StyleSheet, Text, View, Animated, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapScreen';
import SplashScreen from './SplashScreen';
import VehicleScreen from './VehicleScreen';
import AlertsScreen from './AlertsScreen';
import AccountScreen from './AccountScreen';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { COLORS } from '../src/theme/theme';

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
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={styles.tabScreen}
            >
              <Ionicons
                name={focused ? 'md-navigate-circle' : 'md-navigate-circle-outline'}
                size={focused ? 35 : 30}
                color={focused ? COLORS.primary : COLORS.dark}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Veiculo"
        component={VehicleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={styles.tabScreen}
            >
              <Ionicons
                name={focused ? 'car-sport' : 'car-sport-outline'}
                size={focused ? 30 : 30}
                color={focused ? COLORS.primary : COLORS.dark}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreen}
            >
              <Ionicons
                name={focused ? 'notifications-sharp' : 'notifications-outline'}
                size={focused ? 30 : 30}
                color={focused ? COLORS.primary : COLORS.dark}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Conta"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreen}
            >

              <FontAwesome5
                name={focused ? 'user-alt' : 'user'}
                size={focused ? 25 : 25}
                color={focused ? COLORS.primary : COLORS.dark}
              />
            </View>
          ),
        }}
      />

    </Tab.Navigator>
  )
}


export default TabsNavigator

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: '10%',
    padding: 2,
    left: 2,
    right: 2,
    bottom: 2,
    backgroundColor: '#F8FAFB',
    elevation: 0,
    borderRadius: 16,
    borderTopColor: 'transparent',
    justifyContent: 'center',
    alignContent: 'space-between',

  },
  tabScreen: {
    borderColor: COLORS.dark,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    padding: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  }

})