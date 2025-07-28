# 🛡️ User Authentication Backend (TypeScript + Node.js)

A full-featured authentication backend built with **Node.js**, **Express**, and **TypeScript** that supports secure login, Google OAuth, role-based access, JWT authentication, OTP-based password recovery, and file upload.

---

## ✨ Features

- ✅ User login via credentials & Google OAuth
- 🔐 JWT access & refresh token system
- 👥 Role-based access control (`user`, `admin`, `superadmin`)
- 🔁 Token refresh logic
- 📧 Forgot password with email OTP
- 🧾 EJS templated emails
- 🛡️ Secure cookie handling
- 📁 File upload (Multer + Cloudinary)
- ✅ Input validation using Zod
- 🚧 Global error handler & custom AppError class
- 🧠 Clean modular architecture (Controller-Service-Route)

---

---

## 🚀 Live Demo

Check out the live backend deployed on Vercel:  
🔗 [https://user-auth-beckend.vercel.app](https://user-auth-beckend.vercel.app)

---



## ⚙️ Tech Stack

| Tech         | Description                    |
|--------------|--------------------------------|
| Node.js      | Backend runtime                |
| Express.js   | Web framework                  |
| TypeScript   | Static typing                  |
| MongoDB      | NoSQL database                 |
| Mongoose     | ODM for MongoDB                |
| Zod          | Schema validation              |
| JWT          | Authentication system          |
| Passport.js  | Google OAuth integration       |
| Multer       | File upload                    |
| Cloudinary   | Image hosting                  |
| Redis        | Caching (OTP/session)  |
| Nodemailer   | Sending email OTP              |



## 📁 Project Structure

```
ssrc/
├── app.ts                  # App initialization
├── server.ts               # Server bootstrap
├── app/
│   ├── config/             # Configuration files (env, multer, passport, etc.)
│   │   ├── cloudinary.config.ts
│   │   ├── env.ts
│   │   ├── multer.config.ts
│   │   ├── passport.ts
│   │   └── redis.config.ts
│   │
│   ├── errorHelpers/       # Centralized error handling utilities
│   │   ├── AppError.ts
│   │   ├── handleCastError.ts
│   │   ├── handleDuplicateError.ts
│   │   ├── handleValidationError.ts
│   │   └── handleZodError.ts
│   │
│   ├── interfaces/         # Global TypeScript interface declarations
│   │   ├── error.types.ts
│   │   └── index.d.ts
│   │
│   ├── middlewares/        # Express middlewares
│   │   ├── checkAuth.ts
│   │   ├── globalErrorHandler.ts
│   │   └── validateRequest.ts
│   │
│   ├── modules/            # Domain-specific business logic
│   │   ├── auth/           # Login, register, Google OAuth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── otp/            # Email-based OTP verification system
│   │   │   ├── otp.controller.ts
│   │   │   ├── otp.route.ts
│   │   │   ├── otp.service.ts
│   │   │   └── otpValidation.ts
│   │   │
│   │   └── user/           # User profile, role, CRUD
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       └── user.validation.ts
│   │
│   ├── routes/             # Combines all route modules
│   │   └── index.ts
│   │
│   └── utils/              # Helper utilities and services
│       ├── catchAsync.ts
│       ├── createUsersToken.ts
│       ├── generateOtp.ts
│       ├── invoice.ts
│       ├── jwt.ts
│       ├── seedSuperAdmin.ts  # Seed a default Super Admin user
│       ├── sendMail.ts
│       ├── sendResponse.ts
│       └── setAuthCookie.ts
│       └── ejsTemplate/    # Email HTML templates
│           ├── forgetPassword.ejs
│           └── otp.ejs

```

## ⚙️ Environment Variables (.env)
```
DB_URL=mongodb+srv://<DB_User>:<DB_Pass>@cluster0.tbsccmb.mongodb.net/<DB_Name>?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV="development"

BCRYPT_SALT=<bcrypt_salt_number>

#express_session_secret
EXPRESS_SESSION_SECRET=<express_session_secret>

# accessToken
JWT_ACCESS_TOKEN_SECRET=<secret_token>
JWT_ACCESS_TOKEN_EXPIRESIN=<token_expire_time>

# REFRESHToken
JWT_REFRESH_TOKEN_SECRET=<secret_token>
JWT_REFRESH_TOKEN_EXPIRESIN=<token_expire_time>

#Google
GOOGLE_CLIENT_SECRET=<google_client_secret>
GOOGLE_CLIENT_ID=<client_id>
GOOGLE_CALLBACK_URL=<callback_url>
# Front end url
FRONT_END_URL=<front_end_url>

#SMTP 
SMTP_HOST=smtp.gmail.com
SMTP_USER=<smtp_user_mail>
SMTP_PORT=<smtp_port>
SMTP_PASS=<app_pass>
SMTP_FROM=<smtp_user_mail>

#cloudinary
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_SECRET_KEY=<cloudinary_secret_key>

#Redis
REDIS_USERNAME=default
REDIS_PASSWORD=<redis_pass>
REDIS_HOST=<redis_host>
REDIS_PORT=<redis_port>

```

## 🔐API Documentation

### Base URL
```
https://user-auth-beckend.vercel.app/api/v1  (live)
https://localhost:5000/api/v1  (local)


```
### Auth Routes (/auth)

| Method | Endpoint                | Description                                   | Auth Required | Request Body / Query Parameters                  |
| ------ | ----------------------- | --------------------------------------------- | ------------- | ------------------------------------------------ |
| POST   | `/auth/login`           | User login with email and password            | No❌            | JSON body: `{ email: string, password: string }` |
| POST   | `/auth/refresh-token`   | Get new access token using refresh token      | No❌           | (Uses cookie)                                    |
| GET    | `/auth/google`          | Initiate Google OAuth login                   | No❌           | Query param: `redirect` (optional)               |
| GET    | `/auth/google/callback` | Google OAuth callback                         | No❌           | -                                                |
| POST   | `/auth/change-password` | Change password                               | Yes✅           | JSON body with validation                        |
| POST   | `/auth/set-password`    | Set new password (for users without password) | Yes           | JSON body with validation                        |
| POST   | `/auth/logout`          | Logout user                                   | No❌            | -                                                |
| POST   | `/auth/forget-password` | Request password reset OTP email              | No❌            | JSON body with email                             |
| POST   | `/auth/reset-password`  | Reset password with OTP                       | Yes✅           | JSON body with OTP and new password              |
          

### User Routes (/user)

| Method | Endpoint          | Description                           | Auth Required                             | Request Body / Notes                                                |
| ------ | ----------------- | ------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| POST   | `/user/create`    | Create a new user                     | No❌                                        | Multipart form data (`file` for upload), plus validated user data   |
| GET    | `/user/all-users` | Get list of all users                 | Yes✅, Roles: ADMIN, SUPER\_ADMIN           | -                                                                   |
| GET    | `/user/get-me`    | Get profile of current logged-in user | Yes✅, Roles: any (user, admin, superadmin) | -                                                                   |
| GET    | `/user/:id`       | Get a single user by ID               | Yes✅, Roles: ADMIN, SUPER\_ADMIN           | URL param: user ID                                                  |
| PATCH  | `/user/:id`       | Update user data                      | Yes✅, Roles: any                           | Multipart form data (`file` for upload), plus validated update data |

### OTP Routes (/otp)
| Method | Endpoint      | Description                  | Auth Required |
| ------ | ------------- | ---------------------------- | ------------- |
| POST   | `/otp/send`   | Send OTP to user email/phone | No❌           |
| POST   | `/otp/verify` | Verify OTP                   | No❌            |



### 🚀Notes:
- Auth Required means the route is protected by **checkAuth** middleware which checks JWT token and user roles.

- **Validation** is done using Zod schemas (e.g., loginShema, changePasswordShema, etc.) before controller logic.

- File uploads handled using **Multer middleware** (multerUpload.single("file")) on relevant routes.

- **Google OAuth** login uses **Passport.js** with routes /auth/google and /auth/google/callback.

- **Refresh** token is handled via cookie on /auth/refresh-token.

- **Role-based** access uses enum Role with values like ADMIN, SUPER_ADMIN, and USER.

## 🔌 Postma collection

📬 You can explore the full API using the Postman collection below:

👉 [Postman Collection Link](https://jonydas.postman.co/workspace/jony-das's-Workspace~ba583e4b-416b-40d4-8462-1752c44cad0a/request/43952441-ac79ad7e-0345-4ab7-9273-3fe8169ddba5?action=share&creator=43952441&ctx=documentation)

📦 Base URL: `http://localhost:5000/api/v1`

🛠 Features Covered:
- ✅ User Registration & Management
- ✅ Email OTP System
- ✅ Authentication (Login, Logout, Google Auth)
- ✅ Password Change / Reset

## 🚀 Local Setup Instructions
### 1️⃣ Clone the Repository
```
git clone https://github.com/yourusername/user_auth_backend.git
cd user_auth_backend
```

### 2️⃣ Install Dependencies
```
npm install
# or
yarn install
```

### 3️⃣ Set up Environment Variables
Create a ```.env``` file in the root directory and paste the environment variables from the example above.

### 4️⃣ Run the Development Server
```
npm run dev
```





```bash
git clone https://github.com/yourusername/user_auth_backend.git
cd user_auth_backend


