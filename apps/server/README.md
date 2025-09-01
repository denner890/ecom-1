# MerchApp Server

Modern Node.js API server with Express, MongoDB, and TypeScript for the MerchApp e-commerce platform.

## Features

- **Express.js** with TypeScript and modern ES modules
- **MongoDB** with Mongoose ODM and optimized schemas
- **JWT Authentication** with Firebase integration
- **RESTful API** with comprehensive error handling
- **File Uploads** via Cloudinary integration
- **Rate Limiting** and security middleware
- **Comprehensive Logging** with Winston
- **Input Validation** with express-validator
- **Testing Setup** with Jest and Supertest

## Environment Variables

Create a `.env` file in the `apps/server` directory with the following variables:

### Required Configuration
```env
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/merch-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Cloudinary Configuration
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Firebase Configuration (Optional)
```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:3001`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run clean` - Clean build artifacts and node_modules

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/firebase` - Authenticate with Firebase token
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/categories` - Get product categories
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create new order (protected)
- `POST /api/orders/:id/cancel` - Cancel order (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/items` - Add item to cart (protected)
- `PUT /api/cart/items/:itemId` - Update cart item (protected)
- `DELETE /api/cart/items/:itemId` - Remove cart item (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Utility
- `GET /health` - Health check endpoint

## Project Structure

```
src/
├── controllers/         # Route handlers and business logic
│   ├── authController.ts
│   ├── productController.ts
│   └── orderController.ts
├── middleware/          # Express middleware
│   ├── auth.ts         # JWT authentication
│   └── errorHandler.ts # Global error handling
├── models/             # Mongoose schemas
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
├── routes/             # Express route definitions
│   ├── authRoutes.ts
│   ├── productRoutes.ts
│   ├── orderRoutes.ts
│   └── cartRoutes.ts
├── utils/              # Utility functions
│   ├── logger.ts       # Winston logging
│   ├── cloudinary.ts   # Image upload helpers
│   └── firebase.ts     # Firebase admin helpers
├── config/             # Configuration files
│   └── db.ts          # MongoDB connection
├── types/              # TypeScript definitions
│   └── index.d.ts
├── tests/              # Test files
│   ├── setup.ts
│   ├── auth.test.ts
│   ├── products.test.ts
│   ├── orders.test.ts
│   └── cart.test.ts
├── app.ts              # Express app setup
└── index.ts            # Server entry point
```

## Database Models

### User Model
- Email/password authentication
- Firebase UID integration
- User roles (user/admin)
- Address management
- User preferences

### Product Model
- Complete product information
- SEO optimization fields
- Inventory management
- Variant support (sizes, colors)
- Image gallery
- Category and tag system

### Order Model
- Order lifecycle management
- Payment integration ready
- Shipping address handling
- Order item details with variants
- Status tracking

## Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration for client integration
- **JWT** token-based authentication
- **Input validation** with express-validator
- **Password hashing** with bcryptjs
- **Firebase token verification** for OAuth

## File Upload Integration

The server includes Cloudinary integration for secure image uploads:

- **Multer** for handling multipart/form-data
- **Cloudinary** for image storage and optimization
- **Signed uploads** for production security
- **Image transformation** support

## Testing

The project includes a comprehensive testing setup:

- **Jest** for test framework
- **Supertest** for API testing
- **MongoDB Memory Server** for isolated test database
- **Test utilities** and setup helpers

Run tests with:
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure Firebase service account
5. Set up Cloudinary production credentials
6. Enable proper logging and monitoring

## Development Notes

- The server uses ES modules (type: "module")
- TypeScript path mapping is configured for clean imports
- All routes include proper error handling and validation
- Logging is configured for both development and production
- The cart implementation uses in-memory storage (replace with Redis for production)