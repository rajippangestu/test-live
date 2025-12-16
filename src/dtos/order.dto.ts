import { ProductDTO } from './product.dto';

export interface OrderDTO {
    customerId: number;
    address: string;
    payment_type: string
    items: ProductDTO[];
}
