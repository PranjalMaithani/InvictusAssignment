const lowercaseString = "_abcdefghijklmnopqrstuvwxyz";

const alphaNumeric =
  "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const BASE26 = lowercaseString.split("");

const BASE62 = alphaNumeric.split("");

export const BigIntBase26 = BigInt(27);

const BigIntBase62 = BigInt(63);

//the underscore _ at the start of both bases is a placeholder, so that words starting with the letter 'a' get encoded properly
//otherwise 'a' refers to 0 and is lost in encoding

//converts from base value to base 10(numerical), in our example from base26(a-z) to base10(0-9)
export function Encode(word, baseValue, baseArray) {
  let result = BigInt(0);
  const array = word.split("");
  array.forEach((char, index) => {
    const num = BigInt(baseArray.indexOf(char)); //index of character in the base array, example: in [a-z] b has a value of 1, while a has a value of 0
    const multi = baseValue ** BigInt(array.length - index - 1);
    result += num * multi;
  });
  return result;
}

//Takes the number and using base conversion gets the exponential values in an array
//Example: 635 -> 63¹ * 10 + 63⁰ * 5 -> [10,5]
export function numberToBaseArray(number) {
  let digits = [];
  let num = BigInt(number);

  while (num > 0n) {
    let remainder = num % BigIntBase62;
    const remainderInt = parseInt(remainder, 10);
    digits.push(Math.floor(remainderInt));
    num = num / BigIntBase62;
  }
  digits = digits.reverse();
  return digits;
}

//Takes the array and converts it to string with corresponding values in the base62 array
//Example: [10,5] -> kf (a = index 0, b = 1, c = 2, ... f = 5 ....  k = 10)

export function arrayToString(array) {
  let word = "";
  array.forEach((num) => {
    word += BASE62[num];
  });
  return word;
}

//Combining all the three functions above, provides a short string from a longer string

export function longToShort(word) {
  let value = Encode(word, BigIntBase26, BASE26);
  let arr = numberToBaseArray(value);
  let newWord = arrayToString(arr);
  return newWord;
}

//output = eo4OsE
// console.log(longToShort("mozilla"));

export default (req, res) => {
  const word = req.body.word;
  if (!word) {
    return res.status(400).end();
  }
  const shortWord = longToShort(word);
  return res.send({ word: shortWord });
};
