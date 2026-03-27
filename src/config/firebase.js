import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgqACb5MWiN3PKHSyn3rtHLMG8oi5uhKE",
  authDomain: "wordlist-23e83.firebaseapp.com",
  projectId: "wordlist-23e83",
  storageBucket: "wordlist-23e83.firebasestorage.app",
  messagingSenderId: "699361820409",
  appId: "1:699361820409:web:88db41af00a65407b32c28",
  measurementId: "G-8YPCFBPJ7W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
