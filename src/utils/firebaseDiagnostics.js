import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, limit, orderBy, where, doc, getDoc } from 'firebase/firestore';

export class FirebaseDiagnostics {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.recommendations = [];
  }

  async runFullDiagnostic() {
    console.group('🔍 Firebase Full Diagnostic');
    
    this.clearResults();
    
    await this.checkEnvironmentVariables();
    await this.checkFirebaseConfiguration();
    await this.checkNetworkConnectivity();
    await this.checkFirestorePermissions();
    await this.checkFirestoreIndexes();
    await this.checkAuthenticationSetup();
    await this.checkBillingStatus();
    await this.checkCORSConfiguration();
    
    this.displayResults();
    console.groupEnd();
    
    return {
      issues: this.issues,
      warnings: this.warnings,
      recommendations: this.recommendations,
      isHealthy: this.issues.length === 0
    };
  }

  clearResults() {
    this.issues = [];
    this.warnings = [];
    this.recommendations = [];
  }

  addIssue(category, message, solution) {
    this.issues.push({ category, message, solution, severity: 'error' });
    console.error(`❌ [${category}] ${message}`);
  }

  addWarning(category, message, suggestion) {
    this.warnings.push({ category, message, suggestion, severity: 'warning' });
    console.warn(`⚠️ [${category}] ${message}`);
  }

  addRecommendation(category, message) {
    this.recommendations.push({ category, message, severity: 'info' });
    console.info(`💡 [${category}] ${message}`);
  }

  async checkEnvironmentVariables() {
    const requiredVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      this.addIssue(
        'Environment',
        `Missing environment variables: ${missing.join(', ')}`,
        'Add missing variables to your .env.local file'
      );
    } else {
      console.log('✅ All required environment variables present');
    }

    // Check for suspicious values
    if (process.env.REACT_APP_FIREBASE_API_KEY?.includes('example') || 
        process.env.REACT_APP_FIREBASE_PROJECT_ID?.includes('your-project')) {
      this.addIssue(
        'Environment',
        'Environment variables contain placeholder values',
        'Replace placeholder values with actual Firebase configuration'
      );
    }
  }

  async checkFirebaseConfiguration() {
    try {
      // Test basic Firebase connection
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      console.log('✅ Firebase configuration valid');
    } catch (error) {
      if (error.code === 'permission-denied') {
        console.log('✅ Firebase connected (permission denied is expected)');
      } else if (error.code === 'failed-precondition') {
        this.addIssue(
          'Configuration',
          'Firestore database not properly initialized',
          'Ensure your Firestore database is created in Firebase Console'
        );
      } else {
        this.addIssue(
          'Configuration',
          `Firebase configuration error: ${error.message}`,
          'Check your Firebase configuration in firebase.js'
        );
      }
    }
  }

  async checkNetworkConnectivity() {
    try {
      // Test network connectivity to Firebase
      await fetch('https://firestore.googleapis.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      console.log('✅ Network connectivity to Firebase OK');
    } catch (error) {
      this.addIssue(
        'Network',
        'Cannot reach Firebase servers',
        'Check your internet connection and firewall settings'
      );
    }
    // Check for local development issues
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.addWarning(
        'Network',
        'Running on localhost - some Firebase features may have limitations',
        'Test on a proper domain for production-like behavior'
      );
    }
  }

  async checkFirestorePermissions() {
    const testCases = [
      {
        name: 'Read listings',
        test: () => getDocs(query(collection(db, 'listings'), limit(1)))
      },
      {
        name: 'Read users',
        test: () => getDocs(query(collection(db, 'users'), limit(1)))
      }
    ];

    for (const testCase of testCases) {
      try {
        await testCase.test();
        console.log(`✅ ${testCase.name}: OK`);
      } catch (error) {
        if (error.code === 'permission-denied') {
          this.addIssue(
            'Permissions',
            `${testCase.name}: Permission denied`,
            'Check your Firestore security rules'
          );
        } else if (error.code === 'failed-precondition') {
          this.addIssue(
            'Indexes',
            `${testCase.name}: Missing database index`,
            'Create required Firestore indexes'
          );
        } else {
          this.addWarning(
            'Firestore',
            `${testCase.name}: ${error.message}`,
            'Investigate this specific error'
          );
        }
      }
    }
  }

  async checkFirestoreIndexes() {
    const indexTests = [
      {
        name: 'User listings index',
        query: () => query(
          collection(db, 'listings'),
          where('userRef', '==', 'test'),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
      },
      {
        name: 'Type-based listings index',
        query: () => query(
          collection(db, 'listings'),
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
      },
      {
        name: 'Offer-based listings index',
        query: () => query(
          collection(db, 'listings'),
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
      }
    ];

    for (const test of indexTests) {
      try {
        await getDocs(test.query());
        console.log(`✅ ${test.name}: Index exists`);
      } catch (error) {
        if (error.code === 'failed-precondition') {
          this.addIssue(
            'Indexes',
            `${test.name}: Missing required index`,
            `Create index at: https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore/indexes`
          );
        }
      }
    }
  }

  async checkAuthenticationSetup() {
    try {
      const auth = getAuth();
      if (!auth) {
        this.addIssue(
          'Authentication',
          'Firebase Auth not initialized',
          'Check your Firebase authentication setup'
        );
        return;
      }

      console.log('✅ Firebase Authentication initialized');
      
      // Check if running on secure origin
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        this.addWarning(
          'Authentication',
          'Firebase Auth requires HTTPS in production',
          'Ensure your production app uses HTTPS'
        );
      }
    } catch (error) {
      this.addIssue(
        'Authentication',
        `Auth setup error: ${error.message}`,
        'Check your Firebase Auth configuration'
      );
    }
  }

  async checkBillingStatus() {
    // This is an indirect check - we can't directly check billing status
    this.addRecommendation(
      'Billing',
      'Ensure Firebase billing is enabled for production usage'
    );
    
    // Check for quota-related errors
    if (this.issues.some(issue => issue.message.includes('quota'))) {
      this.addIssue(
        'Billing',
        'Quota exceeded - billing may not be enabled',
        'Enable billing in Firebase Console'
      );
    }
  }

  async checkCORSConfiguration() {
    // Check for CORS-related issues
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && window.location.protocol === 'file:') {
      this.addWarning(
        'CORS',
        'File protocol may cause CORS issues',
        'Use a local development server instead'
      );
    }
  }

  displayResults() {
    console.log('\n📊 Diagnostic Summary:');
    console.log(`Issues: ${this.issues.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Recommendations: ${this.recommendations.length}`);

    if (this.issues.length > 0) {
      console.group('🚨 Critical Issues (Must Fix):');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Solution: ${issue.solution}`);
      });
      console.groupEnd();
    }

    if (this.warnings.length > 0) {
      console.group('⚠️ Warnings (Should Fix):');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. [${warning.category}] ${warning.message}`);
        console.log(`   Suggestion: ${warning.suggestion}`);
      });
      console.groupEnd();
    }

    if (this.recommendations.length > 0) {
      console.group('💡 Recommendations:');
      this.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.category}] ${rec.message}`);
      });
      console.groupEnd();
    }
  }
}

// Specific 400 error analyzer
export class WebChannelErrorAnalyzer {
  static analyzeError(error) {
    const errorUrl = error?.target?.responseURL || '';
    const errorCode = error?.target?.status || 0;

    if (errorCode === 400 && errorUrl.includes('Firestore/Listen/channel')) {
      return {
        type: 'WEBCHANNEL_CONNECTION_ERROR',
        severity: 'high',
        description: 'Firestore WebChannel connection failing with 400 Bad Request',
        possibleCauses: [
          'Invalid Firebase project configuration',
          'Firestore database not created or in wrong region',
          'Security rules blocking connection',
          'Missing or invalid API keys',
          'Network/firewall blocking Firebase endpoints',
          'Browser security policies blocking requests'
        ],
        diagnosticSteps: [
          'Verify Firebase project ID matches the one in console',
          'Check if Firestore database is created and active',
          'Verify security rules allow basic operations',
          'Test with temporary permissive rules',
          'Check browser network tab for specific error details',
          'Try accessing from different network/device'
        ],
        immediateActions: [
          'Check Firebase Console for project status',
          'Verify .env.local has correct values',
          'Test with a simple read operation',
          'Check browser console for auth errors'
        ]
      };
    }

    return null;
  }
}

// Export singleton instance
export const diagnostics = new FirebaseDiagnostics();
