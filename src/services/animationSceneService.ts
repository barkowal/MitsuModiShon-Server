import { CreateAnimationScene, DeleteAnimationScene, FindPublicAnimationSceneDataFile, FindPublicAnimationScenes, FindUsersAnimationSceneDataFile, FindUsersAnimationScenes, PatchAnimationScene } from "../models/animationSceneModel";
import { AnimationSceneQueryParamsType, AnimationSceneResultType, PatchAnimationSceneData, PatchAnimationSceneSchema, UploadAnimationSceneData } from "../types/AnimationSceneTypes";
import { getSignedImageURL } from "../utils/utils";

export async function uploadAnimationScene(sceneData: UploadAnimationSceneData) {

    await CreateAnimationScene(sceneData);

}

export async function getPaginatedPublicAnimationScenes(params: AnimationSceneQueryParamsType) {
    return await getAnimationScenes(params);
}

export async function getPaginatedUsersAnimationScenes(params: AnimationSceneQueryParamsType, userID: number) {
    return await getAnimationScenes(params, userID);
}

export async function getPublicAnimationSceneDataFile(id: number) {

    const animationSceneDataFile = await FindPublicAnimationSceneDataFile(id);

    return animationSceneDataFile;
}

export async function getUsersAnimationSceneDataFile(id: number, userID: number) {

    const animationSceneDataFile = await FindUsersAnimationSceneDataFile(id, userID);

    return animationSceneDataFile;
}

export async function deleteAnimationScene(id: number, userID: number) {

    const response = await DeleteAnimationScene(id, userID);
    return response;
}

export async function patchAnimationScene(updatedData: PatchAnimationSceneData, id: number, userID: number) {
    PatchAnimationSceneSchema.parse(updatedData);

    const response = await PatchAnimationScene(updatedData, id, userID);
    return response;

}

async function getAnimationScenes(params: AnimationSceneQueryParamsType, userID?: number) {

    const startIndex = (params.page - 1) * params.pageLimit;
    const endIndex = params.page * params.pageLimit;

    const scenes = userID ?
        await FindUsersAnimationScenes(startIndex, params.pageLimit, params.searchKeyword.toLowerCase(), userID, params.public) :
        await FindPublicAnimationScenes(startIndex, params.pageLimit, params.searchKeyword.toLowerCase());

    const scenesCount = scenes[1];

    const lastPage = Math.ceil(scenesCount / params.pageLimit);

    const prevPage = (params.page - 1) > 0 ? params.page - 1 : 1;
    const nextPage = (endIndex + 1 < scenesCount) ? params.page + 1 : lastPage;

    const scenesData: Array<AnimationSceneResultType> = [];

    scenes[0].forEach(scene => {

        scenesData.push({
            id: scene.id,
            name: scene.name,
            createdAt: scene.created_at,
            imgPath: getSignedImageURL(scene.img_filename),
            username: scene.account.username,
            isPublic: scene.is_public,
            duration: scene.duration,
        });

    });

    const result = {
        pageData: {
            prevPage: prevPage,
            nextPage: nextPage,
            lastPage: lastPage,
            limit: params.pageLimit,
        },
        scenes: scenesData,
    };

    return result;
}
