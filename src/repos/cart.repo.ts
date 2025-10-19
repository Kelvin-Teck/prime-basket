import prisma from "../config/prisma.config";

export const getAllCartItems = async (userId: string) => {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });
    
    return cartItems
}


export const getSingleCartItemById = async (id:string) => {
        const cartItem = await prisma.cartItem.findUnique({
          where: { id },
          include: { product: true },
        });
    
    
    return cartItem;
}


export const getCartItem = async (userId: string, productId: string) => {
    const cartItem = prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });


    return cartItem;
}

export const updateCartItemQuantity = async (quantity: number, id: string) => {
  return await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });
}


export const createCartItem = async (userId: string, productId: string, quantity: number ) => {
   return await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: { product: true },
    });
}

export const removeCartItem = async (id: string) => {
      await prisma.cartItem.delete({
        where: { id },
      });
}