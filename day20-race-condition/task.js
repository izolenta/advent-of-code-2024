const fs = require('fs');

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const readData = isReal => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8').trim().split('\n');
    const start = {}, end = {};

    for (let y = 0; y < data.length; y++) {
        const sIndex = data[y].indexOf('S');
        const eIndex = data[y].indexOf('E');
        if (sIndex !== -1) [start.x, start.y] = [sIndex, y];
        if (eIndex !== -1) [end.x, end.y] = [eIndex, y];
    }

    return {data, width: data[0].length, height: data.length, start, end};
};

const findShortestPath = (data, start, end, [width, height]) => {
    const queue = [{...start, distance: 0}];
    const visited = new Set([`${start.x},${start.y}`]);
    const parents = new Map([[`${start.x},${start.y}`, null]]);

    while (queue.length) {
        const curr = queue.shift();
        if (curr.x === end.x && curr.y === end.y) {
            const path = [];
            let node = curr;
            while (node) {
                path.unshift({x: node.x, y: node.y});
                node = parents.get(`${node.x},${node.y}`);
            }
            return path;
        }

        for (const [dx, dy] of directions) {
            const x = curr.x + dx, y = curr.y + dy;
            const key = `${x},${y}`;

            if (x < 0 || x >= width || y < 0 || y >= height || data[y][x] === '#' || visited.has(key)) continue;

            visited.add(key);
            queue.push({x, y, distance: curr.distance + 1});
            parents.set(key, curr);
        }
    }
    return [];
};

const star1 = () => {
    const {data, width, height, start, end} = readData(true);
    const path = findShortestPath(data, start, end, [width, height]);
    const minSave = 102;
    let res = 0;

    for (let i = 0; i < path.length - minSave; i++) {
        for (let j = i + minSave; j < path.length; j++) {
            if (Math.abs(path[i].x - path[j].x) + Math.abs(path[i].y - path[j].y) <= 2) res++;
        }
    }
    return res;
};

const star2 = () => {
    const {data, width, height, start, end} = readData(true);
    const path = findShortestPath(data, start, end, [width, height]);
    const minSave = 100;
    let res = 0;

    for (let i = 0; i < path.length - minSave; i++) {
        for (let j = i + minSave; j < path.length; j++) {
            const diff = Math.abs(path[i].x - path[j].x) + Math.abs(path[i].y - path[j].y);
            if (diff <= 20 && j - i - diff >= minSave) res++;
        }
    }
    return res;
};

const main = () => {
    console.time('star1');
    console.log(`🎄: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`🎄🎄: ${star2()}`);
    console.timeEnd('star2');
};

main();