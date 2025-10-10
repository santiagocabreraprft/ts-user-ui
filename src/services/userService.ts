import axios from "axios";
import { User } from "../types/User";

const API_URL = "http://localhost:8080/api/users";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>("");
    return response.data;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error(`Failed to get all users: ${error}`);
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting user with id ${id}:`, error);
    throw new Error(`Failed to get user with id ${id}: ${error}`);
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>("", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await axiosInstance.put<User>(`/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new Error(`Failed to update user with id ${id}: ${error}`);
    }
  };

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw new Error(`Failed to delete user with id ${id}: ${error}`);
  }
};