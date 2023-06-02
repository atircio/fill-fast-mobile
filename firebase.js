// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import the getFirestore function*/

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1elJaTMHC0I1_IyFlt4x31_lu-AoB_Vc",
  authDomain: "fillfast-385014.firebaseapp.com",
  projectId: "fillfast-385014",
  storageBucket: "fillfast-385014.appspot.com",
  messagingSenderId: "223371228008",
  appId: "1:223371228008:web:f2758c8cf5952006ca5cdd",
  measurementId: "G-T5NN3P8XHM"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


export { auth, db, storage, firebase }; // Export the Firestore instance