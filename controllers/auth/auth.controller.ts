import { Request, Response } from "express";
import { loginUser, signupUser } from "../../database/sql";
import { hashString } from "../../helpers";

const jwt = require('jsonwebtoken');
import { SECRET as secret, REFRESHSECRET as refreshSecret } from '../../config/secret'

let token;
let refreshToken;


const signupController = async(req:Request, res:Response)=>{
    const data = req.body || req.body.data;
    const emailHash = hashString(data.email);
    const response = await signupUser( { ...data, password_hash: emailHash } );

    token = jwt.sign(response.toJSON(), secret, {expiresIn: "1h" });
    refreshToken = jwt.sign(response.toJSON(), refreshSecret, { expiresIn: "1d"});
    
    res.json({success: true, data: { auth: {token, refreshToken}, user: response }, message: "User Created Successfully!"});

}

async function loginController(req:Request, res:Response){
    const data = req.body || req.body.data;
    const user = await loginUser(data); 

    token = jwt.sign(user.toJSON(), secret, {expiresIn: "1h" });
    refreshToken = jwt.sign(user.toJSON(), refreshSecret, { expiresIn: "1d"});
    
    res.json({success: true, data: { token, refreshToken }, message: "Login Successfully!"});
}


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