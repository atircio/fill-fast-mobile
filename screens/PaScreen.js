import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PaScreen = ({ route }) => {
  const { id, name, rating, reviews, imageReference, address } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>PaScreen</Text>
      <Text>ID: {id}</Text>
    </View>
  );
};

export default PaScreen;

const styles = StyleSheet.create({});
