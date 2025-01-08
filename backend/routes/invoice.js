const express = require('express');
const InvoiceRouter = express.Router();
const Invoice = require('../models/invoice');
const Inventory = require('../models/inventory'); // Assuming you have an Inventory model
const Event = require('../models/event'); // Assuming you have an Event model
const Ledger = require('../models/ledger');
const ledger = require('../models/ledger');
// const ledger = require('../models/ledger');

// Add a new invoice
InvoiceRouter.post('/add', async (req, res) => {
    try {
        const { event, itemsArray } = req.body;

        // Subtract quantity from inventory
    const itemsForInvoice = [];
        for (const item of itemsArray) {
            const inventoryItem = await Inventory.findOne({ name: item.itemsName });
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            if (inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ message: 'Insufficient inventory quantity' });
            }
            itemsForInvoice.push({ itemsName: inventoryItem.name, quantity: item.quantity, pricePerItem:item.pricePerItem});
            inventoryItem.quantity -= item.quantity;
            await inventoryItem.save();
        }
        const invoice = new Invoice({ items: itemsForInvoice });
        await invoice.save();

        // Save the event
        const findEvent = await Event.findById(event._id);
        if(!findEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        findEvent.invoice = invoice._id;
        await findEvent.save();

        const newleger= new Ledger({
            date: findEvent.date,
            description: 'this is credit of  event '+findEvent.index,
            amount: invoice.total,
            type: 'dues',
            eventId: findEvent._id,
            companyName: findEvent.company
        });
        await newleger.save();
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an existing invoice
InvoiceRouter.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { event, itemsArray } = req.body;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Restore inventory quantities for the old items
        for (const item of invoice.items) {
            const inventoryItem = await Inventory.findOne({ name: item.itemsName });
            if (inventoryItem) {
                inventoryItem.quantity += item.quantity;
                await inventoryItem.save();
            }
        }

        // Subtract quantity from inventory for the new items
        const itemsForInvoice = [];
        for (const item of itemsArray) {
            const inventoryItem = await Inventory.findOne({ name: item.itemsName });
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            if (inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ message: 'Insufficient inventory quantity' });
            }
            itemsForInvoice.push({ itemsName: inventoryItem.name, quantity: item.quantity, pricePerItem: item.pricePerItem });
            inventoryItem.quantity -= item.quantity;
            await inventoryItem.save();
        }

        // Update the invoice
        invoice.items = itemsForInvoice;
        await invoice.save();

        // Update the event if provided
        if (event) {
            const findEvent = await Event.findById(event._id);
            if (!findEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            findEvent.invoice = invoice._id;
            await findEvent.save();
            
            const ledger=await Ledger.findOne({eventId:event._id});
            ledger.amount=invoice.total;
            await ledger.save();
            res.status(200).json(invoice);
        }else{
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all invoices
InvoiceRouter.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = InvoiceRouter;
