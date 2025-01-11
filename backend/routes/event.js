const express = require('express');
const EventRouter = express.Router();
const Event = require('../models/event');

// Add a new event
EventRouter.post('/add', async (req, res) => {
    const { date, day, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    if (!date || !day || !eventPlace|| !phone_no|| !ballons || !company || !employees || !details) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        const event = new Event({ date, day, eventPlace,ballons,phone_no, company, employees, details });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update an event
EventRouter.put('/update/:id', async (req, res) => {
    const { date, day, eventPlace,phone_no,ballons, company, employees, details } = req.body;
    if (!date || !day || !eventPlace || !phone_no|| !ballons || !company || !employees || !details) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { date, day, eventPlace,ballons,phone_no, company, employees, details }, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).send();
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
        const events = await Event.find().populate('invoice');
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = EventRouter;
