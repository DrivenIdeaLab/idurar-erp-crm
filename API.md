# IDURAR API Documentation

This document provides comprehensive documentation for the IDURAR ERP/CRM REST API.

## Table of Contents

- [Authentication](#authentication)
- [Common Response Formats](#common-response-formats)
- [Error Handling](#error-handling)
- [Invoice API](#invoice-api)
- [Quote API](#quote-api)
- [Payment API](#payment-api)
- [Client API](#client-api)
- [Vehicle API](#vehicle-api)
- [Admin API](#admin-api)
- [Settings API](#settings-api)
- [Tax API](#tax-api)
- [Payment Mode API](#payment-mode-api)

## Base URL

```
Development: http://localhost:8888/api
Production: https://your-domain.com/api
```

## Authentication

IDURAR uses JWT (JSON Web Tokens) for authentication. After logging in, include the JWT token in the `Authorization` header for all protected endpoints.

### Login

**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "admin@demo.com",
  "password": "admin123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "result": {
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@demo.com",
      "name": "Admin User",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Successfully logged in"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "result": null,
  "message": "Invalid credentials"
}
```

### Logout

**Endpoint:** `POST /api/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "result": {},
  "message": "Successfully logged out"
}
```

### Verify Token

**Endpoint:** `GET /api/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "result": {
    "isValidToken": true,
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@demo.com",
      "name": "Admin User"
    }
  }
}
```

## Common Response Formats

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "result": { /* data object or array */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "result": null,
  "message": "Error description"
}
```

### Pagination Response
```json
{
  "success": true,
  "result": [/* array of items */],
  "pagination": {
    "page": 1,
    "pages": 10,
    "count": 100
  },
  "message": "Successfully retrieved data"
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "result": null,
  "message": "Validation error",
  "errors": {
    "email": "Email is required",
    "name": "Name must be at least 2 characters"
  }
}
```

## Invoice API

### List Invoices

**Endpoint:** `GET /api/invoice`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `items` (number, default: 10) - Items per page
- `search` (string) - Search term
- `status` (string) - Filter by status (draft, pending, paid, etc.)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "number": 1,
      "year": 2024,
      "client": {
        "_id": "507f191e810c19729de860ea",
        "name": "Acme Corporation",
        "email": "contact@acme.com"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "expiredDate": "2024-02-15T00:00:00.000Z",
      "status": "pending",
      "subTotal": 1000.00,
      "taxTotal": 100.00,
      "total": 1100.00,
      "credit": 0,
      "discount": 0,
      "items": [
        {
          "itemName": "Website Development",
          "description": "Custom website development",
          "quantity": 1,
          "price": 1000.00,
          "total": 1000.00
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "count": 50
  }
}
```

### Get Invoice by ID

**Endpoint:** `GET /api/invoice/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439011",
    "number": 1,
    "year": 2024,
    "client": {
      "_id": "507f191e810c19729de860ea",
      "name": "Acme Corporation"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "expiredDate": "2024-02-15T00:00:00.000Z",
    "status": "pending",
    "items": [],
    "taxRate": 10,
    "subTotal": 1000.00,
    "taxTotal": 100.00,
    "total": 1100.00
  }
}
```

### Create Invoice

**Endpoint:** `POST /api/invoice`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "client": "507f191e810c19729de860ea",
  "date": "2024-01-15",
  "expiredDate": "2024-02-15",
  "items": [
    {
      "itemName": "Website Development",
      "description": "Custom website development",
      "quantity": 1,
      "price": 1000.00
    }
  ],
  "taxRate": 10,
  "discount": 0,
  "notes": "Thank you for your business"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439011",
    "number": 1,
    "year": 2024,
    "status": "draft"
  },
  "message": "Invoice created successfully"
}
```

### Update Invoice

**Endpoint:** `PATCH /api/invoice/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "sent",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "sent"
  },
  "message": "Invoice updated successfully"
}
```

### Delete Invoice

**Endpoint:** `DELETE /api/invoice/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {},
  "message": "Invoice deleted successfully"
}
```

### Get Invoice Summary

**Endpoint:** `GET /api/invoice/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "total": 150,
    "draft": 10,
    "pending": 50,
    "paid": 80,
    "overdue": 10,
    "totalRevenue": 150000.00,
    "unpaidRevenue": 45000.00
  }
}
```

## Quote API

### List Quotes

**Endpoint:** `GET /api/quote`

**Query Parameters:**
- `page` (number)
- `items` (number)
- `search` (string)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Similar structure to Invoice List

### Create Quote

**Endpoint:** `POST /api/quote`

**Request Body:** Similar to Invoice creation

### Convert Quote to Invoice

**Endpoint:** `POST /api/quote/convert/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "invoice": {
      "_id": "507f1f77bcf86cd799439012",
      "number": 15,
      "year": 2024
    }
  },
  "message": "Quote converted to invoice successfully"
}
```

## Payment API

### List Payments

**Endpoint:** `GET /api/payment`

**Query Parameters:**
- `page` (number)
- `items` (number)
- `invoice` (string) - Filter by invoice ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "number": 1,
      "client": {
        "_id": "507f191e810c19729de860ea",
        "name": "Acme Corporation"
      },
      "invoice": {
        "_id": "507f1f77bcf86cd799439011",
        "number": 1
      },
      "amount": 1100.00,
      "paymentMode": {
        "name": "Bank Transfer",
        "isDefault": false
      },
      "date": "2024-01-20T00:00:00.000Z",
      "description": "Payment for invoice #1"
    }
  ]
}
```

### Record Payment

**Endpoint:** `POST /api/payment`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "invoice": "507f1f77bcf86cd799439011",
  "client": "507f191e810c19729de860ea",
  "amount": 1100.00,
  "paymentMode": "507f191e810c19729de860eb",
  "date": "2024-01-20",
  "description": "Payment for invoice #1"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439013",
    "number": 1
  },
  "message": "Payment recorded successfully"
}
```

## Client API

### List Clients

**Endpoint:** `GET /api/client`

**Query Parameters:**
- `page` (number)
- `items` (number)
- `search` (string)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1234567890",
      "address": "123 Business St",
      "city": "New York",
      "country": "USA",
      "peopleCount": 1
    }
  ]
}
```

### Create Client

**Endpoint:** `POST /api/client`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": "123 Business St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "name": "Acme Corporation"
  },
  "message": "Client created successfully"
}
```

### Update Client

**Endpoint:** `PATCH /api/client/:id`

**Request Body:** Partial client data

### Delete Client

**Endpoint:** `DELETE /api/client/:id`

## Vehicle API

The Vehicle API provides endpoints for managing vehicles in the automotive workshop system, including VIN decoding capabilities.

### List Vehicles

**Endpoint:** `GET /api/vehicle`

**Query Parameters:**
- `page` (number) - Page number for pagination
- `items` (number) - Number of items per page
- `search` (string) - Search by VIN, make, model, or license plate

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f191e810c19729de860ea",
      "vin": "1HGBH41JXMN109186",
      "licensePlate": "ABC1234",
      "year": 2021,
      "make": "Honda",
      "model": "Accord",
      "trim": "EX-L",
      "color": "Silver",
      "engine": "2.0L Turbo",
      "transmission": "Automatic",
      "fuelType": "gasoline",
      "currentMileage": 45000,
      "mileageUnit": "miles",
      "customer": {
        "_id": "507f191e810c19729de860eb",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "created": "2024-01-15T10:30:00.000Z",
      "updated": "2024-01-20T14:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "count": 47
  }
}
```

### Get Vehicle by ID

**Endpoint:** `GET /api/vehicle/read/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "vin": "1HGBH41JXMN109186",
    "licensePlate": "ABC1234",
    "year": 2021,
    "make": "Honda",
    "model": "Accord",
    "trim": "EX-L",
    "color": "Silver",
    "engine": "2.0L Turbo",
    "transmission": "Automatic",
    "fuelType": "gasoline",
    "currentMileage": 45000,
    "mileageUnit": "miles",
    "customer": {
      "_id": "507f191e810c19729de860eb",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "photos": [
      {
        "url": "/uploads/vehicles/photo1.jpg",
        "uploadedDate": "2024-01-15T10:30:00.000Z",
        "description": "Front view"
      }
    ],
    "mileageHistory": [
      {
        "mileage": 45000,
        "recordedDate": "2024-01-20T14:45:00.000Z",
        "recordedBy": "507f1f77bcf86cd799439014"
      }
    ],
    "vinDecodeData": {
      "manufacturer": "Honda",
      "plantCountry": "USA",
      "vehicleType": "Passenger Car",
      "bodyClass": "Sedan"
    }
  },
  "message": "Vehicle retrieved successfully"
}
```

### Create Vehicle

**Endpoint:** `POST /api/vehicle/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vin": "1HGBH41JXMN109186",
  "licensePlate": "ABC1234",
  "year": 2021,
  "make": "Honda",
  "model": "Accord",
  "trim": "EX-L",
  "color": "Silver",
  "engine": "2.0L Turbo",
  "transmission": "Automatic",
  "fuelType": "gasoline",
  "customer": "507f191e810c19729de860eb",
  "currentMileage": 45000,
  "mileageUnit": "miles",
  "notes": "Customer's primary vehicle"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "vin": "1HGBH41JXMN109186",
    "make": "Honda",
    "model": "Accord",
    "year": 2021
  },
  "message": "Vehicle created successfully"
}
```

### Update Vehicle

**Endpoint:** `PATCH /api/vehicle/update/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Partial vehicle data (any fields to update)

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "currentMileage": 46500
  },
  "message": "Vehicle updated successfully"
}
```

### Delete Vehicle

**Endpoint:** `DELETE /api/vehicle/delete/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {},
  "message": "Vehicle deleted successfully"
}
```

### Decode VIN

**Endpoint:** `POST /api/vehicle/decode-vin`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vin": "1HGBH41JXMN109186"
}
```

