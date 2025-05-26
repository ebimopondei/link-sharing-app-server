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
        origin: ["http://localhost:5173", "https://link-sharing-app-cyan.vercel.app", "http://localhost:5174", "http://localhost:3000", "http://localhost:4173", 'http://192.168.0.102:5173', 'http://192.168.174.172:4173',  "http://10.0.12.7:5173", "http://10.0.12.7:4173"], 
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true
    }
));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname,'uploads')));


// Links.bulkCreate([
//     {
//         platform: 'facebook',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g clip-path="url(#a)"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>'
//     },
//     {
//         platform: 'youtube',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8.162 2.667c.356.002 1.247.01 2.194.048l.336.015c.952.045 1.904.122 2.377.253.63.177 1.125.693 1.292 1.348.267 1.04.3 3.068.304 3.56V8.107c-.004.491-.037 2.52-.304 3.56a1.874 1.874 0 0 1-1.292 1.347c-.473.131-1.425.209-2.377.253l-.336.016c-.947.037-1.838.046-2.194.048h-.326c-.754-.004-3.904-.038-4.907-.317a1.875 1.875 0 0 1-1.292-1.348c-.267-1.04-.3-3.068-.304-3.56v-.216c.004-.492.037-2.52.304-3.56A1.872 1.872 0 0 1 2.93 2.984c1.002-.28 4.153-.313 4.906-.317h.326Zm-1.496 3v4.666l4-2.333-4-2.333Z"/></svg>'
//     },
//     {
//         platform: 'twitter',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M14.973 4a5.711 5.711 0 0 1-1.64.46 2.866 2.866 0 0 0 1.253-1.587 5.761 5.761 0 0 1-1.813.7 2.816 2.816 0 0 0-2.107-.906 2.857 2.857 0 0 0-2.846 2.86c0 .226.026.446.073.653A8.13 8.13 0 0 1 2 3.193a2.83 2.83 0 0 0-.387 1.433c0 .994.5 1.874 1.273 2.374-.473 0-.913-.133-1.3-.333v.02c0 1.386.987 2.546 2.294 2.806-.42.115-.86.131-1.287.047a2.854 2.854 0 0 0 2.667 1.987 5.68 5.68 0 0 1-3.554 1.226 5.83 5.83 0 0 1-.68-.04A8.096 8.096 0 0 0 5.413 14c5.253 0 8.14-4.36 8.14-8.14 0-.127 0-.247-.007-.373.56-.4 1.04-.907 1.427-1.487Z"/></svg>'
//     },
//     {
//         platform: 'twitch',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7.76 3.954h.954v2.853H7.76m2.62-2.854h.954v2.854h-.954M4.667 1.333l-2.38 2.38v8.574H5.14v2.38l2.387-2.38h1.9L13.714 8V1.333m-.954 6.194-1.9 1.9H8.954l-1.667 1.667V9.427H5.14v-7.14h7.62v5.24Z"/></svg>'
//     },
//     {
//         platform: 'stackoverflow',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"><g clip-path="url(#a)"><path d="M12.655 15.075v-4.268h1.425V16.5H1.229v-5.693h1.419v4.268h10.008Zm-8.583-1.421h7.162v-1.425H4.072v1.425Zm.175-3.235 6.988 1.458.299-1.38L4.55 9.042l-.303 1.378Zm.906-3.37 6.47 3.019.601-1.3-6.468-3.02-.602 1.292-.001.01Zm1.81-3.19L12.44 8.43l.906-1.082L7.87 2.781l-.902 1.075-.005.004ZM10.499.5l-1.163.862 4.27 5.736 1.164-.861L10.5.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 .5h16v16H0z"/></clipPath></defs></svg>'
//     },
//     {
//         platform: 'linkedin',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M12.667 2A1.333 1.333 0 0 1 14 3.333v9.334A1.334 1.334 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V3.333A1.333 1.333 0 0 1 3.333 2h9.334Zm-.334 10.333V8.8a2.173 2.173 0 0 0-2.173-2.173c-.567 0-1.227.346-1.547.866v-.74h-1.86v5.58h1.86V9.047a.93.93 0 1 1 1.86 0v3.286h1.86ZM4.587 5.707a1.12 1.12 0 0 0 1.12-1.12 1.124 1.124 0 1 0-1.12 1.12Zm.926 6.626v-5.58H3.667v5.58h1.846Z"/></svg>'
//     },
//     {
//         platform: 'hashnode',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g clip-path="url(#a)"><path d="M1.1 5.347c-1.466 1.438-1.466 3.84 0 5.306L5.346 14.9c1.437 1.466 3.84 1.466 5.306 0l4.247-4.247c1.465-1.465 1.465-3.868 0-5.306L10.653 1.1C9.187-.366 6.784-.366 5.347 1.1L1.099 5.347ZM9.86 9.86a2.63 2.63 0 0 1-3.716 0 2.624 2.624 0 0 1 0-3.716 2.624 2.624 0 0 1 3.715 0 2.63 2.63 0 0 1 0 3.716Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>'
//     },
//     {
//         platform: 'gitlab',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="m14.442 6.658-.019-.048-1.812-4.73a.474.474 0 0 0-.471-.299.474.474 0 0 0-.436.348L10.48 5.68H5.52L4.295 1.93a.474.474 0 0 0-.434-.35.48.48 0 0 0-.472.3L1.575 6.618l-.02.046a3.371 3.371 0 0 0 1.117 3.893l.007.004.016.013 2.764 2.07 1.367 1.034.831.63a.562.562 0 0 0 .678 0l.83-.63 1.368-1.035 2.78-2.082.008-.005a3.37 3.37 0 0 0 1.12-3.897Z"/></svg>'
//     },
//     {
//         platform: 'github',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g clip-path="url(#a)"><path d="M9.982 2.288a8.756 8.756 0 0 0-3.963 0c-.754-.462-1.329-.674-1.747-.764a2.315 2.315 0 0 0-.544-.056 1.342 1.342 0 0 0-.247.03l-.01.002-.005.002h-.003l.146.513-.146-.512a.533.533 0 0 0-.342.294 3.328 3.328 0 0 0-.17 2.241 3.578 3.578 0 0 0-.817 2.287c0 1.657.488 2.77 1.321 3.486.584.501 1.292.768 2.002.92a2.496 2.496 0 0 0-.123 1.022v.638c-.434.09-.735.062-.95-.008-.267-.089-.473-.267-.67-.523a5.118 5.118 0 0 1-.289-.429l-.06-.099a9.772 9.772 0 0 0-.24-.378c-.202-.3-.503-.675-.99-.803l-.515-.135-.271 1.032.516.136c.085.021.196.101.379.369.07.106.137.213.202.322l.073.117c.1.162.215.342.349.517.27.352.637.707 1.184.887.373.124.797.154 1.282.079v1.992a.533.533 0 0 0 .533.533h4.267a.533.533 0 0 0 .533-.534v-3.8c0-.336-.015-.644-.11-.931.707-.15 1.41-.416 1.99-.918.833-.72 1.32-1.845 1.32-3.511v-.001a3.578 3.578 0 0 0-.82-2.267 3.328 3.328 0 0 0-.169-2.24.533.533 0 0 0-.34-.295l-.146.512c.146-.512.145-.512.144-.512l-.002-.001-.005-.002-.01-.003a1.344 1.344 0 0 0-.248-.03 2.318 2.318 0 0 0-.544.057c-.417.09-.992.302-1.745.764Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>'
//     },
//     {
//         platform: 'frontendmentor',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M15.512 8.388a.448.448 0 0 1-.2-.047l-4.188-2.098a.509.509 0 0 1-.21-.202.594.594 0 0 1 0-.593.509.509 0 0 1 .21-.202l4.189-2.091a.442.442 0 0 1 .373-.011c.12.052.219.155.271.287a.607.607 0 0 1 .01.418.527.527 0 0 1-.257.303l-3.19 1.593 3.191 1.599c.102.05.185.14.236.25.05.112.066.24.043.362a.559.559 0 0 1-.17.31.457.457 0 0 1-.308.122ZM9.804 16c-4.605 0-8.63-3.477-9.788-8.456a.602.602 0 0 1 .051-.414.498.498 0 0 1 .298-.252.443.443 0 0 1 .37.057.543.543 0 0 1 .225.333c.51 2.19 1.656 4.127 3.256 5.51 1.6 1.382 3.566 2.131 5.588 2.13.13 0 .253.058.345.16a.58.58 0 0 1 .143.386.58.58 0 0 1-.143.386.463.463 0 0 1-.345.16ZM8.123 11.467a.463.463 0 0 1-.345-.16.58.58 0 0 1-.143-.385V.546A.58.58 0 0 1 7.778.16.463.463 0 0 1 8.123 0c.13 0 .253.058.345.16a.58.58 0 0 1 .143.386v10.376a.58.58 0 0 1-.143.386.463.463 0 0 1-.345.16Z"/></svg>'
//     },
//     {
//         platform: 'freecodecamp',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g clip-path="url(#a)"><path d="M13.257 2.604a.414.414 0 0 0-.236.08c-.054.053-.108.13-.108.209 0 .133.158.316.449.615 1.215 1.17 1.825 2.602 1.821 4.33-.004 1.91-.646 3.446-1.896 4.635-.262.236-.37.42-.371.578 0 .078.053.158.107.236.063.062.146.1.235.108.29 0 .693-.342 1.222-1.006 1.028-1.26 1.493-2.652 1.52-4.55.023-1.898-.572-3.184-1.736-4.513-.42-.475-.769-.721-1.007-.722Zm-10.513.001c-.239 0-.588.247-1.007.722C.572 4.656-.023 5.943.001 7.841c.026 1.897.491 3.288 1.52 4.549.527.665.932 1.007 1.221 1.006a.382.382 0 0 0 .235-.108c.053-.077.106-.158.106-.235 0-.158-.108-.343-.37-.578C1.464 11.285.82 9.751.817 7.84c-.004-1.728.606-3.16 1.821-4.33.291-.299.45-.481.449-.615 0-.078-.054-.155-.108-.209a.414.414 0 0 0-.236-.08h.001Zm4.704.597s.437 1.387-1.766 4.485c-2.104 2.955.697 4.766.955 4.924-.188-.12-1.334-1 .268-3.616.31-.513.717-.98 1.222-2.027 0 0 .447.63.214 1.999-.349 2.067 1.514 1.476 1.542 1.504.651.767-.538 2.114-.611 2.156-.072.04 3.397-2.087.933-5.29-.169.168-.388.961-.845.844-.456-.116 1.417-2.33-1.912-4.979Zm-.811 9.409.025.016-.025-.016Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>'
//     },
//     {
//         platform: 'codepen',
//         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="m11 8.801-2.334 1.555v2.398L12.798 10 11 8.8ZM9.798 8 8 6.8 6.202 8 8 9.198 9.798 8Zm3.535-.755L12.202 8l1.131.754V7.245ZM12.798 6 8.666 3.246v2.397L11 7.198 12.798 6ZM5 7.198l2.333-1.555V3.246L3.202 6 5 7.198ZM3.202 10l4.131 2.754v-2.398L5 8.801 3.202 10Zm-.536-1.246L3.798 8l-1.132-.755v1.51ZM1.333 6a.667.667 0 0 1 .297-.555l6-4a.667.667 0 0 1 .74 0l6 4a.666.666 0 0 1 .296.555v4a.665.665 0 0 1-.296.554l-6 4a.667.667 0 0 1-.74 0l-6-4A.666.666 0 0 1 1.333 10V6Z"/></svg>'
//     }
// ])


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