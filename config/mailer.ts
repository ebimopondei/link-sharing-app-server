import dotenv from 'dotenv';
dotenv.config();

const MAILINGHOST = process.env.mailingHost;
const MAILINGPORT = process.env.mailingPort;
const MAILINGSECURE = process.env.mailingSecure;
const MAILINGUSER = process.env.mailingUser;
const MAILINGPASSWORD = process.env.mailingPassword;
const MAILINGREJECTUNAUTHORIZED = process.env.mailingRejectUnauthorized;

export {
    MAILINGHOST,
    MAILINGPORT,
    MAILINGSECURE,
    MAILINGUSER,
    MAILINGPASSWORD,
    MAILINGREJECTUNAUTHORIZED
}