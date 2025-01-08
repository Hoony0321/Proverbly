import { SignUpForm } from "@/app/models/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_API_URL;
const FRONTEND_SERVER_URL = process.env.NEXT_PUBLIC_FRONTEND_SERVER_URL;

export async function getAllUsersApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch proverb");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching proverb:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserByIdApi(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserByEmailAndPasswordApi(
  email: string,
  password: string
) {
  try {
    const response = await fetch(`${FRONTEND_SERVER_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.error);
      } else {
        throw new Error("서버 오류가 발생했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error in auth:", error);
    throw error;
  }
}

export async function createUserApi(user: SignUpForm) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
