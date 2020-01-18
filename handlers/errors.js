module.exports = async (res,req, next) => {
  try {
    await next()
  } catch(e) {
    res.status = e.status || 500
    res.body = { error: e.message || 'Internal Server Error' }
  }
}