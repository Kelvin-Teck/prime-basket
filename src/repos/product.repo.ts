import prisma from "../config/prisma.config";
import { CreateProductBody, UpdateProductBody } from "../types";

export const createProduct = async (data: CreateProductBody) => {
  const { categoryId, ...rest } = data as any;
  const product = await prisma.product.create({
    data: {
      ...rest,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    },
  });

  return product;
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getSingleProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export const updateProductById = async (
  id: string,
  data: UpdateProductBody
) => {
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return product;
};

export const deleteProductById = async (id: string) => {
  await prisma.product.delete({
    where: { id },
  });
};
