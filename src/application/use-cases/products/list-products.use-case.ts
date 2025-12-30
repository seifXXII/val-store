import { ProductEntity } from "@/domain/entities/product.entity";
import { ProductRepositoryInterface } from "@/domain/interfaces/repositories/product.repository.interface";

/**
 * List Products Use Case
 *
 * Retrieves a list of products with optional filtering.
 */

export interface ListProductsInput {
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  currentPrice: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage: number;
  primaryImage: string | null;
}

export interface ListProductsOutput {
  products: ProductListItem[];
  total: number;
}

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(input: ListProductsInput = {}): Promise<ListProductsOutput> {
    // 1. Fetch products from repository
    const products = await this.productRepository.findAll(input);

    // 2. Get total count
    const total = await this.productRepository.count(input);

    // 3. Map to DTOs
    const productDTOs = products.map((product) => this.mapToDTO(product));

    return {
      products: productDTOs,
      total,
    };
  }

  private mapToDTO(product: ProductEntity): ProductListItem {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      currentPrice: product.getCurrentPrice(),
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale(),
      discountPercentage: product.getDiscountPercentage(),
      primaryImage: product.getPrimaryImage(),
    };
  }
}
