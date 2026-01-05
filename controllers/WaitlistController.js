const usermodel = require("../models/UserModel")
const WaitlistModel = require("../models/WaitListModel")
const createLicenseKey = require("../utils/license")


const GetWaitlist = async(req,res)=>{
    try {
        const user = await usermodel.findById(req.user._id)
        if (user.roles.includes('admin')) {
            const items = await WaitlistModel.find().sort({createdAt: 1})
        return res.status(200).json(items)
        } else {
            return res.status(400).json({'message': "You don't have roles to access waitlist."})
        }
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}


const Subscribe = async(req,res)=>{
    try {
        let {email} = req.body
        email = email.trim().toLowerCase()
        if (!email) {
            return res.status(400).json({'message': 'Email is required.'})
        }

        const existing = await WaitlistModel.findOne({email: email})
        if (existing) {
            return res.status(200).json({'message': 'We already received your request. You will be contacted if your request is approved.'})
        }
const license = createLicenseKey()
        const newitem = new WaitlistModel({email: email, status: 'waiting', placeholderLicense: license})
        await newitem.save()
        return res.status(200).json({'message': 'Thank You. You will be contacted with your License Key.'})
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}

module.exports = {Subscribe}