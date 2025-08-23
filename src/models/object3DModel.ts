import prisma from "../config/prismaClient";
import { type Prisma } from "../generated/prisma";
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

export async function FindPublicObjects3d(startIndex: number, pageLimit: number, searchKeyword: string) {

    const objects3d = await prisma.$transaction([
        prisma.object3D.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    created_at: true,
                    img_filename: true,
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
