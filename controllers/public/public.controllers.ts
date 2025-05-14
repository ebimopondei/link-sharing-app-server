import { Request, Response } from "express";
import {  getUserPublicProfile } from "../../database/sql";

async function handleGetUserPublicProfile(req:Request, res:Response){
    const username = req.params.username

    try {
        const response = await getUserPublicProfile(username)
        res.json({success: true, data: response, message: "Platforms Found"});
    } catch (err:any) {
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }
}


export {
    handleGetUserPublicProfile
}