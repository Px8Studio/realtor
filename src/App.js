import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
import { optimizeFirestoreConnection, suppressFirebaseWarnings } from './utils/firebaseOptimization';
import FirebaseErrorMonitor from './components/FirebaseErrorMonitor';
import FirebaseDiagnostics from './utils/firebaseDiagnostics';
import { setupFirestoreDatabase, checkDatabaseRegion, checkFirestoreConnection, verifyDatabaseRegion } from './utils/firestoreSetup';

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);
  
  useEffect(() => {
    // Initialize Firebase optimizations
    optimizeFirestoreConnection();
    suppressFirebaseWarnings();
  }, []);

  useEffect(() => {
    const checkFirebase = async () => {
      // Check Firebase configuration on app start
      try {
        console.group('🔥 Firebase Health Check (europe-west4)');
        
        // Step 1: Verify region configuration
        console.log('🌍 Step 1: Verifying region configuration...');
        await verifyDatabaseRegion();
        
        // Step 2: Test Firestore connection
        console.log('🔧 Step 2: Testing Firestore connection...');
        const connectionResult = await checkFirestoreConnection();
        
        if (!connectionResult.success) {
          console.error('❌ Firestore connection failed');
          setFirebaseError(`Firestore Error: ${connectionResult.error}`);
          return;
        }
        
        console.log('✅ All Firebase checks passed!');
        setFirebaseError(null);
        setFirebaseReady(true);
        
      } catch (error) {
        console.error('❌ Firebase health check failed:', error);
        setFirebaseError(`Firebase Error: ${error.message}`);
      } finally {
        console.groupEnd();
        setChecking(false);
        setLoading(false);
      }
    };

    checkFirebase();
  }, []);

  // Show loading screen while checking Firebase
  if (checking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Firebase...</p>
        </div>
      </div>
    );
  }

  // Show error screen if Firebase failed to initialize
  if (!firebaseReady || firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Database Connection Failed</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the database. This might be due to:
          </p>
          <ul className="text-left text-sm text-gray-500 mb-4">
            <li>• Missing Firestore security rules</li>
            <li>• Missing database indexes</li>
            <li>• Network connectivity issues</li>
          </ul>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Add Firebase Error Monitor */}
      {process.env.NODE_ENV === 'development' && <FirebaseErrorMonitor />}
    </>
  );
}

export default App;
