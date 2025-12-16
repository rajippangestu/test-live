import fs from 'fs/promises';
import path from 'path';

const orderFolder = path.join(__dirname, '../../database/customer-order');

export const generateOrderNumber = async (customerId: number): Promise<string> => {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getFullYear()).slice(-2)}`;

    await fs.mkdir(orderFolder, { recursive: true });

    const files = await fs.readdir(orderFolder);

    const customerFiles = files
        .filter(file => file.startsWith(`ORDER-${customerId}-${dateStr}-`) && file.endsWith('.json'));

    console.log(customerFiles);

    let runningNumber = 1;
    if (customerFiles.length > 0) {
        const lastFile = customerFiles.sort().pop();

        console.log(lastFile);
        if (lastFile) {
            const parts = lastFile.replace('.json','').split('-');
            const lastNumber = parseInt(parts[3], 10);
            console.log(lastNumber);
            runningNumber = lastNumber + 1;
        }
    }

    const runningStr = String(runningNumber).padStart(5, '0');
    console.log(`ORDER-${customerId}-${dateStr}-${runningStr}`)
    return `ORDER-${customerId}-${dateStr}-${runningStr}`;
};

export const calculateTotal = (items: any[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
};
