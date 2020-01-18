const MongooseError = require('mongoose').Error

module.exports = async (res,req, next) => {
  try {
    await next()
  } catch(e) {
    if (e instanceof MongooseError) {
      res.status(400, 'Bad credentials')
    } else {
      console.log(e)
    }
  }
}