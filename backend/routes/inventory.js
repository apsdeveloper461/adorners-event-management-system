const express = require('express');
const InventoryRouter = express.Router();
const Inventory = require('../models/inventory');

// Add a new inventory item
InventoryRouter.post('/add', async (req, res) => {
    const { category_id, name, specification, quantity } = req.body;
    if (!category_id || !name || !specification || !quantity) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        const existingInventory = await Inventory.findOne({ $or: [{ category_id }, { name }] });
        if (existingInventory) {
            return res.status(400).send({ error: 'category_id and name must be unique' });
        }
        const inventory = new Inventory({ category_id, name, specification, quantity });
        await inventory.save();
        res.status(201).send(inventory);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update an inventory item
InventoryRouter.put('/update/:id', async (req, res) => {
    const { category_id, name, specification, quantity } = req.body;
    if (!category_id || !name || !specification || !quantity) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        const existingInventory = await Inventory.findOne({ 
            $or: [{ category_id }, { name }], 
            _id: { $ne: req.params.id } 
        });
        if (existingInventory) {
            return res.status(400).send({ error: 'category_id and name must be unique and not match with other category_id or name' });
        }
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, { category_id, name, specification, quantity }, { new: true, runValidators: true });
        if (!inventory) {
            return res.status(404).send();
        }
        res.send(inventory);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add quantity to an inventory item
InventoryRouter.put('/add-quantity/:id', async (req, res) => {
    const { quantity } = req.body;
    if (quantity === undefined) {
        return res.status(400).send({ error: 'Quantity is required' });
    }
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).send();
        }
        inventory.quantity += quantity;
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Remove quantity from an inventory item
InventoryRouter.put('/remove-quantity/:id', async (req, res) => {
    const { quantity } = req.body;
    if (quantity === undefined) {
        return res.status(400).send({ error: 'Quantity is required' });
    }
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).send();
        }
        inventory.quantity -= quantity;
        if (inventory.quantity < 0) {
            inventory.quantity = 0;
        }
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all inventory items
InventoryRouter.get('/all', async (req, res) => {
    try {
        const inventories = await Inventory.find({});
        res.send(inventories);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = InventoryRouter;
