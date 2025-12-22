/**
 * Dependency Injection Container
 *
 * Simple DI container for managing dependencies.
 * Provides singleton instances of repositories and use cases.
 *
 * Refactored to use individual properties instead of Map for type safety.
 * No "as" type assertions needed - TypeScript infers all types correctly!
 */

import { DrizzleProductRepository } from "@/infrastructure/database/repositories/product.repository";
import { CreateProductUseCase } from "./use-cases/products/create-product.use-case";
import { ListProductsUseCase } from "./use-cases/products/list-products.use-case";
import { GetProductUseCase } from "./use-cases/products/get-product.use-case";
import { DeleteProductUseCase } from "./use-cases/products/delete-product.use-case";
import { ToggleProductStatusUseCase } from "./use-cases/products/toggle-product-status.use-case";

class Container {
  private static instance: Container;

  // Individual properties for type safety - TypeScript infers types automatically
  private productRepository?: DrizzleProductRepository;
  private createProductUseCase?: CreateProductUseCase;
  private listProductsUseCase?: ListProductsUseCase;
  private getProductUseCase?: GetProductUseCase;
  private deleteProductUseCase?: DeleteProductUseCase;
  private toggleProductStatusUseCase?: ToggleProductStatusUseCase;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositories - no "as" needed, return type inferred from property type
  getProductRepository(): DrizzleProductRepository {
    if (!this.productRepository) {
      this.productRepository = new DrizzleProductRepository();
    }
    return this.productRepository;
  }

  // Product Use Cases - no "as" needed, return type inferred from property type
  getCreateProductUseCase(): CreateProductUseCase {
    if (!this.createProductUseCase) {
      this.createProductUseCase = new CreateProductUseCase(
        this.getProductRepository()
      );
    }
    return this.createProductUseCase;
  }

  getListProductsUseCase(): ListProductsUseCase {
    if (!this.listProductsUseCase) {
      this.listProductsUseCase = new ListProductsUseCase(
        this.getProductRepository()
      );
    }
    return this.listProductsUseCase;
  }

  getGetProductUseCase(): GetProductUseCase {
    if (!this.getProductUseCase) {
      this.getProductUseCase = new GetProductUseCase(
        this.getProductRepository()
      );
    }
    return this.getProductUseCase;
  }

  getDeleteProductUseCase(): DeleteProductUseCase {
    if (!this.deleteProductUseCase) {
      this.deleteProductUseCase = new DeleteProductUseCase(
        this.getProductRepository()
      );
    }
    return this.deleteProductUseCase;
  }

  getToggleProductStatusUseCase(): ToggleProductStatusUseCase {
    if (!this.toggleProductStatusUseCase) {
      this.toggleProductStatusUseCase = new ToggleProductStatusUseCase(
        this.getProductRepository()
      );
    }
    return this.toggleProductStatusUseCase;
  }

  // Clear all instances (useful for testing)
  clear(): void {
    this.productRepository = undefined;
    this.createProductUseCase = undefined;
    this.listProductsUseCase = undefined;
    this.getProductUseCase = undefined;
    this.deleteProductUseCase = undefined;
    this.toggleProductStatusUseCase = undefined;
  }
}

// Export singleton instance
export const container = Container.getInstance();
