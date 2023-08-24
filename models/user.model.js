const { model, Schema } = require('mongoose');

const UserModel = model('user', Schema({
    username: String,
    avatar: String,
    email: {
        type: String,
        unique: true
    },
    password: String,

}))

module.exports = { UserModel };

let user = {
    "username": "aman",
    "avatar": "avtar",
    "email": "aman@123.gmail.com",
    "password": "1234"
}