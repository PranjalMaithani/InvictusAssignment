[Online demo here](https://invictus-assignment.vercel.app/)

`yarn` and `yarn dev` to run the application <br />
`yarn test` to run tests

## Stack used:
* NextJS - both backend and frontend
* Jest & Testing Library - tests

## The Algorithm

Strings are converted to shorter strings using type conversion. This uses the same logic as converting a decimal number to binary or hexadecimal to decimal and so on. 
The user inputs a base26 string(only lowercase letters a-z, a total of 26 characters) which gets converted to base63(alphanumeric: a-z,A-Z,0-9,\_, a total of 63 characters). This results in a shorter length string automatically. This shorter string can be processed back to the base26 string using type conversion, making it lossless.

### The process of the algorithm

Example word: 'cat'

* Encoding the string from base26 to base10(decimal number system, 0-9). This is done to be able to apply mathematical calculations. 'cat' is split into a character array `['c','a','t']`. The positions(not index) of these characters in the base26 array then define their numerical value. So 'cat' becomes `[3,1,20]`. Then using type conversion, this array is converted into a number, with the array values being used as multiples like below:

Our base26 array looks like `[_, a-z]`, making it a total of 27 characters instead of 26. Why? We'll come back to this later. But this is the reason for the number 27 below, instead of 26

`[3, 1, 20]` -> `27² × 3 + 27¹ × 1 + 27⁰ × 20` -> `2234`

This is also how binary numbers(base 2) can be converted to decimal numbers(base 10). Just replace 27 with 2 and the array with the binary number.
Example: `110` -> `[1,1,0]` -> `2² × 1 + 2¹ × 1 + 2⁰ × 0` -> `6`

* Converting from base10(decimal) to base63(alphanumeric) and storing the variables in an array. To convert the base10 number to base 63, the process is as thus
  * Divide the number by 63
  * The resulting remainder is stored in an array
  * Repeat the process until the number reaches 0
  * Finally reverse the array.

So our 'cat' number gives us this array
`2234` -> `[35, 29] (after reversing)`

Once again, this is how base10 numbers can be converted back to binary

* Then taking our base63 array which is as follows `[_a-zA-Z0-9]` this array is converted into a string. The numbers in the array decide the index of the character to be used in the string. So 'a' becomes 1, 'b' becomes 2, \_ becomes 0.

`[35, 29]` -> `'IC'`

This gives us 'IC' as the resulting shorter string for 'cat'

### Reverse Process

This short string can be converted back to its original string as well, using the reverse of the above process.
Example : 'IC'

* Convert the string to numbers, depending on their index in the base63 array. So 'IC' becomes `[35, 29]`.
* The array is converted to a number using type conversion. Just like how we converted base26 to base10. So using base63 to base10 conversion

`[35, 29]` -> `63¹ × 35 + 63⁰ × 29` -> `2234`

* Finally the base10 number is converted to base26, which results in the original word. The process is similar to converting from base 10 to base 63
  * Take an empty string to start with
  * Divide the number by 27 (our base26 array actually has 27 characters instead of 26)
  * The resulting remainder's value is used as the index of the character in the array. For a value of 1 it returns 'a', for 2 it returns 'b' and so on.
  * Add this character to the start of the string
  * Repeat this process until the number reaches 0

`2234` -> `remainders = [3,1,20]` -> `'cat'`

## Code Components

### longToShort.js

Reponsible for converting the string to a shorter string. This has the following functions: 
* Encode: Encodes the word to a base10 number, as explained before in the algorithm process.
* numberToBaseArray: Using base10 to base63 type conversion, returns an array of numbers. This can be converted back to the base10 number. The numbers are the 'remainders' which result from looped division of the number.
* arrayToString: Takes the array from `numberToBaseArray` and returns a string. The array numbers decide the index of the character to be picked up from the alphanumeric array `[_,a-z,A-Z,0-9]`. Example: `[3,0,1,20]` becomes 'c_at', since c is the third character in the array, \_ is the first, and so on.

### shortToLong.js

Responsible for converting the shorter string back to the original string. This has the following functions:
* stringToArray: Converts the shorter string to an array of numbers. The numbers are the indexes of the characters in the alphanumeric array `[_,a-z,A-Z]`.
* arrayToNumber: Converts the array to a base10 number using type conversion, as explained before in the  'Reverse Process'
* Decode: Decodes a base10 number to a base26 string - the original string. Uses base10 to base26 conversion, as explained before in 'Reverse Process'.

### pages/index.js

The frontend of the application. Uses controlled input to make sure the user can only input a lowercase string as the original string and only an alphanumeric string in the shorter string version. Displays a message to convey this information.


## \_\_tests\_\_ 

`yarn test` to run all tests

### Frontend tests:
* Cannot enter an invalid value in 'original' field. Only lowercase letters a-z allowed
* Cannot enter an invalid value in 'shorter' field. Only alphanumeric characters a-zA-Z0-9 allowed
* UI and app is working with data received from the server. Uses mock functions to resolve returned data from a server.

### Backend tests:
* longToShort returns a string of shorter length than original, and 'less than or equal' if it is 2 or less characters
* longToShort returns a string which can be restored back to the original using shortToLong. Takes an array of data for testing with different parameters. Currently we are testing with the following array `[
  ["mozilla"],
  ["firefox"],
  ["chrome"],
  ["react"],
  ["jest"],
  ["go"],
  ["unity"],]`
* longToShort and shortToLong work for long length strings. Example: `mozillafirefoxbutreallylongfortestinglongstrings`. Currently this app uses BigInts for numbers. Earlier, when not using big ints, long strings would lose data in the decoding process. This test ensures it doesn't happen again.
* Encoding and Decoding are bidirectional
* Array to number is working correctly. `[10,5]` -> `635` using base63 to base10 conversion
* Number to array is working correctly. Reverse of array to number.
* Number to array and array to number are bidirectional
* Array to string and string to array are bidirectional and correct. `[3,1,20]` <-> `'cat'`
* longToShort and shortToLong work for words starting with 'a'. 

## Why 27 characters in the base26 array?

When using this algorithm with 26 characters `[a-z]` in the base26 array, I found out when converting words that start with the letter 'a', they don't get encoded properly. 'aaac' would result in 'c' which converts back to 'c'. All the 'a's were lost! <br />
The reason was that 'a' represents 0 in our base26 and so gets lost in the encoding process of the algorithm. To solve this problem I introduced \_ at the 0 index of the base26 array. Since we are not allowing the user to type in anything but lowercase letters, this \_ will pop up in the shorter strings only.

![All tests passing!](https://i.imgur.com/In8QJPf.png)
