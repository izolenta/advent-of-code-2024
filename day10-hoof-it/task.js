const fs = require('fs');

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const readData = () => {
    const data = fs.readFileSync('./inputs/real.data', 'utf8').trim().split('\n');
    const width = data[0].length;
    const height = data.length;
    const starts = [];

    for (let y = 0; y < height; y++) {
        const row = data[y];
        const indices = [...row.matchAll(/0/g)].map(match => [match.index, y]);
        starts.push(...indices);
    }

    return { data, width, height, starts };
}

const findPaths = (data, width, height, x, y, distinct) => {
    const paths = distinct ? new Set() : [];
    const queue = [[x, y, 0]];
    let queueIndex = 0;

    while (queueIndex < queue.length) {
        const [x, y, current] = queue[queueIndex++];

        if (current === 9) {
            const path = `${x},${y}`;
            distinct ? paths.add(path) : paths.push(path);
            continue;
        }

        const nextVal = `${current + 1}`;
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < width &&
                newY >= 0 && newY < height &&
                data[newY][newX] === nextVal) {
                queue.push([newX, newY, current + 1]);
            }
        }
    }

    return distinct ? paths.size : paths.length;
}

const solve = distinct => {
    const { data, width, height, starts } = readData();
    return starts.reduce((sum, [x, y]) =>
        sum + findPaths(data, width, height, x, y, distinct), 0);
}

const star1 = () => solve(true);
const star2 = () => solve(false);

const main = () => {
    console.time('star1');
    console.log(`⚝: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⚝⚝: ${star2()}`);
    console.timeEnd('star2');
};

main();