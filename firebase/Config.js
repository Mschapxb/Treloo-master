import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {
  getDatabase,
  ref,
  update,
  remove,
  push,
  set,
  get,
} from 'firebase/database';

// Uncomment and complete the config details
// const firebaseConfig = {
//   apiKey: 
//   authDomain: 
//   databaseURL: 
//   projectId: 
//   storageBucket: 
//   messagingSenderId:
//   appId: 
// };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const handleEdit = async (uri, data) => {
  try {
    const dbRef = ref(db, uri);
    await update(dbRef, data);
    console.log('Update successful');
  } catch (error) {
    console.error('Error updating data: ', error);
  }
};

const handleDelete = async (uri) => {
  try {
    const dbRef = ref(db, uri);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      await remove(dbRef);
      console.log('Data removal completed');
    } else {
      console.warn('No data at specified path');
    }
  } catch (error) {
    console.error('Error deleting data: ', error);
  }
};

const handleAdd = async (uri, data) => {
  try {
    const newRef = push(ref(db, uri));
    await set(newRef, data);
    console.log('Data added successfully');
  } catch (error) {
    console.error('Error adding data: ', error);
  }
};

export { app, auth, handleEdit, handleDelete, handleAdd };
