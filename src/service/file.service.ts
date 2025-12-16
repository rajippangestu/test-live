import fs from 'fs/promises';
import path from 'path';

export const saveOrderToFile = async (order: any, maxRetry = 3): Promise<void> => {
    const folder = path.join(__dirname, '../../database/customer-order');
    console.log(order.no_order);
    const filePath = path.join(folder, `${order.no_order}.json`);

    for (let attempt = 1; attempt <= maxRetry; attempt++) {
        try {
            await fs.mkdir(folder, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(order, null, 2));
            return;
        } catch (err) {
            if (attempt === maxRetry) throw err;
            await new Promise(r => setTimeout(r, 100));
        }
    }
};
