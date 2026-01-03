const PageModel = require("../models/PageModel")
const PageViewModel = require("../models/PageViewModel")
const projectModel = require("../models/ProjectModel")
const getCountryCodeISO = require("../utils/CountryCode")
const getRefererValue = require("../utils/RefererHeader")
const { getIO } = require("../utils/socket")




const registerPageView = async(req,res)=>{
    try {
        const APIKey = req.headers['x-metrica-key']
        if (!APIKey) {
            return res.status(400).json({'message': "You need to provide API Key for the project."})
        }

        const pathname = req.headers['x-metrica-path']

        if (!pathname) {
            return res.status(400).json({'message': 'window.location.pathname not provided. Use SDK for automatic page view tracking.'})
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
        let uniqueview = false
        if (uniqueparam && uniqueparam === 'true') {
            uniqueview = true
        }

        const allowedpages = await PageModel.find({projectID: ProjectItem._id})
        const pagewhitelist = allowedpages.map(item => item.path)

        if (pagewhitelist.includes(pathname)) {
            const date = new Date()
            date.setUTCHours(0, 0, 0, 0)

            const projectID = ProjectItem._id

            const existingPageviews = await PageViewModel.find({date: date, path: pathname, projectID: projectID})

            if (existingPageviews.length === 0) {
                //create new
                const toInsert = {
                    date: date,
                    path: pathname,
                    views: {
                        [countrycode]: 1
                    },

                    uniqueViews: {
                        [countrycode]: uniqueview ? 1 : 0
                    },

                    projectID: projectID


                }



                const newitem = new PageViewModel(toInsert)
                await newitem.save()
                if (ProjectItem.realTime && ProjectItem.realTime === true) {
                    console.log('Calling sendRealTime for new pageview, projectID:', projectID)
                    await sendRealTime(projectID, date, pathname)
                }
                
                return res.status(200).json({'message': 'OK'})

            } else {
                const viewID = existingPageviews[0]._id
                let incrementObject = {
                    [`views.${countrycode}`]: 1
                }

                if (uniqueview) {
                    incrementObject[`uniqueViews.${countrycode}`] =  1
                }
                await PageViewModel.findByIdAndUpdate(viewID, {$inc: incrementObject})
                if (ProjectItem.realTime && ProjectItem.realTime === true) {
                    console.log('Calling sendRealTime for updated pageview, projectID:', projectID)
                    await sendRealTime(projectID, date, pathname)
                }
                return res.status(200).json({'message': 'OK'})
            }
        } else {
            return res.status(403).json({'message': `Project [${ProjectItem.title}] doesn't monitor analytics for path ${pathname}!`})
        }
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}



async function sendRealTime(projectID, date, path) {
    const io = getIO()

    console.log(`Sockets in room ${projectID}:`, io.sockets.adapter.rooms.get(projectID)?.size || 0);
    io.to(projectID.toString()).emit('updatePageViewStats', {
        "date": date,
        "path": path
    })

            console.log('='.repeat(30))
            console.log('New Dashboard Update')
            console.log('-'.repeat(30))
            console.log(`Path: ${path}`)
            console.log(`Date: ${date}`)
            console.log('-'.repeat(30))
            console.log('From sendRealTime func on pageview controller')
            console.log('='.repeat(30))
    

    return
}


module.exports = {registerPageView}