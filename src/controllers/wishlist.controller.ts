import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as wishListService from "../services/wishlist.service"


export const getUserWishList = async (req:AuthRequest, res: Response) => {
     try {
       const response = await wishListService.getUserWishList(req);

       helpers.successResponse(
         res,
         200,
         "wishList retrieved successfully",
         response
       );
     } catch (error: any) {
       console.error("Get products error:", error);

       helpers.errResponse(
         res,
         error.code,
         "Failed to retrieve wishlist",
         error.message
       );
     }   
}

export const addToWishList = async (req: AuthRequest, res: Response) => {
     try {
       const response = await wishListService.addToWishList(req);

       helpers.successResponse(
         res,
         201,
         "item added to wishList",
         response
         );
         
     } catch (error: any) {
       console.error("Get products error:", error);

       helpers.errResponse(
         res,
         error.code,
         "Failed to add item to wishlist",
         error.message
       );
     }   
}

export const  removeItemFromWishList = async (req: AuthRequest, res: Response) => {
         try {
       const response = await wishListService.removeItemFromWishList(req);

       helpers.successResponse(
         res,
         200,
         "item removed from wishList",
         response
         );
         
     } catch (error: any) {
       console.error("Get products error:", error);

       helpers.errResponse(
         res,
         error.code,
         "Failed to remove item from wishlist",
         error.message
       );
     } 
}


export const checkProductInWishList = async (req: AuthRequest, res: Response) => {
             try {
               const response = await wishListService.checkProductInWishList(
                 req
               );

               helpers.successResponse(
                 res,
                 200,
                 "product in wishlist retrieved successfully",
                 response
               );
             } catch (error: any) {
               console.error("Get products error:", error);

               helpers.errResponse(
                 res,
                 error.code,
                 "Failed to retrieve product in wishlist",
                 error.message
               );
             } 
}