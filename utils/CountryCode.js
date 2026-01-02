const getCountryCodeISO = (req)=>{
    const countrycode = req.headers['x-vercel-ip-country'] || 'UN'
    return countrycode
}

module.exports = getCountryCodeISO