"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = ['DB_URL', 'PORT', 'NODE_ENV', 'BCRYPT_SALT', 'JWT_ACCESS_TOKEN_SECRET',
        'JWT_ACCESS_TOKEN_EXPIRESIN', "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRESIN", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CALLBACK_URL", "FRONT_END_URL", "SMTP_HOST",
        "SMTP_USER",
        "SMTP_PORT",
        "SMTP_PASS",
        "SMTP_FROM",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_SECRET_KEY",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "REDIS_HOST",
        "REDIS_PORT",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD"
    ];
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`);
        }
    });
    return {
        DB_URL: process.env.DB_URL,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        BCRYPT_SALT: process.env.BCRYPT_SALT,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
        JWT_ACCESS_TOKEN_EXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_TOKEN_EXPIRESIN: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONT_END_URL: process.env.FRONT_END_URL,
        MAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_FROM: process.env.SMTP_FROM
        },
        CLOUDINARY: {
            CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        },
        REDIS: {
            REDIS_USERNAME: process.env.REDIS_USERNAME,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT
        }
    };
};
exports.envVars = loadEnvVariables();
