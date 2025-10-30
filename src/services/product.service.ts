import { BadRequest } from "../errors/bad-request.error";
import NotFoundError from "../errors/not-found.error";
import * as productRepo from "../repos/product.repo";
import * as orderItemRepo from "../repos/order-item.repo";
import { AuthRequest, CreateProductBody, UpdateProductBody } from "../types";
import * as imageHandler from "../utils/cloudinary";

export const getAllProducts = async () => {
  const products = await productRepo.getAllProducts();

  if (!products) {
    throw new NotFoundError("Products Not Found");
  }

  const formattedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));

  
  return formattedProducts;
};

export const getSingleProduct = async (req: AuthRequest) => {
  const { id } = req.params;

  const products = await productRepo.getSingleProductById(id);

  if (!products) {
    throw new NotFoundError("Product Not Found");
  }

  return products;
};

export const createProduct = async (req: AuthRequest) => {
  try {
    const data = req.body as CreateProductBody;
    const files = req.files as Express.Multer.File[] | undefined;

    // Validate required fields
    if (!data.name || !data.description || !data.price) {
      throw new BadRequest("Name, description, and price are required");
    }

    let mainImageUrl: string | undefined;
    let additionalImages: string[] = [];

    // ===== HANDLE MAIN IMAGE =====
    // Priority: 1. Uploaded file, 2. Image URL
    if (files && files.length > 0) {
      // First file is the main image
      const mainImageFile = files[0];
      const uploadResult = await imageHandler.uploadImageToCloudinary(
        mainImageFile.buffer,
        "products/main"
      );
      mainImageUrl = uploadResult.url;
    } else if (data.imageUrl) {
      // Use provided URL
      const uploadResult = await imageHandler.uploadImageFromUrl(
        data.imageUrl,
        "products/main"
      );
      mainImageUrl = uploadResult.url;
    } else {
      throw new BadRequest("At least one product image is required");
    }

    // ===== HANDLE ADDITIONAL IMAGES =====
    // Combine uploaded files (skip first one as it's main image) and URLs
    const additionalFiles = files && files.length > 1 ? files.slice(1) : [];
    const additionalUrls = data.additionalImageUrls || [];

    if (additionalFiles.length > 0 || additionalUrls.length > 0) {
      additionalImages = await imageHandler.uploadMultipleImages(
        additionalFiles,
        additionalUrls,
        "products/additional"
      );
    }

    // ===== CREATE PRODUCT =====
    const productData = {
      ...data,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : 0,
      costPrice: data.costPrice ? Number(data.costPrice) : 0,
      stock: data.stock ? Number(data.stock) : 0,
      isFeatured: Boolean(data.isFeatured),
      imageUrl: mainImageUrl,
      images: additionalImages,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    const product = await productRepo.createProduct(productData);

    if (!product) {
      throw new NotFoundError("Product creation failed");
    }

    return product;
  } catch (error: any) {
    // If error occurs, we might want to cleanup uploaded images
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (req: AuthRequest) => {
  const { id } = req.params;

  const data = req.body;

  

  return await productRepo.updateProductById(id, {
    ...data,
    comparePrice: Number(data.comparePrice),
    costPrice: Number(data.costPrice),
    isFeatured: Boolean(data.isFeatured),
    stock: Number(data.stock),
    price: Number(data.price),
  });

  
};

export const deleteProduct = async (req: AuthRequest) => {
  const { id } = req.params;

  const productInUse = await orderItemRepo.findOrderByProductId(id);

  if (productInUse) {
    throw new BadRequest(
      "Cannot delete product because it is linked to an existing order."
    );
  }

  await productRepo.deleteProductById(id);
};
