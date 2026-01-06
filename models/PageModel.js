const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    projectID: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    path: {
        type: String,
        required: true
    }
}, {timestamps: true})


const PageModel = mongoose.model('Page', schema)

module.exports = PageModel