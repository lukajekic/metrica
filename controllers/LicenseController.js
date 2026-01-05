const LicenseModel = require("../models/LicenseModel")
const ProjectModel = require('../models/ProjectModel')
const UserModel = require("../models/UserModel")
const createLicenseKey = require("../utils/license")


const checkValidty = async(req, res)=>{
  try {
      const {license} = req.body || {}
    const licenseITEM = await LicenseModel.findOne({licenseKey: license})
    if (!licenseITEM) {
        return res.status(400).json({"message": "License key is not valid.  "})
    }

    const usedIN = await ProjectModel.find({license: license}).countDocuments()
    if (usedIN > 0) {
        return res.status(400).json({"message": "License is already used, earlier project deletion will result in license reactivation."})
    } else if (licenseITEM && usedIN === 0) {
        return res.status(200).json({"message": "License is valid."})
    } else {
        return res.status(400).json({"message": "Unknown problem occured"})
    }
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }
    
}




const createLicense = async(req, res)=>{
    try {
        const {_id, roles} = req.user
        const {email} = req.body
        if (!_id || !roles || !email) {
            return res.status(400).json({"message": "Missing Admin ID, Roles or tagret user email."})
        }
        if (roles.includes('admin')) {
            const user = await UserModel.findOne({email: email})
            if (!user) {
                return res.status(400).json({"message": "User not found."})
            }

            const toInsert = {
                owner: user?._id,
                licenseKey: createLicenseKey()
            }


            const newitem = new LicenseModel(toInsert)
            await newitem.save()
            return res.status(201).json({'message': "Successfuly created new license", 'liceneKey': newitem})
        } else {
            return res.status(400).json({'message': 'You are not authorized to Create new license.'})
        }
    } catch (error) {
     return res.status(500).json({"error": error.message})   
    }
}


module.exports = {checkValidty, createLicense}