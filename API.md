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
- [Service Record API](#service-record-api)
- [Appointment API](#appointment-api)
- [Inspection API](#inspection-api)
- [Part API](#part-api)
- [Inventory Transaction API](#inventory-transaction-api)
- [Purchase Order API](#purchase-order-api)
- [Supplier API](#supplier-api)
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

## Service Record API

The Service Record API provides endpoints for managing vehicle service records in the automotive workshop system.

### List Service Records

**Endpoint:** `GET /api/servicerecord/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number)
- `items` (number)
- `search` (string)

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f191e810c19729de860ea",
      "number": 1,
      "year": 2024,
      "customer": {
        "name": "John Doe"
      },
      "vehicle": {
        "vin": "1HGBH41JXMN109186",
        "make": "Honda",
        "model": "Accord"
      },
      "serviceType": "oil_change",
      "status": "completed",
      "scheduledDate": "2024-01-20T09:00:00.000Z",
      "completionDate": "2024-01-20T10:30:00.000Z",
      "total": 79.99
    }
  ]
}
```

### Create Service Record

**Endpoint:** `POST /api/servicerecord/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer": "507f191e810c19729de860eb",
  "vehicle": "507f191e810c19729de860ec",
  "serviceType": "oil_change",
  "status": "scheduled",
  "scheduledDate": "2024-01-25T09:00:00.000Z",
  "technician": "507f191e810c19729de860ed",
  "advisor": "507f191e810c19729de860ee",
  "customerConcerns": "Engine making strange noise",
  "mileageIn": 45000,
  "taxRate": 8.5
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "number": 2,
    "year": 2024
  },
  "message": "Service record created successfully"
}
```

### Convert Service Record to Invoice

**Endpoint:** `POST /api/servicerecord/convert-to-invoice/:id`

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
      "year": 2024,
      "total": 450.75
    },
    "serviceRecord": {
      "_id": "507f191e810c19729de860ea",
      "number": 2,
      "status": "invoiced"
    }
  },
  "message": "Service record converted to invoice successfully"
}
```

### Update Service Record Status

**Endpoint:** `POST /api/servicerecord/update-status/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "status": "in_progress",
    "checkInDate": "2024-01-25T09:15:00.000Z"
  },
  "message": "Service record status updated successfully"
}
```

### Get Service Record Summary

**Endpoint:** `GET /api/servicerecord/summary`

**Query Parameters:**
- `vehicle` (string) - Filter by vehicle ID
- `customer` (string) - Filter by customer ID
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalServices": 156,
    "servicesByStatus": [
      { "_id": "completed", "count": 98, "totalRevenue": 45230.50 },
      { "_id": "in_progress", "count": 12 }
    ],
    "servicesByType": [
      { "_id": "oil_change", "count": 45, "averageCost": 65.50 },
      { "_id": "brake_service", "count": 23, "averageCost": 350.00 }
    ],
    "revenueByMonth": [
      { "_id": { "year": 2024, "month": 1 }, "revenue": 12450.00, "count": 42 }
    ],
    "topTechnicians": [
      {
        "technician": { "name": "Mike Johnson" },
        "servicesCompleted": 35,
        "totalRevenue": 15230.00
      }
    ],
    "averageServiceTimeHours": 2.5
  },
  "message": "Service record summary retrieved successfully"
}
```

## Appointment API

The Appointment API provides endpoints for managing service appointments.

### List Appointments

**Endpoint:** `GET /api/appointment/list`

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
      "customer": {
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "vehicle": {
        "vin": "1HGBH41JXMN109186",
        "make": "Honda",
        "model": "Accord"
      },
      "appointmentDate": "2024-01-25T00:00:00.000Z",
      "appointmentTime": "09:00",
      "duration": 60,
      "serviceType": "oil_change",
      "status": "confirmed",
      "estimatedCost": 65.00
    }
  ]
}
```

### Create Appointment

**Endpoint:** `POST /api/appointment/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer": "507f191e810c19729de860eb",
  "vehicle": "507f191e810c19729de860ec",
  "appointmentDate": "2024-01-30",
  "appointmentTime": "14:00",
  "duration": 120,
  "serviceType": "brake_service",
  "technician": "507f191e810c19729de860ed",
  "customerConcerns": "Brakes squeaking",
  "contactPhone": "+1234567890",
  "contactEmail": "john@example.com",
  "estimatedCost": 350.00
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "appointmentDate": "2024-01-30T00:00:00.000Z",
    "appointmentTime": "14:00",
    "status": "scheduled"
  },
  "message": "Appointment created successfully"
}
```

### Check Appointment Availability

**Endpoint:** `GET /api/appointment/check-availability`

**Query Parameters:**
- `date` (date) - Required (YYYY-MM-DD)
- `time` (string) - Required (HH:MM)
- `duration` (number) - Optional (default 60)
- `technician` (string) - Optional technician ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "isAvailable": true,
    "conflicts": 0,
    "requestedDate": "2024-01-30",
    "requestedTime": "14:00",
    "existingAppointments": [
      {
        "time": "09:00",
        "duration": 60
      },
      {
        "time": "11:00",
        "duration": 90
      }
    ]
  },
  "message": "Time slot is available"
}
```

