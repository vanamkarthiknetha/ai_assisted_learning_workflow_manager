"use server";

import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// Register a new user
export async function register(formData: FormData): Promise<ActionResponse> {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Validate input
  const validatedFields = registerSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully. Please log in.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Login user
export async function login(formData: FormData): Promise<ActionResponse> {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate input
  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email.toLowerCase(),
      password: validatedFields.data.password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
          };
        default:
          return {
            success: false,
            message: "Something went wrong. Please try again.",
          };
      }
    }
    throw error;
  }
}

// Logout user
export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
