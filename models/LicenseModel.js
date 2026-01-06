const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    licenseKey: {
        type: String,
        required: true
    }
}, {timestamps: true})


const LicenseModel = mongoose.model('License', schema)

module.exports = LicenseModel