const UserModel = require("../models/UserModel")



const CheckExistingUser = async(req,res)=>{
    try {
        const {email} = req.body || {}
        if (!email) {
            return res.status(400).json({'message': "Provide the email."})
        }

        const user = await UserModel.findOne({email: email})
        if (!user) {
            return res.status(200).json({'existing': false, 'action': 'subscribe'})
        } else{
            return res.status(200).json({'existing': true, 'action': 'logindialog'})
        }
    } catch (error) {
        return res.status(500).json({'error': error.message})
    }
}


module.exports = {CheckExistingUser}