import prisma from "../config/prisma.config";

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return categories;
};

export const getSingleCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return category;
};

export const createCategory = async (data: any) => {
  const category = await prisma.category.create({
    data: {
      ...data,
    },
  });

  return category;
};


export const updateCategory = async (id: string, data:any) => {
    return await prisma.category.update({
        where: { id },
        data: {
            ...data
        }
    });
}

export const deleteCategory = async (id: string) => {
    return await prisma.category.delete({
        where: { id },
      });
}