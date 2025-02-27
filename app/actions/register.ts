"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_REDIRECT_URL } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { UserRole } from "@prisma/client";

// Extend the register schema to include role
const ExtendedRegisterSchema = registerSchema.extend({
    role: z.nativeEnum(UserRole).default(UserRole.MURID)
});

export const register = async (values: z.infer<typeof ExtendedRegisterSchema>) => {
    console.log("Received values:", values); // Debug log
    
    const validatedFields = ExtendedRegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        console.log("Validation errors:", validatedFields.error); // Debug log
        return { error: "Invalid input" };
    }

    const { email, password, name, role } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser){
        return {error: "User already exists"};
    }

    try {
        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            }
        });

        // After user creation, automatically sign in
        const signInResult = await signIn("credentials", {
            email,
            password: values.password, // Use original password, not hashed
            redirect: false,
        });

        if (signInResult?.error) {
            return { error: "Failed to login after registration" };
        }

        console.log("User created and logged in:", { email, name, role });
        return { 
            success: "Registration successful", 
            redirectTo: DEFAULT_REDIRECT_URL,
            shouldRefresh: true
        };
    } catch (error) {
        console.error("Registration error:", error);
        
        if (error instanceof Error) {
            return { error: error.message };
        }
        
        return { error: "An error occurred during registration" };
    }
};
