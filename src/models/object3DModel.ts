import prisma from "../config/prismaClient";
import { type Prisma } from "../generated/prisma";
import { PatchObject3DData, UploadObject3DData } from "../types/Object3DTypes";

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

export async function FindPublicObjects3d(startIndex: number, pageLimit: number, searchKeyword: string) {

    const objects3d = await prisma.$transaction([
        prisma.object3D.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    account: {
                        select: { username: true }
                    },
                },
                skip: startIndex,
                take: pageLimit,
                where: {
                    is_public: true,
                    name: { contains: searchKeyword, mode: "insensitive" }
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
            }
        }),
    ]);

    return objects3d;
}

export async function FindUsersObjects3d(startIndex: number, pageLimit: number, searchKeyword: string, userID: number, showPublic: boolean | undefined) {

    let whereClause: Prisma.Object3DWhereInput;
    if (showPublic === undefined) whereClause = getAllWhereClause(searchKeyword, userID);
    else if (showPublic === true) whereClause = getPublicWhereClause(searchKeyword, userID);
    else whereClause = getPrivateWhereClause(searchKeyword, userID);


    const objects3d = await prisma.$transaction([
        prisma.object3D.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
                    is_public: true,
                    account: {
                        select: { username: true }
                    },
                },
                skip: startIndex,
                take: pageLimit,
                where: whereClause,
                orderBy: {
                    name: "asc",
                },
            }
        ),
        prisma.object3D.count({
            where: whereClause
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

function getAllWhereClause(searchKeyword: string, userID: number): Prisma.Object3DWhereInput {
    return {
        name: { contains: searchKeyword, mode: "insensitive" },
        account_id: userID,
    };
}
function getPrivateWhereClause(searchKeyword: string, userID: number): Prisma.Object3DWhereInput {
    return {
        name: { contains: searchKeyword, mode: "insensitive" },
        account_id: userID,
        is_public: false,
    };
}
function getPublicWhereClause(searchKeyword: string, userID: number): Prisma.Object3DWhereInput {
    return {
        name: { contains: searchKeyword, mode: "insensitive" },
        account_id: userID,
        is_public: true,
    };
}
