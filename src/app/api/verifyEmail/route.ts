import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../firebase'; // Adjust the path to your Firebase configuration
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        // Sample data for testing
        const { email, verificationCode } = await req.json();

        // Access the document directly by its ID (email)
        const verificationDocRef = doc(db, 'emailVerificationCodes', email);
        const verificationDocSnap = await getDoc(verificationDocRef);

        if (!verificationDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'Verification code not found' }), { status: 404 });
        }

        const verificationData = verificationDocSnap.data();

        // Check if the verification code matches
        if (verificationData.code !== verificationCode) {
            return new NextResponse(JSON.stringify({ error: 'Verification code is incorrect' }), { status: 400 });
        }

        // Query the users collection to find the user document by email
        const usersQuery = query(collection(db, 'users'), where('email', '==', email));
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // Assume there is only one user document with the given email
        const userDoc = usersSnapshot.docs[0];
        const userRecordRef = doc(db, 'users', userDoc.id);

        // Update the user's verified status in Firestore
        await updateDoc(userRecordRef, { verified: true });

        // Delete the verification code document from the collection
        await deleteDoc(verificationDocRef);

        return new NextResponse(JSON.stringify({ message: 'Email verified successfully' }), { status: 200 });

    } catch (error) {
        console.error('Error verifying email:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to verify email' }), { status: 500 });
    }
}
