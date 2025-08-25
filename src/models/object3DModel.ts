import prisma from "../config/prismaClient";
import { Prisma } from "../generated/prisma";
import { PatchObject3DData, UploadObject3DData } from "../types/Object3DTypes";

export async function UploadObject3D(objectData: UploadObject3DData) {

    await prisma.object3D.create({
        data: {
            name: objectData.name,
            is_public: objectData.is_public ?? false,
            img_filename: objectData.imageName,
            data_filename: objectData.dataFileName,
            account_id: objectData.accountID,
            is_animated: objectData.is_animated ?? false,
        }
    });

}

export async function FindPublicObjects3d(startIndex: number, pageLimit: number, searchKeyword: string, animated: boolean | undefined) {

    const objects3d = await prisma.$transaction([
        prisma.object3D.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    is_animated: true,
                    account: {
                        select: { username: true }
                    },
                },
                skip: startIndex,
                take: pageLimit,
                where: {
                    is_public: true,
                    name: { contains: searchKeyword, mode: "insensitive" },
                    is_animated: animated ?? Prisma.skip, // TODO at time of writing this there was a bug in prisma, check if it's resolved
                },
                orderBy: {
                    name: "asc",
                },
            }
        ),
        prisma.object3D.count({
            where: {
                is_public: true,
                name: { contains: searchKeyword, mode: "insensitive" },
                is_animated: animated ?? Prisma.skip,
            }
        }),
    ]);

    return objects3d;
}

export async function FindUsersObjects3d(startIndex: number, pageLimit: number, searchKeyword: string, userID: number, showPublic: boolean | undefined, animated: boolean | undefined) {

    const objects3d = await prisma.$transaction([
        prisma.object3D.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    is_animated: true,
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
                    is_animated: animated ?? Prisma.skip,
                },
                orderBy: {
                    name: "asc",
                },
            }
        ),
        prisma.object3D.count({
            where: {
                name: { contains: searchKeyword, mode: "insensitive" },
                account_id: userID,
                is_public: showPublic ?? Prisma.skip,
                is_animated: animated ?? Prisma.skip,
            },
        }),
    ]);

    return objects3d;
}

export async function GetPublicObjectsCount() {
    const objectsCount = await prisma.object3D.count();
    return objectsCount;
}

export async function FindPublicObject3DDataFile(id: number) {
    const object3DDataFile = prisma.object3D.findUnique({
        select: {
            data_filename: true,
        },
        where: {
            id: id,
            is_public: true,
        }
    });

    return object3DDataFile;
}

export async function FindUsersObject3DDataFile(id: number, userID: number) {
    const object3DDataFile = prisma.object3D.findUnique({
        select: {
            data_filename: true,
        },
        where: {
            id: id,
            account_id: userID,
        }
    });

    return object3DDataFile;
}

export async function DeleteObject3D(id: number, userID: number) {

    const response = prisma.object3D.delete({
        where: {
            id: id,
            account_id: userID,
        }
    });

    return response;
}

export async function PatchObject3D(updatedData: PatchObject3DData, id: number, userID: number) {

    const response = prisma.object3D.update({
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

