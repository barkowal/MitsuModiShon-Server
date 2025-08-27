import { z } from "zod";

export const UploadObject3DSchema = z.object({
    name: z.string().min(3),
    is_public: z.boolean().default(false),
    accountID: z.number(),
    imageName: z.string(),
    dataFileName: z.string(),
    is_animated: z.boolean().default(false),
});
export type UploadObject3DData = z.infer<typeof UploadObject3DSchema>;

export type Object3DShortType = {
    id: number,
    name: string,
    createdAt: Date,
    imgPath: string,
    username: string,
    isPublic?: boolean,
    isAnimated?: boolean,
}

export const PatchObject3DSchema = z.object({
    name: z.string().min(3),
    is_public: z.boolean().default(false),
});
export type PatchObject3DData = z.infer<typeof PatchObject3DSchema>;

export type Object3DQueryParamsType = {
    page: number,
    pageLimit: number,
    searchKeyword: string,
    public?: boolean,
    animated?: boolean,
}
