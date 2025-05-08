import { Op } from 'sequelize';
import User from '../models/user';
import UserLinks from '../models/links';
import Verification from '../models/verification';
import '../database/setup';

import path from 'path';
import { DatabaseError } from '../utils/DatabaseError';
const fs = require( 'fs')


interface LinkInput {
    id?: string;
    platform: string;
    order: string;
    url: string;
  }


const signupUser = async(user:User)=>{
    const {
        email,
        password,
        password_hash
    } = user;

    let toString, res

    res = await User.findAll( {where: { email } } );
    
    if(res.length > 0) throw new DatabaseError('Email exists in database', 409)
    
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

const updateUserProfile = async(userId:string, user:User, avatar_url:string ='')=>{
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

      if (avatar_url && existingUser.avatar_url && existingUser.avatar_url !== avatar_url) {
    
        const filePath = path.join(__dirname, `../uploads/${existingUser.avatar_url}`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('deleted')
        } else {

            console.log('not found')

        }
      }
      
      const data = await User.update({ username, firstname, lastname, email, address, country, phone, dob, avatar_url }, { where: { id: userId } } );
      
      return {
          success: true,
          data,
          message: "User Updated successfully"
      }   

  } catch (error) {
      console.error('Error deleting avatar:', error);
      
  }

}

const getUserLinks = async (userId:string) => {
    const response = await UserLinks.findAll( { where: { user_id: userId }});

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
        const { id, platform, url, order } = link;
  
        if (id) {
          await UserLinks.update( { platform, url, order }, { where: { id, user_id: userId } });
        } else {
          await UserLinks.create({ user_id: userId, platform, url, order });
        }
      }
  
      return;
  };

async function getUserProfileDetails (userId:string) {
    const response = User.findOne( { where: { id: userId}})
    return response
}



export { 
    loginUser, 
    signupUser,
    updateUserProfile,
    getUserLinks,
    addNewLinks,
    getUserProfileDetails
}