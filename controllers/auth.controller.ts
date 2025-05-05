import { Request, Response } from "express";
import { loginUser, signupUser } from "../database/sql";
import { hashString } from "../helpers";

const jwt = require('jsonwebtoken');
import { SECRET as secret, REFRESHSECRET as refreshSecret } from '../config/secret'

let token;
let refreshToken;


const signupController = async(req:Request, res:Response)=>{
    const data = req.body || req.body.data;
    const emailHash = hashString(data.email);
    const response = await signupUser( { ...data, password_hash: emailHash } );



    if( !response.success ) {
        res.json(response)
        return
    };

    token = jwt.sign(response, secret, {expiresIn: "1h" });
    refreshToken = jwt.sign(response, refreshSecret, { expiresIn: "1d"});
    
    res.json({success: true, data: { auth: {token, refreshToken}, user: response.data }, message: "User Created Successfully!"});

}

async function loginController(req:Request, res:Response){
    const data = req.body || req.body.data;
    const response = await loginUser(data);
    const user = response?.data[0];
    if( response.data.length<1 ){
        res.status( 401 ).json( {success: false, data: null, message: "Login Credentials are wrong!"} );
        return
    } 

    token = jwt.sign(response.data[0], secret, {expiresIn: "1h" });
    refreshToken = jwt.sign(response.data[0], refreshSecret, { expiresIn: "1d"});
    
    res.json({success: true, data: { auth: { token, refreshToken }, user }, message: "Login Successfully!"});
}

// const verifyEmailController = async(req:Request, res:Response)=>{
//     const { hash } = req.body || req.body.data;
//     const response = await verifyEmail( hash )
//     res.json(response)
// }

const refreshTokenController = async (req:Request, res:Response) =>{
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        res.sendStatus(401)
        return
    };

    jwt.verify( cookies.refreshToken, refreshSecret, ( err:Error, data:any ) => {
        
            if( err ) return res.status( 401 ).json( { success: true, message: err.message, data: [] });

            delete data.iat
            delete data.exp

            const token = jwt.sign(data, secret, {expiresIn: "1h" });
            const refreshToken = jwt.sign(data, refreshSecret, {expiresIn: "1d" });
            
            
            res.json({ token, refreshToken })
        })


}

const handleVerifyToken = async( req:Request, res:Response ) =>{
    const { resetToken } = req.body || req.body.data;

    if( resetToken == undefined || resetToken == null || resetToken == '' ) {
        return res.json( { success: false, data: null, message: "No token provided."});
    }else {
        
        jwt.verify( resetToken, secret, ( err:Error ) => {

            if( err ) {
                
                return res.json( { success: false, data: null, message: err.message} );

            }else {
                res.json( { success: true, data: null, message: "Verified token."})
            };
            
        })
    
    };

}

export {
    loginController,
    signupController,
    // verifyEmailController,
    refreshTokenController,
}