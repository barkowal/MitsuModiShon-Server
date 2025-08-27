import { Prisma } from "../generated/prisma";
import prisma from "../config/prismaClient";
import { PatchAnimationSceneData, UploadAnimationSceneData } from "../types/AnimationSceneTypes";


export async function CreateAnimationScene(sceneData: UploadAnimationSceneData) {

    await prisma.animation_Scene.create({
        data: {
            name: sceneData.name,
            img_filename: sceneData.imageName,
            data_filename: sceneData.dataFileName,
            account_id: sceneData.accountID,
            is_public: sceneData.is_public,
            duration: sceneData.duration,
        }
    });

}

export async function FindPublicAnimationScenes(startIndex: number, pageLimit: number, searchKeyword: string) {

    const scenes = await prisma.$transaction([
        prisma.animation_Scene.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    duration: true,
                    account: {
                        select: { username: true }
                    },
                },
                skip: startIndex,
                take: pageLimit,
                where: {
                    is_public: true,
                    name: { contains: searchKeyword, mode: "insensitive" },
                },
                orderBy: {
                    name: "asc",
                },
            }
        ),
        prisma.animation_Scene.count({
            where: {
                is_public: true,
                name: { contains: searchKeyword, mode: "insensitive" },
            }
        }),
    ]);

    return scenes;

}

export async function FindUsersAnimationScenes(startIndex: number, pageLimit: number, searchKeyword: string, userID: number, showPublic: boolean | undefined) {

    const scenes = await prisma.$transaction([
        prisma.animation_Scene.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    duration: true,
                    account: {
                        select: { username: true }
                    },
                },
                skip: startIndex,
                take: pageLimit,
                where:
                {
                    name: { contains: searchKeyword, mode: "insensitive" },
                    account_id: userID,
                    is_public: showPublic ?? Prisma.skip,
                },
                orderBy: {
                    name: "asc",
                },
            }
        ),
        prisma.animation_Scene.count({
            where: {
                name: { contains: searchKeyword, mode: "insensitive" },
                account_id: userID,
                is_public: showPublic ?? Prisma.skip,
            },
        }),
    ]);

    return scenes;

}

export async function FindPublicAnimationSceneDataFile(sceneID: number) {

    const sceneDataFile = prisma.animation_Scene.findUnique({
        select: {
            data_filename: true,
        },
        where: {
            id: sceneID,
            is_public: true,
        }
    });

    return sceneDataFile;
}

export async function FindUsersAnimationSceneDataFile(sceneID: number, userID: number) {

    const sceneDataFile = prisma.animation_Scene.findUnique({
        select: {
            data_filename: true,
        },
        where: {
            id: sceneID,
            account_id: userID,
        }
    });

    return sceneDataFile;
}

export async function DeleteAnimationScene(sceneID: number, userID: number) {

    const response = prisma.animation_Scene.delete({
        where: {
            id: sceneID,
            account_id: userID,
        }
    });

    return response;

}

export async function PatchAnimationScene(updatedData: PatchAnimationSceneData, id: number, userID: number) {

    const response = prisma.animation_Scene.update({
        where: {
            id: id,
            account_id: userID,
        },
        data: {
            name: updatedData.name,
            is_public: updatedData.is_public,
        }
    });

    return response;
}

