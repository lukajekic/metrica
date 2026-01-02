const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    path: {
        type: String,
        required: true
    },

    views: {
        type: Map,
        of: Number,
        default:{}
    },

    uniqueViews: {
        type: Map,
        of: Number,
        default: {}
    },

    projectID: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})


const PageViewModel = mongoose.model('PageView', schema, 'pageviews')
module.exports = PageViewModel