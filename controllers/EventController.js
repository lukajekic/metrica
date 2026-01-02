const EventModel = require("../models/EventModel")
const checkProject = require("../utils/CheckProject")



const getEvents = async(req,res)=>{
try {
        const {projectID} = req.body
const ownership = await checkProject(projectID, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }
    let items = await EventModel.find({projectID})

    return res.status(200).json(items)
} catch (error) {
    return res.status(500).json({"error": error.message})
}
}


const getSingleEvent = async(req,res)=>{
try {
        const _id = req.params.id
        if (!_id) {
            return res.status(400).json({'message': "Provide event ID"})
        }
        const event = await EventModel.findById(_id)
        if (!event) {
            return res.status(400).json({"message": "Event not found"})
        }

const ownership = await checkProject(event.projectID, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }

    return res.status(200).json(event)
} catch (error) {
    return res.status(500).json({"error": error.message})
}
}



const createEvent = async(req,res)=>{
    try {
        const {title, projectID, description} = req.body
const ownership = await checkProject(projectID, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }
const newitem = new EventModel({title, projectID, description})
await newitem.save()
return res.status(201).json(newitem)

    } catch (error) {
return res.status(500).json({"error": error.message})        
    }
}


const editEvent = async(req,res)=>{
    try {
        const body = req.body
        if (!body) {
            return res.status(400).json({"message": "Event ID and at least one other field are required."})

        }


        const {_id} = req.body

if (!_id) {
                return res.status(400).json({"message": "Event ID and at least one other field are required."})
}

const toUpdate = {}
const fieldWhitelist = ['title', 'description']
for (const key in fieldWhitelist) {
if (body[key] !== undefined) {
    toUpdate[key] === body[key]
}
}
        const updated = await EventModel.findByIdAndUpdate(_id, toUpdate, {new: true})
        return res.status(200).json(updated)
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}


const deleteEvent = async(req, res)=>{
    try {
        const _id = req.params.id
        if (!_id) {
            return res.status(400).json({"message": "You need to specify event ID."})
        }
        const event = await EventModel.findById(_id)
        if (!event) {
            return res.status(400).json({"message": "Event not found"})
        }
        const ownership = await checkProject(event.projectID, req.user._id)
        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }


        await EventModel.findByIdAndDelete(_id)
        return res.status(200).json({"message": "Successfully deleted the event."})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


module.exports = {getEvents, getSingleEvent, createEvent, editEvent, deleteEvent}
        