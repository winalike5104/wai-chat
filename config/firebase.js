import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKutAIM8JNqz5vRhOqNEcseptvDOk7Kpw",
  authDomain: "entarome-15d8a.firebaseapp.com",
  projectId: "entarome-15d8a",
  storageBucket: "entarome-15d8a.appspot.com",
  messagingSenderId: "779364504573",
  appId: "1:779364504573:web:4c76e66828cfbcc8b2ff94",
  measurementId: "G-E8LDCESXK3"
};

initializeApp(firebaseConfig);