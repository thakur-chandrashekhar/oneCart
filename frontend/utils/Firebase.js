import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginonecart-7ddbb.firebaseapp.com",
  projectId: "loginonecart-7ddbb",
  storageBucket: "loginonecart-7ddbb.firebasestorage.app",
  messagingSenderId: "1010679117710",
  appId: "1:1010679117710:web:a6e6316067b3f2233e96df",
  measurementId: "G-J8LNZ7KW4B"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider,}

