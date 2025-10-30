import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  sku?: string;
  categoryId?: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  // Image handling
  imageUrl?: string; // For URL-based main image
  additionalImageUrls?: string[]; // For URL-based additional images
}

export interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  
}

export interface AddToCartBody {
  productId: string;
  quantity: number;
}

export interface UpdateCartBody {
  quantity: number;
}
