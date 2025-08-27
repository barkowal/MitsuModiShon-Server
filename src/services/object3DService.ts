import { DeleteObject3D, FindPublicObject3DDataFile, FindPublicObjects3d, FindUsersObject3DDataFile, FindUsersObjects3d, PatchObject3D, UploadObject3D } from "../models/object3DModel";
import { Object3DQueryParamsType, Object3DShortType, PatchObject3DData, PatchObject3DSchema, UploadObject3DData } from "../types/Object3DTypes";
import { getSignedImageURL } from "../utils/utils";


export async function uploadObject3D(objectData: UploadObject3DData) {

    await UploadObject3D(objectData);

}

export async function getPaginatedPublicObjects3D(params: Object3DQueryParamsType) {

    const startIndex = (params.page - 1) * params.pageLimit;
    const endIndex = params.page * params.pageLimit;

    const objects3D = await FindPublicObjects3d(startIndex, params.pageLimit, params.searchKeyword.toLowerCase(), params.animated);
    const objectsCount = objects3D[1];

    const lastPage = Math.ceil(objectsCount / params.pageLimit);

    const prevPage = (params.page - 1) > 0 ? params.page - 1 : 1;
    const nextPage = (endIndex + 1 < objectsCount) ? params.page + 1 : lastPage;

    const objectsData: Array<Object3DShortType> = [];

    objects3D[0].forEach(object => {

        objectsData.push({
            id: object.id,
            name: object.name,
            createdAt: object.created_at,
            imgPath: getSignedImageURL(object.img_filename),
            username: object.account.username,
            isPublic: object.is_public,
            isAnimated: object.is_animated,
        });

    });

    const result = {
        pageData: {
            prevPage: prevPage,
            nextPage: nextPage,
            lastPage: lastPage,
            limit: params.pageLimit,
        },
        objects: objectsData,
    };

    return result;

}

export async function getPaginatedUsersObjects3D(params: Object3DQueryParamsType, userID: number) {
    const startIndex = (params.page - 1) * params.pageLimit;
    const endIndex = params.page * params.pageLimit;

    const objects3D = await FindUsersObjects3d(startIndex, params.pageLimit, params.searchKeyword.toLowerCase(), userID, params.public, params.animated);
    const objectsCount = objects3D[1];

    const lastPage = Math.ceil(objectsCount / params.pageLimit);

    const prevPage = (params.page - 1) > 0 ? params.page - 1 : 1;
    const nextPage = (endIndex + 1 < objectsCount) ? params.page + 1 : lastPage;

    const objectsData: Array<Object3DShortType> = [];

    objects3D[0].forEach(object => {

        objectsData.push({
            id: object.id,
            name: object.name,
            createdAt: object.created_at,
            imgPath: getSignedImageURL(object.img_filename),
            username: object.account.username,
            isPublic: object.is_public,
            isAnimated: object.is_animated,
        });

    });

    const result = {
        pageData: {
            prevPage: prevPage,
            nextPage: nextPage,
            lastPage: lastPage,
            limit: params.pageLimit,
        },
        objects: objectsData,
    };

    return result;

}

export async function getPublicObject3DDataFile(id: number) {

    const object3DDataFile = await FindPublicObject3DDataFile(id);

    return object3DDataFile;

}

export async function getUsersObject3DDataFile(id: number, userID: number) {

    const object3DDataFile = await FindUsersObject3DDataFile(id, userID);

    return object3DDataFile;
}

// TODO Delete img files and data files
export async function deleteObject3D(id: number, userID: number) {

    const response = await DeleteObject3D(id, userID);
    return response;

}

export async function patchObject3D(updatedData: PatchObject3DData, id: number, userID: number) {
    PatchObject3DSchema.parse(updatedData);

    const response = await PatchObject3D(updatedData, id, userID);
    return response;

}
