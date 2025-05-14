import { Request, Response } from "express";
import { addNewPlatform, getAllPlatforms } from "../../database/sql";


const handleAddNewPlatform = async(req:Request, res:Response)=>{
    try {
        const data = req.body || req.body.data;
        const response = await addNewPlatform(data)
        res.json({success: true, data: response, message: "User platform added successfully!"});
    }catch(err:any) {
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }

}

async function handleGetAllPlatforms(req:Request, res:Response){
    try {
        const response = await getAllPlatforms()
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
    handleAddNewPlatform,
    handleGetAllPlatforms
}