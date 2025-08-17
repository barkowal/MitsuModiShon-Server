import { z } from "zod";

export const UploadObject3DSchema = z.object({
    name: z.string().min(3),
    is_public: z.boolean().default(false),
    accountID: z.number(),
    imageName: z.string(),
    dataFileName: z.string(),
});
export type UploadObject3DData = z.infer<typeof UploadObject3DSchema>;
