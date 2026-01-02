const createLicenseKey = ()=>{
    const uuid = crypto.randomUUID()
    let formatted = uuid.toUpperCase().replace(/-/g, '')
    return formatted
}

module.exports = createLicenseKey