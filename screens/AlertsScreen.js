import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LoginCredentialData } from '../database/LoginCredential';
import NotAuthorized from './NotAuthorized';

const AlertsScreen = () => {

  const userWithEmail = LoginCredentialData.find((item) => item && item.email);
  const result = userWithEmail || null;

  if (result) {
    return (
      <View>
        <Text>AlertsScreen</Text>
      </View>
    )
  }else{
    return(<NotAuthorized/>)
  }


}

export default AlertsScreen

const styles = StyleSheet.create({

})