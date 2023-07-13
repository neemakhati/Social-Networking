import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// add firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZuWuz0h-uAhFrssQQm3Mbi6StZtMeiUs",

  authDomain: "eventsnet-fa0f0.firebaseapp.com",

  projectId: "eventsnet-fa0f0",

  storageBucket: "eventsnet-fa0f0.appspot.com",

  messagingSenderId: "901264439913",

  appId: "1:901264439913:web:b0c1eb2fcfefe9ecfd40f8"

};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
