const fs = require('fs');

const readData = () => fs.readFileSync('./inputs/real.data', 'utf8').trim().split(' ').map(Number);

const splitNumber = (num) => {
    if (num === 0) return [1];
    if (`${num}`.length % 2 === 0) {
        const half = `${num}`.length / 2;
        return [
            parseInt(`${num}`.slice(0, half)),
            parseInt(`${num}`.slice(half))
        ];
    }
    return [num * 2024];
};

const solution = (steps) => {
    let mapArr = new Map();
    readData().forEach(a => mapArr.set(a, (mapArr.get(a) || 0) + 1));
    const cacheSplit = new Map();
    for (let i = 0; i < steps; i++) {
        const nextMap = new Map();

        for (const [key, value] of mapArr) {
            if (!cacheSplit.has(key)) {
                cacheSplit.set(key, splitNumber(key));
            }

            for (const newNum of cacheSplit.get(key)) {
                nextMap.set(newNum, (nextMap.get(newNum) || 0) + value);
            }
        }
        mapArr = nextMap;
    }
    return Array.from(mapArr.values()).reduce((a, b) => a + b, 0);
};

const star1 = () => solution(25);
const star2 = () => solution(75);

const main = () => {
    console.time('star1');
    console.log(`⚝: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⚝⚝: ${star2()}`);
    console.timeEnd('star2');
};

main();