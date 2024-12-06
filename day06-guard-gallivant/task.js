const fs = require('fs');

const readData = () => {
   return fs.readFileSync('./inputs/real.data', 'utf8').split('\n');
};

const directions = [
    [0, -1], [1, 0], [0, 1], [-1, 0]
];

const getStartPosition = (map) => {
    for (let y = 0; y < map.length; y++) {
        const x = map[y].indexOf('^');
        if (x >= 0) return {x: x, y: y};
    }
    return {x: -1,  y: -1};
}

const star1 = () => {
    const map = readData();
    const [width, height] = [map[0].length, map.length];
    let {x, y} = getStartPosition(map)
    let direction = 0;
    const set = new Set();
    while (true) {
        set.add(`${x},${y}`);
        let newX = x + directions[direction][0];
        let newY = y + directions[direction][1];
        if (newX < 0 || newX >= width || newY < 0 || newY >= height) break;
        if (map[newY][newX] === '#') {
            direction = (direction + 1) % 4;
        }
        else {
            x = newX;
            y = newY;
        }
    }

    return set.size;
}

const star2 = () => {
    const map = readData();
    const [width, height] = [map[0].length, map.length];
    let res = 0;
    for (let i =0; i<height; i++) {
        for (let j =0; j<width; j++) {
            if (map[i][j] === '#' || map[i][j] === '^') continue;
            const obstMap = [...map];
            obstMap[i] = obstMap[i].substring(0, j) + '#' + obstMap[i].substring(j+1);
            let {x, y} = getStartPosition(map)
            let direction = 0;
            const set = new Set();
            while (true) {
                if (set.has(`${x},${y},${direction}`)) {
                    res += 1;
                    break;
                }
                set.add(`${x},${y},${direction}`);
                let newX = x + directions[direction][0];
                let newY = y + directions[direction][1];
                if (newX < 0 || newX >= width || newY < 0 || newY >= height) break;
                if (obstMap[newY][newX] === '#') {
                    direction = (direction + 1) % 4;
                }
                else {
                    x = newX;
                    y = newY;
                }
            }
        }
    }
    return res;
}

const main = () => {
    console.time('star1');
    console.log(star1());
    console.timeEnd('star1');
    console.time('star2');
    console.log(star2());
    console.timeEnd('star2');
};

main();