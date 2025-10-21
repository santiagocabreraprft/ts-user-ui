import { User } from "../types/User";

const axios = require('axios');
const mockAdapter = require('axios-mock-adapter');
const mockAxios = new mockAdapter(axios);

const userService = require('./userService');

const API_URL = "http://localhost:8080/api/users";

describe("User Service", () => {
  const mockUsers: User[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "0987654321",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  test("getAllUsers - success", async () => {
    mockAxios.onGet(API_URL).reply(200, mockUsers);

    const users = await userService.getAllUsers();
    
    expect(users).toEqual(mockUsers);
  });

  test("getUserById - success", async () => {
    mockAxios.onGet(`${API_URL}/1`).reply(200, mockUsers[0]);

    const user = await userService.getUserById("1");
    
    expect(user).toEqual(mockUsers[0]);
  });

  test("createUser - success", async () => {
    const newUserData = {
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      phone: "5555555555",
    };

    const createdUser = {
      id: "3",
      ...newUserData,
      createdAt: "2025-10-21T16:27:37.740Z",
      updatedAt: "2025-10-21T16:27:37.740Z",
    };

    mockAxios.onPost(API_URL).reply(201, createdUser);

    const user = await userService.createUser(newUserData);
    
    expect(user).toEqual(createdUser);
  });

  test("updateUser - success", async () => {
    const updatedData = { firstName: "John Updated" };
    const updatedUser = {
      ...mockUsers[0],
      ...updatedData,
      createdAt: mockUsers[0].createdAt,
      updatedAt: mockUsers[0].updatedAt,
    };

    mockAxios.onPut(`${API_URL}/1`).reply(200, updatedUser);

    const user = await userService.updateUser("1", updatedData);
    
    expect(user).toEqual(updatedUser);
  });

  test("deleteUser - success", async () => {
    mockAxios.onDelete(`${API_URL}/1`).reply(204);

    await expect(userService.deleteUser("1")).resolves.not.toThrow();
  });
});