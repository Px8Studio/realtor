// REQUIRED FIRESTORE INDEXES - CREATE THESE IMMEDIATELY
//
// INDEX 1: Profile Page - User Listings Query
// Collection: listings
// Fields: userRef (Ascending), timestamp (Descending)
// Used by: Profile.jsx for displaying user's own listings
//
// INDEX 2: Category/Type Pages - Type-based Listings Query  
// Collection: listings
// Fields: type (Ascending), timestamp (Descending)
// Used by: Home.jsx, Category.jsx for rent/sale listings
//
// INDEX 3: Offers Page - Offer-based Listings Query
// Collection: listings  
// Fields: offer (Ascending), timestamp (Descending)
// Used by: Home.jsx, Offers.jsx for discounted listings

// Go to Firebase Console > Firestore > Indexes and create these manually
// OR wait for the error messages when running queries and click the provided links
