import { Request, Response } from "express";
import { addNewLinks, getUserLinks } from "../../database/sql";


const handleAddNewLinks = async(req:Request, res:Response)=>{
    try {
        // @ts-ignore
        const user = req.parsedToken;
        const data = req.body || req.body.data;
        const response = await addNewLinks(user.id, data)
        res.json({success: true, data: response, message: "User Links Created Successfully!"});
    }catch(err:any) {
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }

}

async function handleGetUserLinks(req:Request, res:Response){
    try {
        // @ts-ignore
        const user = req.parsedToken;
        const response = await getUserLinks(user.id)
        res.json({success: true, data: response, message: "User Links Found"});
    } catch (err:any) {
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message || 'Internal server error',
          });
    }
}


export {
    handleAddNewLinks,
    handleGetUserLinks
}