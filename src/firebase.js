// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
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

// Validate configuration
const validateConfig = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN', 
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missing);
    console.error('Please check your .env.local file');
    return false;
  }
  
  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase only if config is valid
let app;
let db;

try {
  if (validateConfig()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    
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
  // Create a dummy db object to prevent app crashes
  db = null;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export { db };
