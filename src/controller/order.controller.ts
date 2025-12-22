import { Request, Response } from 'express';
import { generateOrderNumber, calculateTotal } from '../service/order.service';
import { saveOrderToFile } from '../service/file.service';
import { acquireLock, releaseLock } from '../utils/lock.manager';
import { OrderDTO } from '../dtos/order.dto';

export const createOrder = async (req: Request, res: Response) => {
    const customerId = Number(req.headers['x-customer-id']);
    const name = String(req.headers['x-customer-name'] || 'unknown');
    const email = String(req.headers['x-customer-email'] || 'unknown');

    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID tidak ada', result: null });
    }

    const locked = await acquireLock(customerId);
    if (!locked) {
        return res.status(409).json({
            message: 'Request sebelumnya untuk customer ini masih diproses',
            result: null
        });
    }

    try {
        const orderData: OrderDTO = req.body;

        // delay async 3 detik
        await new Promise(r => setTimeout(r, 3000));

        const orderNumber = await generateOrderNumber(customerId);
        const total = calculateTotal(orderData.items);

        const order = {
            no_order: orderNumber,
            id_customer: customerId,
            name,
            email,
            address: orderData.address,
            payment_type: orderData.payment_type,
            items: orderData.items,
            total,
            status: 'Order Diterima'
        };

        await saveOrderToFile(order);

        return res.json({ message: 'Order berhasil dibuat', result: { order_number: orderNumber } });
    } catch (err: any) {
        return res.status(500).json({ message: err.message, result: null });
    } finally {
        releaseLock(customerId);
    }
};
