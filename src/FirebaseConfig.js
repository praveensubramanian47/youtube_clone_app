import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdY38PrXixJcxCSd1Yi1cvap2v6XCrGu8",
  authDomain: "clone-1e6f8.firebaseapp.com",
  projectId: "clone-1e6f8",
  storageBucket: "clone-1e6f8.appspot.com",
  messagingSenderId: "985266038733",
  appId: "1:985266038733:web:eba2de8e67fe716871c684",
  measurementId: "G-QEQ1QKVG5X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
