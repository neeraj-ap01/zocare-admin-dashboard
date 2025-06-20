import {
  Field,
  CreateFieldDto,
  UpdateFieldDto,
  PaginationParams,
} from "@shared/types";
import { mockData, getNextId, simulateDelay } from "@/data/mockData";
import { generateId } from "@shared/utils";

export class FieldRepository {
  /**
   * Get all fields with pagination and search
   */
  static async findAll(params: PaginationParams = {}) {
    await simulateDelay();

    let fields = [...mockData.fields];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      fields = fields.filter(
        (field) =>
          field.name.toLowerCase().includes(searchLower) ||
          field.label.toLowerCase().includes(searchLower) ||
          field.type.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    if (params.sortBy) {
      fields.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Field];
        const bValue = b[params.sortBy as keyof Field];

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
    const paginatedFields = fields.slice(offset, offset + limit);

    return {
      data: paginatedFields,
      pagination: {
        page,
        limit,
        total: fields.length,
        totalPages: Math.ceil(fields.length / limit),
      },
    };
  }

  /**
   * Find field by ID
   */
  static async findById(id: string): Promise<Field | null> {
    await simulateDelay();
    return mockData.fields.find((field) => field.id === id) || null;
  }

  /**
   * Find field by name
   */
  static async findByName(name: string): Promise<Field | null> {
    await simulateDelay();
    return mockData.fields.find((field) => field.name === name) || null;
  }

  /**
   * Create new field
   */
  static async create(data: CreateFieldDto): Promise<Field> {
    await simulateDelay();

    const newField: Field = {
      id: getNextId(mockData.fields),
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockData.fields.push(newField);
    return newField;
  }

  /**
   * Update field
   */
  static async update(id: string, data: UpdateFieldDto): Promise<Field | null> {
    await simulateDelay();

    const fieldIndex = mockData.fields.findIndex((field) => field.id === id);
    if (fieldIndex === -1) {
      return null;
    }

    const updatedField: Field = {
      ...mockData.fields[fieldIndex],
      ...data,
      updatedAt: new Date(),
    };

    mockData.fields[fieldIndex] = updatedField;
    return updatedField;
  }

  /**
   * Delete field
   */
  static async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const fieldIndex = mockData.fields.findIndex((field) => field.id === id);
    if (fieldIndex === -1) {
      return false;
    }

    mockData.fields.splice(fieldIndex, 1);
    return true;
  }

  /**
   * Check if field name is unique
   */
  static async isNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    await simulateDelay();

    return !mockData.fields.some(
      (field) => field.name === name && field.id !== excludeId,
    );
  }

  /**
   * Get fields by type
   */
  static async findByType(type: string): Promise<Field[]> {
    await simulateDelay();
    return mockData.fields.filter((field) => field.type === type);
  }

  /**
   * Get active fields only
   */
  static async findActive(): Promise<Field[]> {
    await simulateDelay();
    return mockData.fields.filter((field) => field.isActive);
  }

  /**
   * Toggle field active status
   */
  static async toggleActive(id: string): Promise<Field | null> {
    await simulateDelay();

    const fieldIndex = mockData.fields.findIndex((field) => field.id === id);
    if (fieldIndex === -1) {
      return null;
    }

    mockData.fields[fieldIndex].isActive =
      !mockData.fields[fieldIndex].isActive;
    mockData.fields[fieldIndex].updatedAt = new Date();

    return mockData.fields[fieldIndex];
  }

  /**
   * Bulk update fields
   */
  static async bulkUpdate(
    updates: { id: string; data: UpdateFieldDto }[],
  ): Promise<Field[]> {
    await simulateDelay();

    const updatedFields: Field[] = [];

    for (const update of updates) {
      const field = await this.update(update.id, update.data);
      if (field) {
        updatedFields.push(field);
      }
    }

    return updatedFields;
  }

  /**
   * Get field statistics
   */
  static async getStats() {
    await simulateDelay();

    const total = mockData.fields.length;
    const active = mockData.fields.filter((f) => f.isActive).length;
    const byType = mockData.fields.reduce(
      (acc, field) => {
        acc[field.type] = (acc[field.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      active,
      inactive: total - active,
      byType,
    };
  }
}
