const fs = require('fs');

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const readData = () => {
    const data = fs.readFileSync('./inputs/real.data', 'utf8').trim().split('\n');
    return { data, width: data[0].length, height: data.length };
}

const makeKey = (x, y) => `${x},${y}`;

const processBlocks = (data, width, height, processor) => {
    const handled = new Set();
    const blocks = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (handled.has(makeKey(x, y))) continue;

            const plant = data[y][x];
            const block = [];
            const queue = [{x, y}];
            let qIndex = 0;

            handled.add(makeKey(x, y));

            while (qIndex < queue.length) {
                const current = queue[qIndex++];
                block.push(current);

                for (const [dx, dy] of directions) {
                    const newX = current.x + dx;
                    const newY = current.y + dy;
                    const key = makeKey(newX, newY);

                    if (newX >= 0 && newX < width &&
                        newY >= 0 && newY < height &&
                        !handled.has(key) &&
                        data[newY][newX] === plant) {
                        handled.add(key);
                        queue.push({x: newX, y: newY});
                    }
                }
            }
            blocks.push(block);
        }
    }

    return blocks.reduce((acc, block) => acc + processor(block) * block.length, 0);
}

const calcPerimeter = (block) => {
    const blockSet = new Set(block.map(({x, y}) => makeKey(x, y)));
    return block.reduce((res, {x, y}) => {
        return res + directions.reduce((sum, [dx, dy]) =>
            sum + (blockSet.has(makeKey(x + dx, y + dy)) ? 0 : 1), 0);
    }, 0);
}

const calcNumberOfPolygonCorners = (blocks) => {
    const walls = new Set();
    const wallDirections = [
        [-1, 0, 'v'],
        [1, 0, 'v'],
        [0, -1, 'h'],
        [0, 1, 'h']
    ];

    const blockSet = new Set(blocks.map(({x, y}) => makeKey(x, y)));

    blocks.forEach(({x, y}) => {
        wallDirections.forEach(([dx, dy, dir]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (!blockSet.has(makeKey(nx, ny))) {
                const wallKey = dir === 'v'
                    ? `${dx > 0 ? x + 1 : x},${y},v`
                    : `${x},${dy > 0 ? y + 1 : y},h`;
                walls.add(wallKey);
            }
        });
    });

    let corners = 0;
    const handled = new Set();

    for (const wall of walls) {
        if (handled.has(wall)) continue;

        const [xStr, yStr, dir] = wall.split(',');
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);

        if (dir === 'v') {
            corners += (walls.has(`${x},${y},h`) || walls.has(`${x-1},${y},h`) ? 1 : 0) +
                (walls.has(`${x},${y+1},h`) || walls.has(`${x-1},${y+1},h`) ? 1 : 0);
        } else {
            corners += (walls.has(`${x},${y},v`) || walls.has(`${x},${y-1},v`) ? 1 : 0) +
                (walls.has(`${x+1},${y},v`) || walls.has(`${x+1},${y-1},v`) ? 1 : 0);
        }

        handled.add(wall);
    }

    return corners / 2;
}

const star1 = () => {
    const {data, width, height} = readData();
    return processBlocks(data, width, height, calcPerimeter);
}

const star2 = () => {
    const {data, width, height} = readData();
    return processBlocks(data, width, height, calcNumberOfPolygonCorners);
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