### Create Service Record from Appointment

**Endpoint:** `POST /api/appointment/create-service-record/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "serviceRecord": {
      "_id": "507f191e810c19729de860ef",
      "number": 5,
      "year": 2024,
      "status": "checked_in"
    },
    "appointment": {
      "_id": "507f191e810c19729de860ea",
      "status": "in_service"
    }
  },
  "message": "Service record created successfully"
}
```

### Get Appointment Summary

**Endpoint:** `GET /api/appointment/summary`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalAppointments": 87,
    "appointmentsByStatus": [
      { "_id": "scheduled", "count": 25 },
      { "_id": "confirmed", "count": 18 }
    ],
    "appointmentsByType": [
      { "_id": "oil_change", "count": 32 },
      { "_id": "brake_service", "count": 15 }
    ],
    "upcomingAppointments": [ /* next 7 days */ ],
    "todaysAppointments": [ /* today's schedule */ ],
    "noShowRate": 5.2
  },
  "message": "Appointment summary retrieved successfully"
}
```

## Inspection API

The Inspection API provides endpoints for managing vehicle inspections.

### List Inspections

**Endpoint:** `GET /api/inspection/list`

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
      "serviceRecord": {
        "number": 5,
        "year": 2024
      },
      "vehicle": {
        "vin": "1HGBH41JXMN109186",
        "make": "Honda",
        "model": "Accord"
      },
      "customer": {
        "name": "John Doe"
      },
      "inspector": {
        "name": "Mike Johnson"
      },
      "inspectionDate": "2024-01-25T10:00:00.000Z",
      "mileage": 45150,
      "overallCondition": "good",
      "customerApproval": "approved"
    }
  ]
}
```

### Create Inspection

**Endpoint:** `POST /api/inspection/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "serviceRecord": "507f191e810c19729de860ef",
  "vehicle": "507f191e810c19729de860ec",
  "customer": "507f191e810c19729de860eb",
  "inspector": "507f191e810c19729de860ed",
  "mileage": 45150,
  "overallCondition": "good",
  "items": [
    {
      "category": "brakes",
      "itemName": "Front Brake Pads",
      "condition": "fair",
      "notes": "40% remaining",
      "recommendedAction": "Replace within 5,000 miles",
      "priority": "medium",
      "estimatedCost": 250.00
    },
    {
      "category": "tires",
      "itemName": "Front Tires",
      "condition": "good",
      "notes": "Tread depth 7/32\"",
      "priority": "low"
    }
  ],
  "safetyIssues": [
    {
      "description": "Brake fluid low",
      "severity": "medium",
      "recommendedAction": "Top off brake fluid"
    }
  ],
  "recommendations": "Replace brake pads soon. All fluids checked and topped off.",
  "nextServiceDue": "2024-04-25",
  "nextServiceMileage": 48000
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "inspectionDate": "2024-01-25T10:00:00.000Z",
    "overallCondition": "good"
  },
  "message": "Inspection created successfully"
}
```

