export function runDeploymentChecks() {
  const checks = [];
  
  // Environment variables
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
    'REACT_APP_GEOCODE_API_KEY'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missingEnvVars.length > 0) {
    checks.push({
      type: 'error',
      message: `Missing environment variables: ${missingEnvVars.join(', ')}`
    });
  }
  
  // Production build optimizations
  if (process.env.NODE_ENV === 'production') {
    checks.push({
      type: 'info',
      message: 'Remember to enable Firebase billing for production usage'
    });
  }
  
  return checks;
}
