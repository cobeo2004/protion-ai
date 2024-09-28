// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ-dzOt6hFNcUKqGqgzMuVy8Gf3QGD2Bg",
  authDomain: "protion-ai.firebaseapp.com",
  projectId: "protion-ai",
  storageBucket: "protion-ai.appspot.com",
  messagingSenderId: "649124360896",
  appId: "1:649124360896:web:da91fb95719f4508127325",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
