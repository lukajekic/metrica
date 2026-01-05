const { default: mongoose } = require("mongoose")
const EventModel = require("../models/EventModel")
const EventTriggerModel = require("../models/EventTriggerModel")
const projectModel = require("../models/ProjectModel")
const getCountryCodeISO = require("../utils/CountryCode")
const getRefererValue = require("../utils/RefererHeader")
const { getIO } = require("../utils/socket")

const getEventTriggers = async(req,res)=>{
    try {
        let {projectID = null, startdate = null, enddate = null, eventID = null} = req.body
        if (!projectID) {
            return res.status(400).json({'message': 'You must provide Project ID'})
        }

        const ownership = await checkProject(projectID, req.user._id)
        if (!ownership) {
            return res.status(400).json({'message': 'You cannot access this project'})
        }

        
        let query = {}
        query.projectID = new mongoose.Types.ObjectId(projectID)
        if (eventID) {
            query.eventID = new mongoose.Types.ObjectId(eventID)
        }

        if (startdate || enddate) {
            query.date = {}

            if (startdate) {
                let start = new Date(startdate)
                start.setUTCHours(0, 0, 0, 0)
                query.date.$gte = new Date(start)
            }

            if (enddate) {
                let end = new Date(enddate)
                end.setUTCHours(0, 0, 0, 0)
                query.date.$lte = new Date(end)
            }
        }


        const items = await EventTriggerModel.find(query)
        return res.status(200).json(items)


    } catch (error) {
        return res.status(500).json({'message': error.message})
    }
}

const registerEventTrigger = async(req,res)=>{
    try {
        const APIKey = req.headers['x-metrica-key']
        if (!APIKey) {
            return res.status(400).json({'message': "You need to provide API Key for the project."})
        }

        const eventID = req.headers['x-metrica-event']

        if (!eventID) {
            return res.status(400).json({'message': 'Event ID not provided. Use SDK for tracking events.'})
        }

        const countrycode = getCountryCodeISO(req)
        if (!countrycode) {
            return res.status(400).json({'message': 'No header: x-vercel-ip-country'})

        }


        const ProjectItem = await projectModel.findOne({apiKey: APIKey})
        if (!ProjectItem) {
            return res.status(403).json({'message': 'Invalid API Key.'})
        }

        const allowedOrigin = new URL(ProjectItem.allowedOrigin).origin
                const RefererHeader = getRefererValue(req)
                if (!allowedOrigin || !RefererHeader) {
                    return res.status(403).json({"message": "Forbidden, missing origin (referer) or allowed origin."})
                }
        
                if (allowedOrigin !== RefererHeader) {
                    return res.status(403).json({"message": "Analytics sending is not allowed from this origin.", "origin": RefererHeader})
                }



        const uniqueparam = req.query.unique
        let uniquetrigger = false
        if (uniqueparam && uniqueparam === 'true') {
            uniquetrigger = true
        }

        const allowedevents = await EventModel.find({projectID: ProjectItem._id})
        const eventwhitelist = allowedevents.map(item => item._id.toString())
console.log(eventwhitelist)
        if (eventwhitelist.includes(eventID)) {
            const date = new Date()
            date.setUTCHours(0, 0, 0, 0)

            const projectID = ProjectItem._id

            const existingEventTriggers = await EventTriggerModel.find({date: date, eventID: eventID, projectID: projectID})

            if (existingEventTriggers.length === 0) {
                //create new
                const toInsert = {
                    date: date,
                    eventID: eventID,
                    triggers: {
                        [countrycode]: 1
                    },

                    uniqueTriggers: {
                        [countrycode]: uniquetrigger ? 1 : 0
                    },

                    projectID: projectID


                }



                const newitem = new EventTriggerModel(toInsert)
                await newitem.save()
                if (ProjectItem.realTime && ProjectItem.realTime === true) {
                    await sendRealTime(projectID, date, eventID)
                }
                return res.status(200).send(newitem)

            } else {
                const triggerID = existingEventTriggers[0]._id
                let incrementObject = {
                    [`triggers.${countrycode}`]: 1
                }

                if (uniquetrigger) {
                    incrementObject[`uniqueTriggers.${countrycode}`] =  1
                }
                await EventTriggerModel.findByIdAndUpdate(triggerID, {$inc: incrementObject})
                if (ProjectItem.realTime && ProjectItem.realTime === true) {
                    await sendRealTime(projectID, date, eventID)
                }
                return res.status(200).json({'message': 'OK'})
            }
        } else {
            return res.status(403).json({'message': `Project [${ProjectItem.title}] doesn't monitor analytics for event with ID: ${eventID}`})
        }
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}

async function sendRealTime(projectID, date, eventID) {
    const io = getIO()
    io.to(projectID.toString()).emit('updateDashboard', {
        "date": date,
        "eventID": eventID
    })

            console.log('='.repeat(30))
            console.log('New Dashboard Update')
            console.log('-'.repeat(30))
            console.log(`eventID: ${eventID}`)
            console.log(`Date: ${date}`)
            console.log('-'.repeat(30))
            console.log('From sendRealTime func on eventtrigger controller')
            console.log('='.repeat(30))
    

    return
}



module.exports = {registerEventTrigger, getEventTriggers}