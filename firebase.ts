import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { AwardIcon } from "lucide-react";
const firebaseConfig = {
    apiKey: "AIzaSyDpGXAoWM85EQSLobqnCz70FtK7u6bdmuA",
    authDomain: "main-project-24.firebaseapp.com",
    projectId: "main-project-24",
    storageBucket: "main-project-24.appspot.com",
    messagingSenderId: "232954289470",
    appId: "1:232954289470:web:19b5eee4d110b25200a06f"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const storage = getStorage(app);
export { storage, firestore };
