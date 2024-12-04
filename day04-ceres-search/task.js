const fs = require('fs');
const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
const word = "XMAS";

const readData = () => {
    const arr = fs.readFileSync('./inputs/real.data', 'utf8').split('\n');
    return arr;
}

const star1 = () => {
    const input = readData();
    const len = input[0].length;
    const height = input.length;
    let res = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < len; j++) {
            if (input[i][j] === word[0]) {
                for (const [dx, dy] of directions) {
                    let x = j, y = i;
                    let k = 1;
                    while (k < word.length) {
                        x += dx;
                        y += dy;
                        if (x < 0 || x >= len || y < 0 || y >= height || input[y][x] !== word[k]) {
                            break;
                        }
                        k++;
                    }
                    if (k === word.length) {
                        res++;
                    }
                }
            }
        }
    }
    return res;
}

const star2 = () => {
    const input = readData();
    const len = input[0].length;
    const height = input.length;
    let res = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < len; j++) {
            if (i === 0 || j === 0 || i === height - 1 || j === len - 1 || input[i][j] !== "A") {
                continue;
            }
            if ((input[i-1][j-1] === "M" && input[i+1][j+1] === "S" || input[i-1][j-1] === "S" && input[i+1][j+1] === "M") &&
                (input[i+1][j-1] === "S" && input[i-1][j+1] === "M" || input[i+1][j-1] === "M" && input[i-1][j+1] === "S")) {
                res++;
            }
        }
    }
    return res;
}

const main = () => {
    const watch1 = Date.now();
    console.log(star1());
    console.log(`${Date.now() - watch1}ms`);
    const watch2 = Date.now();
    console.log(star2());
    console.log(`${Date.now() - watch2}ms`);
}

main();