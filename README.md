<div align="center">
    <a href="https://www.idurarapp.com/">
  <img src="https://avatars.githubusercontent.com/u/50052356?s=200&v=4" width="128px" />
    </a>
    <h1>Open Source ERP / CRM Accounting Invoice Quote</h1>
    <p align="center">
        <p>IDURAR ERP CRM | Simple To Use</p>
    </p>


```
 Give a Star ⭐️ & Fork to this project ... Happy coding! 🤩`
```

IDURAR is Open Source ERP / CRM (Invoice / Quote / Accounting ) Based on Advanced Mern Stack (Node.js / Express.js / MongoDb / React.js ) with Ant Design (AntD) and Redux

</div>

**🚀 Self-hosted Entreprise Version** : [https://cloud.idurarapp.com](https://cloud.idurarapp.com/)

## Table of Contents

- [About IDURAR](#about-idurar)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## About IDURAR

IDURAR is a modern, open-source ERP/CRM solution designed for small to medium-sized businesses. It provides comprehensive tools for managing invoices, quotes, payments, customers, and accounting operations. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and featuring Ant Design UI components, IDURAR offers a professional, user-friendly interface with enterprise-grade functionality.

### Key Highlights

- **Modern Technology Stack**: Built with React 18, Node.js 20, MongoDB, and Ant Design 5
- **Comprehensive Business Management**: Handle invoices, quotes, payments, and customer relationships in one place
- **Multi-language Support**: Available in 40+ languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure**: JWT authentication, bcrypt password hashing, and role-based access control
- **Extensible**: Modular architecture allows easy customization and feature additions
- **Cloud Storage**: Integrated AWS S3 support for file management
- **Email Integration**: Automated email sending via Resend API
- **AI-Ready**: OpenAI integration for intelligent features
- **Production-Ready**: Includes rate limiting, compression, and security best practices

### Industry-Specific Solutions

IDURAR's flexible architecture makes it ideal for various industries:

- **🚗 Automotive Workshops**: See our [Automotive Workshop Implementation Guide](AUTOMOTIVE-WORKSHOP-GUIDE.md) for a complete blueprint to extend IDURAR with vehicle management, service records, appointments, parts inventory, and technician scheduling
- **🏗️ Construction & Contractors**: Adapt for project management, equipment tracking, and job costing
- **🏥 Healthcare Services**: Customize for patient management, appointments, and billing
- **🎓 Educational Institutions**: Modify for student records, course management, and fee collection
- **🏪 Retail & E-commerce**: Extend with inventory management and POS integration

The automotive workshop guide provides a detailed 12-week implementation roadmap with ready-to-use data models, API specifications, and React components.

## Features

### Invoice Management
- Create, read, update, and delete invoices
- Support for recurring invoices (daily, weekly, monthly, quarterly, annually)
- Automatic invoice numbering with year tracking
- Convert quotes to invoices
- PDF export and download
- Email invoices directly to customers
- Record payments against invoices
- Multi-currency support

### Quote Management
- Create and manage quotes/offers
- Convert quotes to invoices with one click
- Quote-specific workflows and numbering
- Professional quote templates
- PDF generation and email delivery

### Payment Management
- Record and track payments
- Multiple payment modes (cash, credit card, bank transfer, etc.)
- Payment history and reporting
- Link payments to invoices
- Payment status tracking

### Customer Management
- Complete customer database
- Customer contact information management
- Customer-invoice relationship tracking
- Customer payment history
- Customer analytics

### Financial Management
- Configurable tax rates
- Multiple payment modes
- Currency handling
- Financial reporting
- Accounting integration

### Settings & Administration
- System-wide settings configuration
- Admin user management
- Role-based access control (owner, admin)
- Email template customization
- Payment method configuration
- Tax rate configuration

### Security Features
- JWT-based authentication
- Password hashing with bcrypt and salt
- Role-based authorization
- Secure API endpoints
- Rate limiting for API protection
- CORS configuration

### Internationalization
- Support for 40+ languages
- Easy translation management
- RTL language support
- Locale-specific formatting

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.9.0 | JavaScript runtime |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.1.1 | MongoDB ODM |
| JWT | 9.0.2 | Authentication tokens |
| Bcrypt | 2.4.3 | Password hashing |
| Joi | 17.11.0 | Validation |
| Multer | 1.4.4 | File uploads |
| AWS SDK | 3.509.0 | S3 file storage |
| Resend | 2.0.0 | Email service |
| OpenAI | 4.27.0 | AI integration |
| html-pdf | 3.0.1 | PDF generation |
| Pug | 3.0.2 | Email templates |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.4.8 | Build tool |
| Redux Toolkit | 2.2.1 | State management |
| React Router | 6.22.0 | Routing |
| Ant Design | 5.14.1 | UI components |
| Axios | 1.6.2 | HTTP client |
| React Quill | 2.0.0 | Rich text editor |
| Day.js | 1.11.10 | Date manipulation |
| Currency.js | 2.0.4 | Currency formatting |

## Architecture

IDURAR follows a modern **monorepo architecture** with clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│                     (React + Ant Design)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ REST API
┌───────────────────────────▼─────────────────────────────────┐
│                    Express.js Server                         │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Auth Layer   │  Middleware  │  Route Handlers          │ │
│  │  (JWT)       │  (Validation)│  (Controllers)           │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    MongoDB Database                          │
│  (Invoice, Quote, Payment, Client, Admin, Settings)         │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture
- **MVC Pattern**: Model-View-Controller separation
- **Middleware Chain**: Authentication, validation, error handling
- **RESTful API**: Standard HTTP methods and status codes
- **Modular Design**: Separate modules for core and app-specific functionality

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Redux State Management**: Centralized state with Redux Toolkit
- **Module Organization**: Feature-based module structure
- **Responsive Layout**: Ant Design Pro Layout for adaptive UI

## Project Structure

```
idurar-erp-crm/
├── backend/                    # Node.js/Express.js API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── appControllers/ # Business logic (Invoice, Quote, Payment, Client)
│   │   │   └── coreControllers/# Core logic (Auth, Admin)
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── appModels/      # Business models
│   │   │   └── coreModels/     # Core models
│   │   ├── routes/             # API routes
│   │   │   ├── appRoutes/      # Business routes
│   │   │   └── coreRoutes/     # Core routes
│   │   ├── middlewares/        # Custom middleware
│   │   ├── handlers/           # Error and response handlers
│   │   ├── emailTemplate/      # Pug email templates
│   │   ├── pdf/                # PDF generation
│   │   ├── locale/             # i18n translations
│   │   ├── setup/              # Database setup scripts
│   │   └── utils/              # Utility functions
│   └── package.json
│
├── frontend/                   # React.js Vite application
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── InvoiceModule/
│   │   │   ├── QuoteModule/
│   │   │   ├── PaymentModule/
│   │   │   ├── AuthModule/
│   │   │   ├── DashboardModule/
│   │   │   └── CrudModule/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── redux/              # Redux state management
│   │   ├── request/            # API client functions
│   │   ├── router/             # Route configuration
│   │   ├── layout/             # Layout components
│   │   ├── locale/             # i18n translations
│   │   └── style/              # CSS styles
│   └── package.json
│
├── doc/                        # Documentation (40+ languages)
├── INSTALLATION-INSTRUCTIONS.md
├── CONTRIBUTING.md
├── CODE-OF-CONDUCT.md
├── SECURITY.md
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js**: v20.9.0 or higher
- **npm**: v10.2.4 or higher
- **MongoDB**: v4.4 or higher (local or MongoDB Atlas)

