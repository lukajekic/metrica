const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    authenticatorSecret: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    projects: {
        type: Array,
        required: false
    },

    roles: {
        type: Array,
        required: true
    }
})

const model = mongoose.model('User', schema, 'users')
module.exports = model