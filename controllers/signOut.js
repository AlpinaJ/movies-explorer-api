const JWT_KEY = "jwt";
const JWT_OPTIONS = {
  maxAge: 604800000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

module.exports.logout = (req, res) => {
  res.clearCookie(JWT_KEY, JWT_OPTIONS);
  res.end();
};
