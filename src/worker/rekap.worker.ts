import fs from 'fs/promises';
import path from 'path';

const DELIVERED_DIR = path.join(__dirname, '../../database/delivered-order');
const REKAP_DIR = path.join(__dirname, '../../database/rekap-order');

export const startRekapWorker = () => {
    setInterval(async () => {
        try {
            await fs.mkdir(REKAP_DIR, { recursive: true });

            const files = await fs.readdir(DELIVERED_DIR);
            const today = new Date();
            const dateStr = `${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getFullYear()).slice(-2)}`;

            const rekapPath = path.join(REKAP_DIR, `REKAP-ORDER-${dateStr}.json`);

            let existing: any[] = [];
            try {
                existing = JSON.parse(await fs.readFile(rekapPath, 'utf-8'));
            } catch {}

            const existingOrders = new Set(existing.map(o => o.no_order));

            for (const file of files) {
                const raw = await fs.readFile(path.join(DELIVERED_DIR, file), 'utf-8');
                const data = JSON.parse(raw);

                if (!existingOrders.has(data.no_order)) {
                    existing.push(data);
                }
            }

            await fs.writeFile(rekapPath, JSON.stringify(existing, null, 2));
        } catch (err) {
            console.error('Rekap worker error:', err);
        }
    }, 5_000);
};
