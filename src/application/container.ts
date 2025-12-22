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
import { DrizzleOrderRepository } from "@/infrastructure/database/repositories/order.repository";
import { ListOrdersUseCase } from "./use-cases/orders/list-orders.use-case";
import { GetOrderUseCase } from "./use-cases/orders/get-order.use-case";
import { UpdateOrderStatusUseCase } from "./use-cases/orders/update-order-status.use-case";
import { DrizzleCategoryRepository } from "@/infrastructure/database/repositories/category.repository";
import { ListCategoriesUseCase } from "./use-cases/categories/list-categories.use-case";
import { CreateCategoryUseCase } from "./use-cases/categories/create-category.use-case";
import { DeleteCategoryUseCase } from "./use-cases/categories/delete-category.use-case";

class Container {
  private static instance: Container;

  // Individual properties for type safety - TypeScript infers types automatically
  private productRepository?: DrizzleProductRepository;
  private createProductUseCase?: CreateProductUseCase;
  private listProductsUseCase?: ListProductsUseCase;
  private getProductUseCase?: GetProductUseCase;
  private deleteProductUseCase?: DeleteProductUseCase;
  private toggleProductStatusUseCase?: ToggleProductStatusUseCase;

  // Order dependencies
  private orderRepository?: DrizzleOrderRepository;
  private listOrdersUseCase?: ListOrdersUseCase;
  private getOrderUseCase?: GetOrderUseCase;
  private updateOrderStatusUseCase?: UpdateOrderStatusUseCase;

  // Category dependencies
  private categoryRepository?: DrizzleCategoryRepository;
  private listCategoriesUseCase?: ListCategoriesUseCase;
  private createCategoryUseCase?: CreateCategoryUseCase;
  private deleteCategoryUseCase?: DeleteCategoryUseCase;

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

  // Order Repository
  getOrderRepository(): DrizzleOrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new DrizzleOrderRepository();
    }
    return this.orderRepository;
  }

  // Order Use Cases
  getListOrdersUseCase(): ListOrdersUseCase {
    if (!this.listOrdersUseCase) {
      this.listOrdersUseCase = new ListOrdersUseCase(this.getOrderRepository());
    }
    return this.listOrdersUseCase;
  }

  getGetOrderUseCase(): GetOrderUseCase {
    if (!this.getOrderUseCase) {
      this.getOrderUseCase = new GetOrderUseCase(this.getOrderRepository());
    }
    return this.getOrderUseCase;
  }

  getUpdateOrderStatusUseCase(): UpdateOrderStatusUseCase {
    if (!this.updateOrderStatusUseCase) {
      this.updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
        this.getOrderRepository()
      );
    }
    return this.updateOrderStatusUseCase;
  }

  // Category Repository
  getCategoryRepository(): DrizzleCategoryRepository {
    if (!this.categoryRepository) {
      this.categoryRepository = new DrizzleCategoryRepository();
    }
    return this.categoryRepository;
  }

  // Category Use Cases
  getListCategoriesUseCase(): ListCategoriesUseCase {
    if (!this.listCategoriesUseCase) {
      this.listCategoriesUseCase = new ListCategoriesUseCase(
        this.getCategoryRepository()
      );
    }
    return this.listCategoriesUseCase;
  }

  getCreateCategoryUseCase(): CreateCategoryUseCase {
    if (!this.createCategoryUseCase) {
      this.createCategoryUseCase = new CreateCategoryUseCase(
        this.getCategoryRepository()
      );
    }
    return this.createCategoryUseCase;
  }

  getDeleteCategoryUseCase(): DeleteCategoryUseCase {
    if (!this.deleteCategoryUseCase) {
      this.deleteCategoryUseCase = new DeleteCategoryUseCase(
        this.getCategoryRepository()
      );
    }
    return this.deleteCategoryUseCase;
  }

  // Clear all instances (useful for testing)
  clear(): void {
    this.productRepository = undefined;
    this.createProductUseCase = undefined;
    this.listProductsUseCase = undefined;
    this.getProductUseCase = undefined;
    this.deleteProductUseCase = undefined;
    this.toggleProductStatusUseCase = undefined;
    this.orderRepository = undefined;
    this.listOrdersUseCase = undefined;
    this.getOrderUseCase = undefined;
    this.updateOrderStatusUseCase = undefined;
  }
}

// Export singleton instance
export const container = Container.getInstance();
