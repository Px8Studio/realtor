import React from 'react';

export default function FirebaseLoader({ message = "Connecting to database..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-400 mt-2">
          If this takes too long, check your internet connection
        </p>
      </div>
    </div>
  );
}