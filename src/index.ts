import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/order.routes';
import { startDeliveryWorker } from './worker/delivery.worker';
import { startRekapWorker } from './worker/rekap.worker';

const app = express();
app.use(bodyParser.json());

app.use('/order', orderRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// worker
startDeliveryWorker();
startRekapWorker();