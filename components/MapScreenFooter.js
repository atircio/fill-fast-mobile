import React from 'react';
import { StyleSheet, View } from 'react-native';

const MapScreenFooter = () => {
  return (
    <View style={styles.footer}>
      {/* Conteúdo da View */}
    </View>
  );
};

export default MapScreenFooter;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 1,
  },
});
