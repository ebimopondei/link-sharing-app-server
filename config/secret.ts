import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.ACCESSTOKENSECRET;
const REFRESHSECRET = process.env.REFRESHTOKENSECRET;


export {
    SECRET,
    REFRESHSECRET
}