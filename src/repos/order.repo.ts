import prisma from "../config/prisma.config";


export const getAllUserOrders = async (userId: string) => {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    
    return orders;
}


export const getSingleUserOrder = async (id:  string) => {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    
    return order
}