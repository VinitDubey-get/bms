// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9C18HBOQaelyNrhl4n2KplTMFLV2pimY",
  authDomain: "bihar-math-society.firebaseapp.com",
  projectId: "bihar-math-society",
  storageBucket: "bihar-math-society.firebasestorage.app",
  messagingSenderId: "789067667736",
  appId: "1:789067667736:web:cb9cae7fc9610e0d47a66d",
  measurementId: "G-2XXPZ6BZYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);