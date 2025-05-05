import dotenv from 'dotenv';
dotenv.config();

const dbConn = process.env.databaseConnection;

export {
    dbConn
}