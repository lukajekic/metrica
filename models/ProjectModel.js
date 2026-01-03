const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    license: {
        type: String,
        required: true
    },

    apiKey: {
        type: String,
        required: true
    },

    allowedOrigin: {
        type: String,
        required: true
    },

    sidebar: {
        type: Array,
        required: true
    },
    icon: {
        type: String,
        required: false
    },

    realTime: {
        type: Boolean,
        required: true,
        default: false
    }
})


const model = mongoose.model('Project', schema)

module.exports = model