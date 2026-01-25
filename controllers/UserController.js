const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const UserModel = require('../models/UserModel')
const Register = async(req, res)=>{
try {
    const {email, password, name} = req.body
    if (!email || !password || !name) {
        return res.status(400).json({"message": "Email, password and name are required."})
    }
    const authSecret = speakeasy.generateSecret({
        name: `Metrica Cloud: ${name}`
    })
    const projects = []
const salt = await bcrypt.genSalt(10)
const hashed = await bcrypt.hash(password, salt)
    const toInsert = {
        email: email,
        password: hashed,
        authenticatorSecret: authSecret.ascii,
        name: name,
        projects: projects,
        roles: ['user']
        
    }

    let newitem = new UserModel(toInsert)
    await newitem.save()

    newitem = newitem.toObject()
    const {password: hashedPassword, ...rest} = newitem
    const toReturn = {
        ...rest,
        qrcode: await qrcode.toDataURL(authSecret.otpauth_url)
    }

res.cookie('token', generateJWT(newitem._id), {
    maxAge: 86400000,
    secure: true,
    httpOnly: true,
    sameSite: 'none'
})
    return res.status(201).json(toReturn)
    
} catch (error) {
    return res.status(500).json({"error": error.message})
}
}

const Login = async(req, res)=>{
    try {
        const {email, passwordAndOTP} = req.body
        if (!email || !passwordAndOTP || passwordAndOTP.length < 7) {
            return res.status(400).json({"message": "Both email and password+OTP are required."})
        }

        const user = await UserModel.findOne({email: email})
        if (!user) {
            return res.status(400).json({"message": "Invalid email, password or 2FA OTP."})
        }

        const password = passwordAndOTP.slice(0, -6)
        const OTP = passwordAndOTP.slice(-6)

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
                        return res.status(400).json({"message": "Invalid email, password or 2FA OTP."})

        }

        const verifyOTP = speakeasy.totp.verify({
            secret: user.authenticatorSecret,
            encoding: "ascii",
            token: OTP
        })

        if(!verifyOTP) {
                        return res.status(400).json({"message": "Invalid email, password or 2FA OTP."})

        }

        res.cookie('token', generateJWT(user._id), {
            maxAge: 86400000,
            secure: true,
            httpOnly: true,
            sameSite: 'none'
        })


        return res.status(200).json({"message": "LOGIN SUCCESSFUL."})
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}





const generateJWT = (userID)=>{
    return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const projectModel = require('../models/ProjectModel')

const getProfile = async(req, res)=>{
    try {
        const user = req.user._id
        const userDB =  await UserModel.findById(user)
        const projects = await projectModel.find({owner: user}).select('_id').lean() //navodno je lean bolji zbog memorije

        const projectIDS = projects.map(item => item._id)
        if (!userDB) {
            return res.status(401).json({"message": "No user found"})
        }
        const {password, authenticatorSecret,  ...rest} = userDB.toObject()
        return res.status(200).json({...rest, projects: projectIDS})
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}

const Logout = async(req, res)=>{
    res.cookie('token', '', {
        expires: new Date(0),
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    })


    return res.status(200).json({"message": "LOGOUT SUCCESSFUL"})
}


const deleteUser = async(req, res)=>{
const user = req.user._id

const body = req.body || {}
const otp = req.body.otp
if (!user || !otp) {
    return res.status(400).json({"message": "Missing User ID and/or OTP code"})
}

const userProjects = await projectModel.find({owner: new mongoose.Types.ObjectId(user)}).countDocuments()
if (userProjects > 0) {
    return res.status(400).json({"message": "You need to delete all projects first."})
}


const totpsecret = req.user.authenticatorSecret


const totpverify = speakeasy.totp.verify({
    secret: totpsecret,
    encoding: 'ascii',
    token: otp
})

if (totpverify) {
    await UserModel.findByIdAndDelete(user)
      res.cookie('token', '', {
        expires: new Date(0),
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    })

    return res.status(302).redirect("/")
} else {
    return res.status(400).json({"message": "Invalid OTP"})
}
}


module.exports = {Register, Login, getProfile, Logout, deleteUser}