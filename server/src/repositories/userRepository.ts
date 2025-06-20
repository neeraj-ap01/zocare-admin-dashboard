import {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginationParams,
} from "@shared/types";
import { mockData, getNextId, simulateDelay } from "@/data/mockData";

export class UserRepository {
  /**
   * Get all users with pagination and search
   */
  static async findAll(params: PaginationParams = {}) {
    await simulateDelay();

    let users = [...mockData.users];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      users = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    if (params.sortBy) {
      users.sort((a, b) => {
        const aValue = a[params.sortBy as keyof User];
        const bValue = b[params.sortBy as keyof User];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return params.sortOrder === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return params.sortOrder === "desc"
            ? bValue.getTime() - aValue.getTime()
            : aValue.getTime() - bValue.getTime();
        }

        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const paginatedUsers = users.slice(offset, offset + limit);

    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    };
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    await simulateDelay();
    return mockData.users.find((user) => user.id === id) || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    await simulateDelay();
    return mockData.users.find((user) => user.email === email) || null;
  }

  /**
   * Create new user
   */
  static async create(data: CreateUserDto): Promise<User> {
    await simulateDelay();

    const newUser: User = {
      id: getNextId(mockData.users),
      ...data,
      isActive: true,
      groupIds: data.groupIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockData.users.push(newUser);
    return newUser;
  }

  /**
   * Update user
   */
  static async update(id: string, data: UpdateUserDto): Promise<User | null> {
    await simulateDelay();

    const userIndex = mockData.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    const updatedUser: User = {
      ...mockData.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    mockData.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const userIndex = mockData.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    mockData.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Check if email is unique
   */
  static async isEmailUnique(
    email: string,
    excludeId?: string,
  ): Promise<boolean> {
    await simulateDelay();

    return !mockData.users.some(
      (user) => user.email === email && user.id !== excludeId,
    );
  }

  /**
   * Get users by role
   */
  static async findByRole(role: string): Promise<User[]> {
    await simulateDelay();
    return mockData.users.filter((user) => user.role === role);
  }

  /**
   * Get users by group
   */
  static async findByGroup(groupId: string): Promise<User[]> {
    await simulateDelay();
    return mockData.users.filter((user) => user.groupIds.includes(groupId));
  }

  /**
   * Get active users only
   */
  static async findActive(): Promise<User[]> {
    await simulateDelay();
    return mockData.users.filter((user) => user.isActive);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id: string): Promise<User | null> {
    await simulateDelay();

    const userIndex = mockData.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    mockData.users[userIndex].lastLoginAt = new Date();
    mockData.users[userIndex].updatedAt = new Date();

    return mockData.users[userIndex];
  }

  /**
   * Add user to group
   */
  static async addToGroup(
    userId: string,
    groupId: string,
  ): Promise<User | null> {
    await simulateDelay();

    const userIndex = mockData.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return null;
    }

    if (!mockData.users[userIndex].groupIds.includes(groupId)) {
      mockData.users[userIndex].groupIds.push(groupId);
      mockData.users[userIndex].updatedAt = new Date();
    }

    return mockData.users[userIndex];
  }

  /**
   * Remove user from group
   */
  static async removeFromGroup(
    userId: string,
    groupId: string,
  ): Promise<User | null> {
    await simulateDelay();

    const userIndex = mockData.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return null;
    }

    mockData.users[userIndex].groupIds = mockData.users[
      userIndex
    ].groupIds.filter((id) => id !== groupId);
    mockData.users[userIndex].updatedAt = new Date();

    return mockData.users[userIndex];
  }

  /**
   * Get user statistics
   */
  static async getStats() {
    await simulateDelay();

    const total = mockData.users.length;
    const active = mockData.users.filter((u) => u.isActive).length;
    const byRole = mockData.users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentLogins = mockData.users.filter(
      (u) =>
        u.lastLoginAt &&
        u.lastLoginAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length;

    return {
      total,
      active,
      inactive: total - active,
      byRole,
      recentLogins,
    };
  }
}
