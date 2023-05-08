import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , SafeAreaView} from 'react-native';
import MapScreen from './screens/MapScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MapView from 'react-native-maps';
import SplashScreen from './screens/SplashScreen';
import Tab from './screens/Tab';
import PaScreen from './screens/PaScreen';

export default function App() {
  const Stack = createNativeStackNavigator();


  return (

    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName='PaScreen'>
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
    backgroundColor: '#fff',
textAlign:'center'
  },
  map: {
    width: '100%',
    height: '100%',
  },
});