### Quick Start

Follow these steps to get IDURAR up and running on your local machine:

1. **[Clone the repository](INSTALLATION-INSTRUCTIONS.md#step-1-clone-the-repository)**

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm
```

2. **[Create Your MongoDB Account and Database Cluster](INSTALLATION-INSTRUCTIONS.md#Step-2-Create-Your-MongoDB-Account-and-Database-Cluster)**

Create a free MongoDB Atlas account or set up a local MongoDB instance.

3. **[Edit the Environment File](INSTALLATION-INSTRUCTIONS.md#Step-3-Edit-the-Environment-File)**

Create `.env` files in both `backend/` and `frontend/` directories.

4. **[Update MongoDB URI](INSTALLATION-INSTRUCTIONS.md#Step-4-Update-MongoDB-URI)**

Update the `DATABASE` variable in `backend/.env` with your MongoDB connection string.

5. **[Install Backend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-5-Install-Backend-Dependencies)**

```bash
cd backend
npm install
```

6. **[Run Setup Script](INSTALLATION-INSTRUCTIONS.md#Step-6-Run-Setup-Script)**

```bash
npm run setup
```

This will create default admin user, settings, taxes, and payment modes.

7. **[Run the Backend Server](INSTALLATION-INSTRUCTIONS.md#Step-7-Run-the-Backend-Server)**

```bash
npm run dev
```

Backend will run on `http://localhost:8888`

8. **[Install Frontend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-8-Install-Frontend-Dependencies)**

```bash
cd ../frontend
npm install
```

9. **[Run the Frontend Server](INSTALLATION-INSTRUCTIONS.md#Step-9-Run-the-Frontend-Server)**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

For detailed installation instructions, see [INSTALLATION-INSTRUCTIONS.md](INSTALLATION-INSTRUCTIONS.md)

## Environment Configuration

### Backend Environment Variables (`backend/.env`)

```env
NODE_ENV=development
PORT=8888
DATABASE=mongodb://localhost:27017/idurar
JWT_SECRET=your-secret-key-here
RESEND_API=your-resend-api-key
OPENAI_API_KEY=your-openai-key (optional)
PUBLIC_SERVER_FILE=http://localhost:8888/
```

### Frontend Environment Variables (`frontend/.env`)

```env
VITE_BACKEND_SERVER=http://localhost:8888/api/
VITE_FILE_BASE_URL=http://localhost:8888/
PROD=false
VITE_DEV_REMOTE=local
```

## Available Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run setup` | Initialize database with default data |
| `npm run upgrade` | Run database migrations/upgrades |
| `npm run reset` | Reset database (WARNING: Deletes all data) |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run dev:remote` | Run with remote backend |

## API Documentation

IDURAR provides a RESTful API with the following main endpoints:

### Authentication

- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/verify` - Verify JWT token

### Invoice Management

- `GET /api/invoice` - List all invoices
- `GET /api/invoice/:id` - Get invoice by ID
- `POST /api/invoice` - Create new invoice
- `PATCH /api/invoice/:id` - Update invoice
- `DELETE /api/invoice/:id` - Delete invoice
- `GET /api/invoice/summary` - Get invoice summary

### Quote Management

- `GET /api/quote` - List all quotes
- `GET /api/quote/:id` - Get quote by ID
- `POST /api/quote` - Create new quote
- `PATCH /api/quote/:id` - Update quote
- `DELETE /api/quote/:id` - Delete quote
- `POST /api/quote/convert/:id` - Convert quote to invoice

### Payment Management

- `GET /api/payment` - List all payments
- `GET /api/payment/:id` - Get payment by ID
- `POST /api/payment` - Record new payment
- `PATCH /api/payment/:id` - Update payment
- `DELETE /api/payment/:id` - Delete payment

### Client Management

- `GET /api/client` - List all clients
- `GET /api/client/:id` - Get client by ID
- `POST /api/client` - Create new client
- `PATCH /api/client/:id` - Update client
- `DELETE /api/client/:id` - Delete client

### Admin & Settings

- `GET /api/admin` - List admins
- `POST /api/admin` - Create admin
- `GET /api/setting` - Get settings
- `PATCH /api/setting/:id` - Update settings

For detailed API documentation with request/response examples, authentication flows, and code examples, see **[API.md](API.md)**

## Database Schema

### Core Collections

- **admins** - User accounts and authentication
- **adminpasswords** - Secure password storage with salt hashing
- **settings** - Application configuration
- **uploads** - File upload tracking

### Business Collections

- **invoices** - Invoice documents
- **quotes** - Quote/offer documents
- **payments** - Payment records
- **clients** - Customer information
- **paymentmodes** - Payment method configuration
- **taxes** - Tax rate configuration

## May i can use IDURAR for Commercial use :

- Yes You can use IDURAR for free for personal or Commercial use.

## Our Sponsors

  <a href="https://m.do.co/c/4ead8370b905?ref=idurarapp.com">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" width="201px">
  </a>

#

<img width="1403" alt="Open Source ERP CRM" src="https://github.com/idurar/idurar-erp-crm/assets/136928179/a6712286-7ca6-4822-8902-fb7523533ee8">

## Free Open Source ERP / CRM App

IDURAR is Open "Fair-Code" Source ERP / CRM (Invoice / Inventory / Accounting / HR) Based on Mern Stack (Node.js / Express.js / MongoDb / React.js ) with Ant Design (AntD) and Redux


## Getting started

1.[Clone the repository](INSTALLATION-INSTRUCTIONS.md#step-1-clone-the-repository)

2.[Create Your MongoDB Account and Database Cluster](INSTALLATION-INSTRUCTIONS.md#Step-2-Create-Your-MongoDB-Account-and-Database-Cluster)

3.[Edit the Environment File](INSTALLATION-INSTRUCTIONS.md#Step-3-Edit-the-Environment-File)

4.[Update MongoDB URI](INSTALLATION-INSTRUCTIONS.md#Step-4-Update-MongoDB-URI)

5.[Install Backend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-5-Install-Backend-Dependencies)

6.[Run Setup Script](INSTALLATION-INSTRUCTIONS.md#Step-6-Run-Setup-Script)

7.[Run the Backend Server](INSTALLATION-INSTRUCTIONS.md#Step-7-Run-the-Backend-Server)

8.[Install Frontend Dependencies](INSTALLATION-INSTRUCTIONS.md#Step-8-Install-Frontend-Dependencies)

9.[Run the Frontend Server](INSTALLATION-INSTRUCTIONS.md#Step-9-Run-the-Frontend-Server)

## Development

For developers who want to contribute or customize IDURAR:

- **[Development Guide](DEVELOPMENT.md)** - Complete guide for setting up your development environment, coding standards, common tasks, and troubleshooting
- **[Architecture Documentation](ARCHITECTURE.md)** - System architecture, design patterns, database schema, and technical implementation details
- **[API Documentation](API.md)** - Complete REST API reference with examples

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **[How to contribute](CONTRIBUTING.md#how-to-contribute)** - Guidelines for contributing to IDURAR
2. **[Reporting issues](CONTRIBUTING.md#reporting-issues)** - How to report bugs and request features
3. **[Working on issues](CONTRIBUTING.md#working-on-issues)** - Claiming and working on issues
4. **[Submitting pull requests](CONTRIBUTING.md#submitting-pull-requests)** - PR guidelines and review process
5. **[Commit Guidelines](CONTRIBUTING.md#commit-guidelines)** - Commit message conventions
6. **[Coding Guidelines](CONTRIBUTING.md#coding-guidelines)** - Code style and best practices
7. **[Questions](CONTRIBUTING.md#questions)** - How to ask questions and get help

Before contributing, please read our **[Code of Conduct](CODE-OF-CONDUCT.md)** and **[Security Policy](SECURITY.md)**.

## Documentation

### Core Documentation
- **[README.md](README.md)** - Project overview and quick start (this file)
- **[INSTALLATION-INSTRUCTIONS.md](INSTALLATION-INSTRUCTIONS.md)** - Detailed installation guide
- **[API.md](API.md)** - Complete REST API documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)** - Community code of conduct
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability reporting
- **[doc/](doc/)** - Feature documentation in 40+ languages

### Industry-Specific Guides
- **[AUTOMOTIVE-WORKSHOP-GUIDE.md](AUTOMOTIVE-WORKSHOP-GUIDE.md)** - Complete implementation guide for automotive workshops with vehicle management, service records, appointments, parts inventory, and technician scheduling
- **[IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md)** - Detailed 12-week implementation plan with sprint breakdowns, team structure, technical setup, risk management, and deployment strategy

## Deployment

### Production Deployment

For production deployment, consider the following:

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use MongoDB Atlas or a production MongoDB instance
3. **Security**: Enable HTTPS, set strong JWT secrets, configure CORS properly
4. **Performance**: Enable compression, use PM2 or similar process manager
5. **Monitoring**: Set up logging and monitoring (e.g., PM2, New Relic, DataDog)
6. **Backups**: Configure automatic database backups

### Deployment Options

- **Self-Hosted**: Deploy on your own servers (VPS, dedicated servers)
- **Cloud Platforms**: Deploy on AWS, DigitalOcean, Google Cloud, Azure
- **Docker**: Containerize and deploy with Docker
- **Enterprise**: **[IDURAR Cloud](https://cloud.idurarapp.com)** - Managed enterprise version

### Recommended Stack

```
Nginx (Reverse Proxy) → Node.js (Backend) → MongoDB
                      ↓
                Static Files (Frontend Build)
```

## Security

IDURAR takes security seriously. We implement:

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt
- **Role-Based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for API security
- **Input Validation** using Joi
- **SQL Injection Prevention** via MongoDB and Mongoose
- **XSS Protection** via React and Content Security Policy

If you discover a security vulnerability, please follow our **[Security Policy](SECURITY.md)**.

## Performance

IDURAR is optimized for performance:

- **Database Indexing** for fast queries
- **Response Compression** (gzip)
- **Pagination** for large datasets
- **Lazy Loading** in React components
- **Code Splitting** with Vite
- **Caching** with node-cache
- **Production Build Optimization**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Show your support

Dont forget to give a ⭐️ to this project ... Happy coding!

**🚀 Self-hosted Entreprise Version** : [https://cloud.idurarapp.com](https://cloud.idurarapp.com)

## Community

- **GitHub**: [https://github.com/idurar/idurar-erp-crm](https://github.com/idurar/idurar-erp-crm)
- **Website**: [https://www.idurarapp.com](https://www.idurarapp.com)
- **Issues**: [Report bugs or request features](https://github.com/idurar/idurar-erp-crm/issues)
- **Discussions**: [Join the community](https://github.com/idurar/idurar-erp-crm/discussions)

## Support

If you need help or have questions:

- Check the **[Documentation](README.md#documentation)** section above
- Search **[existing issues](https://github.com/idurar/idurar-erp-crm/issues)**
- Create a **[new issue](https://github.com/idurar/idurar-erp-crm/issues/new)**
- Email: **hello@idurarapp.com**

## Roadmap

Future enhancements planned for IDURAR:

- [ ] Real-time notifications with WebSocket
- [ ] Advanced reporting and analytics
- [ ] Inventory management
- [ ] HR management module
- [ ] Project management features
- [ ] Mobile application (iOS/Android)
- [ ] Multi-company support
- [ ] API webhooks
- [ ] Advanced permissions system
- [ ] Integration marketplace

## Changelog

See **[GitHub Releases](https://github.com/idurar/idurar-erp-crm/releases)** for version history and changelogs.

**Current Version**: 4.1.0

## License

IDURAR is **Free Open Source** software released under the **[GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE)**.

### What this means:

- ✅ **Free to use** for personal and commercial purposes
- ✅ **Free to modify** and customize to your needs
- ✅ **Free to distribute** modified versions
- ⚠️ **Must disclose source** if you distribute or provide as a service
- ⚠️ **Must use same license** (AGPL-3.0) for derived works
- ⚠️ **Must state changes** made to the code

For more details, see the **[LICENSE](LICENSE)** file.

## Credits

Built with ❤️ by the IDURAR team and contributors.

### Key Technologies

- [React](https://react.dev/) - UI framework
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Ant Design](https://ant.design/) - UI components
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Vite](https://vitejs.dev/) - Build tool

### Contributors

Thank you to all the people who have contributed to IDURAR!

See the **[Contributors](https://github.com/idurar/idurar-erp-crm/graphs/contributors)** page.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=idurar/idurar-erp-crm&type=Date)](https://star-history.com/#idurar/idurar-erp-crm&Date)

---

**Made with ❤️ by IDURAR** | [Website](https://www.idurarapp.com) | [GitHub](https://github.com/idurar) | [Cloud Version](https://cloud.idurarapp.com)
