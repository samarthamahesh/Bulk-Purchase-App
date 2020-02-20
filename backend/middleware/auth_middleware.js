const jwt = require('jsonwebtoken');

function auth_middleware(req, res, next) {
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).json({msg: "No token, authorization denied"});
    }

    try {
        const decrypted = jwt.verify(token, "thisissecret");

        req.user = decrypted;
        next();
    } catch(e) {
        res.status(400).json({ msg: "Token is invalid" })
    }
}

module.exports = auth_middleware;