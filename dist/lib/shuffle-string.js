"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleString = void 0;
const shuffleString = (str) => {
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
exports.shuffleString = shuffleString;
// module.exports = shuffleString;
