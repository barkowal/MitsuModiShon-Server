import { Secret } from "jsonwebtoken";

export const PORT: number = Number(process.env.PORT) || 3000;

export const SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS) || 10;

export const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET || "secret";
export const ACCESS_TOKEN_EXPIRES_IN: string = process.env.ACCESS_TOKEN_EXPIRES_IN || "10m";

export const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || "verysecure";
export const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const IMAGE_URL_SECRET: Secret = process.env.IMAGE_URL_SECRET || "S%CReT_IMage";
export const IMAGE_URL_EXPIRES_IN: string = process.env.IMAGE_URL_EXPIRES_IN || "5m";

export const BUCKET_BIN: string = process.env.BUCKET_BIN || "./uploads/trash";
export const OBJECT3D_DATA_PATH: string = process.env.OBJECT3D_DATA_PATH || "./uploads/objects/data";
export const OBJECT3D_IMAGE_PATH: string = process.env.OBJECT3D_IMAGE_PATH || "./uploads/objects/images";
