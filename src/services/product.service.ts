import NotFoundError from "../errors/not-found.error";
import * as productRepo from "../repos/product.repo";
import { AuthRequest, CreateProductBody, UpdateProductBody } from "../types";

export const getAllProducts = async () => {
    const products = await productRepo.getAllProducts();
    
    if (products.length == 0) {
        throw new NotFoundError('Products Not Found');
    }

    return products;
}

export const getSingleProduct = async (req: AuthRequest

) => {
    const { id } = req.params;

    const products = await productRepo.getSingleProductById(id);
    
    if (!products) {
        throw new NotFoundError('Product Not Found');
    }

    return products;
}

export const createProduct = async (req: AuthRequest

) => {
    
    const data = req.body as CreateProductBody;

    const products = await productRepo.createProduct(data);
    
    if (!products) {
        throw new NotFoundError('Product Not Found');
    }

    return products;
}

export const updateProduct = async (req: AuthRequest

) => {
    const { id } = req.params;
    
    const data = req.body as UpdateProductBody;

    await productRepo.updateProductById(id, data);
    
}

export const deleteProduct = async (req: AuthRequest

) => {
    const { id } = req.params;

    await productRepo.deleteProductById(id);
    
}


