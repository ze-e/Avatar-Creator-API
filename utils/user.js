//hides data we do not want to return in our response
exports.sanitizeUser = (user) => {
  const userData = { ...user };
  delete userData._doc.admin;
  return userData._doc;
};

// save last state
exports.saveLastState = (user, prevData) => {
  if (Array.isArray(prevData)) {
    prevData.forEach((d) => {
      if (Object.keys(user.admin.prevData).includes(d.key))
        user.admin.prevData[d.key] = d.value;
      else user.admin.prevData = user.admin.prevData.concat(d);
    });
  } else {
    if (Object.keys(user.admin.prevData).includes(prevData.key))
      user.admin.prevData[prevData.key] = prevData.value;
    else user.admin.prevData = user.admin.prevData.concat(prevData);
  }
  user.admin.lastUpdated = new Date();
  return user;
}