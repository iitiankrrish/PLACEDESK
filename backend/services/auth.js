const jwt = require('jsonwebtoken');
const secretKey = "dummykey";
function setUser(user) {
  const payload = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    enrollmentNumber: user.enrollmentNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
}
function getUser(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return null;
  }
}

module.exports = { setUser, getUser };
