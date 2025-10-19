import { AuthRequest } from "../types";
import * as categoryRepo from "../repos/category.repo";
import NotFoundError from "../errors/not-found.error";
import * as helpers from "../utils/helpers";

export const getAllCategories = async (req: AuthRequest) => {
  const categories = await categoryRepo.getAllCategories();

  return categories;
};

export const getSingleCategory = async (req: AuthRequest) => {
  const { slug } = req.params;

  const category = await categoryRepo.getSingleCategoryBySlug(slug);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const createCategory = async (req: AuthRequest) => {
  const { name, description, imageUrl, sortOrder } = req.body;

  // Generate slug
  const slug = helpers.generateSlug(name);

  const data = {
    name,
    slug,
    description,
    imageUrl,
    sortOrder: sortOrder || 0,
  };

  const category = await categoryRepo.createCategory(data);

  return category;
};

export const updateCategory = async (req: AuthRequest) => {
  const { id } = req.params;
  const { name, description, imageUrl, sortOrder, isActive } = req.body;
  // Generate new slug if name changed
  let slug;

  if (name) {
    slug = helpers.generateSlug(name);
  }

  const data = { name, description, imageUrl, sortOrder, isActive };

  const category = categoryRepo.updateCategory(id, data);

  return category;
};

export const deleteCategory = async (req: AuthRequest) => {
  const { id } = req.params;

    await categoryRepo.deleteCategory(id);
    return;
};
