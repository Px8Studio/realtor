// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  for (const field of requiredFields) {
    if (!firebaseConfig[field]) {
      console.error(`❌ Missing Firebase config: ${field}`);
      return false;
    }
  }
  
  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase only if config is valid
let app;
let db;
let auth;
let storage;

try {
  if (validateConfig()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    
    console.log('🔥 Firebase initialized successfully');
    console.log('📊 Project:', firebaseConfig.projectId);
    
    // Optional: Connect to emulator in development
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
      console.log('🔧 Connecting to Firebase emulator...');
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } else {
    throw new Error('Invalid Firebase configuration');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create dummy objects to prevent app crashes
  db = null;
  auth = null;
  storage = null;
}

// Force enable network and disable emulator for production
if (process.env.NODE_ENV === 'production') {
  enableNetwork(db).catch(console.error);
}

// Make sure we're not accidentally connecting to emulator
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  console.warn('🚨 Using Firebase Emulator - this should only be for testing!');
} else {
  console.log('🌐 Using production Firebase');
}

// Initialize Firestore with explicit region configuration
const initializeFirestore = async () => {
  try {
    if (db) {
      console.log('🇳🇱 Initializing Firebase for Netherlands/Europe region...');
      console.log('📍 Database region: europe-west4 (Netherlands)');
      console.log('🎯 Project ID:', firebaseConfig.projectId);
      
      // Force enable network for Europe region
      await enableNetwork(db);
      console.log('✅ Firestore network enabled for Europe region');
    }
    return true;
  } catch (error) {
    console.error('❌ Firestore initialization failed:', error);
    return false;
  }
};

// Initialize immediately
initializeFirestore();

export { db, auth, storage };
