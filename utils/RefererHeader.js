const getRefererValue = (req) => {
  const header = req.header('origin')
  if (!header) return ""

  console.log(header)
  const url = new URL(header).origin
  return url
}

module.exports = getRefererValue
