import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/order.routes';

const app = express();
app.use(bodyParser.json());

app.use('/order', orderRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
