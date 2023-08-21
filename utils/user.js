//hides data we do not want to return in our response
exports.sanitizeUser = (user) => {
  const userData = { ...user };
  delete userData._doc.admin;
  return userData._doc;
};
