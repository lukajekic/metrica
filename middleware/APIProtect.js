const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../models/UserModel')

const protect = async(req, res, next)=>{
try {
    let token = req.cookies.token

    if (!token) {
        return res.status(401).json({"message": "You are not authenticated to access this API, no Token found."})
    }


    const verify = jwt.verify(token, process.env.JWT_SECRET)

    if (verify) {
        const user = await UserModel.findById(verify.id)
        if (!user) {
            return res.status(401).json({"message": "User not found"})
        }
        req.user = user
        req.user.id = user._id.toString()
        req.user._id = user._id.toString()
        next()
    } else {
        return res.status(401).json({"message": "You are not authenticated to access this API, no Token found."})
    }
} catch (error) {
    return res.status(500).json({"error": error.message, "location": "ApiProtect.js"})
}
}

module.exports = protect