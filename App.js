import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapScreen from './screens/MapScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {decode, encode} from 'base-64'


import MapView from 'react-native-maps';
import SplashScreen from './screens/SplashScreen';
import Tab from './screens/Tab';
import PaScreen from './screens/PaScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import TravelScreen from './screens/TravelScreen';
import VehicleBuild from './screens/VehicleBuild';
import NotAuthorized from './screens/NotAuthorized';
import { COLORS } from './src/theme/theme';
import AlertsBuild from './screens/AlertsBuild';
import AlertsList from './screens/AlertsList';
import Ab from './screens/Ab';
import CommentsScreen from './screens/CommentsScreen';


if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default function App() {
  const Stack = createNativeStackNavigator();


  return (

    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName='WelcomeScreen'>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PaScreen"
            component={PaScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CommentsScreen"
            component={CommentsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NotAuthorized"
            component={NotAuthorized}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Ab"
            component={Ab}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VehicleBuild"
            component={VehicleBuild}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TravelScreen"
            component={TravelScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AlertsList"
            component={AlertsList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AlertsBuild"
            component={AlertsBuild}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tab"
            component={Tab}
            options={{
              headerShown: false,
            }}
          />
          
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
textAlign:'center'
  },
  map: {
    width: '100%',
    height: '100%',
  },
});