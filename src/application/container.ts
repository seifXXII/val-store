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
import { UpdateProductUseCase } from "./use-cases/products/update-product.use-case";
import { DrizzleOrderRepository } from "@/infrastructure/database/repositories/order.repository";
import { ListOrdersUseCase } from "./use-cases/orders/list-orders.use-case";
import { GetOrderUseCase } from "./use-cases/orders/get-order.use-case";
import { UpdateOrderStatusUseCase } from "./use-cases/orders/update-order-status.use-case";
import { DrizzleCategoryRepository } from "@/infrastructure/database/repositories/category.repository";
import { ListCategoriesUseCase } from "./use-cases/categories/list-categories.use-case";
import { CreateCategoryUseCase } from "./use-cases/categories/create-category.use-case";
import { DeleteCategoryUseCase } from "./use-cases/categories/delete-category.use-case";
import { UpdateCategoryUseCase } from "./use-cases/categories/update-category.use-case";
import { DrizzleDashboardRepository } from "@/infrastructure/database/repositories/dashboard.repository";
import { GetDashboardMetricsUseCase } from "./use-cases/dashboard/get-metrics.use-case";
import { GetSalesTrendUseCase } from "./use-cases/dashboard/get-sales-trend.use-case";
import { GetRecentOrdersUseCase } from "./use-cases/dashboard/get-recent-orders.use-case";
import { DrizzleProductVariantRepository } from "@/infrastructure/database/repositories/product-variant.repository";
import { AddProductVariantUseCase } from "./use-cases/products/add-product-variant.use-case";
import { UpdateVariantStockUseCase } from "./use-cases/products/update-variant-stock.use-case";
import { DrizzleProductImageRepository } from "@/infrastructure/database/repositories/product-image.repository";
import { AddProductImageUseCase } from "./use-cases/products/add-product-image.use-case";
import { RemoveProductImageUseCase } from "./use-cases/products/remove-product-image.use-case";
import { ResendEmailService } from "@/infrastructure/services/resend-email.service";
import { DrizzleCustomerRepository } from "@/infrastructure/database/repositories/customer.repository";
import { GetOrCreateCustomerUseCase } from "./use-cases/customers/get-or-create-customer.use-case";
import { DrizzleSiteConfigRepository } from "@/infrastructure/database/repositories/site-config.repository";

class Container {
  private static instance: Container;

  // Individual properties for type safety - TypeScript infers types automatically
  private productRepository?: DrizzleProductRepository;
  private createProductUseCase?: CreateProductUseCase;
  private listProductsUseCase?: ListProductsUseCase;
  private getProductUseCase?: GetProductUseCase;
  private deleteProductUseCase?: DeleteProductUseCase;
  private toggleProductStatusUseCase?: ToggleProductStatusUseCase;
  private updateProductUseCase?: UpdateProductUseCase;

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
  private updateCategoryUseCase?: UpdateCategoryUseCase;

  // Dashboard dependencies
  private dashboardRepository?: DrizzleDashboardRepository;
  private getDashboardMetricsUseCase?: GetDashboardMetricsUseCase;
  private getSalesTrendUseCase?: GetSalesTrendUseCase;
  private getRecentOrdersUseCase?: GetRecentOrdersUseCase;

  // Product Variant dependencies
  private productVariantRepository?: DrizzleProductVariantRepository;
  private addProductVariantUseCase?: AddProductVariantUseCase;
  private updateVariantStockUseCase?: UpdateVariantStockUseCase;

  // Product Image dependencies
  private productImageRepository?: DrizzleProductImageRepository;
  private addProductImageUseCase?: AddProductImageUseCase;

  // Email service
  private emailService?: ResendEmailService;
  private removeProductImageUseCase?: RemoveProductImageUseCase;

  // Customer dependencies
  private customerRepository?: DrizzleCustomerRepository;
  private getOrCreateCustomerUseCase?: GetOrCreateCustomerUseCase;

  // Site Config dependencies (CMS)
  private siteConfigRepository?: DrizzleSiteConfigRepository;

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

