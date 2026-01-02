const getCountryCodeISO = (req)=>{
    const countrycode = req.headers['x-vercel-ip-country']
    return countrycode
}

module.exports = getCountryCodeISO