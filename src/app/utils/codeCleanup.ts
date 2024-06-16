/* import cron from 'node-cron';
import admin from 'firebase-admin'; // Import Firebase Admin without specific type imports

const serviceAccount = require('../../../taskjourney-cb5d6-firebase-adminsdk-l302o-639d1e02d4.json'); // Path to your Firebase service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("Code cleanup tasks are active!");

// Define the task to run every hour for expired verification codes
const taskVerificationCodes = cron.schedule('0 * * * *', async () => {
    try {
        const now = admin.firestore.Timestamp.now();
        const verificationCodesRef = db.collection('emailVerificationCodes');
        const querySnapshot = await verificationCodesRef.where('expiresAt', '<=', now).get();

        const batch = db.batch();

        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        console.log('Expired verification codes deleted');
    } catch (error) {
        console.error('Error deleting expired verification codes:', error);
    }
}, { scheduled: true });

// Start the verification codes cleanup task
taskVerificationCodes.start();

// Define the task to run every hour for expired tokens
const taskTokens = cron.schedule('0 * * * *', async () => {
    try {
        const now = admin.firestore.Timestamp.now();
        const tokensRef = db.collection('tokens');
        const querySnapshot = await tokensRef.where('expiry', '<=', now).get();

        const batch = db.batch();

        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        console.log('Expired tokens deleted');
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
}, { scheduled: true });

// Start the tokens cleanup task
taskTokens.start();


*/