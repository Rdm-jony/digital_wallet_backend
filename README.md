
# 💳 Digital Wallet API

A RESTful API backend for managing a digital wallet system with user roles, OTP verification, wallet transactions (top-up, withdraw, send), and role-based access.

---
## 🔗 **Live URL**: [https://digital-wallet-beckend.vercel.app](https://digital-wallet-beckend.vercel.app)


## 🧰 Tech Stack
- Node.js + Express
- TypeScript
- MongoDB
- JWT Auth + OTP
- Redis (for OTP and session control)
- Cloudinary (optional)
- Deployment: Vercel

---

## 📁 Folder Structure (src/)
```
src/
├── app.ts                # App initialization
├── server.ts             # Server setup
├── app/
│   ├── config/           # Environment configs, Redis, Cloudinary, Passport
│   ├── errorHelpers/     # Custom error classes & handlers
│   ├── interfaces/       # TypeScript types/interfaces
│   ├── middlewares/      # Middlewares (auth, error handler)
│   ├── modules/          # Features: auth, otp, user, wallet, transaction
│   ├── routes/           # Main route exporter
│   └── utils/            # Utility functions (JWT, Mail, OTP, etc.)
```

---

## ✨ Features
### 🔐 Authentication & Authorization
✅ JWT-based login system with three distinct roles: admin, user, and agent

✅ Secure password hashing using bcrypt

✅ Role-based route protection to restrict access based on roles

### 👤 User Features
✅ Automatic wallet creation upon registration with an initial balance of ৳50

✅ Ability to:

- 💰 Top-up (add money to own wallet)

- 💸 Withdraw funds

- 🔁 Send money to another user

📜 View transaction history

### 🧑‍💼 Agent Features
✅ Can cash-in (add money) to any user's wallet

✅ Can cash-out (withdraw money) from any user's wallet

✅ Optionally view their commission history

### 🛠️ Admin Features
✅ View all users, agents, wallets, and transactions

✅ Block/unblock any user's wallet

✅ Approve/suspend agent accounts

✅ Optionally set system parameters, such as transaction fees or commission rates

### 📊 Transaction System
✅ Every financial operation (top-up, send, withdraw, cash-in, cash-out) is  trackable

✅ Clear separation of transaction types for audit and reporting

### 🛡️ Security
✅ Role-based access control

✅ OTP-based verification for sensitive operations

✅ Secure authentication and authorization flows

---

## 📦 API Endpoints


# 🔐 User API Endpoin

### ✅ POST `/api/v1/user/create`

**Description:**  
Create a new user with optional file upload (e.g., profile picture).

**Headers:**  
`Content-Type: multipart/form-data`

**Request Body (form-data):**  
- `file` (optional): image or file to upload  
- Other fields (as JSON keys in form-data):  
```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```
---
✅ **GET** `/api/v1/user/all-users`

**Description:**  
Get a list of all users.

**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`

**Response:**  
Array of user objects.

---
✅ **GET** `/api/v1/user/get-me`

**Description:**  
Get the currently authenticated user's profile.

**Authorization:**  
Required — All roles

**Response:**  
User object for the authenticated user.

---
✅ **POST** `/api/v1/user/request-agent`

**Description:**  
Request to become an agent.

**Authorization:**  
Required — Role: `USER`

**Request Body:**  
_No body required._

**Response:**  
Success message or updated user information.

---
✅ **GET** `/api/v1/user/:id`

**Description:**  
Get a single user by ID.

**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`

**Response:**  
User object.

---
✅ **PATCH** `/api/v1/user/:id`

**Description:**  
Update user details with optional file upload.


**Authorization:**  
Required — All roles


**Headers:**  

| Content-Type  | multipart/form-data   


**Request Body (form-data):**

- `file` (optional): file upload  
- Other fields as JSON keys in form-data:

```
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "AGENT",
   ....
}
````
---
✅ **PATCH** `/api/v1/user/approve-agent/:id`

**Description:**  
Approve a user's request to become an agent.

**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`

**Response:**  
Success message or updated agent status.

---
✅ **PATCH** `/api/v1/user/suspend-agent/:id`

**Description:**  
Suspend an agent user.

**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`


**Response:**  
Success message or updated agent status.


---
# 🔐 Auth API Endpoints

These routes handle user authentication, password management, and Google OAuth.


### 🔄 POST `/api/v1/auth/login`

**Description:**  
Log in using email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```
**Response:**  
Returns a new unser.Set access token and refresh token (usually in cookies).

---

### 🔄 POST `/api/v1/auth/refresh-token`

**Description:**  
Get a new access token using a refresh token.

**Response:**  
Returns a new access token.

---

### 🔄 GET `/api/v1/auth/google`

**Description:**  
Redirects the user to Google OAuth consent screen.

**Query Parameters:**
- `redirect` _(optional)_: URL to redirect after successful login.

---

### 🔄 GET `/api/v1/auth/google/callback`

**Description:**  
Callback route for Google OAuth.

**Note:**  
On failure, it redirects to the frontend login page.

---

### 🛡️ POST `/api/v1/auth/change-password`

**Access:**  
Authenticated (`USER`, `AGENT`, `ADMIN`)

**Request Body:**
```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@456"
}
```

**Description:**  
Change the current user's password.

---

### 🔑 POST `/api/v1/auth/set-password`

**Use Case:**  
Used for users who signed in with Google but want to set a local password.

**Access:**  
Authenticated

**Request Body:**
```json
{
  "plainPassword": "MyNewLocalPassword@123"
}
```

---

### 🔐 POST `/api/v1/auth/logout`

**Description:**  
Logs the user out by clearing refresh tokens or relevant sessions.

