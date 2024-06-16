import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || ''; // Ensure you have the secret key set in your environment variables

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method === 'POST') {
        const { uid } = await req.json();

        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Validate UID format if necessary

        const token = jwt.sign({ uid }, secretKey, { expiresIn: '1h' });

        return new Response(JSON.stringify({ token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
    }
};
