module.exports.getLevelByXP = (levelData, xp) => {
  let closestKey = null;
  let closestDistance = Infinity;

  levelData.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (value <= xp && xp - value < closestDistance) {
        closestKey = parseInt(key);
        closestDistance = xp - value;
      }
    });
  });
  return parseInt(closestKey);
}

module.exports.gainLevel = (leveldata, xp, userLevel) => {
  const newLevel = getLevelByXP(leveldata, xp);
  if (newLevel > userLevel) {
    console.log("User gained a level!");
    return newLevel;
  }
  return userLevel;
}