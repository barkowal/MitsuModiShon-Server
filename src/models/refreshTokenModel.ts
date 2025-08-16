import prisma from "../config/prismaClient";

export async function CreateRefreshToken(userId: number, token: string, expiration: Date) {

    await prisma.refresh_Token.create({
        data: {
            token: token,
            user_id: userId,
            expires_at: expiration,
        }
    });

}

export async function DeleteRefreshToken(tokenID: number) {
    const token = await prisma.refresh_Token.delete({
        where: {
            id: tokenID,
        }
    });

    return token;
}

export async function FindUserRefreshTokens(userID: number) {
    const tokens = await prisma.refresh_Token.findMany({
        where: {
            user_id: userID
        },
    });

    return tokens;
}
