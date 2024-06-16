import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username');
    console.log('username: ' + username);

    if (username == '') return new Response('Username missing.', { status: 400 });

    if (!username || username.length === 0) {
        console.error('Missing username in request');
        return new Response('Missing Username', { status: 400 });
    }

    if (username?.length > 25) {
        console.error('Username too long:', username);
        return new Response('The username is too long.', { status: 400 });
    }

    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('Username available.');
            return new Response(JSON.stringify({
                message: 'The username is available.',
                available: true
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({
            message: 'The username is taken.',
            available: false
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error checking username availability:', error);
        return new Response('internal server error', { status: 500 });
    }
}
