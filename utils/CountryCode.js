const getCountryCodeISO = (req)=>{
    const countrycode = req.headers['x-metrica-country'] || 'UN'
    return countrycode
}

module.exports = getCountryCodeISO