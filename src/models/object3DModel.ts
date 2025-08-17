import prisma from "../config/prismaClient";
import { UploadObject3DData } from "../types/Object3DTypes";

export async function UploadObject3D(objectData: UploadObject3DData) {

    await prisma.object3D.create({
        data: {
            name: objectData.name,
            is_public: objectData.is_public,
            img_filename: objectData.imageName,
            data_filename: objectData.dataFileName,
            account_id: objectData.accountID,
        }
    });

}

export async function FindPublicObjects3d() {

    const objects3d = await prisma.object3D.findMany();
    return objects3d;

}
