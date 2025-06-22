import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

// Optimize Firestore connection for better stability
export function optimizeFirestoreConnection() {
  const db = getFirestore();
  
  // Handle page visibility changes to manage connections
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      enableNetwork(db).catch(err => {
        console.log('Failed to re-enable Firestore network:', err);
      });
    } else {
      // Optionally disable network when page is hidden to reduce connection errors
      // Uncomment the next line if you want this behavior
      // disableNetwork(db).catch(err => console.log('Failed to disable network:', err));
    }
  });

  // Handle online/offline events
  window.addEventListener('online', () => {
    enableNetwork(db).catch(err => {
      console.log('Failed to enable network on online event:', err);
    });
  });

  window.addEventListener('offline', () => {
    disableNetwork(db).catch(err => {
      console.log('Failed to disable network on offline event:', err);
    });
  });
}

// Suppress Firebase connection warnings in development
export function suppressFirebaseWarnings() {
  if (process.env.NODE_ENV === 'development') {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      // Suppress specific Firebase connection warnings
      const message = args.join(' ');
      if (
        message.includes('WebChannelConnection RPC') ||
        message.includes('transport errored') ||
        message.includes('Failed to load resource') ||
        message.includes('ERR_ABORTED 400')
      ) {
        return; // Don't log these warnings
      }
      originalWarn.apply(console, args);
    };
  }
}
