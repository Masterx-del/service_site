import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, update, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCQ8323U6o9UkptArtel1YNtV-BgaZQJQ",
  authDomain: "provider-46c14.firebaseapp.com",
  databaseURL: "https://provider-46c14-default-rtdb.firebaseio.com",
  projectId: "provider-46c14",
  storageBucket: "provider-46c14.firebasestorage.app",
  messagingSenderId: "1032460066158",
  appId: "1:1032460066158:web:8a52fb3c0651169c55f57f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, ref, set, get, child, update, push, onValue };
