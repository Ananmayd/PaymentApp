const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (re, res, next) => {
    const authHeader = req.header.authorization;

    if (!authHeader || authHeader.startsWith('Bearer '))
        return res.status(403).json();

    const token = authHeader.splite(' ')[1];

    try {

        const info = jwt.verify(token, JWT_SECRET);

        if(info.userId){
            req.userId = info.userId;
            next();
        }

    } catch (err) {
        return res.status(403).json();
    }
};

module.exports = {
    authMiddleware,
}