"use server";

import { ApiResponse } from "@/types/api";

interface FavoriteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createFavorite(
  jobId: string,
  token: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/job/favorite/${jobId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data: ApiResponse<FavoriteResponse> = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Added to favorites",
      };
    }

    return {
      success: false,
      error: data.error || data.message || "Failed to add to favorites",
    };
  } catch (error) {
    console.error("Error creating favorite:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}