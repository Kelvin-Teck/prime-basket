# E-Commerce Backend API

A full-featured e-commerce REST API built with Node.js, Express, Prisma ORM, and PostgreSQL.

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (USER, ADMIN)
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes

### Product Management
- ✅ CRUD operations for products
- ✅ Product categories
- ✅ Product reviews and ratings
- ✅ Stock management
- ✅ Featured products
- ✅ SEO-friendly URLs (slugs)

### Shopping Features
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Order placement and tracking
- ✅ Order history
- ✅ Multiple order statuses

### Advanced Features
- ✅ Input validation with Zod
- ✅ Comprehensive error handling
- ✅ Database transactions
- ✅ Product snapshots in orders
- ✅ Verified purchase reviews
- ✅ Decimal precision for prices

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Create database (if needed)
createdb ecommerce_db

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Models
- **User** - User accounts with roles
- **Product** - Product catalog with pricing and stock
- **Category** - Product categories
- **CartItem** - Shopping cart items
- **Order** - Customer orders with full address details
- **OrderItem** - Individual items in orders
- **Wishlist** - Saved products
- **Review** - Product reviews and ratings

## 🔐 Authentication

### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### Using the JWT Token

Include the token in the Authorization header for protected routes:

```http
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Public Routes (No Authentication Required)

#### Products
```http
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
```

#### Categories
```http
GET    /api/categories            # Get all categories
GET    /api/categories/:slug      # Get category with products
```

#### Reviews
```http
GET    /api/reviews/product/:productId  # Get product reviews
```

### Protected Routes (Authentication Required)

#### Cart
```http
GET    /api/cart                  # Get user's cart
POST   /api/cart                  # Add item to cart
PUT    /api/cart/:id              # Update cart item quantity
DELETE /api/cart/:id              # Remove item from cart
```

**Add to Cart:**
```json
POST /api/cart
{
  "productId": "product_id",
  "quantity": 2
}
```

#### Orders
```http
GET    /api/orders                # Get user's orders
GET    /api/orders/:id            # Get single order
POST   /api/orders/checkout       # Place order from cart
```

**Checkout:**
```json
POST /api/orders/checkout
{
  "shippingName": "John Doe",
  "shippingEmail": "user@example.com",
  "shippingPhone": "+234 801 234 5678",
  "shippingAddress": "123 Main Street",
  "shippingCity": "Lagos",
  "shippingState": "Lagos",
  "shippingZip": "100001",
  "shippingCountry": "NG",
  "paymentMethod": "credit_card",
  "customerNotes": "Please ring doorbell"
}
```

#### Wishlist
```http
GET    /api/wishlist              # Get user's wishlist
POST   /api/wishlist/:productId   # Add product to wishlist
DELETE /api/wishlist/:productId   # Remove from wishlist
GET    /api/wishlist/check/:productId  # Check if in wishlist
```

#### Reviews
```http
GET    /api/reviews/my-reviews    # Get user's reviews
POST   /api/reviews               # Create review
PUT    /api/reviews/:id           # Update review
DELETE /api/reviews/:id           # Delete review
```

**Create Review:**
```json
POST /api/reviews
{
  "productId": "product_id",
  "rating": 5,
  "title": "Amazing product!",
  "comment": "This product exceeded my expectations..."
}
```

### Admin Only Routes

#### Products (Admin)
```http
POST   /api/products              # Create product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
```

**Create Product:**
```json
POST /api/products
Authorization: Bearer <admin-token>

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Categories (Admin)
```http
POST   /api/categories            # Create category
PUT    /api/categories/:id        # Update category
DELETE /api/categories/:id        # Delete category
```

#### Reviews (Admin)
```http
PATCH  /api/reviews/:id/approve   # Approve review
```

## 🧪 Testing the API

### Using the Seed Data

After running `npm run prisma:seed`, you'll have:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Accounts:**
- Email: `user@example.com` / Password: `user123`
- Email: `jane@example.com` / Password: `user123`

**Sample Data:**
- 4 categories
- 10 products
- Pre-filled carts
- Sample orders
- Product reviews

### Example API Flow

1. **Register/Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'
```

2. **Get Products**
```bash
curl http://localhost:5000/api/products
```

3. **Add to Cart**
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"productId":"product_id","quantity":1}'
```

4. **Place Order**
```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{ ... shipping details ... }'
```

## 🗂️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── middleware/
│   │   ├── auth.ts         # JWT authentication
│   │   └── validation.ts   # Input validation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── wishlist.routes.ts
│   │   └── review.routes.ts
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── utils/
│   │   └── prisma.ts       # Prisma client
│   └── server.ts           # Main server file
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication (7-day expiry)
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ CORS configuration
- ✅ Environment variable protection

## 📈 Database Best Practices

- ✅ Proper indexing for faster queries
- ✅ Cascade deletes for data integrity
- ✅ Unique constraints
- ✅ Database transactions for critical operations
- ✅ Decimal types for accurate currency handling
- ✅ Timestamps for auditing
- ✅ Soft deletes via `isActive` flags

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="strong-random-secret-key"
NODE_ENV="production"
PORT=5000
FRONTEND_URL="https://your-frontend-domain.com"
```

### Deployment Platforms

- **Render** (Recommended for PostgreSQL)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS/GCP/Azure**

### Quick Deployment Steps

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Run build command: `npm run build`
5. Start command: `npm start`
6. Run migrations: `npx prisma migrate deploy`

## 🛠️ Development Commands

```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run prisma:studio       # Open Prisma Studio (database GUI)

# Database
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Create and run migrations
npm run prisma:seed         # Seed database with sample data

# Production
npm run build               # Build TypeScript
npm start                   # Start production server
```

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ]  // For validation errors
}
```

## 🐛 Common Issues & Solutions

### Database Connection Error
```bash
# Check if PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
# Ensure database exists: createdb ecommerce_db
```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Migration Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then reseed
npm run prisma:seed
```

### Port Already in Use
```bash
# Change PORT in .env file
# Or kill the process using the port:
# On Mac/Linux: lsof -ti:5000 | xargs kill -9
# On Windows: netstat -ano | findstr :5000
```

## 📊 Performance Optimizations

- Database indexing on frequently queried fields
- Prisma query optimization with `select` and `include`
- Connection pooling
- Proper use of database transactions
- Efficient N+1 query prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👤 Author

Your Name - Full Stack Developer

## 🙏 Acknowledgments

- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- Zod Validation

---

**Happy Coding! 🚀**