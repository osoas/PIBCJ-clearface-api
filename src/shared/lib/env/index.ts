import "dotenv/config";
import { z } from "zod";

export const {ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET} = z.object({
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
}).parse(process.env)