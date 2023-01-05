import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const nwitter_firebase = initializeApp(firebaseConfig);
const nwitter_firebase_auth = getAuth(nwitter_firebase);
const nwitter_firebase_firestore = getFirestore(nwitter_firebase);
const nwitter_firebase_storage = getStorage(nwitter_firebase, 'gs://nwitter-504b3.appspot.com');

export { nwitter_firebase_auth, nwitter_firebase_firestore, nwitter_firebase_storage };
