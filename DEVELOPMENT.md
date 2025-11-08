# IDURAR Development Guide

This guide provides comprehensive instructions for developers working on the IDURAR ERP/CRM project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Structure](#code-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Development Tasks](#common-development-tasks)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.9.0 (exact version required)
- **npm**: v10.2.4 (exact version required)
- **MongoDB**: v4.4+ (local instance or MongoDB Atlas account)
- **Git**: Latest version
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - MongoDB for VS Code

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm
```

2. **Set up MongoDB**

Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data/directory
```

Option B: MongoDB Atlas (Recommended)
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string

3. **Configure Backend**

```bash
cd backend
cp .env.example .env  # If example exists, otherwise create .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=8888
DATABASE=mongodb://localhost:27017/idurar  # Or your Atlas connection string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RESEND_API=your-resend-api-key  # Optional for email features
OPENAI_API_KEY=your-openai-key  # Optional for AI features
PUBLIC_SERVER_FILE=http://localhost:8888/
```

4. **Install Backend Dependencies**

```bash
npm install
```

5. **Initialize Database**

```bash
npm run setup
```

This creates:
- Default admin user (check console output for credentials)
- Default settings
- Sample payment modes
- Sample tax rates

6. **Configure Frontend**

```bash
cd ../frontend
cp .env.example .env  # If example exists, otherwise create .env
```

Edit `frontend/.env`:
```env
VITE_BACKEND_SERVER=http://localhost:8888/api/
VITE_FILE_BASE_URL=http://localhost:8888/
PROD=false
VITE_DEV_REMOTE=local
```

7. **Install Frontend Dependencies**

```bash
npm install
```

8. **Start Development Servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

9. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8888/api
- Default credentials will be shown in terminal after `npm run setup`

## Development Environment

### Recommended VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

### Environment Variables

#### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production) | Yes | development |
| `PORT` | Server port | Yes | 8888 |
| `DATABASE` | MongoDB connection URI | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `RESEND_API` | Resend email API key | No | - |
| `OPENAI_API_KEY` | OpenAI API key | No | - |
| `PUBLIC_SERVER_FILE` | Public file server URL | Yes | http://localhost:8888/ |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key | No | - |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key | No | - |
| `S3_BUCKET_NAME` | S3 bucket name | No | - |
| `AWS_REGION` | AWS region | No | us-east-1 |

#### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_BACKEND_SERVER` | Backend API URL | Yes | http://localhost:8888/api/ |
| `VITE_FILE_BASE_URL` | File server base URL | Yes | http://localhost:8888/ |
| `PROD` | Production flag | Yes | false |
| `VITE_DEV_REMOTE` | Use remote backend in dev | No | local |

## Code Structure

### Backend Structure

```
backend/src/
├── controllers/           # Request handlers
│   ├── appControllers/    # Business logic
│   │   ├── invoiceController/
│   │   │   ├── create.js
│   │   │   ├── read.js
│   │   │   ├── update.js
│   │   │   ├── delete.js
│   │   │   ├── search.js
│   │   │   └── summary.js
│   │   └── ...
│   └── coreControllers/   # Core functionality
│       └── ...
│
├── models/                # Mongoose schemas
│   ├── appModels/
│   │   ├── Invoice.js
│   │   └── ...
│   └── coreModels/
│       └── ...
│
├── routes/                # API routes
├── middlewares/           # Custom middleware
├── handlers/              # Response handlers
├── utils/                 # Utility functions
├── emailTemplate/         # Email templates
├── pdf/                   # PDF generation
└── setup/                 # Database scripts
```

### Frontend Structure

```
frontend/src/
├── modules/               # Feature modules
│   ├── InvoiceModule/
│   │   ├── index.jsx
│   │   ├── components/
│   │   └── config.js
│   └── ...
│
├── components/            # Shared components
│   ├── common/
│   └── ...
│
├── redux/                 # State management
│   ├── auth/
│   ├── crud/
│   ├── erp/
│   └── settings/
│
├── request/               # API client
│   └── request.js
│
├── router/                # Routing configuration
│   └── AppRouter.jsx
│
├── layout/                # Layout components
│   ├── DashboardLayout/
│   └── ...
│
└── utils/                 # Utility functions
```

## Coding Standards

### JavaScript/React Style Guide

Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with these additions:

#### General Rules

1. **Use single quotes** for strings
```javascript
// Good
const name = 'IDURAR';

// Bad
const name = "IDURAR";
```

2. **Use const/let instead of var**
```javascript
// Good
const immutable = 'value';
let mutable = 'value';

// Bad
var oldSchool = 'value';
```

3. **Use arrow functions**
```javascript
// Good
const add = (a, b) => a + b;

// Avoid (unless you need 'this' binding)
function add(a, b) {
  return a + b;
}
```

4. **Destructure when possible**
```javascript
// Good
const { name, email } = user;
const [first, second] = array;

// Avoid
const name = user.name;
const email = user.email;
```

#### React Conventions

1. **Use functional components with hooks**
```javascript
// Good
const InvoiceForm = ({ invoice, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  return <form>...</form>;
};

// Avoid class components
```

2. **Props destructuring**
```javascript
// Good
const Component = ({ title, description }) => {
  return <div>{title}</div>;
};

// Avoid
const Component = (props) => {
  return <div>{props.title}</div>;
};
```

3. **Use PropTypes or TypeScript**
```javascript
import PropTypes from 'prop-types';

Component.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};
```

#### Naming Conventions

- **Components**: PascalCase (`InvoiceForm`, `PaymentList`)
- **Files**: PascalCase for components (`InvoiceForm.jsx`), camelCase for utilities (`formatCurrency.js`)
- **Variables/Functions**: camelCase (`userName`, `fetchInvoices`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ITEMS`)
- **Redux Actions**: UPPER_SNAKE_CASE (`FETCH_INVOICES_REQUEST`)
- **Database Models**: PascalCase (`Invoice`, `Client`)

#### File Organization

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';

// 2. Constants
const MAX_LENGTH = 100;

// 3. Component
const InvoiceForm = ({ invoice }) => {
  // Hooks
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handleSubmit = () => {
    // Submit logic
  };

  // Render
  return <div>...</div>;
};

// 4. PropTypes
InvoiceForm.propTypes = {
  invoice: PropTypes.object
};

// 5. Export
export default InvoiceForm;
```

### Backend Conventions

1. **Controller functions should be async**
```javascript
const create = async (req, res) => {
  try {
    const result = await Model.create(req.body);
    return successResponse(res, result);
  } catch (error) {
    return errorResponse(res, error);
  }
};
```

2. **Use Joi for validation**
```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).required()
});

const { error, value } = schema.validate(req.body);
```

3. **Consistent error handling**
```javascript
// Always use try-catch in async functions
// Always return proper error responses
// Log errors appropriately
```

## Git Workflow

### Branch Naming

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/issue-name` - Urgent fixes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```bash
feat(invoice): add recurring invoice functionality
fix(payment): correct calculation for partial payments
docs(api): update authentication endpoint documentation
refactor(client): simplify client validation logic
```

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Write tests (if applicable)
4. Update documentation
5. Run linting: `npm run lint`
6. Create pull request
7. Wait for code review
8. Address feedback
9. Merge after approval

## Testing

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Writing Tests

#### Backend Test Example

```javascript
// tests/invoice.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Invoice API', () => {
  test('GET /api/invoice should return invoices', async () => {
    const response = await request(app)
      .get('/api/invoice')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

#### Frontend Test Example

```javascript
// components/__tests__/InvoiceForm.test.jsx
import { render, screen } from '@testing-library/react';
import InvoiceForm from '../InvoiceForm';

test('renders invoice form', () => {
  render(<InvoiceForm />);
  const element = screen.getByText(/Invoice/i);
  expect(element).toBeInTheDocument();
});
```

## Debugging

### Backend Debugging

1. **Using console.log**
```javascript
console.log('Debug:', { variable, anotherVariable });
```

2. **Using VS Code Debugger**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

3. **Debugging with Node Inspector**
```bash
node --inspect src/server.js
# Open chrome://inspect in Chrome
```

### Frontend Debugging

1. **React DevTools**
   - Install React Developer Tools extension
   - Inspect component props and state

2. **Redux DevTools**
   - Install Redux DevTools extension
   - Monitor state changes and actions

3. **Browser Console**
```javascript
console.log('Debug:', data);
console.table(array);
console.error('Error:', error);
```

4. **VS Code Debugger**

Add to `.vscode/launch.json`:
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Frontend",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/frontend/src"
}
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Model** (if needed)

```javascript
// backend/src/models/appModels/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
```

2. **Create Controller**

```javascript
// backend/src/controllers/appControllers/productController/create.js
const Product = require('@/models/appModels/Product');

const create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      result: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = create;
```

3. **Create Route**

```javascript
// backend/src/routes/appRoutes/index.js
const productController = require('@/controllers/appControllers/productController');

router.post('/product', isValidAdminToken, productController.create);
```

### Adding a New Frontend Module

1. **Create Module Directory**

```bash
mkdir frontend/src/modules/ProductModule
```

2. **Create Module Component**

```jsx
// frontend/src/modules/ProductModule/index.jsx
import React from 'react';
import CrudModule from '@/modules/CrudModule';

export default function ProductModule() {
  const entity = 'product';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,description'
  };

  const config = {
    entity,
    searchConfig,
    // ... other config
  };

  return <CrudModule config={config} />;
}
```

3. **Add Route**

```jsx
// frontend/src/router/AppRouter.jsx
import ProductModule from '@/modules/ProductModule';

<Route path="/product" element={<ProductModule />} />
```

### Adding New Redux State

1. **Create Slice**

```javascript
// frontend/src/redux/product/slice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    current: null,
    isLoading: false
  },
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
```

2. **Add to Store**

```javascript
// frontend/src/redux/store.js
import productReducer from './product/slice';

export default configureStore({
  reducer: {
    // ... other reducers
    product: productReducer
  }
});
```

## Building for Production

### Backend Production Build

```bash
cd backend

# Set environment to production
export NODE_ENV=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start src/server.js --name idurar-backend

# Or start directly
npm start
```

### Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# Serve with static server
npm install -g serve
serve -s dist -p 3000
```

### Environment Configuration

Production `.env` files should have:

Backend:
```env
NODE_ENV=production
DATABASE=mongodb+srv://your-production-database
JWT_SECRET=strong-random-secret-key
PUBLIC_SERVER_FILE=https://yourdomain.com/
```

Frontend:
```env
VITE_BACKEND_SERVER=https://api.yourdomain.com/api/
VITE_FILE_BASE_URL=https://api.yourdomain.com/
PROD=true
```

### Deployment Checklist

- [ ] Update environment variables for production
- [ ] Build frontend with `npm run build`
- [ ] Test production build locally
- [ ] Set up MongoDB production database
- [ ] Configure HTTPS/SSL
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure CORS for production domain
- [ ] Enable compression
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test all critical features

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running
- Check DATABASE connection string in `.env`
- Verify network connectivity to MongoDB Atlas

#### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::8888
```

**Solution:**
```bash
# Find process using port 8888
lsof -i :8888

# Kill the process
kill -9 <PID>
```

#### CORS Errors

```
Access to fetch at 'http://localhost:8888/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
- Check backend CORS configuration
- Verify `VITE_BACKEND_SERVER` in frontend `.env`

#### JWT Token Invalid

**Solution:**
- Check `JWT_SECRET` matches between requests
- Verify token is being sent in Authorization header
- Check token expiration

#### Module Not Found

```
Cannot find module '@/models/...'
```

**Solution:**
- Check module alias configuration in `jsconfig.json` or `package.json`
- Restart development server

### Getting Help

- **Documentation**: Check README.md, API.md, ARCHITECTURE.md
- **GitHub Issues**: https://github.com/idurar/idurar-erp-crm/issues
- **Community**: Join discussions on GitHub
- **Email**: hello@idurarapp.com

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Ant Design Components](https://ant.design/components/overview/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [IDURAR Repository](https://github.com/idurar/idurar-erp-crm)
