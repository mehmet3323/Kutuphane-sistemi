import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAN5jVcwGP-fEPGmUq_Ids1M6JovJNzca8",
  authDomain: "kutuphane-14257.firebaseapp.com",
  projectId: "kutuphane-14257",
  storageBucket: "kutuphane-14257.firebasestorage.app",
  messagingSenderId: "584699718413",
  appId: "1:584699718413:android:708bc18056c5bd1c81de44"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
