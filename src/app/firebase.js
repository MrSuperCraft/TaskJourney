// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore } from "firebase/firestore";
import { getStorage } from '@firebase/storage'




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage(app);

export const verifyIdToken = (token) => {
    return auth.verifyIdToken(token);
};




export { app, auth, db, storage };  // Export app and auth for use in other modules



