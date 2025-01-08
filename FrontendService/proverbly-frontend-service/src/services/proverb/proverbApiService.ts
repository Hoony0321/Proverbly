const API_BASE_URL = process.env.NEXT_PUBLIC_PROVERB_SERVICE_API_URL;

export async function getProverbApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/proverb`, {
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
