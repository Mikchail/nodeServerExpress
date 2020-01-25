const { Schema } = require('mongoose');
const mongoose  = require('mongoose');

const privatePath = require('mongoose-private-paths');

const postSchema  = new Schema({
  title: {
      type: String,
      required: true
  },
  content:{
      type: String,
      required: true,
  },
  createDate: {
      type: Date,
      dafault: Date.now
  }
});


postSchema.plugin(privatePath);
module.exports = mongoose.model('posts',postSchema);