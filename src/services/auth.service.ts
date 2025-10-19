import bcrypt from "bcryptjs";
import { AuthRequest, LoginBody, RegisterBody } from "../types";
import * as userRepo from "../repos/user.repo";
import AlreadyExists from "../errors/already-exist.error";
import * as encryptor from "../utils/encryptor";
import { BadRequest } from "../errors/bad-request.error";

export const register = async (req: AuthRequest) => {
  const { email, password, name } = req.body as RegisterBody;

  // Check if user exists
  const existingUser = await userRepo.findUserByEmail(email);

  if (existingUser) {
    throw new AlreadyExists("This User already exist");
  }

  // Hash password
  const hashedPassword = await encryptor.hashedPassword(password);
  let data = { email, password: hashedPassword, name };
  // Create user
  const user = await userRepo.createUser(data);
  // Generate token
  const token = await encryptor.generateAccessToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};


export const login = async (req: AuthRequest) => {

     const { email, password } = req.body as LoginBody;

     // Find user
    const user = await userRepo.findUserByEmail(email);
    
     if (!user) {
       throw new BadRequest('Invalid Credentials')
     }

     // Verify password
    const validPassword = await encryptor.comparePassword(password, user.password);
    
    if (!validPassword) {
        throw new BadRequest("Invalid Credentials");
     }

     // Generate token
     const token = await encryptor.generateAccessToken(user)

     return {
       token,
       user: {
         id: user.id,
         email: user.email,
         name: user.name,
         role: user.role,
       },
     };
}