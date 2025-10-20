import express, { Express, NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import swaggerOptions from "./config/swagger.config";


import authRouter from "./routes/auth.route"
import productRouter from "./routes/product.route"
import cartRouter from "./routes/cart.route";
import categoryRouter from "./routes/category.route"
import orderRouter from "./routes/order.route"
import wishlistRouter from "./routes/wishlist.route"
import reviewRouter from "./routes/review.route"

import { exceptionHandler } from "./middleware/exeption";

dotenv.config();

const app: Express = express();
export const PORT = process.env.PORT || 3000;


// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// SWAGGER DOCUMENTATION
// ============================================
const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    message: 'Prime Basket API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/reviews', reviewRouter);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Global error handler
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined,
//   });
// });

app.use(exceptionHandler)

export default app