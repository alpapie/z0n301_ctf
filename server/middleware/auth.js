const jwt = require('jsonwebtoken');

let secret_jwt = process.env.JWT_SECRET
function verifyToken(req, res, next) {
    
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token?.split(' ').pop(), secret_jwt);
        req.userId = decoded.userId;
        next();
    } catch (error) {        
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;

