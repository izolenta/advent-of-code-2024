const fs = require('fs');

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const readData = isReal => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8')
        .trim().split('\n').map(line => {
            const [x, y] = line.split(',');
            return {x: parseInt(x), y: parseInt(y)};
        });
    return { data, dimension: isReal ? 71 : 7 };
};

const findShortestPath = (data, start, end, dimension) => {
    const obstacles = new Set(data.map(({ x, y }) => `${x},${y}`));
    const queue = [{ ...start, distance: 0 }];
    const visited = new Set([`${start.x},${start.y}`]);
    const parentMap = new Map([[`${start.x},${start.y}`, null]]);

    const reconstructPath = (current) => {
        const path = [];
        while (current) {
            path.unshift({ x: current.x, y: current.y });
            current = parentMap.get(`${current.x},${current.y}`);
        }
        return path;
    };

    while (queue.length) {
        const current = queue.shift();

        if (current.x === end.x && current.y === end.y) {
            return reconstructPath(current);
        }

        for (const [dx, dy] of directions) {
            const newX = current.x + dx;
            const newY = current.y + dy;

            if (newX < 0 || newX >= dimension || newY < 0 || newY >= dimension) continue;

            const newPos = `${newX},${newY}`;
            if (obstacles.has(newPos) || visited.has(newPos)) continue;

            visited.add(newPos);
            queue.push({ x: newX, y: newY, distance: current.distance + 1 });
            parentMap.set(newPos, current);
        }
    }
    return [];
};

const star1 = () => {
    const real = true;
    const { data, dimension } = readData(real);
    const res = findShortestPath(data.slice(0, real ? 1024 : 12), {x: 0, y: 0}, {x: dimension-1, y: dimension-1}, dimension);
    return res.length - 1;
};

const star2 = () => {
    const real = true;
    const { data, dimension } = readData(real);
    const toSlice = real ? 1024 : 12;

    for (let index = toSlice + 1; index < data.length; index++) {
        const res = findShortestPath(data.slice(0, index), {x: 0, y: 0}, {x: dimension-1, y: dimension-1}, dimension);
        if (!res.length) {
            const point = data[index-1];
            return `${point.x},${point.y}`;
        }
    }
    return '-1,-1';
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