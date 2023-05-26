import AsyncStorage from '@react-native-async-storage/async-storage';


/*   */


export class Database {
  async selectUsers() {
    try {
      const data = await AsyncStorage.getItem('users');
      return JSON.parse(data) ?? [];
    } catch (error) {
      console.error('Error retrieving user data from AsyncStorage:', error);
      return [];
    }
  }

  async insertUser(user) {
    try {
      const existingUsers = await this.selectUsers();
      const newUsers = [...existingUsers, user];
      await AsyncStorage.setItem('users', JSON.stringify(newUsers));
      return user;
    } catch (error) {
      console.error('Error inserting user data into AsyncStorage:', error);
      return null;
    }
  }

  async selectVehicles(userId) {
    try {
      const data = await AsyncStorage.getItem(`vehicles_${userId}`);
      return JSON.parse(data) ?? [];
    } catch (error) {
      console.error('Error retrieving vehicle data from AsyncStorage:', error);
      return [];
    }
  }

  async insertVehicle(userId, vehicle) {
    try {
      const existingVehicles = await this.selectVehicles(userId);
      const newVehicles = [...existingVehicles, vehicle];
      await AsyncStorage.setItem(`vehicles_${userId}`, JSON.stringify(newVehicles));
      return vehicle;
    } catch (error) {
      console.error('Error inserting vehicle data into AsyncStorage:', error);
      return null;
    }
  }

  async selectReminders(vehicleId) {
    try {
      const data = await AsyncStorage.getItem(`reminders_${vehicleId}`);
      return JSON.parse(data) ?? [];
    } catch (error) {
      console.error('Error retrieving reminder data from AsyncStorage:', error);
      return [];
    }
  }

  async insertReminder(vehicleId, reminder) {
    try {
      const existingReminders = await this.selectReminders(vehicleId);
      const newReminders = [...existingReminders, reminder];
      await AsyncStorage.setItem(`reminders_${vehicleId}`, JSON.stringify(newReminders));
      return reminder;
    } catch (error) {
      console.error('Error inserting reminder data into AsyncStorage:', error);
      return null;
    }
  }

  // Métodos adicionais para deletar e atualizar dados...

}

export class CurrentUser {

  async checkUserExists() {
    try {
      const data = await AsyncStorage.getItem('user');
      const user = JSON.parse(data);
      return user ? user : null;
    } catch (error) {
      console.error('Error checking user data in AsyncStorage:', error);
      return null;
    }
  }
  async selectUser() {
    try {
      const data = await AsyncStorage.getItem('user');
      return JSON.parse(data) ?? {};
    } catch (error) {
      console.error('Error retrieving user data from AsyncStorage:', error);
      return {};
    }
  }

  async insertUser(user) {
    try {
      //const existingUsers = await this.selectUsers();
      const newUsers = user;
      await AsyncStorage.setItem('user', JSON.stringify(newUsers));
      return user;
    } catch (error) {
      console.error('Error inserting user data into AsyncStorage:', error);
      return null;
    }
  }

  


}

export const checkAsyncStorageData = async () => {
  try {
    const usersData = await AsyncStorage.getItem('users');
    const userData = await AsyncStorage.getItem('user');
    const vehiclesData = await AsyncStorage.getItem('vehicles_userId');
    const remindersData = await AsyncStorage.getItem('reminders_vehicleId');

    console.log('Users:', JSON.parse(usersData));
    console.log('User:', JSON.parse(userData));
    console.log('Vehicles:', JSON.parse(vehiclesData));
    console.log('Reminders:', JSON.parse(remindersData));
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
  }
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem('user');
    return JSON.parse(data) ?? null;
  } catch (error) {
    console.error('Error retrieving user data from AsyncStorage:', error);
    return null;
  }
}
