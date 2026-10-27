// src/utils/api.ts
import axios from "axios";

export const API_BASE_URL = "https://CMSPRajAbhiyanAPI.mahaitgov.in/api";

export const loginUser = async (username: string, passwordHash: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/Login`, {
      username,
      userpassword: passwordHash,
    });
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
