import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfA7-QusjQzU3sKdkRUUFaiYdxtRGedYw",
  authDomain: "cleanupmeet-26ae7.firebaseapp.com",
  projectId: "cleanupmeet-26ae7",
  storageBucket: "cleanupmeet-26ae7.appspot.com",
  messagingSenderId: "925966602841",
  appId: "1:925966602841:web:452b1b7e81685133ac5748",
  measurementId: "G-KD5NYK09PH",
};

export const firebaseAppObject = initializeApp(firebaseConfig);
export const firebaseAuthObject = getAuth(firebaseAppObject);
