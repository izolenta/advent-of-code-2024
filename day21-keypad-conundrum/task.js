const fs = require('fs');

const directions = {
    '<': [-1, 0],
    '>': [1, 0],
    '^': [0, -1],
    'v': [0, 1]
};

const codePad = [
    {button: '7', x:0, y:0},
    {button: '8', x:1, y:0},
    {button: '9', x:2, y:0},
    {button: '4', x:0, y:1},
    {button: '5', x:1, y:1},
    {button: '6', x:2, y:1},
    {button: '1', x:0, y:2},
    {button: '2', x:1, y:2},
    {button: '3', x:2, y:2},
    {button: '0', x:1, y:3},
    {button: 'A', x:2, y:3},
];

const actionPad = [
    {button: '^', x:1, y:0},
    {button: 'A', x:2, y:0},
    {button: 'v', x:1, y:1},
    {button: '<', x:0, y:1},
    {button: '>', x:2, y:1},
];

const readData = isReal => {
    return fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8').trim().split('\n');
};

function findShortestPaths(start, end, keypadSize, blockedCell = null) {
    const shortestPaths = [];
    let shortestDistance = Infinity;

    const queue = [{ cell: start, path: '', distance: 0 }];

    const bestDistForCell = new Map();
    bestDistForCell.set(start.toString(), 0);

    while (queue.length) {
        const { cell, path, distance } = queue.shift();
        const [x, y] = cell;

        if (x === end[0] && y === end[1]) {
            if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestPaths.length = 0; // clear old paths
                shortestPaths.push(path);
            } else if (distance === shortestDistance) {
                shortestPaths.push(path);
            }
            continue;
        }

        if (distance >= shortestDistance) {
            continue;
        }

        for (const [dir, [dx, dy]] of Object.entries(directions)) {
            const newX = x + dx;
            const newY = y + dy;
            if (
                newX >= 0 && newX < keypadSize[0] &&
                newY >= 0 && newY < keypadSize[1] &&
                !(blockedCell && newX === blockedCell[0] && newY === blockedCell[1])
            ) {
                const newCell = [newX, newY];
                const nextDistance = distance + 1;

                const prevDistance = bestDistForCell.get(newCell.toString());
                if (
                    prevDistance === undefined ||
                    nextDistance <  prevDistance ||
                    nextDistance === prevDistance
                ) {
                    bestDistForCell.set(newCell.toString(), nextDistance);
                    queue.push({
                        cell: newCell,
                        path: path + dir,
                        distance: nextDistance
                    });
                }
            }
        }
    }

    return shortestPaths;
}

const getButtonSequence = (data, depth = 2) => {
    let {x, y} = { x: 2, y: 3 };
    let res = 0;
    for (let next of data) {
        let path = [];
        for (let sym of next.split('')) {
            const button = codePad.find(button => button.button === sym);
            let paths = findShortestPaths([x, y], [button.x, button.y], [3, 4], [0, 3]).map(path => path+'A');
            let shortest = Infinity
            let shortestPath = '';
            for (let p of paths) {
                let indepth  = calcNumpadSequenceLength(p, depth)
                if (indepth < shortest) {
                    shortest = indepth;
                    shortestPath = p;
                }
            }
            x = button.x;
            y = button.y;
            path.push(shortestPath);
        }
        let indepth  = calcNumpadSequenceLength(path.join(''), depth)
        console.log(next)
        console.log(path.join(''))
        console.log(indepth)
        res += parseInt(next)*indepth;
    }
    return res;
}

const cache = new Map();

const calcNumpadSequenceLength = (data, maxDepth, depth = 0,  depthCache = new Map()) => {
    if (depthCache.has(`${data}-${depth}`)) {
        return depthCache.get(`${data}-${depth}`);
    }
    let sum = 0;
    const aStrings = data.split(/(?<=A)/);
    for (let str of aStrings) {
        let x = 2;
        let y = 0;
        let val = '';
        for (let sym of str.split('')) {
            const button = actionPad.find(button => button.button === sym);
            const difx = x - button.x;
            const dify = y - button.y;
            if (button.x === 0) {
                for (let i=0;i<Math.abs(dify);i++) {
                    const add = dify < 0? 'v': '^'
                    val+=add
                }
                for (let i=0;i<Math.abs(difx);i++) {
                    const add = difx < 0? '>': '<';
                    val+=add
                }
            }
            else {
                for (let i=0;i<Math.abs(difx);i++) {
                    const add = difx < 0? '>': '<';
                    val+=add
                }
                for (let i=0;i<Math.abs(dify);i++) {
                    const add = dify < 0? 'v': '^'
                    val+=add
                }
            }
            val+='A';
            x = button.x;
            y = button.y;
        }
        if (depth === maxDepth-1) {
            sum+=val.length;
        }
        else {
            sum+=calcNumpadSequenceLength(val, maxDepth, depth+1, depthCache)
        }
    }
    depthCache.set(`${data}-${depth}`, sum);
    return sum;
}

const star1 = () => {
    const data = readData(true);
    return getButtonSequence(data);
};

const star2 = () => {
    const data = readData(true);
    return getButtonSequence(data, 25);
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