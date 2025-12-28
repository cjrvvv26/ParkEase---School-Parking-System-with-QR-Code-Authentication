const generateDefaultName = (name) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomUserName = name;
  for (let i = 0; i < 10; i++) {
    randomUserName += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomUserName;
};

module.exports = generateDefaultName;
