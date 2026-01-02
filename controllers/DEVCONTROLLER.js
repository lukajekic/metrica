const getCountryCodeISO = require("../utils/CountryCode")

const getCountryCodeDEV = (req,res,next)=>{
    const cc = getCountryCodeISO(req)
    const frontendOrigin = req.headers.origin
    return res.status(200).send(cc, frontendOrigin)
}

module.exports = {getCountryCodeDEV}