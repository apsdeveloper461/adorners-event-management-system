require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS
const routes = require('./routes');
const EventRouter = require('./routes/event');
const inventoryRoutes = require('./routes/inventory');
const InvoiceRouter = require('./routes/invoice');
const ledgerRouter = require('./routes/ledger');
console.log(process.env.MONGODB_URL,process.env.DB_NAME,   process.env.PORT); 

const app = express();
const port = process.env.PORT || 3000; // Use port from .env file
const mongoURL=process.env.MONGODB_URL;
console.log(mongoURL);

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173' // Add frontend URL from .env file
}));

// MongoDB connection
mongoose.connect(mongoURL).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Routes
app.use('/api', routes);
app.use('/api/events', EventRouter);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoice', InvoiceRouter);
app.use('/api/ledgers', ledgerRouter);


