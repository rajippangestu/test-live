import fs from 'fs/promises';
import path from 'path';

const CUSTOMER_ORDER_DIR = path.join(__dirname, '../../database/customer-order');
const DELIVERED_DIR = path.join(__dirname, '../../database/delivered-order');

const MAX_CONCURRENT = 10;

const processFile = async (file: string, retry = 3) => {
    const srcPath = path.join(CUSTOMER_ORDER_DIR, file);
    const destPath = path.join(DELIVERED_DIR, file);

    try {
        const raw = await fs.readFile(srcPath, 'utf-8');
        const data = JSON.parse(raw);

        data.status = 'Dikirim ke customer';

        await fs.mkdir(DELIVERED_DIR, { recursive: true });

        // jangan overwrite
        try {
            await fs.access(destPath);
            return;
        } catch {}

        await fs.writeFile(destPath, JSON.stringify(data, null, 2));
        // await fs.unlink(srcPath);

    } catch (err) {
        if (retry > 0) {
            return processFile(file, retry - 1);
        }
        console.error(`Gagal proses ${file}:`, err);
    }
};

export const startDeliveryWorker = () => {
    setInterval(async () => {
        try {
            const files = await fs.readdir(CUSTOMER_ORDER_DIR);
            const batch = files.slice(0, MAX_CONCURRENT);

            await Promise.all(batch.map(file => processFile(file)));
        } catch (err) {
            console.error('Worker error:', err);
        }
    }, 10_000);
};
