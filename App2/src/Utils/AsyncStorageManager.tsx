import AsyncStorage from '@react-native-async-storage/async-storage';
class AsyncStorageManager {
  async getItem(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) {
        console.warn(`No value found for key: ${key}`);
      }
      return value;
    } catch (error) {
      console.error(
        `Error getting item from AsyncStorage for key ${key}: ${error}`,
      );
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(`Successfully set item with key: ${key}`);
    } catch (error) {
      console.error(
        `Error setting item in AsyncStorage for key ${key}: ${error}`,
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Successfully removed item with key: ${key}`);
    } catch (error) {
      console.error(
        `Error removing item from AsyncStorage for key ${key}: ${error}`,
      );
    }
  }

  async clearAllStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('All keys have been removed from AsyncStorage.');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  }
}

export const apiStorage = new AsyncStorageManager();
