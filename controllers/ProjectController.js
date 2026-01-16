const { default: mongoose } = require("mongoose");
const projectModel = require("../models/ProjectModel");
const { generateApiKey } = require('generate-api-key');
const checkProject = require("../utils/CheckProject");

const getProjects = async(req,res)=>{
    try {
        const {_id = null} = req.body || {}
        let query = {
            owner: new mongoose.Types.ObjectId(req.user._id)
        }
        if (_id) {
            query._id = new mongoose.Types.ObjectId(_id)
        }
        const items = await projectModel.find(query).select('-apiKey')
        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const createProject = async(req,res)=>{
    try {
        const {title, allowedOrigin, sidebar, license} = req.body
        const icon = req.file?.filename || null
        const apiKey = generateApiKey({
            method: 'string',
            pool: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890',
            min: 28,
            max: 32,
            prefix: 'Metrica'
        })


        const owner = req.user._id
        if (!title || !allowedOrigin || !sidebar || sidebar.length === 0 || !apiKey || !owner) {
            return res.status(400).json({"message": "Creating Project requires title, allowed origin, owner, auto api key, and sidebar customization"})
        }

        let newitem = new projectModel({title, owner, license, apiKey, allowedOrigin, sidebar, icon})
        await newitem.save()
        


        return res.status(201).json(newitem)


    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}





const updateProject = async(req,res)=>{
    try {
        const {_id} = req.body

        if (!_id) {
            return res.status(400).json({"message": "Project ID (_id) is necessary."})
        }


        const ownership = await checkProject(_id, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }

        let allowedFields = ['title', 'allowedOrigin', 'sidebar', 'icon']
let result = {}
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) { //VAZNO JE DA SAMO NE UDE UNDEFINED, JER NULL I FALSE MOGU BIII UPOTREBLJENI
                result[field] = req.body[field]
            }
        }
        let updated = await projectModel.findByIdAndUpdate(_id, result, {new: true})
       
        


        return res.status(200).json(updated)


    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}


const speakeasy = require('speakeasy');
const usermodel = require("../models/UserModel");

const deleteProject = async(req,res)=>{
    try {
        const {id = null, otp = null} = req.body || {}
        if (!id) {
            return res.status(400).json({"message": "ID is required in request url parameter"})

        }


        const ownership = await checkProject(id, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }
const user = await usermodel.findById(id)

const totpsecret = req.user.authenticatorSecret

        const otpverificaion = speakeasy.totp.verify({
            secret: totpsecret,
            encoding: "ascii",
            token: otp
        })

        if (otpverificaion) {
            await projectModel.findByIdAndDelete(id)
        } else {
            return res.status(400).json({"message": "Invalid OTP"})
        }

        return res.status(200).json({"message": "Successful project deletion"})
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}

module.exports = {getProjects, createProject, updateProject, deleteProject}