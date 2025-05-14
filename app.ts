import express, { NextFunction, Request, Response } from 'express';
import { CustomError } from './types/error';
import { Routing } from './routes';
import { PORT } from './config/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const {
    SequelizeError,
    SequelizeDatabaseError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError,
    TimeoutError,
    ConnectionError,
    HostNotFoundError,
    HostNotReachableError,
    AssociationError,
    InstanceError,
  } = require('sequelize');


const app = express();

app.use(cors(
    { 
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173", 'http://192.168.0.102:5173', 'http://192.168.174.172:4173',  "http://10.0.12.7:5173", "http://10.0.12.7:4173"], 
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true
    }
));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname,'uploads')));





// Request logging middleware

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Path:', req.path);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

app.use('/', Routing )

app.use((error:CustomError, req:Request, res:Response, next:NextFunction) => {
    console.error('Sequelize Error Handler:', error);
  
    if (error instanceof SequelizeDatabaseError) {
      const validationMessages = error?.errors.map((e) => e.message).join(', ');
      throw new Error(validationMessages)
       res.status(400).json({ error: `Data validation failed: ${validationMessages}` });
    } else if (error instanceof UniqueConstraintError) {
      const uniqueFields = error.errors.map((e) => e.path).join(', ');
       res.status(409).json({ error: `The provided value for ${uniqueFields} already exists.` });
    } else if (error instanceof ForeignKeyConstraintError) {
       res.status(409).json({ error: 'Failed due to a foreign key constraint violation.' });
    } else if (error instanceof DatabaseError) {
      console.error('Sequelize Database Error:', error.message, error.sql);
      if (error.parent) {
        console.error('Underlying Database Error:', error.parent);
      }
       res.status(500).json({ error: 'A database error occurred. Please try again later.' });
    } else if (error instanceof TimeoutError) {
       res.status(408).json({ error: 'The database operation timed out.' });
    } else if (
      error instanceof ConnectionError ||
      error instanceof HostNotFoundError ||
      error instanceof HostNotReachableError
    ) {
       res.status(503).json({ error: 'Could not connect to the database. Please check your connection.' });
    } else if (error instanceof AssociationError || error instanceof InstanceError) {
       res.status(500).json({ error: 'An error occurred with the data or its relationships.' });
    } else if (error instanceof SequelizeError) {
       res.status(500).json({ error: 'An unexpected database error occurred.' });
    }
  
    // If the error is not a Sequelize error, pass it on to the next error handler
    next(error);
  });

app.use((req: Request, res: Response, next: NextFunction) => {
    const error: CustomError = new Error(`Cannot ${req.method} ${req.originalUrl}`) as CustomError;
    error.statusCode = 404;
    error.status = 'fail';
    next(error); // Pass to error handler
});

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) =>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'fail',
    res.status(error.statusCode).json( {
        status: error.statusCode,
        message: error.message, 
        name: error.name
    })
})

app.listen(PORT, ()=> {
    console.log('server started!..')
})