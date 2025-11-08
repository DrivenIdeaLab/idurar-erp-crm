# IDURAR Architecture Documentation

This document provides a comprehensive overview of the IDURAR ERP/CRM system architecture, design patterns, and technical implementation details.

## Table of Contents

- [System Overview](#system-overview)
- [High-Level Architecture](#high-level-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Design](#database-design)
- [Security Architecture](#security-architecture)
- [File Storage Architecture](#file-storage-architecture)
- [Email System](#email-system)
- [API Architecture](#api-architecture)
- [State Management](#state-management)
- [Design Patterns](#design-patterns)

## System Overview

IDURAR is built as a **modern monorepo application** using the MERN stack with clear separation of concerns between frontend and backend. The system follows a **three-tier architecture**:

1. **Presentation Layer** - React.js frontend with Ant Design UI
2. **Application Layer** - Express.js REST API server
3. **Data Layer** - MongoDB database

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│              React 18 + Ant Design + Redux                   │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Invoice   │  │   Quote    │  │   Payment/Client   │   │
│  │  Module    │  │   Module   │  │     Modules        │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (Axios)
┌───────────────────────────▼─────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                Express.js + Node.js 20                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Authentication  │  Validation  │  Business Logic   │   │
│  │     (JWT)        │    (Joi)     │  (Controllers)    │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼─────────────────────────────────┐
│                       DATA LAYER                             │
│                    MongoDB Database                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Invoices │  │  Quotes  │  │ Payments │  │  Clients │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## High-Level Architecture

### Component Interaction Diagram

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────┐
│          React Frontend (Port 3000)          │
│  ┌────────────────────────────────────────┐  │
│  │  React Router │ Redux Store │ Axios    │  │
│  └────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────┘
       │ HTTP REST API
       ▼
┌──────────────────────────────────────────────┐
│      Express.js Backend (Port 8888)          │
│  ┌────────────────────────────────────────┐  │
│  │         Middleware Pipeline            │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ 1. CORS                          │  │  │
│  │  │ 2. Rate Limiting                 │  │  │
│  │  │ 3. Body Parser                   │  │  │
│  │  │ 4. Cookie Parser                 │  │  │
│  │  │ 5. Authentication (JWT)          │  │  │
│  │  │ 6. Validation (Joi)              │  │  │
│  │  │ 7. Route Handler                 │  │  │
│  │  │ 8. Error Handler                 │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌────────────────┐
│   MongoDB   │  │   AWS S3       │
│  Database   │  │ File Storage   │
└─────────────┘  └────────────────┘
       │
       ▼
┌─────────────────┐
│  External APIs  │
│  - Resend       │
│  - OpenAI       │
└─────────────────┘
```

## Backend Architecture

### Directory Structure

```
backend/src/
├── controllers/
│   ├── appControllers/        # Business logic controllers
│   │   ├── invoiceController/
│   │   ├── quoteController/
│   │   ├── paymentController/
│   │   └── clientController/
│   ├── coreControllers/       # Core system controllers
│   │   ├── authController/
│   │   └── adminController/
│   └── pdfController/         # PDF generation
│
├── models/
│   ├── appModels/             # Business domain models
│   │   ├── Invoice.js
│   │   ├── Quote.js
│   │   ├── Payment.js
│   │   ├── Client.js
│   │   ├── PaymentMode.js
│   │   └── Taxes.js
│   └── coreModels/            # Core system models
│       ├── Admin.js
│       ├── AdminPassword.js
│       ├── Setting.js
│       └── Upload.js
│
├── routes/
│   ├── appRoutes/             # Business routes
│   │   └── index.js
│   └── coreRoutes/            # Core routes
│       └── index.js
│
├── middlewares/               # Custom middleware
│   ├── auth.js                # JWT authentication
│   ├── permission.js          # Role-based access
│   └── uploadMiddleware.js    # File upload handling
│
├── handlers/                  # Response handlers
│   ├── errorHandlers.js
│   └── successHandlers.js
│
├── utils/                     # Utility functions
│   ├── helpers.js
│   └── validators.js
│
├── emailTemplate/             # Pug email templates
│   └── invoice.pug
│
├── pdf/                       # PDF generation
│   └── templates/
│
└── setup/                     # Database initialization
    ├── setup.js
    ├── upgrade.js
    └── reset.js
```

### MVC Pattern Implementation

IDURAR follows the **Model-View-Controller (MVC)** pattern:

```
Request Flow:
Client → Route → Middleware → Controller → Model → Database
                    ↓             ↓
                Validation    Business Logic
                    ↓             ↓
                  Error      Response Handler
```

#### Example: Invoice Creation Flow

```javascript
// 1. Route (routes/appRoutes/index.js)
router.post('/invoice', isValidAdminToken, create);

// 2. Middleware (middlewares/auth.js)
const isValidAdminToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify JWT token
  // Attach admin to req.admin
  next();
};

// 3. Controller (controllers/appControllers/invoiceController/create.js)
const create = async (req, res) => {
  try {
    // Validate request body with Joi
    const { error, value } = invoiceSchema.validate(req.body);

    // Business logic
    const invoice = await Invoice.create(value);

    // Send success response
    return successResponse(res, invoice);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// 4. Model (models/appModels/Invoice.js)
const invoiceSchema = new Schema({
  number: Number,
  client: { type: ObjectId, ref: 'Client', autopopulate: true },
  items: [itemSchema],
  total: Number
});
```

### Middleware Pipeline

```javascript
// server.js
app.use(helmet());              // Security headers
app.use(compression());         // Response compression
app.use(cors(corsOptions));     // CORS handling
app.use(cookieParser());        // Cookie parsing
app.use(express.json());        // JSON body parsing
app.use(express.urlencoded());  // URL-encoded parsing
app.use(rateLimiter);           // Rate limiting
app.use('/api', routes);        // API routes
app.use(errorHandler);          // Error handling
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AppRouter
│   ├── PublicRoutes
│   │   └── AuthModule
│   │       ├── LoginForm
│   │       └── ForgotPassword
│   │
│   └── PrivateRoutes
│       ├── DashboardModule
│       │   └── DashboardCards
│       │
│       ├── InvoiceModule
│       │   ├── InvoiceList (CrudModule)
│       │   ├── InvoiceCreate (CrudModule)
│       │   ├── InvoiceRead
│       │   ├── InvoiceUpdate (CrudModule)
│       │   └── RecordPaymentModule
│       │
│       ├── QuoteModule
│       │   ├── QuoteList (CrudModule)
│       │   ├── QuoteCreate (CrudModule)
│       │   └── ConvertToInvoice
│       │
│       ├── PaymentModule
│       │   └── PaymentList
│       │
│       └── SettingModule
│           ├── GeneralSettings
│           ├── PaymentModeSettings
│           └── TaxSettings
```

### Module Structure

Each module follows a consistent pattern:

```
InvoiceModule/
├── index.jsx              # Module entry point
├── components/            # Module-specific components
│   ├── InvoiceForm.jsx
│   ├── InvoiceTable.jsx
│   └── InvoiceItem.jsx
├── hooks/                 # Custom hooks
│   └── useInvoice.js
└── config.js              # Module configuration
```

### Redux State Architecture

```
Redux Store
├── auth                   # Authentication state
│   ├── current            # Current user
│   ├── isLoggedIn
│   └── loading
│
├── crud                   # Generic CRUD state
│   ├── list
│   ├── current
│   ├── isLoading
│   └── isSuccess
│
├── erp                    # ERP-specific state
│   ├── invoice
│   ├── quote
│   ├── payment
│   └── client
│
└── settings               # App settings state
    ├── general
    ├── paymentModes
    └── taxes
```

### Data Flow Pattern

```
Component Dispatch Action
    ↓
Redux Thunk Middleware
    ↓
Async API Call (Axios)
    ↓
Backend API
    ↓
Response
    ↓
Redux Reducer Updates State
    ↓
Component Re-renders with New State
```

## Database Design

### Schema Relationships

```
┌──────────────┐
│    Admin     │
└──────────────┘
       │ 1:1
       ▼
┌──────────────┐
│AdminPassword │
└──────────────┘

┌──────────────┐
│   Client     │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐         ┌──────────────┐
│   Invoice    │◄───────►│  PaymentMode │
└──────┬───────┘   N:1   └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Payment    │
└──────────────┘

┌──────────────┐
│    Quote     │
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│   Client     │
└──────────────┘

┌──────────────┐
│    Taxes     │
└──────────────┘
```

### Key Collections

#### Invoice Schema
```javascript
{
  _id: ObjectId,
  number: Number,           // Auto-incremented
  year: Number,             // Current year
  client: ObjectId,         // Reference to Client
  date: Date,
  expiredDate: Date,
  status: String,           // draft, pending, sent, paid, overdue
  items: [{
    itemName: String,
    description: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  taxRate: Number,
  subTotal: Number,
  taxTotal: Number,
  total: Number,
  credit: Number,
  discount: Number,
  notes: String,
  recurring: String,        // none, daily, weekly, monthly, etc.
  createdBy: ObjectId,      // Reference to Admin
  removed: Boolean,
  enabled: Boolean,
  created: Date,
  updated: Date
}
```

#### Client Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
  notes: String,
  enabled: Boolean,
  removed: Boolean
}
```

### Indexing Strategy

```javascript
// Invoice indexes for performance
Invoice.index({ number: 1, year: 1 }, { unique: true });
Invoice.index({ client: 1 });
Invoice.index({ status: 1 });
Invoice.index({ date: -1 });
Invoice.index({ enabled: 1, removed: 1 });

// Client indexes
Client.index({ email: 1 }, { unique: true, sparse: true });
Client.index({ name: 1 });

// Admin indexes
Admin.index({ email: 1 }, { unique: true });
Admin.index({ removed: 1, enabled: 1 });
```

## Security Architecture

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /api/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  Auth Controller    │
│  1. Validate input  │
│  2. Find admin      │
│  3. Check password  │
│  4. Generate JWT    │
└──────┬──────────────┘
       │ 2. Return JWT token
       ▼
┌─────────────┐
│   Client    │
│ Store Token │
└──────┬──────┘
       │ 3. Subsequent requests
       │    Authorization: Bearer <token>
       ▼
┌─────────────────────┐
│  Auth Middleware    │
│  1. Extract token   │
│  2. Verify JWT      │
│  3. Attach admin    │
└──────┬──────────────┘
       │ 4. Allow access
       ▼
┌─────────────┐
│  Protected  │
│  Resource   │
└─────────────┘
```

### Password Security

```javascript
// Password hashing with salt
1. User registers/changes password
   ↓
2. Generate unique salt (bcrypt.genSalt)
   ↓
3. Hash password + salt (bcrypt.hash)
   ↓
4. Store hash and salt separately
   - AdminPassword.password (hashed)
   - AdminPassword.salt (salt)

// Password verification
1. User attempts login
   ↓
2. Retrieve AdminPassword for user
   ↓
3. Hash input password + stored salt
   ↓
4. Compare with stored hash (bcrypt.compare)
   ↓
5. Match → Success, No Match → Fail
```

### JWT Token Structure

```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: "admin_id",
    email: "admin@example.com",
    role: "owner",
    iat: 1640000000,      // Issued at
    exp: 1640086400       // Expires (24 hours)
  },
  signature: "..."
}
```

### Security Headers (Helmet.js)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Rate Limiting

```javascript
// Authentication endpoints: 5 requests / 15 minutes
// General API: 100 requests / 15 minutes

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
```

## File Storage Architecture

### Upload Flow

```
Client selects file
    ↓
Frontend: FormData with file
    ↓
POST /api/upload
    ↓
Multer middleware processes file
    ↓
┌─────────────────────┐
│  Storage Decision   │
└──────┬──────────────┘
       │
       ├─── Local Storage
       │    └─→ Save to public/uploads/
       │
       └─── AWS S3
            └─→ Upload to S3 bucket
                ↓
            Return S3 URL
    ↓
Save file record to Upload collection
    ↓
Return file URL to client
```

### S3 Integration

```javascript
// S3 client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Upload to S3
const command = new PutObjectCommand({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: `uploads/${filename}`,
  Body: fileBuffer,
  ContentType: file.mimetype
});
```

## Email System

### Email Flow

```
Trigger Event (e.g., Invoice Created)
    ↓
Generate Email Content
    ↓
Render Pug Template
    ↓
Resend API Call
    ↓
Email Sent to Recipient
```

### Pug Template Example

```pug
doctype html
html
  head
    title Invoice #{invoiceNumber}
  body
    h1 Invoice ##{invoiceNumber}
    p Dear #{clientName},
    p Please find your invoice attached.
    table
      each item in items
        tr
          td= item.name
          td= item.quantity
          td= item.price
    p Total: #{total}
```

## API Architecture

### RESTful Principles

```
Resource-based URLs:
GET    /api/invoice       - List invoices
GET    /api/invoice/:id   - Get single invoice
POST   /api/invoice       - Create invoice
PATCH  /api/invoice/:id   - Update invoice
DELETE /api/invoice/:id   - Delete invoice
```

### Response Standardization

```javascript
// Success handler
const successResponse = (res, data, message) => {
  return res.status(200).json({
    success: true,
    result: data,
    message: message || 'Success'
  });
};

// Error handler
const errorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    result: null,
    message: error.message || 'Error'
  });
};
```

## State Management

### Redux Toolkit Slices

```javascript
// Example: Invoice slice
const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    list: [],
    current: null,
    isLoading: false,
    isSuccess: false,
    error: null
  },
  reducers: {
    setInvoices: (state, action) => {
      state.list = action.payload;
    },
    setCurrentInvoice: (state, action) => {
      state.current = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      });
  }
});
```

## Design Patterns

### Used Patterns

1. **MVC (Model-View-Controller)** - Separation of concerns
2. **Repository Pattern** - Data access abstraction through Mongoose models
3. **Middleware Pattern** - Request processing pipeline
4. **Factory Pattern** - Dynamic CRUD module generation
5. **Observer Pattern** - Redux for state management
6. **Singleton Pattern** - Database connection, API client
7. **Dependency Injection** - Middleware and route handlers
8. **Module Pattern** - Frontend feature modules

### Code Organization Principles

- **DRY (Don't Repeat Yourself)** - Reusable components and utilities
- **SOLID Principles** - Single responsibility, open/closed, etc.
- **Separation of Concerns** - Clear boundaries between layers
- **Convention over Configuration** - Consistent naming and structure

## Performance Optimizations

1. **Database Indexing** - Fast queries on frequently searched fields
2. **Response Compression** - Gzip compression for API responses
3. **Caching** - Node-cache for frequently accessed data
4. **Lazy Loading** - Code splitting and dynamic imports in React
5. **Pagination** - Limit data transfer for large lists
6. **Autopopulate** - Mongoose plugin to reduce queries
7. **Production Build** - Minification and optimization with Vite

## Scalability Considerations

1. **Stateless API** - JWT-based auth allows horizontal scaling
2. **Database Indexing** - Handles growing data efficiently
3. **Cloud Storage** - AWS S3 for scalable file storage
4. **Microservices Ready** - Modular structure allows service extraction
5. **Load Balancing** - Stateless design supports load balancers
6. **Caching Layer** - Redis can be added for session/data caching

## Monitoring and Logging

```javascript
// Error logging
app.use((err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  next(err);
});

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

## Deployment Architecture

```
┌─────────────────────┐
│   Load Balancer     │
└──────┬──────────────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Node.js  │   │ Node.js  │   │ Node.js  │
│Instance 1│   │Instance 2│   │Instance 3│
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
     ┌──────────────┴──────────────┐
     ▼                             ▼
┌──────────┐                  ┌─────────┐
│ MongoDB  │                  │  AWS S3 │
│ Cluster  │                  └─────────┘
└──────────┘
```

## Future Enhancements

1. **WebSocket Integration** - Real-time notifications
2. **GraphQL API** - Alternative to REST for complex queries
3. **Redis Caching** - Improved performance for frequently accessed data
4. **Elasticsearch** - Advanced search capabilities
5. **Message Queue** - RabbitMQ/Redis for async processing
6. **Docker Containerization** - Easier deployment and scaling
7. **Kubernetes Orchestration** - Container management
8. **CI/CD Pipeline** - Automated testing and deployment
