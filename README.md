# Hoodly Realtor App 🏠

A modern real estate application built with React, Firebase, and Tailwind CSS.

## 🚀 Features

- **User Authentication** - Sign up, sign in, forgot password, Google OAuth
- **Property Listings** - Create, edit, delete property listings
- **Image Upload** - Multiple image upload with Firebase Storage
- **Interactive Maps** - Property location with Leaflet maps
- **Real-time Data** - Live updates with Firestore
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Search & Filter** - Find properties by type, location, and features

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router 6, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: React Leaflet
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS with forms plugin

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd realtor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase and Google Maps API credentials.

4. **Start development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Set up Storage bucket
5. **IMPORTANT**: Create these Firestore indexes:

```javascript
// Required indexes - your app won't work without these!
// Index 1: User listings (Collection: listings, Fields: userRef ASC, timestamp DESC)
// Index 2: Type listings (Collection: listings, Fields: type ASC, timestamp DESC)  
// Index 3: Offer listings (Collection: listings, Fields: offer ASC, timestamp DESC)
```

### Google Maps API

1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable Geocoding API
3. Add to `.env.local` as `REACT_APP_GEOCODE_API_KEY`

## 🏗️ Project Structure

```
src
├── components      # Reusable components
├── config          # Configuration files
├── hooks           # Custom React hooks
├── pages           # Page components
├── styles          # Global styles and Tailwind CSS setup
└── utils           # Utility functions
```

## 📚 Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
