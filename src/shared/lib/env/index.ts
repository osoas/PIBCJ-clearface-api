import "dotenv/config";
import { z } from "zod";

export const {ADMIN_EMAIL,ADMIN_PASSWORD} = z.object({
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
}).parse(process.env)