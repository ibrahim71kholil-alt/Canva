// firebase-config.js

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// আপনার Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAvWIeD84boXfT4fEJaNl8HJGXEbK9SVXw",
  authDomain: "canva-access.firebaseapp.com",
  projectId: "canva-access",
  storageBucket: "canva-access.firebasestorage.app",
  messagingSenderId: "369166805582",
  appId: "1:369166805582:web:77a82e0596479c5c89711f"
};


// Firebase চালু
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export {
  auth,
  db,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  serverTimestamp
};
