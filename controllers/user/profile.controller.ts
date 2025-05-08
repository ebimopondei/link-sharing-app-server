import { Request, Response } from "express";
import { getUserProfileDetails, updateUserProfile } from "../../database/sql";

async function handleGetUserProfile (req:Request, res:Response){
    try {
        // @ts-expect-error
        const user = req.parsedToken
        const response = await getUserProfileDetails(user.id)
        res.status(200).json( { success: true, data: response, message: 'profile found'})
    }catch (err:any ){
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }  
} 

async function handleUpdateUserProfile (req:Request, res:Response) {
    try {
        //@ts-expect-error
        const user = req.parsedToken;
        const data = req.body || req.body.data;
        const avatar = req.file
        const response = await updateUserProfile(user.id, data, avatar?.filename)
        res.json(response)
    
    }catch(err:any) {
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }
}

export {
    handleGetUserProfile,
    handleUpdateUserProfile
}