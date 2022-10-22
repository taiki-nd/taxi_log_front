import { initializeApp } from "firebase/app";
import { firebase } from "../utils/constHide";

const firebaseConfig = {
  apiKey: firebase.apiKey,
  authDomain: firebase.authAdmin,
  projectId: firebase.projectId,
  storageBucket: firebase.storageBucket,
  messagingSenderId: firebase.messagingSenderId,
  appId: firebase.appId,
};

export const app = initializeApp(firebaseConfig);