import prisma from "../config/prisma.config";

export const getProductReviews = async (productId: string) => {
  return await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserReviews = async (userId: string) => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findSingleProductReviewedByUser = async (
  userId: string,
  productId: string
) => {
  return await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};


export const createReview = async (
data: any
) => {
  return prisma.review.create({
    data: {
...data
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getReviewById = async (id:string) => {
  return await prisma.review.findUnique({
        where: { id },
      });
}



export const updateReview = async (id: string, data: any) => {
  return await prisma.review.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}



export const deleteReview = async (id: string) => {
      await prisma.review.delete({
        where: { id },
      });
  
  
}

export const approveReview = async (id: string) => {
     const review = await prisma.review.update({
      where: { id},
      data: { isApproved: true },
     });
  
  return review;
}