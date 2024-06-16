import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure this path is correct based on your project structure
import { generateToken } from '../../utils/jwt';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse('Method not allowed', { status: 405 });
    }

    try {
        const { emailOrUsername, password } = await req.json(); // Parse the JSON body

        // Determine if emailOrUsername is an email
        const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);
        let email = emailOrUsername;

        // If username, get the email from Firestore
        if (!isEmail) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', emailOrUsername));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const userDoc = querySnapshot.docs[0];
            email = userDoc.data().email;
        }

        // Sign in user with Firebase Authentication
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user is verified in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
            throw new Error('User not found in Firestore');
        }

        const userData = userDocSnapshot.data();
        if (!userData.verified) {
            throw new Error('User not verified');
        }

        // Generate new token and set expiry
        const token = generateToken(user.uid);
        const expiry = new Date().getTime() + 3600000; // 1 hour expiry

        // Check for existing tokens
        const tokensRef = collection(db, 'tokens');
        const tokenQuery = query(tokensRef, where('uid', '==', user.uid));
        const tokenSnapshot = await getDocs(tokenQuery);

        if (!tokenSnapshot.empty) {
            const tokenDoc = tokenSnapshot.docs[0];
            const tokenData = tokenDoc.data();
            if (tokenData.expiry > new Date().getTime()) {
                return new NextResponse(
                    JSON.stringify({ uid: user.uid, token: tokenData.token }),
                    { status: 200 }
                );
            } else {
                await deleteDoc(doc(tokensRef, tokenDoc.id));
            }
        }

        // Store new token in Firestore
        await setDoc(doc(tokensRef, user.uid), {
            uid: user.uid,
            token: token,
            expiry: expiry,
        });

        return new NextResponse(
            JSON.stringify({ uid: user.uid, token: token }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse((error as Error).message || "There was an error in your request, try again soon.", { status: 500 });
    }
}