**Response (Success - VIN Decoded):**
```json
{
  "success": true,
  "result": {
    "vin": "1HGBH41JXMN109186",
    "exists": false,
    "data": {
      "year": 2021,
      "make": "Honda",
      "model": "Accord",
      "trim": "EX-L",
      "engine": "2.0L Turbo",
      "engineCylinders": 4,
      "engineDisplacement": "2.0L",
      "transmission": "Automatic",
      "fuelType": "gasoline",
      "manufacturer": "Honda",
      "plantCountry": "USA",
      "vehicleType": "Passenger Car",
      "bodyClass": "Sedan",
      "doors": 4,
      "driveType": "FWD"
    }
  },
  "message": "VIN decoded successfully"
}
```

**Response (Vehicle Already Exists):**
```json
{
  "success": true,
  "result": {
    "vin": "1HGBH41JXMN109186",
    "exists": true,
    "vehicle": {
      "_id": "507f191e810c19729de860ea",
      "customer": {
        "name": "John Doe"
      }
    },
    "data": { /* decoded data */ }
  },
  "message": "VIN decoded successfully. Vehicle already exists in the system."
}
```

**Response (Error - Invalid VIN):**
```json
{
  "success": false,
  "result": null,
  "message": "VIN must be exactly 17 characters"
}
```

