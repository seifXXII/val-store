/**
 * Product Repository Interface
 *
 * Defines the contract for Product data operations.
 * Implementation will be in the infrastructure layer.
 */

import { ProductEntity } from "@/domain/entities/product.entity";

export interface ProductFilters {
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductRepositoryInterface {
  /**
   * Find a product by ID
   */
  findById(productId: string): Promise<ProductEntity | null>;

  /**
   * Find a product by slug
   */
  findBySlug(slug: string): Promise<ProductEntity | null>;

  /**
   * Find all products with optional filters
   */
  findAll(filters?: ProductFilters): Promise<ProductEntity[]>;

  /**
   * Find products by category
   */
  findByCategory(categoryId: string): Promise<ProductEntity[]>;

  /**
   * Find featured products
   */
  findFeatured(limit?: number): Promise<ProductEntity[]>;

  /**
   * Search products by name or description
   */
  search(query: string): Promise<ProductEntity[]>;

  /**
   * Create a new product
   */
  create(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Update an existing product
   */
  update(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Delete a product
   */
  delete(productId: string): Promise<void>;

  /**
   * Update product stock
   */
  updateStock(productId: string, quantity: number): Promise<void>;

  /**
   * Check if a product slug exists
   */
  existsBySlug(slug: string): Promise<boolean>;
}
