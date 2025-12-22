import { OrderEntity } from "@/domain/entities/order.entity";
import { OrderRepositoryInterface } from "@/domain/interfaces/repositories/order.repository.interface";

/**
 * List Orders Use Case
 */

export interface ListOrdersInput {
  userId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
}

export interface OrderListItem {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
}

export interface ListOrdersOutput {
  orders: OrderListItem[];
  total: number;
}

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(input: ListOrdersInput = {}): Promise<ListOrdersOutput> {
    // Fetch orders from repository
    const orders = await this.orderRepository.findAll(input);

    // Get total count
    const total = await this.orderRepository.count(input);

    // Map to DTOs
    const orderDTOs = orders.map((order) => this.mapToDTO(order));

    return {
      orders: orderDTOs,
      total,
    };
  }

  private mapToDTO(order: OrderEntity): OrderListItem {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      totalItems: order.getTotalItems(),
      createdAt: order.createdAt,
      isPaid: order.isPaid(),
      isDelivered: order.isDelivered(),
    };
  }
}