### Update Vehicle Mileage

**Endpoint:** `POST /api/vehicle/update-mileage/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "mileage": 46500,
  "serviceRecordId": "507f1f77bcf86cd799439016"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "currentMileage": 46500,
    "mileageHistory": [
      {
        "mileage": 46500,
        "recordedDate": "2024-01-25T10:00:00.000Z",
        "recordedBy": "507f1f77bcf86cd799439014",
        "serviceRecordId": "507f1f77bcf86cd799439016"
      }
    ]
  },
  "message": "Vehicle mileage updated successfully"
}
```

**Response (Error - Invalid Mileage):**
```json
{
  "success": false,
  "result": null,
  "message": "New mileage (40000) cannot be less than current mileage (45000)"
}
```

### Get Vehicle Summary

**Endpoint:** `GET /api/vehicle/summary`

**Query Parameters:**
- `customer` (string) - Filter by customer ID (optional)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalVehicles": 47,
    "vehiclesByCustomer": [
      {
        "customer": {
          "_id": "507f191e810c19729de860eb",
          "name": "John Doe"
        },
        "count": 3
      }
    ],
    "vehiclesByMake": [
      {
        "_id": "Honda",
        "count": 12
      },
      {
        "_id": "Toyota",
        "count": 10
      }
    ],
    "vehiclesByYear": [
      {
        "_id": 2023,
        "count": 5
      },
      {
        "_id": 2022,
        "count": 8
      }
    ],
    "recentVehicles": [
      {
        "_id": "507f191e810c19729de860ea",
        "vin": "1HGBH41JXMN109186",
        "make": "Honda",
        "model": "Accord",
        "year": 2021,
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  },
  "message": "Vehicle summary retrieved successfully"
}
```

## Admin API

### List Admins

**Endpoint:** `GET /api/admin`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "email": "admin@demo.com",
      "name": "Admin User",
      "role": "owner",
      "enabled": true
    }
  ]
}
```

