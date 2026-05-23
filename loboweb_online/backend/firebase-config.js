const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

let db = null;

// Initialize Firebase only if credentials are provided
function initializeFirebase() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Firebase credentials not configured. Running in local-only mode.');
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase Firestore connected');
    return db;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.log('💡 Continuing with in-memory storage only');
    return null;
  }
}

// Save game state to Firestore
async function saveGame(gameId, state) {
  if (!db) return; // Skip if Firebase not initialized

  try {
    await db.collection('games').doc(gameId).set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      hostName: state.jugadores[0],
      estado: state,
      fase: state.fase_actual,
      ganadores: null
    }, { merge: true });
  } catch (error) {
    console.error('Error saving game to Firestore:', error);
  }
}

// Load game state from Firestore
async function loadGame(gameId) {
  if (!db) return null; // Skip if Firebase not initialized

  try {
    const doc = await db.collection('games').doc(gameId).get();
    if (doc.exists) {
      return doc.data().estado;
    }
  } catch (error) {
    console.error('Error loading game from Firestore:', error);
  }
  return null;
}

// Mark game as ended with results
async function endGame(gameId, results) {
  if (!db) return;

  try {
    await db.collection('games').doc(gameId).update({
      ganadores: results,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error ending game in Firestore:', error);
  }
}

module.exports = {
  initializeFirebase,
  getDb: () => db,
  saveGame,
  loadGame,
  endGame
};
