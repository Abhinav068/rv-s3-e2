const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        jwt.verify(token, process.env.jwtsecret,(err,decoded) => {
            if(err) {
                res.status(404).send('invalid token please login');
            }
            req.body.username=decoded.username;
            next()
        });
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = { authenticate };