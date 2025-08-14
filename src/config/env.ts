import { Secret } from "jsonwebtoken";

export const PORT: number = Number(process.env.PORT) || 3000;
export const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";
