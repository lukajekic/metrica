const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        required: true,
        default: 'waiting'
    },

    placeholderLicense: {
        type: String,
        required: true
    }
}, {timestamps: true})

const WaitlistModel = mongoose.model('Waitlist', schema, 'waitlistrecords')
module.exports = WaitlistModel