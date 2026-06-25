import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
console.log(firebaseConfig.storageBucket,'0000')
const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);
if (!hasFirebaseConfig) {
  console.warn("Firebase configuration is incomplete. Firebase services will not be initialized.");
}

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db: Firestore | null = hasFirebaseConfig ? getFirestore(app) : null;
export const auth: Auth | null = hasFirebaseConfig ? getAuth() : null;

export const isFirebaseReady = () => Boolean(db && auth);
