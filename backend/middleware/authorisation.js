const { getUser } = require('../services/auth');

function userLoggedInOrNot(req, res, next) {
const token = req.cookies?.loginToken;


  if (!token) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const userInfo = getUser(token);
  if (!userInfo) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  req.user = userInfo; 
  next();
}
function isPicMember(req, res, next) {
  if (req.user.role !== 'pic_member') {
    return res.status(403).json({ error: "Access denied: PIC Members only" });
  }
  next();
}
function isStudent(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: "Access denied: Students only" });
  }
  next();
}

module.exports = { userLoggedInOrNot };
