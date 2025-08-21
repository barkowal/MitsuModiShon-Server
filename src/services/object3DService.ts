import { FindPublicObjects3d, UploadObject3D } from "../models/object3DModel";
import { Object3DShortType, UploadObject3DData } from "../types/Object3DTypes";
import { DefaultQueryParamsType } from "../types/UniversalTypes";
import { getSignedImageURL } from "../utils/utils";


export async function uploadObject3D(objectData: UploadObject3DData) {

    await UploadObject3D(objectData);

}

export async function getPaginatedPublicObjects3D(params: DefaultQueryParamsType) {

    const startIndex = (params.page - 1) * params.pageLimit;
    const endIndex = params.page * params.pageLimit;

    const objects3D = await FindPublicObjects3d(startIndex, params.pageLimit, params.searchKeyword.toLowerCase());
    const objectsCount = objects3D[1];

    const lastPage = Math.ceil(objectsCount / params.pageLimit);

    const prevPage = (params.page - 1) > 0 ? params.page - 1 : 1;
    const nextPage = (endIndex + 1 < objectsCount) ? params.page + 1 : lastPage;

    const objectsData: Array<Object3DShortType> = [];

    objects3D[0].forEach(object => {

        objectsData.push({
            name: object.name,
            createdAt: object.created_at,
            imgPath: getSignedImageURL(object.img_filename),
            username: object.account.username,
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

