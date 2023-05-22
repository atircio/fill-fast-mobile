import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { AntDesign, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { COLORS } from '../src/theme/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import User from '../modules/mobileUser';


const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/profile-pic.png')} style={styles.profileImage} />
        <Text style={styles.email}>{User.email ? User[0].email : 'Faça Login'}</Text>
      </View>
      <View style={styles.separator} />

      {/* Lista de opções */}
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option}>
          <AntDesign name="staro" size={24} color="black" />
          <Text style={styles.optionText}>Postos Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <FontAwesome5 name="cog" size={24} color="black" />
          <Text style={styles.optionText}>Definições</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    flex: 1,
    alignItems: 'flex-start',


  },
  profileContainer: {
    marginTop: 40,

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  optionContainer: {
    padding: 10,
    width: '100%'

  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    padding: 10,
    width: '100%',
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 2,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
