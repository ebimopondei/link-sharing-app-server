import { Op, QueryTypes } from 'sequelize';
import User from '../models/user';
import UserLinks from '../models/user-links';
import Verification from '../models/verification';
import '../database/setup';

import path from 'path';
import { DatabaseError } from '../utils/DatabaseError';
import Links from '../models/links';
import { cloudinary } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
const fs = require( 'fs')


interface LinkInput {
    id?: string;
    platform_id: string;
    order: string;
    url: string;
  }

  interface Link {
    icon: string;
    platform: string;
  }


const signupUser = async(user:User)=>{
    const {
        email,
        password,
        password_hash
    } = user;

    let res


    
    res = await User.create( {
        email,
        password,
        password_hash
    });

    await Verification.create( {
        token: password_hash,
        userId: res.id 
    })

    return res
}

const loginUser = async({ email, password } : User) => {

    let res = await User.findOne( {  where: { [Op.and]: [ { [Op.or]: [{ email }, { username: email }]}, { password }] }, attributes: { exclude: ['password', 'password_hash', 'firstname', 'lastname', 'address', 'country', 'phone', 'dob', 'emailverified']}})
    if ( !res ) throw new DatabaseError('User not found', 401);
    return res;
}

const updateUserProfile = async(userId:string, user:User, avatar:Partial<UploadApiResponse>)=>{
    const {
        username,
        firstname,
        lastname,
        email,
        address,
        country,
        phone,
        dob,
    } = user;

    try {

      const existingUser = await User.findOne({ where: { id: userId } });

      if (!existingUser) {
        return {
            success: false,
            message: 'User not found',
            data: null
        };
      }

      if (existingUser.avatar_public_id) {

        cloudinary.uploader.destroy(existingUser.avatar_public_id)
        
      }
      
      const data = await User.update({ username, firstname, lastname, email, address, country, phone, dob, avatar_url: avatar.url, avatar_public_id: avatar.public_id }, { where: { id: userId } } );
      
      return {
          success: true,
          data,
          message: "User Updated successfully"
      }   

  } catch (error:any) {
      console.error('Error:', error.message);
      
  }

}

const getUserLinks = async (userId:string) => {
    const response = await UserLinks.findAll( { where: { user_id: userId }, include: [ Links ]});
    
    return response

}

async function getAllPlatforms(){
  const response = await Links.findAll();
  
  return response

}

const addNewLink = async ( userId: string, links: { id:string, platform:string, order: string, url:string}[]) => {
    
    const existingLinks = await UserLinks.findAll({
        where: { user_id: userId },
        attributes: ['id']
      });
    //   console.log(existingLinks)
      const existingLinkIds = existingLinks.map(link => link.id);
//    console.log(existingLinkIds)
      // 2. Get incoming IDs from client (filter out new ones)
      const incomingIds = links.map(link => link.id).filter(id => !!id);
  
      // 3. Delete links that are no longer present
      const linksToDelete = existingLinkIds.filter(id => !incomingIds.includes(id));
      if (linksToDelete.length > 0) {
        await UserLinks.destroy({
          where: {
            user_id: userId,
            id: { [Op.in]: linksToDelete }
          }
        });
      }
  
      // 4. Upsert each link (update if ID exists, create if not)
      for (const link of links) {
        if (link.id) {
          // Update existing link
          await UserLinks.update({
            platform: link.platform,
            url: link.url,
            order: link.order
          }, {
            where: { id: link.id, user_id: userId }
          });
        } else {
          // Create new link
          await UserLinks.create({
            user_id: userId,
            platform: link.platform,
            url: link.url,
            order: link.order
          });
        }
      }

    return { success: true, data: [], message: 'Links Added'}
}

async function addNewLinks(userId: string, links: LinkInput[]){


    const existingLinks = await UserLinks.findAll({ where: { user_id: userId }, attributes: ['id'] });
    const existingIds = existingLinks.map(link => link.id);
    const incomingIds = links.map(link => link.id).filter(Boolean);
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
        await UserLinks.destroy({ where: { user_id: userId, id: { [Op.in]: idsToDelete } } });
      }
      
      for (const link of links) {
        const { id, platform_id, url, order } = link;
        
        if (id) {
          await UserLinks.update( { platform_id, url, order }, { where: { id, user_id: userId } });
        } else {
          await UserLinks.create({ user_id: userId, platform_id, url, order });
        }
      }
      
      return;
  };

  async function addNewPlatform( { platform, icon, }: Link){

    try{
      const response = await Links.create( { 
      platform, icon
    })}catch (error:any){
      console.error('Error during link creation:', error.name);

  if (error.name === 'SequelizeUniqueConstraintError' && error.errors && error.errors.length > 0) {
    // @ts-expect-error
    const validationMessage = error.errors.map(err => err.message).join(', ');
    
    throw new Error(`${validationMessage}`);
  } else {
    // For other types of errors, re-throw a generic error
    console.error('An unexpected error occurred during link creation:', error.name);
    throw new Error(error.message);
  }
    }
    return;
};

async function getUserProfileDetails (userId:string) {
    const response = User.findOne( { where: { id: userId}})
    return response
}

async function getUserPublicProfile (username:string) {
  const response = User.findOne( { where: { username }, attributes: { exclude: ['password']}, include: [{model:UserLinks, include: [Links], required: true}]})
  return response;
}



export { 
    loginUser, 
    signupUser,
    updateUserProfile,
    getUserLinks,
    addNewLinks,
    getUserProfileDetails,
    addNewPlatform,
    getAllPlatforms,
    getUserPublicProfile
}