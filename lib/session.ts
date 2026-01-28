import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Get the current session (for use in Server Components)
export async function getSession() {
  return await auth();
}

// Get the current user ID (for use in Server Actions)
// Throws an error if not authenticated
export async function getCurrentUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

// Require authentication in a Server Component
// Redirects to login if not authenticated
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
