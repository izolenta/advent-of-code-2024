const fs = require('fs');

const decimalToSnafu = (decimal) => {
    let maxPow = 1
    while (Math.floor(decimal / maxPow) > 0) {
        maxPow *= 5;
    }
    console.log(maxPow);
    maxPow = Math.floor(maxPow / 5);
    let res = '';
    let nextDigit = 0;
    let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let index = 10;
    while (true) {
        if (maxPow < 5) {
            break;
        }
        nextDigit = Math.floor(decimal / maxPow);
        if (nextDigit > 2) {
            arr[index - 1] += 1;
        }
        arr.push(nextDigit);
        decimal -= nextDigit * maxPow;
        console.log(maxPow)
        maxPow = Math.floor(maxPow / 5);
        index += 1;
    }
    arr.push(decimal);
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        let index = i
        while (arr[index] === 5) {
            arr[index] = 0;
            index -= 1;
            arr[index] += 1;
        }
    }

    while (arr[0] === 0) {
        arr = arr.slice(1);
    }
    console.log(arr);
    for (let next of arr) {
        if (next === 0) {
            res += '0';
        }
        else if (next === 1) {
            res += '1';
        }
        else if (next === 2) {
            res += '2';
        }
        else if (next === 4) {
            res += '-';
        }
        else if (next === 3) {
            res += '=';
        }
        else {
            throw new Error('Invalid digit');
        }
    }
    return res;
}

const snafuToDecimal = (snafu) => {
    let res = 0;
    let power = 1
    for (let i = snafu.length - 1; i >= 0; i--) {
        let digit = parseInt(snafu[i]);
        if (isNaN(digit)) {
            if (snafu[i] === '-') {
                digit = -1;
            }
            else if (snafu[i] === '=') {
                digit = -2;
            }
            else {
                throw new Error('Invalid character in snafu number');
            }
        }
        res+=digit*power;
        power *=5;
    }
    return res;
}

function main() {
    const inputData = fs.readFileSync('./inputs/test.data', 'utf8');
    const inputArray = inputData.split('\n');
    let res = 0
    for (let next of inputArray) {
        res += snafuToDecimal(next);
    }
    console.log(res);
    console.log(decimalToSnafu(res));

    // console.log(snafuToDecimal('1121-1110-1=0'))
    // console.log(decimalToSnafu(314159265))
    // console.log('expected 1121-1110-1=0')
}
main();