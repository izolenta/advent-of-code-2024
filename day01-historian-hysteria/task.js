const fs = require('fs');

const readData = () => {
//    const inputData = fs.readFileSync('./inputs/test_input_star1.data', 'utf8');
    const inputData = fs.readFileSync('./inputs/real_input.data', 'utf8');
    const inputArray = inputData.split('\n');
    const leftArray = [];
    const rightArray = [];
    for (const next of inputArray) {
        const pair = next.split('   ');
        const a = parseInt(pair[0].trim());
        const b = parseInt(pair[1].trim());
        leftArray.push(a);
        rightArray.push(b);
    }
    return { leftArray, rightArray };
}

const star1 = () => {
    const { leftArray, rightArray } = readData();
    leftArray.sort();
    rightArray.sort();
    let res = 0
    for (let i = 0; i < leftArray.length; i++) {
        res += Math.abs(rightArray[i] - leftArray[i]);
    }
    return res;
}

const star2 = () => {
    const { leftArray, rightArray } = readData();
    let res = 0;
    for(let next of leftArray) {
        const rightCopy = [...rightArray];
        let times = 0
        while (rightCopy.indexOf(next) !== -1) {
            rightCopy.splice(rightCopy.indexOf(next), 1);
            times+=1;
        }
        res += next*times
    }
    return res
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