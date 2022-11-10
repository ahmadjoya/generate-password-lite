"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumbers = void 0;
const generateRandomNumbers = (upperLimit) => {
    return Math.floor(Math.random() * upperLimit);
};
exports.generateRandomNumbers = generateRandomNumbers;
// module.exports = generateRandomNumbers;
