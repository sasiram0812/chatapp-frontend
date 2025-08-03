// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO0OGcTgPEIwyKFF-xScDvTT4PqaVQYao",
  authDomain: "chatapp-4dd1d.firebaseapp.com",
  projectId: "chatapp-4dd1d",
  storageBucket: "chatapp-4dd1d.appspot.com", // <-- corrected ".app" to ".appspot.com"
  messagingSenderId: "866662922664",
  appId: "1:866662922664:web:9561d4c442fa6b53c9859d",
  measurementId: "G-54SXNJT19T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // <-- this line is CRUCIAL
export default app;
