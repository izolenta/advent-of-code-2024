const fs = require('fs');

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
]

const readData = isReal => {
    return fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8').trim().split('\n');
};

function findShortestPaths(startX, startY, endX, endY) {
    const paths = [];
    let shortestLength = Infinity;
    const visited = new Set();

    function getButtonAt(x, y) {
        return codePad.find(button => button.x === x && button.y === y);
    }

    function getNeighbors(x, y) {
        const directions = [[-1, 0, '<'], [0, 1, 'v'], [1, 0, '>'], [0, -1, '^']];

        return directions
            .map(([dx, dy, symbol]) => ({x: x + dx, y: y + dy, move: symbol}))
            .filter(pos => getButtonAt(pos.x, pos.y));
    }

    function dfs(currentX, currentY, path) {
        if (path.length > shortestLength) {
            return;
        }

        if (currentX === endX && currentY === endY) {
            if (path.length < shortestLength) {
                paths.length = 0;
                shortestLength = path.length;
            }
            if (path.length > 0) {
                paths.push(path.join(''));
            }
            return;
        }

        const neighbors = getNeighbors(currentX, currentY);

        for (const neighbor of neighbors) {
            const posKey = `${neighbor.x},${neighbor.y}`;

            if (!visited.has(posKey)) {
                visited.add(posKey);
                path.push(neighbor.move);

                dfs(neighbor.x, neighbor.y, path);

                path.pop();
                visited.delete(posKey);
            }
        }
    }

    const startButton = getButtonAt(startX, startY);
    const endButton = getButtonAt(endX, endY);

    if (!startButton || !endButton) {
        return paths;
    }

    const startPosKey = `${startX},${startY}`;
    visited.add(startPosKey);
    dfs(startX, startY, []);

    return paths;
}

const getButtonSequence = (data, depth = 2) => {
    let {x, y} = { x: 2, y: 3 };
    let res = 0;
    for (let next of data) {
        let path = [];
        for (let sym of next.split('')) {
            const button = codePad.find(button => button.button === sym);
            let paths = findShortestPaths(x, y, button.x, button.y).map(path => path+'A');
            let shortest = Infinity
            let shortestPath = '';
            for (let p of paths) {
                let indepth = p;
                for (let i=0; i<depth; i++) {
                    console.log(i)
                    indepth  = getNumpadSequence(indepth)
                }
                if (indepth.length < shortest) {
                    shortest = indepth.length;
                    shortestPath = p;
                }
            }
            x = button.x;
            y = button.y;
            path.push(shortestPath);
        }
        let indepth = path.join('');
        for (let i=0; i<depth; i++) {
            console.log(indepth)
            indepth  = getNumpadSequence(indepth)
        }
        console.log(next)
        console.log(path.join(''))
        console.log(indepth)
        res += parseInt(next)*indepth.length;
    }
    return res;
}

const cache = new Map();

const getNumpadSequence = (data) => {
    let path = [];
    let x = 2;
    let y = 0;
    const aStrings = data.split(/(?<=A)/);
    for (let str of aStrings) {
        if (cache.has(str)) {
            path.push(cache.get(str))
            continue;
        }
        let val = '';
        for (let sym of str.split('')) {
            const button = actionPad.find(button => button.button === sym);
            const difx = x - button.x;
            const dify = y - button.y;
            if (button.x === 0) {
                for (let i=0;i<Math.abs(dify);i++) {
                    const add = dify < 0? 'v': '^'
                    path.push(add)
                    val+=add
                }
                for (let i=0;i<Math.abs(difx);i++) {
                    const add = difx < 0? '>': '<';
                    val+=add
                    path.push(add)
                }
            }
            else {
                for (let i=0;i<Math.abs(difx);i++) {
                    const add = difx < 0? '>': '<';
                    val+=add
                    path.push(add)
                }
                for (let i=0;i<Math.abs(dify);i++) {
                    const add = dify < 0? 'v': '^'
                    path.push(add)
                    val+=add
                }
            }
            path.push('A');
            val+='A';
            x = button.x;
            y = button.y;
        }
        cache.set(str, val);
    }
    return path.join('');
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