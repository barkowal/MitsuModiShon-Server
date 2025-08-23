import { IMAGE_URL_SECRET, IMAGE_URL_EXPIRES_IN } from "../config/env";
import { sign, SignOptions } from "jsonwebtoken";

export function parseDuration(duration: string) {
    const regex = /(\d+)([smhd])/g;
    let totalMilliseconds = 0;
    let match;

    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case "s": // seconds
                totalMilliseconds += value * 1000;
                break;
            case "m": // minutes
                totalMilliseconds += value * 60 * 1000;
                break;
            case "h": // hours
                totalMilliseconds += value * 60 * 60 * 1000;
                break;
            case "d": // days
                totalMilliseconds += value * 24 * 60 * 60 * 1000;
                break;
            default:
                break;
        }
    }
    return totalMilliseconds;
}

export function getFileExtension(mimeType: string): string | null {
    const mimeTypeMap: { [key: string]: string } = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "application/json": "json",
    };

    return mimeTypeMap[mimeType] || null;
}

export function getSignedImageURL(filename: string) {
    const timestamp = Date.now().toString();
    const token = sign({ timestamp: timestamp, filename: filename }, IMAGE_URL_SECRET, { expiresIn: IMAGE_URL_EXPIRES_IN } as SignOptions);

    return `/${filename}?signature=${token}`;
}

export function getImagePath() {

}

export function stringToBoolean(str: string): boolean {
    return str
        .toLowerCase() === "true";
}
