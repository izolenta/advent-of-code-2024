const fs = require('fs');
const math = require('mathjs');

const readData = () => fs.readFileSync('./inputs/real.data', 'utf8').trim().split('\n\n')
    .map(block => {
        const [, ...nums] = block.match(/Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/);
        return nums.map(Number);
    });

const solve = (data, offset = 0) => data.reduce((sum, [a1, a2, b1, b2, x, y]) => {
    const solution = math.lusolve([[a1, b1], [a2, b2]], [x + offset, y + offset]);
    const [n1, n2] = solution.map(n => Math.round(n[0]));

    if (Math.abs(n1 - solution[0][0]) <= 0.0001 &&
        Math.abs(n2 - solution[1][0]) <= 0.0001 &&
        n1 >= 0 && n2 >= 0 &&
        (offset || (n1 <= 100 && n2 <= 100))) {
        return sum + n1 * 3 + n2;
    }
    return sum;
}, 0);

const star1 = () => solve(readData());
const star2 = () => solve(readData(), 10000000000000);

const main = () => {
    console.time('star1');
    console.log(`⚝: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⚝⚝: ${star2()}`);
    console.timeEnd('star2');
};

main();