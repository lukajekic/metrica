const getRefererValue = (req)=>{
    const header = req.header('referer') || 'UN'
    console.log(header)
    const url = new URL(header).origin
    return url
}

module.exports = getRefererValue