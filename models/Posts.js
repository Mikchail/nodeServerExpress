const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const privatePath = require('mongoose-private-paths');

const postSchema = new Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  fuck: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },

  comments: [
    {
      body: {
        type: String,
        required: true
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      createdDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  

});

const populationFields = 'user comments.user'

postSchema.post('save', async (doc) => {
  await doc.populate(populationFields).execPopulate()
})

function populateFields() {
  this.populate(populationFields)
}

postSchema.pre('find', populateFields)
postSchema.pre('findOne', populateFields)
postSchema.pre('findOneAndUpdate', populateFields)

module.exports = mongoose.model('posts', postSchema)
// postSchema.plugin(privatePath);
// module.exports = mongoose.model('posts',postSchema);