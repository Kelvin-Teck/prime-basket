import { User } from "@prisma/client";
import prisma from "../config/prisma.config";

export const findUserByEmail = async (email: string) => {
 const user  =    await prisma.user.findUnique({
      where: { email },
 });
    
    return user;
}


export const createUser = async (data: any) => {
  return    await prisma.user.create({
       data: {
         email:data.email,
         password: data.password,
         name:data.name,
       },
     });

}