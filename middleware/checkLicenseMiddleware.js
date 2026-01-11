const LicenseModel = require("../models/LicenseModel")
const ProjectModel = require('../models/ProjectModel')




const checkLicenseMiddleware = async(req, res, next)=>{
  try {
      const {license} = req.body || {}
      if (!license) {
        return res.status(400).json({'message': 'No license provided'})
      }
    const licenseITEM = await LicenseModel.findOne({licenseKey: license})
    if (!licenseITEM) {
        return res.status(400).json({"message": "License key is not valid."})
    }

    const usedIN = await ProjectModel.find({license: license}).countDocuments()
    if (usedIN > 0) {
        return res.status(400).json({"message": "License is already used, earlier project deletion will result in license reactivation."})
    } else if (licenseITEM && usedIN === 0) {
        //license ok
        next()
    } else {
        return res.status(400).json({"message": "Unknown problem occured"})
    }
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }
    
}


module.exports = checkLicenseMiddleware