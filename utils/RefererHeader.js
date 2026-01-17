const getRefererValue = (req)=>{
    const header = req.header('origin') || 'UN'
    console.log(header)
    const url = new URL(header).origin
    return url
}

module.exports = getRefererValue