  getUpdateProductUseCase(): UpdateProductUseCase {
    if (!this.updateProductUseCase) {
      this.updateProductUseCase = new UpdateProductUseCase(
        this.getProductRepository()
      );
    }
    return this.updateProductUseCase;
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

  getUpdateCategoryUseCase(): UpdateCategoryUseCase {
    if (!this.updateCategoryUseCase) {
      this.updateCategoryUseCase = new UpdateCategoryUseCase(
        this.getCategoryRepository()
      );
    }
    return this.updateCategoryUseCase;
  }

  // Dashboard Repository
  getDashboardRepository(): DrizzleDashboardRepository {
    if (!this.dashboardRepository) {
      this.dashboardRepository = new DrizzleDashboardRepository();
    }
    return this.dashboardRepository;
  }

  // Dashboard Use Cases
  getGetDashboardMetricsUseCase(): GetDashboardMetricsUseCase {
    if (!this.getDashboardMetricsUseCase) {
      this.getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(
        this.getDashboardRepository()
      );
    }
    return this.getDashboardMetricsUseCase;
  }

  getGetSalesTrendUseCase(): GetSalesTrendUseCase {
    if (!this.getSalesTrendUseCase) {
      this.getSalesTrendUseCase = new GetSalesTrendUseCase(
        this.getDashboardRepository()
      );
    }
    return this.getSalesTrendUseCase;
  }

  getGetRecentOrdersUseCase(): GetRecentOrdersUseCase {
    if (!this.getRecentOrdersUseCase) {
      this.getRecentOrdersUseCase = new GetRecentOrdersUseCase(
        this.getDashboardRepository()
      );
    }
    return this.getRecentOrdersUseCase;
  }

  // Product Variant Repository
  getProductVariantRepository(): DrizzleProductVariantRepository {
    if (!this.productVariantRepository) {
      this.productVariantRepository = new DrizzleProductVariantRepository();
    }
    return this.productVariantRepository;
  }

  // Product Variant Use Cases
  getAddProductVariantUseCase(): AddProductVariantUseCase {
    if (!this.addProductVariantUseCase) {
      this.addProductVariantUseCase = new AddProductVariantUseCase(
        this.getProductVariantRepository(),
        this.getProductRepository()
      );
    }
    return this.addProductVariantUseCase;
  }

  getUpdateVariantStockUseCase(): UpdateVariantStockUseCase {
    if (!this.updateVariantStockUseCase) {
      this.updateVariantStockUseCase = new UpdateVariantStockUseCase(
        this.getProductVariantRepository()
      );
    }
    return this.updateVariantStockUseCase;
  }

  // Product Image Repository
  getProductImageRepository(): DrizzleProductImageRepository {
    if (!this.productImageRepository) {
      this.productImageRepository = new DrizzleProductImageRepository();
    }
    return this.productImageRepository;
  }

  // Product Image Use Cases
  getAddProductImageUseCase(): AddProductImageUseCase {
    if (!this.addProductImageUseCase) {
      this.addProductImageUseCase = new AddProductImageUseCase(
        this.getProductImageRepository(),
        this.getProductRepository()
      );
    }
    return this.addProductImageUseCase;
  }

  getRemoveProductImageUseCase(): RemoveProductImageUseCase {
    if (!this.removeProductImageUseCase) {
      this.removeProductImageUseCase = new RemoveProductImageUseCase(
        this.getProductImageRepository()
      );
    }
    return this.removeProductImageUseCase;
  }

  // Email Service
  getEmailService(): ResendEmailService {
    if (!this.emailService) {
      this.emailService = new ResendEmailService();
    }
    return this.emailService;
  }

  // Customer Repository
  getCustomerRepository(): DrizzleCustomerRepository {
    if (!this.customerRepository) {
      this.customerRepository = new DrizzleCustomerRepository();
    }
    return this.customerRepository;
  }

  // Get or Create Customer Use Case
  getGetOrCreateCustomerUseCase(): GetOrCreateCustomerUseCase {
    if (!this.getOrCreateCustomerUseCase) {
      this.getOrCreateCustomerUseCase = new GetOrCreateCustomerUseCase(
        this.getCustomerRepository()
      );
    }
    return this.getOrCreateCustomerUseCase;
  }

  // Site Config Repository (CMS)
  getSiteConfigRepository(): DrizzleSiteConfigRepository {
    if (!this.siteConfigRepository) {
      this.siteConfigRepository = new DrizzleSiteConfigRepository();
    }
    return this.siteConfigRepository;
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
    this.dashboardRepository = undefined;
    this.getDashboardMetricsUseCase = undefined;
    this.getSalesTrendUseCase = undefined;
    this.getRecentOrdersUseCase = undefined;
    this.siteConfigRepository = undefined;
  }
}

// Export singleton instance
export const container = Container.getInstance();
