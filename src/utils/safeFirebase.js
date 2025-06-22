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

export const isFirebaseReady = () => {
  return db !== null && db !== undefined;
};

export const getFirebaseError = (error) => {
  if (!db) {
    return 'Firebase not initialized';
  }
  
  switch (error.code) {
    case 'permission-denied':
      return 'Access denied - please sign in';
    case 'failed-precondition':
      return 'Database configuration incomplete';
    case 'unavailable':
      return 'Database temporarily unavailable';
    default:
      return error.message || 'Unknown error occurred';
  }
};