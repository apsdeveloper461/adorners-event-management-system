const express = require('express');
const EventRouter = express.Router();
const Event = require('../models/event');
const Ledger = require('../models/ledger');

// Add a new event
EventRouter.post('/add', async (req, res) => {
    // const { date, day, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    // if (!date || !day || !eventPlace|| !phone_no|| !ballons || !company || !employees || !details) {
    //     return res.status(400).send({ error: 'All fields are required' });
    // }
    const { date, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    if (!date || !eventPlace|| !phone_no|| !ballons || !company || !employees || !details) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        // const companys=company.trim();
        const event = new Event({ date, eventPlace,ballons,phone_no, company:company.trim(), employees, details });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update an event
EventRouter.put('/update/:id', async (req, res) => {
    // const { date, day, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    // if (!date || !day || !eventPlace || !phone_no|| !ballons || !company || !employees || !details) {
    //     return res.status(400).send({ error: 'All fields are required' });
    // }
    const { date, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    if (!date  || !eventPlace|| !phone_no|| !ballons || !company || !employees || !details) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { date, eventPlace,ballons,phone_no, company:company.trim(), employees, details }, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).send();
        }
        const ledger = await Ledger.findOne({ eventId: req.params.id });
        if (ledger) {
            ledger.date = date;
            await ledger.save();
        }
        const ledgers = await Ledger.find({ eventId: req.params.id });
        for (const ledger of ledgers) {
            ledger.companyName = company.trim();
            await ledger.save();
        }
        res.send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

// // Delete an event
// EventRouter.delete('/delete/:id', async (req, res) => {
//     try {
//         const event = await Event.findByIdAndDelete(req.params.id);
//         if (!event) {
//             return res.status(404).send();
//         }
//         res.send(event);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// Get all events
EventRouter.get('/all', async (req, res) => {
    try {
        const events = await Event.find().populate('invoice').sort({ _id: -1 });
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = EventRouter;
