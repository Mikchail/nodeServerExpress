const { Schema } = require('mongoose');
const mongoose  = require('mongoose');

const privatePath = require('mongoose-private-paths');

const userSchema  = new Schema({
  name: {
      type: String,
      required: true
  },
  email:{
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true,
      private: true,
  },
  createDate: {
      type: Date,
      dafault: Date.now
  }
})


userSchema.plugin(privatePath);
module.exports = mongoose.model('users',userSchema)