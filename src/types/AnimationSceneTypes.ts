import { z } from "zod";

export const UploadAnimationSceneSchema = z.object({
    name: z.string().min(3),
    imageName: z.string(),
    dataFileName: z.string(),
    duration: z.number().min(1),
    is_public: z.boolean().default(false),
    accountID: z.number(),
});
export type UploadAnimationSceneData = z.infer<typeof UploadAnimationSceneSchema>;

export type AnimationSceneModelReturn = {
    id: true,
    name: true,
    created_at: true,
    img_filename: true,
    is_public: true,
    duration: true,
    username: true,
}

export type AnimationSceneResultType = {
    id: number,
    name: string,
    createdAt: Date,
    imgPath: string,
    duration: number,
    isPublic: boolean,
    username: string,
}

export type AnimationSceneQueryParamsType = {
    page: number,
    pageLimit: number,
    searchKeyword: string,
    public?: boolean,
}

export const PatchAnimationSceneSchema = z.object({
    name: z.string().min(3),
    is_public: z.boolean().default(false),
});
export type PatchAnimationSceneData = z.infer<typeof PatchAnimationSceneSchema>;
