import prisma from "../config/prismaClient";
import { RegisterUserData } from "../types/AuthTypes";

export async function CreateUser(userData: RegisterUserData) {

    const user = await prisma.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            password: userData.password,
        }
    });

    return user;
}

export async function GetUserByEmail(email: string) {

    const user = await prisma.user.findUnique({
        where: { email }
    });

    return user;
}

