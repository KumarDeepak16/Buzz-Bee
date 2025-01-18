import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyDhFf82PmDvbItOCukQOphwqdXa2_1G7Nk",
    authDomain: "buzz-6d54b.firebaseapp.com",
    projectId: "buzz-6d54b",
    storageBucket: "buzz-6d54b.appspot.com",
    messagingSenderId: "630443321410",
    appId: "1:630443321410:web:4578dc955515c56b9325db",
    measurementId: "G-JQ6B37SPJJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);