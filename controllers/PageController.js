const { default: mongoose } = require("mongoose")
const PageModel = require("../models/PageModel")
const PageViewModel = require("../models/PageViewModel")
const checkProject = require("../utils/CheckProject")


const getPages = async(req,res)=>{
try {
        const {projectID} = req.body || {}
const ownership = await checkProject(projectID, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }
    let items = await PageModel.find({projectID})

    return res.status(200).json(items)
} catch (error) {
    return res.status(500).json({"error": error.message})
}
}


const getSinglePage = async(req,res)=>{
try {
        const _id = req.params.id
        if (!_id) {
            return res.status(400).json({'message': "Provide page ID"})
        }
        const page = await PageModel.findById(_id)
        if (!page) {
            return res.status(400).json({"message": "Page not found"})
        }

const ownership = await checkProject(page.projectID, req.user._id)

        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }
    let item = await PageModel.findById({_id})

    return res.status(200).json(item)
} catch (error) {
    return res.status(500).json({"error": error.message})
}
}



const createPage = async(req,res)=>{
    try {
        const {title, projectID, path} = req.body
        if (!title || !projectID || !path) {
            return res.status(400).json({'message': "Please fill all the fields and check active project ID."})
        }
const ownership = await checkProject(projectID, req.user._id)

        if (!ownership) {
            return res.status(400).json({"message": "You are not authorized to access this project."})
        }
const newitem = new PageModel({title, projectID, path})
await newitem.save()
return res.status(201).json(newitem)

    } catch (error) {
return res.status(500).json({"error": error.message})        
    }
}


const editPage = async(req,res)=>{
    try {
        const body = req.body || {}
        if (!body) {
            return res.status(400).json({"message": "Page ID and at least one other field are required."})

        }


        const {_id} = req.body

if (!_id) {
                return res.status(400).json({"message": "Page ID and at least one other field are required."})
}

let toUpdate = {}
const fieldWhitelist = ['title', 'path']
for (const key of fieldWhitelist) {
if (body[key] !== undefined) {
    toUpdate[key] = body[key]
}
}
        const updated = await PageModel.findByIdAndUpdate(_id, toUpdate, {new: false})
        if (req.body.PATHUPDATE !== undefined && req.body.PATHUPDATE !== null) {
            const pathupdate = req.body.PATHUPDATE
            const newpath = req.body.path
            const projectID = req.body.projectID
            const oldpath = updated.path

            if (!newpath || !projectID || !oldpath) {
                return res.status(400).json({'message': 'Since you updated the path, API call needs updated path, old path and Parent Project ID.', 'Assistant_ReceivedFields': {pathupdate, newpath, oldpath, projectID}})
            }

            if (pathupdate === true) {
                const updatemany = await PageViewModel.updateMany({path: oldpath, projectID: projectID}, {$set: {path: newpath}})
                return res.status(200).json({"Assistant_BulkUpdateResults": updatemany, 'Assistant_Action': 'Updating Main and updating Children'})
            } else if (pathupdate === false) {
                const deletemany = await PageViewModel.deleteMany({path: oldpath, projectID: projectID})
                return res.status(200).json({"Assistant_BulkUpdateResults": deletemany, 'Assistant_Action': 'Updating Main and deleting Children'})
            }
        }
        return res.status(200).json({'message': 'Updated', 'OldValues': updated, 'Assistant_Action': 'Updating Main and no operation on Children'})
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}


const deletePage = async(req, res)=>{
    try {
        const _id = req.params.id
        const projectID = req.params.projectid
        if (!_id) {
            return res.status(400).json({"message": "You need to specify page ID."})
        }

        if (!projectID || !mongoose.Types.ObjectId.isValid(projectID)) {
            return res.status(400).json({"message": "You need to specify project ID and in correct format."})
        }
        const page = await PageModel.findById(_id)
        if (!page) {
            return res.status(400).json({"message": "Page not found"})
        }
        const ownership = await checkProject(page.projectID, req.user._id)
        if (!ownership) {
            return res.status(403).json({"message": "You are not authorized to access this project."})
        }


        const deletedParentPage = await PageModel.findByIdAndDelete(_id)
        const deletedchildren = await PageViewModel.deleteMany({projectID: page.projectID, path: deletedParentPage.path})
        return res.status(200).json({"message": "Successfully deleted the page.", 'Assistant_BulkDeleteResults': deletedchildren})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


module.exports = {getPages, getSinglePage, createPage, editPage, deletePage}
        