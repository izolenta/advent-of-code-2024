const fs = require('fs');

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const readData = isReal => {
    const file = isReal ? './inputs/real.data' : './inputs/test.data';
    const data = fs.readFileSync(file, 'utf8').trim().split('\n');
    return { data, width: data[0].length, height: data.length };
}

const star1 = () => {
    const { data, width, height } = readData(true);
    const end = { x: width - 2, y: 1 };
    let queue = [{ x: 1, y: height - 2, direction: 1, score: 0 }];
    const visited = new Map();
    let min = Infinity;

    while (queue.length) {
        const newQueue = [];
        for (const current of queue) {
            if (current.x === end.x && current.y === end.y) {
                min = Math.min(min, current.score);
                continue;
            }

            const key = `${current.x},${current.y},${current.direction}`;
            if (visited.has(key) && visited.get(key) < current.score) continue;
            visited.set(key, current.score);

            const newX = current.x + directions[current.direction][0];
            const newY = current.y + directions[current.direction][1];

            if (data[newY][newX] !== '#') {
                newQueue.push({x: newX, y: newY, direction: current.direction, score: current.score + 1});
            }

            for (let i = 0; i < directions.length; i++) {
                if (i !== current.direction) {
                    newQueue.push({x: current.x, y: current.y, direction: i, score: current.score + 1000});
                }
            }
        }
        queue = newQueue;
    }
    return min;
}

let scores = [];

const floodFill2 = (data, x, y, direction, score, endX, endY, visited = new Map(), path = new Set()) => {
    if (data[y][x] === '#' || score > 150000 /* don't ask me why, it's AoC */) return;

    const currentPos = `${x},${y}`;
    const visitedKey = `${x},${y},${direction}`;

    if (visited.has(visitedKey) && visited.get(visitedKey) < score) return;

    visited.set(visitedKey, score);
    path.add(currentPos);

    if (x === endX && y === endY) {
        scores.push({ score, path: new Set(path) });
        return;
    }

    const nextX = x + directions[direction][0];
    const nextY = y + directions[direction][1];
    floodFill2(data, nextX, nextY, direction, score + 1, endX, endY, visited, new Set(path));

    for (let i = 0; i < directions.length; i++) {
        if (i === direction) continue;

        if (directions[i][0] === -directions[direction][0] &&
            directions[i][1] === -directions[direction][1]) continue;

        const newX = x + directions[i][0];
        const newY = y + directions[i][1];
        floodFill2(data, newX, newY, i, score + 1001, endX, endY, visited, new Set(path));
    }
};

const star2 = () => {
    const { data, width, height } = readData(true);
    const end = { x: width - 2, y: 1 };
    scores = [];
    floodFill2(data, 1, height - 2, 1, 0, end.x, end.y);

    const minScore = Math.min(...scores.map(s => s.score));
    const paths = scores.filter(s => s.score === minScore)
        .reduce((set, score) => {
            score.path.forEach(path => set.add(path));
            return set;
        }, new Set());

    return paths.size;
}

const main = () => {
    console.time('star1');
    console.log(`⚝: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⚝⚝: ${star2()}`);
    console.timeEnd('star2');
};

main();