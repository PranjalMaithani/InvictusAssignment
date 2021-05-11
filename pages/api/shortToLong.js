const lowercaseString = "_abcdefghijklmnopqrstuvwxyz";

const alphaNumeric =
  "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const BASE26 = lowercaseString.split("");

const BASE62 = alphaNumeric.split("");

const BigIntBase26 = BigInt(27);

const BigIntBase62 = BigInt(63);

//the underscore _ at the start of both bases is a placeholder, so that words starting with the letter 'a' get encoded properly
//otherwise 'a' refers to 0 and is lost in encoding

//takes the encoded number and converts it to the string it was converted from
export function Decode(data) {
  let result = "";
  while (data > 0) {
    let r = data % BigIntBase26;
    result = BASE26[r] + result;
    data /= BigIntBase26;
  }
  return result;
}

//getting the array of exponential values from the string
//Example: kf -> [10,5] (a = index 0, b = 1, c = 2, ... f = 5 ....  k = 10)
export function stringToArray(s) {
  let stringArr = s.split("");
  let arr = stringArr.map((c) => BASE62.indexOf(c));
  return arr;
}

//getting the number from the array of exponential values using base conversion
//Example: [10,5] -> 63¹ * 10 + 63⁰ * 5 = 630 + 5 -> 635
export function arrayToNumber(arr) {
  let result = BigInt(0);
  arr.forEach((num, index) => {
    let multi = BigInt(1);

    //getting exponential value of multi, using a loop
    for (let i = 0; i < arr.length - index - 1; ++i) {
      multi = multi * BigIntBase62;
    }

    //below commented code doesn't work because BigInt gets a clipped value of int, losing data in the process
    //this is why we are manually calculating the exponential value
    // const multi = BigInt(base62 ** (arr.length - index - 1));

    result += BigInt(num) * multi;
  });
  return result;
}

//Combining all the three functions above, provides the original string from a short string

export function shortToLong(word) {
  let array = stringToArray(word);
  let value = arrayToNumber(array);
  let originalWord = Decode(value);
  return originalWord;
}

//output: "mozilla"
// console.log(shortToLong("eo4OsE"));

export default (req, res) => {
  const word = req.body.word;
  if (!word) {
    return res.status(400).end();
  }
  const originalWord = shortToLong(word);
  return res.send({ word: originalWord });
};
