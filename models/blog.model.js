const { model, Schema } = require('mongoose');

const BlogModel = model('blog', Schema({
    username: String,
    title: String,
    content: String,
    category: {
        type: String,
        enum: ['Business', 'Tech', 'Lifestyle', 'Entertainment']
    },
    date: Date,
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        username: String,
        content: String
    }]

}))

module.exports = { BlogModel };

