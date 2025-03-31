import "dotenv/config";
import { z } from "zod";

export const {ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,HOST,PORT,JWT_EXPIRES_IN,COOKIE_SECRET} = z.object({
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
    PORT:z.string(),
    HOST:z.string(),
    JWT_EXPIRES_IN:z.string(),
    COOKIE_SECRET:z.string().default("ClearFaceSecret")
}).parse(process.env)