import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';

// Other import statements...

const Alerts = () => {
  const handleAlertsMenuPress = () => {
    console.log('AlertsScreen menu pressed');
    // Navigate to AlertsScreen or perform any other action
  };

  const handleSecondMenuPress = () => {
    console.log('Second menu pressed');
    // Perform the action for the second menu
  };

  const renderFirstMenu = () => (
    <TouchableOpacity style={styles.menuItem} onPress={handleAlertsMenuPress}>
      <Text style={styles.menuItemText}>AlertsScreen</Text>
    </TouchableOpacity>
  );

  const renderSecondMenu = () => (
    <TouchableOpacity style={styles.menuItem} onPress={handleSecondMenuPress}>
      <Text style={styles.menuItemText}>Second Menu</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Swipeable rightButtons={[renderFirstMenu(), renderSecondMenu()]}>
        <View style={styles.content}>
          <Text>Swipeable Screen Content</Text>
        </View>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
  },
  menuItemText: {
    color: '#FFFFFF',
  },
});

export default Alerts;
