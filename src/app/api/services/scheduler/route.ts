import cron from 'node-cron';
import admin from 'firebase-admin';

export async function POST() {
    const serviceAccount = require('../../../../../taskjourney-cb5d6-firebase-adminsdk-l302o-639d1e02d4.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();

    console.log("Code cleanup tasks are active!");

    // Define the task to run every hour for expired verification codes
    const taskVerificationCodes = cron.schedule('*/20 * * * *', async () => {
        try {
            const now = admin.firestore.Timestamp.now().toDate().getTime();
            const verificationCodesRef = db.collection('emailVerificationCodes');
            const querySnapshot = await verificationCodesRef.where('expiresAt', '<=', now).get();

            if (!querySnapshot.empty) {
                const batch = db.batch();

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();

                console.log('Expired verification codes deleted:', querySnapshot.size);
            } else {
                console.log('No expired verification codes found.');
            }
        } catch (error) {
            console.error('Error deleting expired verification codes:', error);
        }
    }, { scheduled: true });

    // Start the verification codes cleanup task
    taskVerificationCodes.start();

    // Define the task to run every hour for expired tokens
    const taskTokens = cron.schedule('*/10 * * * *', async () => {
        try {
            const now = admin.firestore.Timestamp.now().toDate().getTime();
            const tokensRef = db.collection('accessTokens');
            const querySnapshot = await tokensRef.where('expirationDate', '<=', now).get();

            if (!querySnapshot.empty) {
                const batch = db.batch();

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();

                console.log('Expired tokens deleted:', querySnapshot.size);
            } else {
                console.log('No expired tokens found.');
            }

            const refreshTokensRef = db.collection('refreshTokens');
            const querySnapshotForRefresh = await refreshTokensRef.where('expirationDate', '<=', now).get();

            if (!querySnapshotForRefresh.empty) {
                const batchTwo = db.batch();

                querySnapshotForRefresh.forEach((doc) => {
                    batchTwo.delete(doc.ref);
                });

                await batchTwo.commit();

                console.log('Expired refresh tokens deleted:', querySnapshotForRefresh.size);
            } else {
                console.log('No expired refresh tokens found.');
            }

        } catch (error) {
            console.error('Error deleting expired tokens:', error);
        }
    }, { scheduled: true });

    // Start the tokens cleanup task
    taskTokens.start();

    return new Response("activated", { status: 200 });
}