### Get Inspection Summary

**Endpoint:** `GET /api/inspection/summary`

**Query Parameters:**
- `vehicle` (string)
- `customer` (string)
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalInspections": 125,
    "byCondition": [
      { "_id": "good", "count": 67 },
      { "_id": "fair", "count": 45 },
      { "_id": "poor", "count": 13 }
    ],
    "bySafetySeverity": [
      { "_id": "low", "count": 34 },
      { "_id": "medium", "count": 18 },
      { "_id": "high", "count": 5 }
    ],
    "approvalRate": 78.5,
    "recentInspections": [ /* last 10 */ ]
  },
  "message": "Inspection summary retrieved successfully"
}
```

## Part API

The Part API provides endpoints for managing parts inventory in the automotive workshop system.

### List Parts

**Endpoint:** `GET /api/part/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number)
- `items` (number)
- `search` (string)

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "_id": "507f191e810c19729de860ea",
      "partNumber": "BRK-001",
      "name": "Front Brake Pads",
      "category": "brakes",
      "quantityOnHand": 25,
      "quantityReserved": 5,
      "quantityAvailable": 20,
      "costPrice": 45.00,
      "sellPrice": 89.99,
      "reorderPoint": 10,
      "lowStockAlert": false,
      "outOfStock": false
    }
  ]
}
```

### Create Part

**Endpoint:** `POST /api/part/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "partNumber": "BRK-001",
  "name": "Front Brake Pads",
  "description": "Ceramic front brake pads",
  "category": "brakes",
  "supplier": "507f191e810c19729de860eb",
  "costPrice": 45.00,
  "sellPrice": 89.99,
  "quantityOnHand": 25,
  "reorderPoint": 10,
  "reorderQuantity": 50
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "partNumber": "BRK-001",
    "name": "Front Brake Pads"
  },
  "message": "Part created successfully"
}
```

### Check Stock

**Endpoint:** `GET /api/part/check-stock`

**Query Parameters:**
- `partNumber` (string) - Check specific part by number
- `partId` (string) - Check specific part by ID
- `threshold` (number) - Custom threshold for low stock alerts

**Headers:**
```
Authorization: Bearer <token>
```

**Response (specific part):**
```json
{
  "success": true,
  "result": {
    "part": {
      "_id": "507f191e810c19729de860ea",
      "partNumber": "BRK-001",
      "name": "Front Brake Pads",
      "quantityOnHand": 25,
      "quantityReserved": 5,
      "quantityAvailable": 20,
      "reorderPoint": 10,
      "lowStockAlert": false,
      "outOfStock": false
    },
    "status": "in_stock"
  },
  "message": "Stock level retrieved successfully"
}
```

**Response (all alerts):**
```json
{
  "success": true,
  "result": {
    "totalAlerts": 15,
    "outOfStock": {
      "count": 3,
      "parts": [...]
    },
    "lowStock": {
      "count": 12,
      "parts": [...]
    }
  },
  "message": "Stock alerts retrieved successfully"
}
```

### Adjust Stock

**Endpoint:** `POST /api/part/adjust-stock/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "adjustment": 10,
  "type": "adjustment",
  "reason": "Manual stock adjustment",
  "notes": "Correcting inventory count"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "part": {
      "_id": "507f191e810c19729de860ea",
      "partNumber": "BRK-001",
      "name": "Front Brake Pads",
      "quantityBefore": 25,
      "quantityAfter": 35,
      "adjustment": 10
    },
    "transaction": {
      "_id": "507f1f77bcf86cd799439012",
      "type": "adjustment",
      "quantityChange": 10
    }
  },
  "message": "Stock adjusted successfully"
}
```

### Get Reorder Suggestions

**Endpoint:** `GET /api/part/reorder`

**Query Parameters:**
- `category` (string)
- `supplier` (string)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "summary": {
      "totalParts": 25,
      "totalEstimatedCost": 5430.00,
      "totalSuppliers": 5,
      "outOfStock": 3,
      "lowStock": 22
    },
    "bySupplier": [
      {
        "supplier": {
          "companyName": "AutoParts Inc"
        },
        "parts": [...],
        "totalCost": 2150.00,
        "totalParts": 10
      }
    ]
  },
  "message": "Reorder suggestions retrieved successfully"
}
```

