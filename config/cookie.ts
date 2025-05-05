import dotenv from 'dotenv';
dotenv.config();

const cookieConfig = { 
    httpOnly: process.env.httpOnly || true, 
    secure: process.env.secure || true, 
    sameSite: process.env.sameSite || 'none', 
    maxAge: process.env.maxAge || 24 * 60 * 60 * 1000 
}

export {
    cookieConfig
}