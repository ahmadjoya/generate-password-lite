export const shuffleString = (str: string) => {
  let arr = str.split("");
  let n = arr.length;

  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.join("");
};

// module.exports = shuffleString;
