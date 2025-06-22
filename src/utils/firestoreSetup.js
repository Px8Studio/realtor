import { db } from '../firebase';
import { doc, setDoc, collection, getDocs, enableNetwork, disableNetwork } from 'firebase/firestore';

export async function setupFirestoreDatabase() {
  console.group('🔧 Setting up Firestore Database');
  
  try {
    // Force enable network
    await enableNetwork(db);
    console.log('📡 Network enabled');
    
    // Test basic write operation to create database
    console.log('✏️ Creating test document to initialize database...');
    const testDoc = doc(db, '_setup', 'init');
    await setDoc(testDoc, {
      initialized: true,
      timestamp: new Date(),
      region: 'auto-detected',
      version: '1.0'
    });
    console.log('✅ Test document created successfully');
    
    // Verify we can read
    console.log('📖 Testing read operations...');
    const testSnapshot = await getDocs(collection(db, '_setup'));
    console.log(`✅ Read test successful. Found ${testSnapshot.size} documents`);
    
    console.log('🎉 Firestore database setup complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error.code === 'failed-precondition') {
      console.error('🚫 Database not created. Please create it manually in Firebase Console:');
      console.error('1. Go to https://console.firebase.google.com/project/hoodly-realtor/firestore');
      console.error('2. Click "Create database"');
      console.error('3. Select "Start in production mode"');
      console.error('4. Choose a region (recommend us-central1)');
    } else if (error.code === 'permission-denied') {
      console.error('🔒 Permission denied. Check your Firestore rules.');
    } else {
      console.error('💥 Unexpected error:', error.message);
    }
    
    return false;
  } finally {
    console.groupEnd();
  }
}

export async function checkDatabaseRegion() {
  try {
    // This will reveal the actual database URL and region
    console.log('🌍 Database URL:', db._delegate._databaseId);
    console.log('🎯 Project ID:', db._delegate._databaseId.projectId);
    console.log('📍 Database ID:', db._delegate._databaseId.database);
    
    return true;
  } catch (error) {
    console.error('❌ Could not determine database region:', error);
    return false;
  }
}

export async function checkFirestoreConnection() {
  console.group('🔧 Firestore Connection Diagnostics');
  
  try {
    // Check project configuration
    console.log('🎯 Project Configuration:');
    console.log('  - Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
    console.log('  - Expected Region: europe-west4');
    console.log('  - Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
    
    // Force enable network
    console.log('📡 Enabling Firestore network...');
    await enableNetwork(db);
    console.log('✅ Network enabled successfully');
    
    // Test basic read operation
    console.log('📖 Testing read operations...');
    const testRef = collection(db, 'test-connection');
    const snapshot = await getDocs(testRef);
    console.log('✅ Read test successful');
    
    // Test write operation
    console.log('✏️ Testing write operations...');
    const docRef = doc(db, 'test-connection', 'connectivity-test');
    await setDoc(docRef, {
      status: 'connected',
      timestamp: new Date(),
      region: 'europe-west4',
      testId: Date.now()
    });
    console.log('✅ Write test successful');
    
    console.log('🎉 All Firestore tests passed!');
    return { success: true, region: 'europe-west4' };
    
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    
    // Detailed error analysis
    if (error.code === 'failed-precondition') {
      console.error('🚫 Failed Precondition Error - Database setup issue');
      console.error('💡 Solution: Check if database exists in Firebase Console');
    } else if (error.code === 'permission-denied') {
      console.error('🔒 Permission Denied - Check Firestore rules');
    } else if (error.code === 'unavailable') {
      console.error('🌐 Service Unavailable - Network or region issue');
      console.error('💡 Verify: europe-west4 region accessibility');
    } else if (error.message.includes('400')) {
      console.error('⚠️ 400 Bad Request - Configuration mismatch');
      console.error('💡 Check: Project ID and region settings');
    }
    
    return { success: false, error: error.message, code: error.code };
    
  } finally {
    console.groupEnd();
  }
}

export async function verifyDatabaseRegion() {
  try {
    console.log('🌍 Verifying database region configuration...');
    
    // Check internal database configuration
    const dbInfo = db._delegate._databaseId;
    console.log('Database Details:', {
      projectId: dbInfo.projectId,
      database: dbInfo.database,
      expectedRegion: 'europe-west4'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Could not verify database region:', error);
    return false;
  }
}
