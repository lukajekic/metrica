const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    projectID: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    description: {
        type: String,
        required: false 
    }
}, {timestamps: true})


const EventModel = mongoose.model('Event', schema)

module.exports = EventModel