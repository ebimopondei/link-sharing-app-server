import { createHash } from "crypto";
import multer from "multer";
import path from "path";

function hashString(string:string) {
  const hash = createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './dist/uploads/');
  },
  
  filename: (req, file, cb) => {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const newFileName = file.originalname + uniqueSuffix + fileExtension;
    cb(null, newFileName);
  },
});

const upload = multer({storage});

function returnJson(result: any){
  const toString = JSON.stringify(result);
  return JSON.parse(toString);
}

const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substr(2, 5);
  return `tx-${timestamp}-${randomSuffix}`;
};

export {
    hashString,
    returnJson,
    generateTransactionId,
    upload
}