import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.accessTokenSecret;
const REFRESHSECRET = process.env.refreshTokenSecret;


export {
    SECRET,
    REFRESHSECRET
}