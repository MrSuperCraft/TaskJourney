const jwt = require('node-jsonwebtoken');

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || '';

if (!secretKey) {
    throw new Error('JWT secret key is not set in environment variables');
}

export function generateToken(uid: string) {
    try {
        const token = jwt.sign({ uid: uid }, secretKey, { expiresIn: '15m' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
        return ''; // Return an empty string or handle the error as needed
    }
}

const secretKeyRefresh = process.env.NEXT_PUBLIC_JWT_REFRESH_KEY || '';

if (!secretKeyRefresh) {
    throw new Error('JWT refresh secret key is not set in environment variables');
}

export function generateRefreshToken(uid: string) {
    try {
        const refreshToken = jwt.sign({ uid: uid }, secretKeyRefresh, { expiresIn: '30d' }); // Refresh token expires in 30 days
        return refreshToken;
    } catch (error) {
        console.error('Error generating refresh token:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
        return ''; // Return an empty string or handle the error as needed
    }
}
