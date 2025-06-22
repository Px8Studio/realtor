# Firebase Troubleshooting Guide

## 🚨 Common 400 Bad Request Errors

### WebChannel Connection Errors
**Symptoms:** GET requests to `firestore.googleapis.com/.../Listen/channel` return 400 Bad Request

**Most Common Causes:**
1. **Invalid Project Configuration**
   - Wrong project ID in environment variables
   - Mismatched Firebase configuration

2. **Firestore Database Not Created**
   - Firestore database doesn't exist
   - Database in wrong region

3. **Security Rules Too Restrictive**
   - Rules blocking initial connection
   - Missing authentication

**Immediate Steps:**
1. Check Firebase Console: https://console.firebase.google.com
2. Verify project ID matches exactly
3. Ensure Firestore database is created
4. Test with permissive rules temporarily

### Step-by-Step Resolution

#### 1. Verify Firebase Project Setup
```bash
# Check your project ID
echo $REACT_APP_FIREBASE_PROJECT_ID

# Should match the project ID in Firebase Console
```

#### 2. Check Firestore Database
- Go to Firebase Console → Firestore Database
- Ensure database exists and is in "production mode"
- Check the region matches your app's region

#### 3. Test with Permissive Rules (TEMPORARY)
```javascript
// TEMPORARY Firestore rules for testing
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### 4. Verify Environment Variables
```bash
# Check all required variables exist
npm run start
# Look for "✅ All environment variables present" in console
```

#### 5. Test Network Connectivity
- Open browser dev tools → Network tab
- Look for failed requests to Firebase
- Check if requests are being blocked

## 🔧 Advanced Troubleshooting

### Enable Firebase Debug Mode
```javascript
// Add to your firebase.js
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
    enableIndexedDbPersistence(db).catch(console.warn);
  });
}
```

### Check Browser Console
Look for these specific error patterns:
- `permission-denied`: Security rules issue
- `failed-precondition`: Missing indexes
- `unauthenticated`: Auth setup issue
- `not-found`: Database/collection doesn't exist

### Network Debugging
```bash
# Test Firebase connectivity
curl -I https://firestore.googleapis.com/

# Should return 200 OK
```

## 📋 Diagnostic Checklist

- [ ] Firebase project exists and is active
- [ ] Firestore database is created
- [ ] Environment variables are correct
- [ ] Security rules allow basic operations
- [ ] Required indexes are created
- [ ] Network can reach Firebase servers
- [ ] No browser extensions blocking requests
- [ ] HTTPS is used in production

## 🆘 Emergency Solutions

### Complete Reset (Last Resort)
1. Create new Firebase project
2. Update all environment variables
3. Deploy basic permissive rules
4. Test with minimal configuration

### Contact Points
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag `firebase`, `firestore`
- GitHub Issues: Your repository issues section

## 📚 Useful Resources
- [Firebase Console](https://console.firebase.google.com)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Network Troubleshooting](https://firebase.google.com/docs/firestore/troubleshooting)
