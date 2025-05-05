import { createHash } from "crypto";

function hashString(string:string) {
  const hash = createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}

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
    generateTransactionId
}