### Get Part Summary

**Endpoint:** `GET /api/part/summary`

**Query Parameters:**
- `category` (string)
- `supplier` (string)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "overview": {
      "totalParts": 350,
      "activeParts": 320,
      "discontinuedParts": 30,
      "inStock": 280,
      "lowStock": 35,
      "outOfStock": 5
    },
    "inventoryValue": {
      "totalCostValue": 125430.00,
      "totalSellValue": 245680.00,
      "totalPotentialProfit": 120250.00
    },
    "partsByCategory": [...],
    "topPartsByQuantity": [...],
    "lowStockAlerts": [...]
  },
  "message": "Part inventory summary retrieved successfully"
}
```

## Inventory Transaction API

The Inventory Transaction API provides endpoints for tracking all inventory movements.

### List Transactions

**Endpoint:** `GET /api/inventorytransaction/list`

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
      "part": {
        "partNumber": "BRK-001",
        "name": "Front Brake Pads"
      },
      "type": "purchase",
      "quantityChange": 50,
      "quantityBefore": 25,
      "quantityAfter": 75,
      "unitCost": 45.00,
      "totalCost": 2250.00,
      "transactionDate": "2024-01-25T10:00:00.000Z"
    }
  ]
}
```

### Record Transaction

**Endpoint:** `POST /api/inventorytransaction/record-transaction`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "part": "507f191e810c19729de860ea",
  "type": "sale",
  "quantityChange": 2,
  "unitPrice": 89.99,
  "serviceRecord": "507f191e810c19729de860ec",
  "notes": "Used in service #SR-2024-0015"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439012",
      "type": "sale",
      "quantityChange": -2,
      "transactionDate": "2024-01-25T10:00:00.000Z"
    },
    "part": {
      "_id": "507f191e810c19729de860ea",
      "quantityBefore": 25,
      "quantityAfter": 23
    }
  },
  "message": "Transaction recorded successfully"
}
```

### Get Transaction Summary

**Endpoint:** `GET /api/inventorytransaction/summary`

**Query Parameters:**
- `part` (string)
- `type` (string)
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "overview": {
      "totalTransactions": 1250,
      "totalCost": 85430.00,
      "totalPrice": 165890.00,
      "totalQuantityIn": 3250,
      "totalQuantityOut": 2890
    },
    "transactionsByType": [...],
    "transactionsByPart": [...],
    "recentTransactions": [...]
  },
  "message": "Inventory transaction summary retrieved successfully"
}
```

## Purchase Order API

The Purchase Order API provides endpoints for managing purchase orders and supplier orders.

### List Purchase Orders

