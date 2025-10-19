import prisma from "../config/prisma.config";

export const findSingleDeliveredOrderItem = async (userId: string, productId: string) => {
       return  await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              userId,
              status: "DELIVERED",
            },
          },
        });
}