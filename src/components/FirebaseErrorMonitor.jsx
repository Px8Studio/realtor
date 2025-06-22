import React, { useState, useEffect } from 'react';
import { diagnostics, WebChannelErrorAnalyzer } from '../utils/firebaseDiagnostics';

const FirebaseErrorMonitor = () => {
  const [errors, setErrors] = useState([]);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  useEffect(() => {
    // Monitor for network errors
    const handleError = (event) => {
      const analysis = WebChannelErrorAnalyzer.analyzeError(event);
      if (analysis) {
        setErrors(prev => [...prev, { ...analysis, timestamp: new Date() }]);
      }
    };

    // Listen for unhandled network errors
    window.addEventListener('error', handleError, true);
    
    // Listen for unhandled promise rejections (Firebase errors)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.code?.startsWith('firestore/')) {
        console.error('🔥 Firebase Error Detected:', event.reason);
        setErrors(prev => [...prev, {
          type: 'FIRESTORE_ERROR',
          severity: 'medium',
          description: `Firestore Error: ${event.reason.code}`,
          message: event.reason.message,
          timestamp: new Date()
        }]);
      }
    });

    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  const runDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const result = await diagnostics.runFullDiagnostic();
      setDiagnosticResult(result);
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const clearErrors = () => {
    setErrors([]);
    setDiagnosticResult(null);
  };

  if (errors.length === 0 && !diagnosticResult) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={runDiagnostic}
          disabled={isRunningDiagnostic}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunningDiagnostic ? '🔍 Diagnosing...' : '🔍 Run Firebase Diagnostic'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-red-800">
            🚨 Firebase Issues Detected
          </h3>
          <button
            onClick={clearErrors}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-red-700 mb-2">Recent Errors:</h4>
            {errors.slice(-3).map((error, index) => (
              <div key={index} className="mb-2 text-sm">
                <div className="font-medium text-red-600">{error.type}</div>
                <div className="text-red-500">{error.description}</div>
              </div>
            ))}
          </div>
        )}

        {diagnosticResult && (
          <div className="mb-4">
            <h4 className="font-medium text-red-700 mb-2">Diagnostic Results:</h4>
            <div className="text-sm space-y-1">
              <div>Issues: <span className="font-medium">{diagnosticResult.issues.length}</span></div>
              <div>Warnings: <span className="font-medium">{diagnosticResult.warnings.length}</span></div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={runDiagnostic}
            disabled={isRunningDiagnostic}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
          >
            {isRunningDiagnostic ? 'Running...' : 'Diagnose'}
          </button>
          <button
            onClick={() => window.open('https://console.firebase.google.com', '_blank')}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Firebase Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseErrorMonitor;
