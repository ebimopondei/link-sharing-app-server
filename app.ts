import express, { NextFunction, Request, Response } from 'express';
import { CustomError } from './types/error';
import { Routing } from './routes';
import { PORT } from './config/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
const app = express();

app.use(cors(
    { 
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173", 'http://192.168.67.172:5173', 'http://192.168.174.172:4173',  "http://10.0.12.7:5173", "http://10.0.12.7:4173"], 
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