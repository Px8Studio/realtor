// Firebase Configuration Checker
import { db } from '../firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

export const checkFirebaseConnection = async () => {
  const results = {
    connection: false,
    rules: false,
    indexes: false,
    errors: []
  };

  try {
    // Check if db is initialized
    if (!db) {
      throw new Error('Firebase database not initialized. Check your configuration.');
    }

    // Test basic connection
    const testRef = collection(db, 'listings');
    const testQuery = query(testRef, limit(1));
    await getDocs(testQuery);
    
    results.connection = true;
    console.log('✅ Firebase connection successful');
    
  } catch (error) {
    results.errors.push({
      type: 'connection',
      message: error.message,
      code: error.code
    });
    
    if (error.message.includes('not initialized')) {
      console.error('❌ Firebase Not Initialized:', error.message);
      results.errors.push({
        type: 'initialization',
        message: 'Firebase failed to initialize. Check your environment variables and Firebase project settings.'
      });
    } else if (error.code === 'permission-denied') {
      console.error('❌ Firestore Security Rules Error:', error.message);
      results.errors.push({
        type: 'rules',
        message: 'Firestore security rules are blocking access. Please check your Firebase Console.'
      });
    } else if (error.code === 'failed-precondition') {
      console.error('❌ Missing Firestore Indexes:', error.message);
      results.errors.push({
        type: 'indexes',
        message: 'Required Firestore indexes are missing. Check Firebase Console > Firestore > Indexes.'
      });
    } else {
      console.error('❌ Firebase Connection Error:', error);
    }
  }

  return results;
};

export const logFirebaseStatus = async () => {
  console.log('🔍 Checking Firebase Configuration...');
  
  // Check environment variables
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
  
  const missingVars = Object.entries(config)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
    
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ All environment variables present');
  console.log('📊 Project ID:', config.projectId);
  
  // Test connection
  const status = await checkFirebaseConnection();
  
  if (status.errors.length > 0) {
    console.log('❌ Firebase Issues Found:');
    status.errors.forEach(error => {
      console.log(`  - ${error.type}: ${error.message}`);
    });
    
    console.log('\n🔧 To fix these issues:');
    console.log('1. Check Firebase Console: https://console.firebase.google.com/');
    console.log('2. Verify Firestore Rules are deployed');
    console.log('3. Create required indexes (see Firebase rules.txt)');
    console.log('4. Ensure billing is enabled for your Firebase project');
  }
  
  // Check Firestore indexes
  const indexTests = [
    { name: 'User listings index', collection: 'listings', field: 'userRef' },
    { name: 'Type listings index', collection: 'listings', field: 'type' },
    { name: 'Offer listings index', collection: 'listings', field: 'offer' }
  ];
  
  for (const test of indexTests) {
    try {
      // These will fail if indexes don't exist
      const q = query(
        collection(db, test.collection),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      await getDocs(q);
      console.log(`✅ ${test.name}: OK`);
    } catch (error) {
      if (error.code === 'failed-precondition') {
        console.log(`❌ ${test.name}: MISSING INDEX`);
        console.log(`   Create index at: https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore/indexes`);
      } else {
        console.log(`⚠️  ${test.name}: ${error.message}`);
      }
    }
  }
  
  return status.connection;
};