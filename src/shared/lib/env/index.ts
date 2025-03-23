import "dotenv/config";
import { z } from "zod";

export const {ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,HOST,PORT} = z.object({
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
    PORT:z.string(),
    HOST:z.string()
}).parse(process.env)