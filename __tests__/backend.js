import {
  longToShort,
  Encode,
  BigIntBase26,
  BASE26,
  numberToBaseArray,
  arrayToString,
} from "../pages/api/longToShort";

import {
  shortToLong,
  Decode,
  arrayToNumber,
  stringToArray,
} from "../pages/api/shortToLong";

const originalWord = "mozilla"; //note that it is lowercase
const longWord = "mozillafirefoxbutreallylongfortestinglongstrings";

test("longToShort returns a string of shorter length than original, or equal if it is 2 or less characters", () => {
  const shortWord = longToShort(originalWord);
  if (originalWord.length <= 2) {
    expect(shortWord.length).toBe(originalWord.length);
  } else {
    expect(shortWord.length).toBeLessThan(originalWord.length);
  }
});

test("longToShort returns a string which can be restored back to the original using shortToLong", () => {
  const shortWord = longToShort(originalWord);
  const restoreOriginalWord = shortToLong(shortWord);
  expect(restoreOriginalWord).toBe(originalWord);
});

test("longToShort and shortToLong work for long length strings", () => {
  const shortWord = longToShort(longWord);
  const restoreOriginalWord = shortToLong(shortWord);
  expect(restoreOriginalWord).toBe(longWord);
});

test("Encoding and Decoding are bidirectional", () => {
  const number = Encode(originalWord, BigIntBase26, BASE26);
  const restoreOriginalWord = Decode(number);
  expect(restoreOriginalWord).toBe(originalWord);
});

test("Array to number is working correctly", () => {
  const number = arrayToNumber([10, 5]);
  expect(number).toEqual(BigInt(635));
});

test("Number to array is working correctly", () => {
  const array = numberToBaseArray(BigInt(635));
  expect(array).toEqual([10, 5]);
});

test("Number to array and array to number are bidirectional", () => {
  const originalNumber = BigInt(635);
  const array = numberToBaseArray(originalNumber);
  const restoredNumber = arrayToNumber(array);
  expect(restoredNumber).toEqual(originalNumber);
});

test("Array to string and string to array are bidirectional and correct", () => {
  const originalWord = "cat";
  const array = stringToArray(originalWord);
  expect(array).toEqual([3, 1, 20]);
  const restoredWord = arrayToString(array);
  expect(restoredWord).toBe(originalWord);
});
