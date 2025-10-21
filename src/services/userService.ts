import axios from "axios";
import { User } from "../types/User";

const API_URL = "http://localhost:8080/api/users";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(API_URL, options);
    return response.data;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error(`Failed to get all users: ${error}`);
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}/${id}`, options);
    return response.data;
  } catch (error) {
    console.error(`Error getting user with id ${id}:`, error);
    throw new Error(`Failed to get user with id ${id}: ${error}`);
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL, userData, options);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_URL}/${id}`, userData, options);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw new Error(`Failed to update user with id ${id}: ${error}`);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, options);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw new Error(`Failed to delete user with id ${id}: ${error}`);
  }
};