### Create Admin

**Endpoint:** `POST /api/admin`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newadmin@demo.com",
  "password": "securepassword",
  "name": "New Admin",
  "role": "admin"
}
```

## Settings API

### Get Settings

**Endpoint:** `GET /api/setting`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439015",
    "settingCategory": "app_settings",
    "settingKey": "app_name",
    "settingValue": "IDURAR ERP/CRM",
    "valueType": "string",
    "enabled": true
  }
}
```

### Update Settings

**Endpoint:** `PATCH /api/setting/:id`

**Request Body:**
```json
{
  "settingValue": "My Company ERP"
}
```

## Tax API

### List Taxes

**Endpoint:** `GET /api/taxes`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "taxName": "VAT",
      "taxValue": 20,
      "isDefault": true,
      "enabled": true
    }
  ]
}
```

### Create Tax

**Endpoint:** `POST /api/taxes`

**Request Body:**
```json
{
  "taxName": "Sales Tax",
  "taxValue": 8.5,
  "isDefault": false
}
```

## Payment Mode API

### List Payment Modes

**Endpoint:** `GET /api/paymentMode`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "name": "Credit Card",
      "description": "Payment via credit card",
      "isDefault": true,
      "enabled": true
    }
  ]
}
```

### Create Payment Mode

**Endpoint:** `POST /api/paymentMode`

**Request Body:**
```json
{
  "name": "PayPal",
  "description": "Payment via PayPal",
  "isDefault": false
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

## Best Practices

1. **Always include error handling** in your API calls
2. **Store JWT tokens securely** (e.g., httpOnly cookies)
3. **Refresh tokens** before they expire
4. **Use pagination** for large data sets
5. **Validate input** on the client side before sending to API
6. **Handle network errors** gracefully
7. **Use HTTPS** in production
8. **Don't expose sensitive data** in client-side code

## Example Usage (JavaScript/Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('token', response.data.result.token);
  return response.data;
};

// Get invoices
const getInvoices = async (page = 1) => {
  const response = await api.get('/invoice', { params: { page } });
  return response.data;
};

// Create invoice
const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoice', invoiceData);
  return response.data;
};
```

## Support

For API-related questions or issues:
- GitHub Issues: https://github.com/idurar/idurar-erp-crm/issues
- Email: hello@idurarapp.com
- Documentation: https://www.idurarapp.com