**Endpoint:** `GET /api/purchaseorder/list`

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
      "poNumber": "PO-2024-0001",
      "supplier": {
        "companyName": "AutoParts Inc"
      },
      "orderDate": "2024-01-20T00:00:00.000Z",
      "status": "confirmed",
      "total": 5430.00,
      "expectedDeliveryDate": "2024-01-27T00:00:00.000Z"
    }
  ]
}
```

### Create Purchase Order

**Endpoint:** `POST /api/purchaseorder/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "supplier": "507f191e810c19729de860eb",
  "items": [
    {
      "part": "507f191e810c19729de860ea",
      "partNumber": "BRK-001",
      "description": "Front Brake Pads",
      "quantityOrdered": 50,
      "unitCost": 45.00,
      "total": 2250.00
    }
  ],
  "taxRate": 8.5,
  "shippingCost": 25.00,
  "expectedDeliveryDate": "2024-01-27",
  "notes": "Rush order"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "poNumber": "PO-2024-0001",
    "status": "draft"
  },
  "message": "Purchase order created successfully"
}
```

### Receive Items

**Endpoint:** `POST /api/purchaseorder/receive/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "itemId": "507f1f77bcf86cd799439012",
      "quantityReceived": 50
    }
  ],
  "actualDeliveryDate": "2024-01-27",
  "notes": "All items received in good condition"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "purchaseOrder": {
      "_id": "507f191e810c19729de860ea",
      "poNumber": "PO-2024-0001",
      "status": "received",
      "items": [...]
    },
    "receivedItems": [...]
  },
  "message": "Items received successfully"
}
```

### Update Status

**Endpoint:** `POST /api/purchaseorder/update-status/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed by supplier"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "poNumber": "PO-2024-0001",
    "status": "confirmed",
    "oldStatus": "sent"
  },
  "message": "Purchase order status updated successfully"
}
```

### Get Purchase Order Summary

**Endpoint:** `GET /api/purchaseorder/summary`

**Query Parameters:**
- `supplier` (string)
- `status` (string)
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "overview": {
      "totalPOs": 87,
      "totalValue": 125430.00,
      "totalPaid": 98500.00,
      "totalOutstanding": 26930.00
    },
    "posByStatus": [...],
    "posBySupplier": [...],
    "pendingDeliveries": {
      "count": 12,
      "items": [...]
    },
    "overdueDeliveries": {
      "count": 3,
      "items": [...]
    }
  },
  "message": "Purchase order summary retrieved successfully"
}
```

## Supplier API

The Supplier API provides endpoints for managing suppliers and vendor relationships.

### List Suppliers

**Endpoint:** `GET /api/supplier/list`

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
      "companyName": "AutoParts Inc",
      "contactPerson": "John Smith",
      "email": "john@autoparts.com",
      "phone": "+1234567890",
      "categories": ["brakes", "suspension"],
      "rating": 4.5,
      "isPreferred": true,
      "totalOrders": 45,
      "totalSpent": 125430.00
    }
  ]
}
```

### Create Supplier

**Endpoint:** `POST /api/supplier/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyName": "AutoParts Inc",
  "tradingName": "API Auto",
  "contactPerson": "John Smith",
  "email": "john@autoparts.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Industrial Dr",
    "city": "Detroit",
    "state": "MI",
    "postcode": "48201",
    "country": "USA"
  },
  "paymentTerms": "net_30",
  "categories": ["brakes", "suspension"]
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "_id": "507f191e810c19729de860ea",
    "companyName": "AutoParts Inc"
  },
  "message": "Supplier created successfully"
}
```

### Get Supplier Performance

**Endpoint:** `GET /api/supplier/performance/:id`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "supplier": {
      "_id": "507f191e810c19729de860ea",
      "companyName": "AutoParts Inc",
      "rating": 4.5
    },
    "metrics": {
      "totalOrders": 45,
      "totalSpent": 125430.00,
      "averageOrderValue": 2787.33,
      "averageLeadTime": 5,
      "onTimeDeliveryRate": 95.5,
      "partsSupplied": 85
    },
    "ordersByStatus": {...},
    "monthlySpending": [...],
    "recentOrders": [...]
  },
  "message": "Supplier performance metrics retrieved successfully"
}
```

### Get Supplier Summary

**Endpoint:** `GET /api/supplier/summary`

**Query Parameters:**
- `category` (string)
- `isPreferred` (boolean)
- `isActive` (boolean)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "result": {
    "overview": {
      "totalSuppliers": 25,
      "activeSuppliers": 22,
      "preferredSuppliers": 8,
      "totalSpending": 545230.00
    },
    "averageMetrics": {
      "averageRating": 4.2,
      "averageOnTimeDelivery": 92.5,
      "averageLeadTime": 6
    },
    "topSuppliersBySpending": [...],
    "topSuppliersByRating": [...],
    "suppliersNeedingReview": {
      "count": 3,
      "items": [...]
    }
  },
  "message": "Supplier summary retrieved successfully"
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
