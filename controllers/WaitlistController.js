const LicenseModel = require("../models/LicenseModel")
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



const Onboarding = async(req, res)=>{
    try {
        let body = req.body || {}
    let action = body.action || null
    if (!action || (action !== 'onboarding' && action !== 'finalcheck')) {
        return res.status(400).json({"message": "You haven't provided right action or hvaen't provided action at all."})
    }

    if (action === 'onboarding') {
        const {email = null, license = null} = body
        if (!email || !license) {
            return res.status(400).json({'message': 'Invalid.'})
        }

        const valid = await WaitlistModel.findOne({email, placeholderLicense: license, status: 'accepted'})

        if (!valid) {
            return res.status(400).json({'message': 'Invalid.'})
        }

        if (valid) {
            

            return res.status(200).json({'message': 'OK'})
        }
    } else if (action === 'finalcheck') {
        const {email = null, invitationID = null} = body
        if (!email || !invitationID) {
            return res.status(400).json({'message': 'Missing Email or Invitation ID'})
        }

        const invitation = await WaitlistModel.findById(invitationID)
        if (!invitation) {
            return res.status(400).json({'message': 'Invalid invitation'})
        }

        if (invitation.status !== 'accepted' || invitation.email !== email) {
            return res.status(400).json({'message': 'Invitation not accepted or email is contaminated.'})
        }


        const LicenseCreationOBJ = {
                licenseKey: invitation.placeholderLicense
            }

            const newlicense = new LicenseModel(LicenseCreationOBJ)
            await newlicense.save()

            await WaitlistModel.findByIdAndDelete(invitationID)

            return res.status(200).json({'message': 'OK'})


    }
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}

const getSingleInvitation = async(req,res)=>{
    try {
        const {invitationID = null} = req.body || {}
    if (!invitationID) {
        return res.status(400).json({'message': 'Provide Invitation ID'})
    }

    const invitation = await WaitlistModel.findById(invitationID)
    if (!invitation) {
        return res.status(400).json({'message': 'Wrong Invitation ID'})
    }

    if (invitation) {
        return res.status(200).json(invitation)
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

module.exports = {Subscribe, GetWaitlist, getSingleInvitation, Onboarding}