import dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
    DB_URL: string,
    PORT: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALT: string,
    EXPRESS_SESSION_SECRET: string,
    JWT_ACCESS_TOKEN_SECRET: string,
    JWT_ACCESS_TOKEN_EXPIRESIN: string,
    JWT_REFRESH_TOKEN_SECRET: string,
    JWT_REFRESH_TOKEN_EXPIRESIN: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CALLBACK_URL: string,
    FRONT_END_URL: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    MAIL_SENDER: {
        SMTP_HOST: string,
        SMTP_USER: string,
        SMTP_PORT: string,
        SMTP_PASS: string,
        SMTP_FROM: string,
    },
    CLOUDINARY: {
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_SECRET_KEY: string,
    },
    REDIS: {
        REDIS_USERNAME: string,
        REDIS_PASSWORD: string,
        REDIS_HOST: string,
        REDIS_PORT: string
    }
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['DB_URL', 'PORT', 'NODE_ENV', 'BCRYPT_SALT', 'JWT_ACCESS_TOKEN_SECRET',
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
    ]

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as EnvConfig["NODE_ENV"],
        SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD as string,
        BCRYPT_SALT: process.env.BCRYPT_SALT as string,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        JWT_ACCESS_TOKEN_EXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN as string,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        JWT_REFRESH_TOKEN_EXPIRESIN: process.env.JWT_REFRESH_TOKEN_EXPIRESIN as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        FRONT_END_URL: process.env.FRONT_END_URL as string,
        MAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string
        },
        CLOUDINARY: {
            CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        },
        REDIS: {
            REDIS_USERNAME: process.env.REDIS_USERNAME as string,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
            REDIS_HOST: process.env.REDIS_HOST as string,
            REDIS_PORT: process.env.REDIS_PORT as string
        }
    }
}

export const envVars = loadEnvVariables()