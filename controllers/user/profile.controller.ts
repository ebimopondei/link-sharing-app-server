import { Request, Response } from "express";
import { getUserProfileDetails, updateUserProfile } from "../../database/sql";
import { cloudinary } from "../../config/cloudinary";

const fs = require( 'fs')


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
        const avatarPath = req?.file?.path

        if(!avatarPath) {
            res.status(400).json( { error: 'No file uploaded'})
            return 
        }

        const result = await cloudinary.uploader.upload(avatarPath)
        const url = cloudinary.url(result.public_id)
        console.log(url)

        const response = await updateUserProfile(user.id, data, result)

        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
            console.log('deleted')
        } else {

            console.log('not found')

        }
        
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