const characters =
  "0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

const generateRandomID = () => {
  let charactersLength = characters.length;
  let randomID = "";
  for (let i = 0; i < 9; i++) {
    randomID += characters[Math.floor(Math.random() * charactersLength)];
  }

  return randomID;
};

export const customAlphabet = () => () => generateRandomID();
