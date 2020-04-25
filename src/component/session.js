import {AsyncStorage} from 'react-native';

interface ISession {
  persistSingleData: (string, string) => boolean;
  persistMultiData: (Array<Array<string>>) => boolean;
  fetchSingleData: (string) => Object;
  fetchMultiData: (Array<string>) => Object;
  removeSingleData: (string) => boolean;
  removeMultiData: (Array<string>) => boolean;
  checkItemEmpty: (string) => boolean;
}

class Session implements ISession {
  persistSingleData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.log('Error Store Single Data Session = ' + error);
      return false;
    }
  };

  persistMultiData = async (data) => {
    try {
      await AsyncStorage.multiSet(data);
      return true;
    } catch (error) {
      console.log('Error Store Multiple Data Session = ' + error);
      return false;
    }
  };

  fetchSingleData = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log('Error Fetch Single Data Session = ' + error);
    }
  };

  fetchMultiData = async (keys) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.log('Error Fetch Multiple Data Session = ' + error);
    }
  };

  removeSingleData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log('Error Remove Single Data Session = ' + error);
      return false;
    }
  };

  removeMultiData = async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.log('Error Remove Multiple Data Session = ' + error);
      return false;
    }
  };

  checkItemEmpty = (key) => {
    try {
      return this.fetchSingleData(key) === null;
    } catch (error) {
      console.log('Error Check Item = ' + error);
      return true;
    }
  };
}

export default Session;
