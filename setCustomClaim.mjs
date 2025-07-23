import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account JSON manually
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

// 🔐 Replace with the UID from your Firebase Auth > Users
const BELLHOP_UID = 'eyqtbwnQidc9SxRB4SA3CIcS80A3';

const assignBellmanRole = async () => {
  try {
    await getAuth().setCustomUserClaims(BELLHOP_UID, { role: 'bellman' });
    console.log(`✅ Custom claim set for UID ${BELLHOP_UID}`);
  } catch (err) {
    console.error('❌ Failed to set custom claim:', err);
  }
};

assignBellmanRole();
