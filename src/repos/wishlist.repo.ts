import prisma from "../config/prisma.config"

export const getAllUserWishList = async (userId: string) => {
   return  await prisma.wishlist.findMany({
      where: { userId},
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

}


export const findProductInUserWishList = async (userId: string, productId:string) => {  
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    

    return wishlist;
}

export const addToWishList = async (userId: string, productId:string) => {
      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    
    
    return wishlistItem;
}


export const deleteItemFromWishList = async (userId: string, productId: string) => {
        await prisma.wishlist.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });
}