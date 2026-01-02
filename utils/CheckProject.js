const projectmodel = require('../models/ProjectModel')

const checkProject = async(projectID, userID)=>{
try {

    const projectItem = await projectmodel.findById(projectID)
    console.log(projectItem.owner.toString())
    console.log(userID.toString())
    if (projectItem.owner.toString() === userID.toString()) {
        return true
    } else {
        return false
    }
} catch (error) {
    throw new Error(error)
}
}


module.exports = checkProject