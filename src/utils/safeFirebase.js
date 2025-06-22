// Safe Firebase operations wrapper
import { db } from '../firebase';
import { toast } from 'react-toastify';

export const safeFirebaseOperation = async (operation, errorMessage = 'Firebase operation failed') => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your configuration.');
    }
    
    return await operation(db);
  } catch (error) {
    console.error('Firebase operation error:', error);
    
    // Show user-friendly error messages
    if (error.message.includes('not initialized')) {
      toast.error('Database connection failed. Please refresh the page.');
    } else if (error.code === 'permission-denied') {
      toast.error('Access denied. Please sign in to continue.');
    } else if (error.code === 'failed-precondition') {
      toast.error('Database setup incomplete. Please contact support.');
    } else {
      toast.error(errorMessage);
    }
    
    throw error;
  }
};

export function isFirebaseReady() {
  return db !== null && db !== undefined;
}

export function getFirebaseErrorMessage(error) {
  const errorMessages = {
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested document was not found.',
    'failed-precondition': 'Missing database index. Check console for details.',
  };
  
  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
}