const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },

    eventID: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    triggers: {
        type: Map,
        of: Number,
        default:{}
    },

    uniqueTriggers: {
        type: Map,
        of: Number,
        default: {}
    },

    projectID: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})


const EventTriggerModel = mongoose.model('EventTrigger', schema, 'eventtriggers')
module.exports = EventTriggerModel