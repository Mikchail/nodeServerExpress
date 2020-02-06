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
  admin:{
    type: Boolean,
    default: false
  },
  password: {
      type: String,
      required: true,
      private: true,
  },
  avatar: {
      type: String,
      default: ''
  },
  createDate: {
      type: Date,
      default: Date.now
  }
});


userSchema.plugin(privatePath);
module.exports = mongoose.model('users',userSchema);