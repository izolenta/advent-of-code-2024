const fs = require('fs');


const readData = () => {
    const inputData = fs.readFileSync('./inputs/real.data', 'utf8');
    const inputArray = inputData.split('\n');
    const leftArray = [];
    for (const next of inputArray) {
        const arr = next.split(' ').map(x => parseInt(x));
        leftArray.push(arr);
    }
    return leftArray;
}

const checkSafe = (arr) => {
    const sign = Math.sign(arr[1] - arr[0]);
    if (sign === 0) return false;

    for (let j = 1; j < arr.length; j++) {
        if (Math.sign(arr[j] - arr[j - 1]) !== sign || Math.abs(arr[j] - arr[j - 1]) > 3) {
            return false;
        }
    }
    return true;
}

const star1 = () => {
    const leftArray = readData();
    let res = 0
    for (let i = 0; i < leftArray.length; i++) {
        if (checkSafe(leftArray[i])) res+=1;
    }
    return res;
}

const star2 = () => {
    const leftArray = readData();
    let res = 0
    for (let i = 0; i < leftArray.length; i++) {
        if (checkSafe(leftArray[i])) {
            res+=1;
            continue
        }
        for (let j = 0; j < leftArray[i].length; j++) {
            const copy = [...leftArray[i]];
            copy.splice(j, 1);
            if (checkSafe(copy)) {
                res+=1;
                break;
            }
        }
    }
    return res;
}

function main() {
    const watch1 = new Date().getTime()
    console.log(star1());
    console.log(`${new Date().getTime() - watch1}ms`)
    const watch2 = new Date().getTime()
    console.log(star2());
    console.log(`${new Date().getTime() - watch2}ms`)
}

main();
