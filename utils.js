import AsyncStorage from '@react-native-community/async-storage';

async function storeItem(name, item) {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(item))
      .then((res) => {
        return res;
      })
      .catch((err) => console.warn(err));
  } catch (err) {
    return err;
  }
}

async function getItem(name) {
  try {
    let item = await AsyncStorage.getItem(name);
    if (item !== null) return JSON.parse(item);
    else return null;
  } catch (err) {
    return err;
  }
}

async function removeItem(name) {
  try {
    const item = await AsyncStorage.getItem(name);
    if (item !== null) await AsyncStorage.removeItem(name);
    else return new Error('Item does not exists');
  } catch (err) {
    return err;
  }
}

export {getItem, storeItem, removeItem};
