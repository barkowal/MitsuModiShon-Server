import { FindPublicObjects3d, UploadObject3D } from "../models/object3DModel";
import { UploadObject3DData } from "../types/Object3DTypes";


export async function uploadObject3D(objectData: UploadObject3DData) {

    await UploadObject3D(objectData);

}

export async function getPublicObjects3D() {

    const objects3D = await FindPublicObjects3d();
    return objects3D;

}
