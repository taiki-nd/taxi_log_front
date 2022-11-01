import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, onAuthStateChanged } from "firebase/auth";
import { firebase } from "../utils/constHide";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getReactNativePersistence } from 'firebase/auth/react-native'

const firebaseConfig = {
  apiKey: firebase.apiKey,
  authDomain: firebase.authAdmin,
  projectId: firebase.projectId,
  storageBucket: firebase.storageBucket,
  messagingSenderId: firebase.messagingSenderId,
  appId: firebase.appId,
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

// Auth
export const auth = getAuth();

/**
 * getUid
 */
export const getUid = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
}