//create auth middleware that checks for a valid jwt token in the authorization header
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });   
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log("this is the decoded", decoded);
    req.farmerId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ message: 'Token is not valid' });
  } 
};

module.exports = auth;