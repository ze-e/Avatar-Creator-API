module.exports.seedLevelTable = () => {
  const keyValuePairs = [{ 1: 50 }];
  for (let i = 2; i <= 100; i++) {
    const previousValue = keyValuePairs[i - 2][i - 1];
    const newValue = previousValue * 2;
    keyValuePairs.push({ [i]: newValue });
  }
  return keyValuePairs;
};