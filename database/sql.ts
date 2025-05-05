import { Op } from 'sequelize';
import User from '../models/user';
import Verification from '../models/verification';
import { returnJson } from '../helpers';
import '../database/setup';


const signupUser = async(user:User)=>{
    const {
        email,
        password,
        password_hash
    } = user;

    let toString, res, toJson;

    res = await User.findAll( {where: { email } } );
    toString = JSON.stringify(res)
    toJson = JSON.parse(toString)[0]
    if(toJson) return { success: false, data: null, message: "Email exists in database!" }
    
    
    res = await User.create( {
        email,
        password,
        password_hash
    });

    toString = JSON.stringify(res)
    
    toJson = JSON.parse(toString)
    console.log('created user', toJson)

    res = await Verification.create( {
        token: password_hash,
        userId: toJson.id 
    })

    return {
        success: true,
        data: toJson,
        message: "User Created successfully"
    }
    
}

const loginUser = async({ email, password } : User) => {

    let res = await User.findAll( { where: { [Op.and]: [ { [Op.or]: [{ email }, { username: email }]}, { password }] }, attributes: { exclude: ['password, address, country, phone, dob, emailverified']}})
    const toJson = returnJson(res);
    
    if ( toJson.length === 0 ) return { success: false, data: toJson, message: "User not found" };

   
    return { success: true, data: toJson, message: "User Found" }
}

const updateUserProfile = async(user:User)=>{
    const {
        id,
        username,
        firstname,
        lastname,
        email,
        address,
        country,
        phone,
        dob,
    } = user;

    const res = await User.update({ username, firstname, lastname, email, address, country, phone, dob }, { where: { id } } );
    const userUpdated = returnJson(res)
    
    return {
        success: true,
        data: userUpdated,
        message: "User Updated successfully"
    }    
}

export { 
    loginUser, 
    signupUser,
    updateUserProfile 
}