---

### 📩 POST `/api/v1/auth/forget-password`

**Description:**  
Sends a password reset OTP to the registered email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### 🔄 POST `/api/v1/auth/reset-password`

**Access:**  
Authenticated (after OTP verification)

**Request Body:**
```json
{
    "id":"68833e18716062f268c26480",
    "newPassword":"newPassword123"
}
```

**Description:**  
Reset password after verifying OTP.
        |


# 🔐 OTP API Endpoints

These routes handle email-based OTP sending and verification for sensitive actions like password reset.


### 📩 POST `/api/v1/otp/send`

**Description:**  
Send an OTP to the user’s email for verification.

**Request Body:**
```json
{
   "name":"user name",
  "email": "user@example.com"
}
```

**Response:**  
Returns a success message if the OTP was sent.

---

### ✅ POST `/api/v1/otp/verify`

**Description:**  
Verify the OTP sent to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**  
Returns a success message if OTP is correct and valid.
         |



# Wallet API Documentation




### ✅ GET `/api/v1/wallet/me`

**Description:**  
Get the wallet details of the currently authenticated user or agent.

**Authorization:**  
Required — Roles: USER, AGENT

**Response:**  
Returns wallet object for the logged-in user or agent.

---
✅ **GET** `/api/v1/wallet/all-wallet`

**Description:**  
Get all wallets in the system.


**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`

---
✅ **PATCH** `/api/v1/wallet/block/:id`

**Description:**  
Block a wallet by ID to prevent any further transactions.


**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`


**Response:**  
Success message and the updated wallet object.


**Response:**  
Array of wallet objects.

---
✅ **PATCH** `/api/v1/wallet/unblock/:id`

**Description:**  
Unblock a wallet by ID to allow transactions again.


**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`


**Response:**  
Success message and the updated wallet object.

---
# Transaction API Documentation


### ✅ POST `/api/v1/transaction/topup`

**Description:**  
Top up money to the user's wallet.

**Authorization:**  
Required — Roles: USER, AGENT

**Request Body:**
```
{
  "amount": 1000
}
```
**Response:**
```
{
  "message": "Transaction successfull",
  "transaction": {
    "transferType::"TOPUP"

   ....
  }
}

```
---
✅ **POST** `/api/v1/transaction/send-money`

**Description:**  
Send money to another user's wallet.


**Authorization:**  
Required — Role: `USER`


**Request Body:**

```
{
  "amount": 200,
  "receiverWalletId": "64d1a2b3c4d5e6f7g8h9i0j1"
}
```
**Response:**
```
{
  "message": "Transaction successfull",
  "transaction": {
    "transferType::"SENDMONEY"
   ....
  }
}

```
---
✅ **POST** `/api/v1/transaction/withdraw`

**Description:**  
Withdraw money from the user's wallet.


**Authorization:**  
Required — Roles: `USER`, `AGENT`


**Request Body:**

```
{
  "amount": 500
}
```
**Response:**
```
{
  "message": "Transaction successfull",
  "transaction": {
    "transferType::"WITHDRAW"
   ....
  }
}

```
---
### ✅ **POST** `/api/v1/transaction/cashIn`

**Description:**  
Agent receives cash from a user and deposits it into their wallet.

**Authorization:**  
Required — Role: `AGENT`


**Request Body:**
```
{
  "amount": 300,
  "receiverWalletId": "64d1a2b3c4d5e6f7g8h9i0j1"
}
```
**Response:**
```
{
  "message": "Transaction successfull",
  "transaction": {
    "transferType::"CASHIN"
   ....
  }
}

```

---
✅ **POST** `/api/v1/transaction/cashOut`

**Description:**  
User requests cash out through an agent.

---

**Authorization:**  
Required — Role: `USER`

---

**Request Body:**

```
{
  "amount": 400,
  "receiverWalletId": "64d3a4b5c6d7e8f9g0h1i2j3"
}
```
**Response:**
```
{
  "message": "Transaction successfull",
  "transaction": {
    "transferType::"CASHOUT"
   ....
  }
}

```
---
✅ **GET** `/api/v1/transaction/history`

**Description:**  
Get transaction history for the logged-in user or agent.



**Authorization:**  
Required — Roles: `USER`, `AGENT`


**Response:**  
Array of transaction objects related to the authenticated user or agent.

---
✅ **GET** `/api/v1/transaction/all-transaction`

**Description:**  
Get all transactions in the system (admin panel).


**Authorization:**  
Required — Roles: `ADMIN`, `SUPER_ADMIN`



**Response:**  
Array of all transaction objects in the system.

---

## 📫 API Testing

You can test the API using the provided Postman collection:

- 📦 **Postman Collection**: [Download Collection](./digital_wallet_backend/digital_wallet.postman_collection.json)
- 🌐 **Live Base URL**: `https://digital-wallet-beckend.vercel.app`


## 🛠 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/yourusername/digital_wallet_backend.git
cd digital_wallet_backend

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Fill in Mongo URI, JWT secrets, Redis, Mail config

# Run the app
npm run dev
```

---

## ✅ Environment Variables (`.env`)

```env
# .env.example

# Application
PORT=5000
NODE_ENV=development

# MongoDB
DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority

# Super Admin
SUPER_ADMIN_EMAIL=your_super_admin_email@example.com
SUPER_ADMIN_PASSWORD=your_super_admin_password

# Bcrypt
BCRYPT_SALT=10

# Session Secret
EXPRESS_SESSION_SECRET=your_express_session_secret

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRESIN=1d

JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRESIN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Frontend URL
FRONT_END_URL=http://localhost:5173

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
SMTP_FROM=your_email@example.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password

```
