# 📘 Omni CRM Platform - Complete Codebase Explanation & Implementation Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [How the System Runs](#how-the-system-runs)
3. [Architecture Breakdown](#architecture-breakdown)
4. [Complete Feature List](#complete-feature-list)
5. [Module-by-Module Breakdown](#module-by-module-breakdown)
6. [Database Structure](#database-structure)
7. [API Flow & Request Lifecycle](#api-flow--request-lifecycle)
8. [Key Technologies & Their Usage](#key-technologies--their-usage)
9. [What's Been Implemented](#whats-been-implemented)
10. [How to Use the System](#how-to-use-the-system)

---

## 🎯 System Overview

**Omni CRM Platform** is a comprehensive, multi-tenant Customer Relationship Management and Omnichannel Communication platform. Think of it as a complete backend system that allows multiple businesses (organizations) to manage:

- **Customer Relationships** (CRM functionality)
- **Multi-Channel Communications** (WhatsApp, Email, Facebook, Telegram)
- **Support Tickets** (Customer support system)
- **Sales Pipeline** (Deal management)
- **Team Management** (Teams and role-based access)
- **Real-time Messaging** (Unified inbox for all channels)

### Why Multi-Tenant?
- One codebase serves multiple organizations
- Each organization has isolated data
- Centralized management and updates
- Cost-effective SaaS model

---

## 🚀 How the System Runs

### Application Startup Flow

```
┌─────────────────┐
│   server.js     │ ◄── Entry Point
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load .env      │ ◄── Environment variables
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Module Aliases  │ ◄── Path aliasing (@, @util, @model, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   src/app.js    │ ◄── Express app configuration
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│    Initialize Infrastructure        │
├─────────────────────────────────────┤
│ ✓ Database (PostgreSQL)             │
│ ✓ Redis (optional)                  │
│ ✓ Cron Jobs (SLA monitoring)        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Setup Express  │
├─────────────────┤
│ • Security (Helmet)                 │
│ • CORS                              │
│ • Body Parser                       │
│ • Compression                       │
│ • Rate Limiting                     │
│ • Multi-tenancy Middleware          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mount Routes   │
├─────────────────┤
│ • API v1 (/api/v1)                  │
│ • Swagger Docs (/docs)              │
│ • Health Check                      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Start Server    │
│ Port: 3000      │
│ Ready! 🎉       │
└─────────────────┘
```

### What Happens When a Request Comes In?

```
1. CLIENT REQUEST
   ↓
2. RATE LIMITER (blocks too many requests)
   ↓
3. TENANT MIDDLEWARE (identifies organization)
   ↓
4. ROUTE MATCHER (finds correct endpoint)
   ↓
5. AUTH MIDDLEWARE (validates JWT token)
   ↓
6. RBAC MIDDLEWARE (checks permissions)
   ↓
7. VALIDATION (validates input data)
   ↓
8. CONTROLLER (handles HTTP request)
   ↓
9. SERVICE (business logic)
   ↓
10. DATABASE (reads/writes data)
   ↓
11. RESPONSE (sends JSON back to client)
```

---

## 🏗️ Architecture Breakdown

### 1. **server.js** - Application Entry Point

**What it does:**
- Loads environment variables (.env file)
- Initializes database connections
- Sets up Redis (if enabled)
- Starts cron jobs (automated tasks)
- Starts Express server on port 3000
- Handles graceful shutdown

**Code Flow:**
```javascript
// 1. Load env & aliases
require('dotenv').config();
require('module-alias/register');

// 2. Initialize infrastructure
await initializeDatabases();        // Connect to PostgreSQL
await redisClient.connect();        // Connect to Redis (optional)
initializeCronJobs();              // Start scheduled tasks

// 3. Start server
app.listen(3000);
```

---

### 2. **src/app.js** - Express Application Setup

**What it does:**
- Creates Express application
- Configures middleware (security, CORS, body parsing)
- Sets up rate limiting
- Mounts API routes
- Handles errors

**Middleware Stack:**
```
Request
  ↓
helmet()          // Security headers
  ↓
cors()           // Cross-origin requests
  ↓
express.json()   // Parse JSON body
  ↓
compression()    // Compress responses
  ↓
tenantMiddleware // Identify organization
  ↓
apiLimiter       // Rate limiting
  ↓
Routes           // Your API endpoints
  ↓
errorHandler     // Catch all errors
  ↓
Response
```

---

### 3. **Module Alias System** (@imports)

Instead of ugly relative imports:
```javascript
// ❌ BAD
const logger = require('../../../common/utils/logger');
const User = require('../../../infrastructure/database/models/User');
```

We use clean aliases:
```javascript
// ✅ GOOD
const logger = require('@util/logger');
const User = require('@model/User');
```

**Configured in package.json:**
```json
"_moduleAliases": {
  "@": "src",
  "@util": "src/common/utils",
  "@model": "src/infrastructure/database/models",
  "@config": "src/config",
  "@middleware": "src/common/middlewares",
  "@modules": "src/modules"
}
```

---

## ✅ Complete Feature List

### **Phase 1: Core Foundation** (✅ COMPLETED)

#### 1. **Multi-Tenant Organization System**
- ✅ Organization CRUD operations
- ✅ Organization settings management
- ✅ Plan types (free, trial, paid, enterprise)
- ✅ Status management (active, suspended, deleted)
- ✅ Organization statistics
- ✅ Soft delete support

#### 2. **Authentication & Authorization**
- ✅ JWT-based authentication
- ✅ Login/Logout endpoints
- ✅ Token refresh mechanism
- ✅ Password hashing (bcrypt)
- ✅ Email verification
- ✅ 2FA/MFA support
- ✅ OTP authentication
- ✅ Password reset flow

#### 3. **Role-Based Access Control (RBAC)**
- ✅ Dynamic role creation
- ✅ Permission management (resource-action based)
- ✅ Role-permission assignment
- ✅ System roles protection
- ✅ Organization-scoped roles
- ✅ Permission checking middleware
- ✅ Super admin bypass

#### 4. **User Management**
- ✅ User CRUD operations
- ✅ Role assignment
- ✅ Status management
- ✅ Profile management
- ✅ User preferences
- ✅ Soft delete
- ✅ Last login tracking

---

### **Phase 2: CRM Core** (✅ COMPLETED)

#### 5. **Contact Management**
- ✅ Contact CRUD operations
- ✅ Lead scoring
- ✅ Owner assignment
- ✅ Bulk import
- ✅ Convert to customer
- ✅ Contact statistics
- ✅ Custom fields support

#### 6. **Account Management**
- ✅ Account CRUD operations
- ✅ Parent-child relationships
- ✅ Owner assignment
- ✅ Convert to customer
- ✅ Account statistics
- ✅ Contact association
- ✅ Billing/shipping addresses

#### 7. **Sales Pipeline**
- ✅ Pipeline CRUD operations
- ✅ Dynamic stage management
- ✅ Stage reordering
- ✅ Default pipeline support
- ✅ Multiple pipelines per organization

#### 8. **Deal Management**
- ✅ Deal CRUD operations
- ✅ Kanban board view (by pipeline)
- ✅ Stage movement tracking
- ✅ Deal history/audit trail
- ✅ Win/loss marking
- ✅ Deal statistics
- ✅ Expected close date
- ✅ Deal value tracking

---

### **Phase 3: Support System** (✅ COMPLETED)

#### 9. **Team Management**
- ✅ Team CRUD operations
- ✅ Team membership management
- ✅ Bulk member addition
- ✅ Role-based permissions within teams
- ✅ Team leadership transfer
- ✅ Team statistics
- ✅ Team hierarchy

#### 10. **Ticketing System**
- ✅ Ticket CRUD operations
- ✅ Status management (open/pending/resolved/closed)
- ✅ Agent assignment
- ✅ Customer communication threads
- ✅ Internal notes
- ✅ Satisfaction ratings
- ✅ Ticket statistics
- ✅ Ticket categorization
- ✅ Priority management

#### 11. **SLA Management**
- ✅ SLA policy CRUD operations
- ✅ Response time definitions
- ✅ Resolution time targets
- ✅ SLA breach detection (background jobs)
- ✅ Priority-based SLA
- ✅ Business hours support

---

### **Phase 4: Communication Channels** (✅ COMPLETED)

#### 12. **Channel Management**
- ✅ Multi-tenant channel system
- ✅ Channel CRUD operations
- ✅ Channel types: WhatsApp, Facebook, Telegram, Email
- ✅ Channel verification
- ✅ Channel activation/deactivation
- ✅ Routing rules configuration
- ✅ Channel statistics

#### 13. **Conversation Management**
- ✅ Conversation CRUD operations
- ✅ Multi-channel conversations
- ✅ Status management
- ✅ Assignment to agents/teams
- ✅ Priority handling
- ✅ Read/unread status

#### 14. **Message Management**
- ✅ Message CRUD operations
- ✅ Message types (text, image, video, document, audio)
- ✅ Message status tracking (sent, delivered, read, failed)
- ✅ Attachments support
- ✅ Internal notes
- ✅ Message templates

#### 15. **Webhook Processing**
- ✅ Webhook verification
- ✅ Webhook handlers for each channel
- ✅ Signature validation
- ✅ Event processing
- ✅ Retry logic

---

### **Infrastructure Features** (✅ COMPLETED)

#### 16. **Database Layer**
- ✅ Sequelize ORM integration
- ✅ PostgreSQL primary database
- ✅ Connection pooling
- ✅ Migration system
- ✅ Model relationships
- ✅ Database seeders
- ✅ Soft delete support
- ✅ Audit fields (createdBy, updatedBy)

#### 17. **Background Jobs**
- ✅ Bull queue setup
- ✅ Redis integration
- ✅ Job processors
- ✅ SLA breach monitoring jobs
- ✅ Cron job system

#### 18. **Email Service**
- ✅ Nodemailer integration
- ✅ Email templates
- ✅ SMTP configuration
- ✅ Email adapters

#### 19. **Logging**
- ✅ Winston logger setup
- ✅ Daily log rotation
- ✅ Error tracking
- ✅ Request logging
- ✅ Log levels (info, warn, error)

#### 20. **Security**
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Input validation (Joi)
- ✅ SQL injection protection (Sequelize)
- ✅ XSS protection

---

## 📦 Module-by-Module Breakdown

### **1. Auth Module** (`src/modules/auth/`)

**Purpose:** Handles all authentication-related operations

**Files:**
```
auth/
├── auth.controller.js      # HTTP handlers (login, register, logout)
├── auth.service.js         # Main auth business logic
├── auth.routes.js          # Auth endpoints
├── auth.validator.js       # Input validation schemas
├── emailauth.service.js    # Email verification logic
├── otpauth.service.js      # OTP generation/validation
├── passwordauth.service.js # Password reset logic
├── redisauth.service.js    # Session management (Redis)
├── smsauth.service.js      # SMS OTP logic
├── tokenauth.service.js    # JWT token management
├── twofactorauth.service.js # 2FA/MFA logic
└── index.js                # Module exports
```

**What it does:**
- User login with email/password
- JWT token generation and validation
- Refresh token mechanism
- Password reset via email
- Email verification
- OTP login (email/SMS)
- Two-factor authentication (2FA)
- Session management

**API Endpoints:**
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login with email/password
POST   /api/v1/auth/login/otp/request # Request OTP
POST   /api/v1/auth/login/otp/verify  # Verify OTP
POST   /api/v1/auth/refresh-token     # Refresh JWT
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
POST   /api/v1/auth/logout            # Logout
GET    /api/v1/auth/profile           # Get user profile
POST   /api/v1/auth/2fa/setup         # Setup 2FA
POST   /api/v1/auth/2fa/enable        # Enable 2FA
```

---

### **2. RBAC Module** (`src/modules/rbac/`)

**Purpose:** Multi-tenant access control system

#### **2.1 Organizations** (`rbac/organizations/`)

**What it does:**
- Create and manage organizations (tenants)
- Organization settings
- Plan management (free, trial, paid)
- Usage limits (max users, storage)

**Database Table:**
```sql
organizations (
  id, name, slug, email, phone, website,
  plan_type, status, settings (JSONB),
  max_users, max_storage,
  timezone, currency, date_format
)
```

**API Endpoints:**
```
GET    /api/v1/organizations        # List organizations
POST   /api/v1/organizations        # Create organization
GET    /api/v1/organizations/:id    # Get by ID
PUT    /api/v1/organizations/:id    # Update organization
DELETE /api/v1/organizations/:id    # Delete organization
```

#### **2.2 Roles** (`rbac/roles/`)

**What it does:**
- Create custom roles per organization
- Assign permissions to roles
- System roles (protected, can't be deleted)

**Database Table:**
```sql
roles (
  id, name, slug, description,
  is_system, organization_id
)
```

**API Endpoints:**
```
GET    /api/v1/roles                    # List roles
POST   /api/v1/roles                    # Create role
GET    /api/v1/roles/:id/permissions    # Get role permissions
PUT    /api/v1/roles/:id                # Update role
DELETE /api/v1/roles/:id                # Delete role
```

#### **2.3 Permissions** (`rbac/permissions/`)

**What it does:**
- Define granular permissions
- Resource-action based (e.g., "users:create", "roles:delete")

**Database Table:**
```sql
permissions (
  id, name, resource, action, description
)

role_permissions (
  role_id, permission_id
)
```

**Permission Format:**
```javascript
{
  resource: "users",      // What (users, roles, contacts, etc.)
  action: "create",       // How (create, read, update, delete)
  name: "Create Users"
}
```

**API Endpoints:**
```
GET    /api/v1/permissions          # List all permissions
GET    /api/v1/permissions/grouped  # Grouped by module
POST   /api/v1/permissions          # Create permission
```

#### **2.4 Users** (`rbac/users/`)

**What it does:**
- User management
- Role assignment
- User preferences

**Database Table:**
```sql
users (
  id, email, password_hash,
  first_name, last_name, phone, avatar_url,
  role_id, organization_id,
  status, last_login_at,
  preferences (JSONB),
  two_factor_enabled
)
```

---

### **3. CRM Modules**

#### **3.1 Contacts** (`src/modules/contacts/`)

**What it does:**
- Manage customer contacts
- Lead tracking and scoring
- Bulk import contacts
- Convert leads to customers

**Database Table:**
```sql
contacts (
  id, organization_id,
  first_name, last_name, email, phone,
  company, job_title, lead_source,
  lead_status, lead_score,
  owner_id, tags, custom_fields (JSONB)
)
```

**Features:**
- CRUD operations
- Lead scoring (0-100)
- Owner assignment
- Bulk import from CSV
- Tag management
- Custom fields

#### **3.2 Accounts** (`src/modules/accounts/`)

**What it does:**
- Manage business accounts/companies
- Parent-child account relationships
- Account hierarchy

**Database Table:**
```sql
accounts (
  id, organization_id,
  name, industry, account_type, website,
  phone, email, employee_count, annual_revenue,
  billing_address (JSONB), shipping_address (JSONB),
  parent_account_id, owner_id
)
```

#### **3.3 Deals** (`src/modules/deals/`)

**What it does:**
- Sales opportunity management
- Deal pipeline visualization
- Win/loss tracking

**Database Tables:**
```sql
pipelines (
  id, organization_id, name, is_default
)

pipeline_stages (
  id, pipeline_id, name, position, probability
)

deals (
  id, organization_id, pipeline_id, stage_id,
  title, value, currency,
  expected_close_date, status,
  contact_id, account_id, owner_id
)

deal_stage_history (
  id, deal_id, from_stage_id, to_stage_id,
  moved_at, moved_by
)
```

---

### **4. Support System Modules**

#### **4.1 Tickets** (`src/modules/tickets/`)

**What it does:**
- Customer support ticket management
- Multi-channel ticket creation
- SLA tracking

**Database Tables:**
```sql
tickets (
  id, organization_id, ticket_number,
  subject, description,
  status, priority, ticket_type, category,
  contact_id, requester_email,
  assigned_to, assigned_team_id,
  channel, sla_policy_id,
  first_response_due, resolution_due,
  satisfaction_rating, tags (array)
)

ticket_messages (
  id, ticket_id, sender_type, sender_id,
  content, content_type,
  is_note, attachments (JSONB)
)
```

**Features:**
- Ticket CRUD
- Assignment to agents/teams
- Internal notes
- Satisfaction ratings
- SLA monitoring

#### **4.2 Teams** (`src/modules/teams/`)

**What it does:**
- Team organization
- Team member management

**Database Tables:**
```sql
teams (
  id, organization_id, name, description,
  team_lead_id, parent_team_id
)

team_members (
  id, team_id, user_id, role,
  joined_at
)
```

#### **4.3 SLA Policies** (`src/modules/sla/`)

**What it does:**
- Define service level agreements
- Response and resolution time targets
- Automated breach detection

**Database Table:**
```sql
sla_policies (
  id, organization_id, name, description,
  is_default, is_active,
  first_response_time, resolution_time,
  business_hours (JSONB),
  target_by_priority (JSONB)
)
```

---

### **5. Communication Modules**

#### **5.1 Channels** (`src/modules/channels/`)

**What it does:**
- Multi-channel integration management
- WhatsApp, Facebook, Telegram, Email setup
- Webhook processing

**Database Table:**
```sql
channels (
  id, organization_id, name, channel_type,
  config (JSONB),           # Stores credentials
  is_active, is_verified,
  default_team_id,
  routing_rules (JSONB)
)
```

**Channel Types:**
- `whatsapp` - WhatsApp Business Cloud API
- `facebook` - Facebook Messenger (Pages)
- `telegram` - Telegram Bot
- `email` - SMTP/IMAP
- `chat_widget` - Web chat widget

**API Endpoints:**
```
GET    /api/v1/channels           # List channels
POST   /api/v1/channels           # Create channel
GET    /api/v1/channels/:id       # Get channel
PUT    /api/v1/channels/:id       # Update channel
DELETE /api/v1/channels/:id       # Delete channel
POST   /api/v1/channels/:id/verify # Verify credentials

# Webhooks (public endpoints)
POST   /api/v1/webhooks/whatsapp  # WhatsApp webhook
POST   /api/v1/webhooks/facebook  # Facebook webhook
POST   /api/v1/webhooks/telegram  # Telegram webhook
```

#### **5.2 Conversations** (`src/modules/conversation/`)

**What it does:**
- Unified conversation management across all channels
- Assignment to agents
- Conversation status tracking

**Database Table:**
```sql
conversations (
  id, organization_id, channel_id,
  contact_id, account_id,
  status, priority,
  assigned_agent_id, assigned_team_id,
  last_message_at, unread_count,
  metadata (JSONB)
)
```

#### **5.3 Messages** (`src/modules/messages/`)

**What it does:**
- Message storage and retrieval
- Support for multiple content types
- Delivery status tracking

**Database Table:**
```sql
messages (
  id, conversation_id, channel_id,
  sender_type, sender_id,
  content, content_type,
  status, direction,
  external_id, metadata (JSONB),
  sent_at, delivered_at, read_at
)
```

**Message Types:**
- text
- image
- video
- document
- audio
- location
- contact
- template

---

## 🗄️ Database Structure

### **Core Tables:**

1. **organizations** - Multi-tenant organizations
2. **users** - User accounts
3. **roles** - User roles
4. **permissions** - Granular permissions
5. **role_permissions** - Role-permission mapping

### **CRM Tables:**

6. **contacts** - Customer contacts
7. **accounts** - Business accounts
8. **contact_accounts** - Contact-account relationships
9. **pipelines** - Sales pipelines
10. **pipeline_stages** - Pipeline stages
11. **deals** - Sales opportunities
12. **deal_stage_history** - Deal movement tracking

### **Support Tables:**

13. **teams** - Team definitions
14. **team_members** - Team membership
15. **tickets** - Support tickets
16. **ticket_messages** - Ticket conversations
17. **sla_policies** - SLA definitions

### **Communication Tables:**

18. **channels** - Communication channels
19. **conversations** - Unified conversations
20. **messages** - All messages

### **Relationships:**

```
Organization
  ├── has many Users
  ├── has many Roles
  ├── has many Contacts
  ├── has many Accounts
  ├── has many Deals
  ├── has many Tickets
  ├── has many Teams
  ├── has many Channels
  └── has many Conversations

Contact
  ├── belongs to Organization
  ├── has many Deals
  ├── has many Tickets
  └── belongs to many Accounts

Deal
  ├── belongs to Organization
  ├── belongs to Pipeline
  ├── belongs to Stage
  ├── belongs to Contact
  └── has many Stage History entries

Conversation
  ├── belongs to Organization
  ├── belongs to Channel
  ├── belongs to Contact
  ├── has many Messages
  └── assigned to User/Team
```

---

## 🔄 API Flow & Request Lifecycle

### Example: Creating a Contact

```
1. CLIENT SENDS REQUEST
   POST /api/v1/contacts
   Headers: { Authorization: "Bearer <token>" }
   Body: { firstName: "John", lastName: "Doe", email: "john@example.com" }

2. EXPRESS RECEIVES REQUEST
   ↓

3. RATE LIMITER
   ✓ Check: Not exceeding rate limit
   ↓

4. TENANT MIDDLEWARE
   ✓ Extract: organization from token
   ↓

5. ROUTE MATCHER
   ✓ Match: POST /api/v1/contacts → contactRoutes
   ↓

6. AUTH MIDDLEWARE
   ✓ Verify: JWT token valid
   ✓ Load: User data from database
   ✓ Attach: req.user = { id, organizationId, roleId }
   ↓

7. RBAC MIDDLEWARE
   ✓ Check: User has "contacts:create" permission
   ✓ Query: role_permissions table
   ↓

8. VALIDATION MIDDLEWARE
   ✓ Validate: Input against Joi schema
   ✓ Check: Required fields, email format, etc.
   ↓

9. CONTROLLER (contact.controller.js)
   → contactController.create(req, res)
   → Extract data from req.body
   → Call contactService.create()
   ↓

10. SERVICE (contact.service.js)
    → contactService.create(data, userId, orgId)
    → Business logic
    → Check for duplicates
    → Generate lead score
    → Validate owner exists
    ↓

11. DATABASE (Sequelize ORM)
    → Contact.create({ ...data })
    → INSERT INTO contacts (...) VALUES (...)
    → Return created contact
    ↓

12. SERVICE RETURNS
    → Return contact object
    ↓

13. CONTROLLER FORMATS RESPONSE
    → successResponse(res, contact, "Contact created", 201)
    ↓

14. CLIENT RECEIVES RESPONSE
    {
      "success": true,
      "message": "Contact created successfully",
      "data": {
        "id": 123,
        "firstName": "John",
        ...
      }
    }
```

---

## 🔧 Key Technologies & Their Usage

### **1. Express.js** (Web Framework)
- Handles HTTP requests/responses
- Middleware pipeline
- Routing system

### **2. Sequelize** (ORM)
- Database abstraction
- Model definitions
- Query building
- Migrations
- Relationships

### **3. PostgreSQL** (Database)
- Primary data store
- ACID compliance
- JSONB for flexible data
- Full-text search

### **4. JWT** (Authentication)
- Stateless authentication
- Token-based auth
- Claims/payload: userId, organizationId

### **5. Joi** (Validation)
- Input validation
- Schema definition
- Error messages

### **6. Winston** (Logging)
- Application logging
- Log rotation
- Multiple transports (file, console)

### **7. Bull** (Job Queue)
- Background job processing
- Redis-backed
- Retry logic
- Cron jobs

### **8. Bcrypt** (Password Hashing)
- Secure password storage
- Salt rounds
- Async hashing

### **9. Nodemailer** (Email)
- SMTP email sending
- Template support
- Attachment handling

### **10. Axios** (HTTP Client)
- External API calls
- WhatsApp/Facebook API integration
- Webhook sending

---

## 📊 What's Been Implemented

### ✅ **100% Complete Modules:**

1. ✅ **Authentication System**
   - Login, Logout, Register
   - JWT tokens, Refresh tokens
   - 2FA, OTP, Email verification
   - Password reset

2. ✅ **RBAC System**
   - Organizations, Roles, Permissions
   - User management
   - Permission checking
   - Multi-tenancy

3. ✅ **CRM Core**
   - Contacts (with lead scoring)
   - Accounts (with hierarchy)
   - Deals (with pipeline)
   - Pipeline stages

4. ✅ **Support System**
   - Tickets (with messages)
   - Teams (with members)
   - SLA policies
   - Satisfaction ratings

5. ✅ **Communication Channels**
   - Channel management
   - Conversations
   - Messages
   - Webhook processing

6. ✅ **Infrastructure**
   - Database migrations
   - Background jobs
   - Email service
   - Logging system
   - Cron jobs

---

## 🎯 How to Use the System

### **Step 1: Setup**

```bash
# Install dependencies
npm install

# Setup database
createdb omni_db

# Run migrations
npm run migrate

# Start server
npm run dev
```

### **Step 2: Create Organization**

```bash
POST /api/v1/organizations
{
  "name": "Acme Corp",
  "email": "admin@acme.com",
  "planType": "trial"
}
```

### **Step 3: Create Admin User**

```bash
POST /api/v1/auth/register
{
  "email": "admin@acme.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Admin",
  "organizationId": 1,
  "roleId": 1
}
```

### **Step 4: Login**

```bash
POST /api/v1/auth/login
{
  "email": "admin@acme.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": { ... }
  }
}
```

### **Step 5: Use the Token**

```bash
# All subsequent requests include the token
GET /api/v1/contacts
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

---

## 📈 System Capabilities

### **Current Capacity:**
- ✅ Multi-tenant (unlimited organizations)
- ✅ Unlimited users per organization
- ✅ Unlimited contacts/accounts/deals
- ✅ Multiple channels per organization
- ✅ Real-time message processing
- ✅ Background job processing
- ✅ Automated SLA monitoring

### **Performance:**
- Database connection pooling
- Request rate limiting
- Response compression
- Optimized queries with indexes
- Async processing for heavy operations

---

## 🎓 Learning the Codebase

### **Start Here:**
1. Read `server.js` - Understand startup
2. Read `src/app.js` - Understand Express setup
3. Explore `src/modules/auth` - See a complete module
4. Look at `src/common/middlewares` - Understand middleware
5. Check `src/infrastructure/database/models` - See data models

### **Key Concepts:**
1. **Module Pattern** - Each feature is a self-contained module
2. **Middleware Chain** - Requests pass through multiple middlewares
3. **Service Layer** - Business logic separated from HTTP layer
4. **Repository Pattern** - Database access through ORM
5. **Multi-tenancy** - Organization isolation at database level

---

## 📝 Summary

**Omni CRM Platform** is a production-ready, enterprise-grade backend system that provides:

- 🏢 **Multi-tenant architecture** - One codebase, many organizations
- 🔐 **Robust authentication** - JWT, 2FA, OTP, email verification
- 👥 **Flexible RBAC** - Custom roles and permissions per organization
- 📞 **Omnichannel communication** - WhatsApp, Facebook, Telegram, Email
- 🎫 **Complete support system** - Tickets, SLA, teams
- 💼 **Full CRM** - Contacts, accounts, deals, pipelines
- 🚀 **Production-ready infrastructure** - Background jobs, logging, monitoring

**Total Implementation:**
- **20+ Database Tables**
- **100+ API Endpoints**
- **15+ Modules**
- **3 Authentication Methods**
- **4 Communication Channels**
- **Full RBAC System**

The system is **fully functional, tested, and ready for production use**! 🎉

---

**Last Updated:** January 15, 2026
**Version:** 2.0.0
**Status:** Production Ready ✅
