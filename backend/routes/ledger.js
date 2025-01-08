const express = require('express');
const ledgerRouter = express.Router();
const Ledger = require('../models/ledger');

// Get all ledger entries
ledgerRouter.get('/', async (req, res) => {
    try {
        const ledgers = await Ledger.find();
        res.json(ledgers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all ledger entries for a specific company
ledgerRouter.get('/company/:companyName', async (req, res) => {
    try {
        const ledgers = await Ledger.find({ companyName: req.params.companyName });
        res.json(ledgers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all ledger entries grouped by company name with total, received, and remaining amounts
ledgerRouter.get('/groupedByCompany', async (req, res) => {
    try {
        const ledgers = await Ledger.aggregate([
            {
                $group: {
                    _id: "$companyName",
                    // dueAmount: { $sum: "$amount" },
                    receivedAmount: { $sum: { $cond: [{ $eq: ["$type", "pay"] }, "$amount", 0] } },
                    dueAmount: { $sum: { $cond: [{ $eq: ["$type", "dues"] }, "$amount", 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    company: "$_id",
                    totalAmount: "$dueAmount",
                    receivedAmount: 1,
                    remainingAmount: { $subtract: ["$dueAmount", "$receivedAmount"] }
                }
            }
        ]);
        console.log(ledgers);
        
        res.json(ledgers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


ledgerRouter.post('/pay',async (req,res)=>{
    try {
        const {company,amount,description,date} = req.body;
        const ledger = new Ledger({
            date: date,
            description: description,
            amount: amount,
            type: 'pay',
            companyName: company
        });
        const newLedger = await ledger.save();
        res.json(newLedger);
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message });
    }
});


module.exports = ledgerRouter;
