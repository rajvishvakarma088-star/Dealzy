import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBk3jYvF4ob3w1dra3g7_c60EkFlaXjfcE",
  authDomain: "my-project-finance-dc248.firebaseapp.com",
  projectId: "my-project-finance-dc248",
  storageBucket: "my-project-finance-dc248.firebasestorage.app",
  messagingSenderId: "773233339831",
  appId: "1:773233339831:web:f2de5b79c307d699094c32",
};

const app = initializeApp(firebaseConfig);

/* Auth with persistence */

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };

/* Firestore */

export const db = getFirestore(app);