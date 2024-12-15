const fs = require('fs');

const directions = new Map([
    ['^', {x: 0, y: -1}],
    ['v', {x: 0, y: 1}],
    ['<', {x: -1, y: 0}],
    ['>', {x: 1, y: 0}]
]);

const readData = (isReal, isStar2 = false) => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8').trim().split('\n\n');
    const moves = data[1].split('\n').join('');
    const objects = [];
    const lab = data[0].split('\n');
    const width = lab[0].length;
    const height = lab.length;
    let start = {x: 0, y: 0};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (lab[y][x] === '#') {
                if (isStar2) {
                    objects.push({x: x*2, y, type: lab[y][x]});
                    objects.push({x: x*2+1, y, type: lab[y][x]});
                } else {
                    objects.push({x, y, type: lab[y][x]});
                }
            }
            if (lab[y][x] === 'O') {
                objects.push({x: isStar2 ? x*2 : x, y, type: lab[y][x]});
            }
            if (lab[y][x] === '@') {
                start = {x: isStar2 ? x*2 : x, y};
            }
        }
    }
    return { moves, objects, start, width: isStar2 ? width*2 : width, height };
}

const getObjectAt = (objects, x, y, isStar2 = false) => {
    for (const object of objects) {
        if (object.x === x && object.y === y) {
            return object;
        }
        if (isStar2 && object.type === 'O' && object.y === y && (object.x === x || object.x === x - 1)) {
            return object;
        }
    }
    return null;
}

const attemptToMove = (objects, object, dx, dy) => {
    const newX = object.x + dx;
    const newY = object.y + dy;
    const newObject = getObjectAt(objects, newX, newY);
    if (!newObject) {
        object.x = newX;
        object.y = newY;
        return true;
    }
    if (newObject.type === '#') return false;
    if (newObject.type === 'O' && attemptToMove(objects, newObject, dx, dy)) {
        object.x = newX;
        object.y = newY;
        return true;
    }
    return false;
}

const star1 = () => {
    const { moves, objects, start } = readData(true);
    let { x, y } = start;
    for (const move of moves) {
        const { x: dx, y: dy } = directions.get(move);
        const newX = x + dx;
        const newY = y + dy;
        const object = getObjectAt(objects, newX, newY);
        if (!object) {
            x = newX;
            y = newY;
            continue;
        }
        if (object.type === '#') continue;
        if (object.type === 'O' && attemptToMove(objects, object, dx, dy)) {
            x = newX;
            y = newY;
        }
    }
    return objects.reduce((res, obj) => res + (obj.type === 'O' ? obj.y * 100 + obj.x : 0), 0);
}

const attemptToMoveHorizontallyDoubledBlocks = (objects, object, dx, dy, test = false) => {
    const newX = object.x + dx;
    const newY = object.y + dy;

    if (dy === 0) {
        const newObject = getObjectAt(objects, dx === 1 ? newX + 1 : newX, newY, true);
        if (!newObject) {
            object.x = newX;
            return true;
        }
        if (newObject.type === '#') return false;
        if (newObject.type === 'O' && attemptToMoveHorizontallyDoubledBlocks(objects, newObject, dx, dy, test)) {
            if (!test) object.x = newX;
            return true;
        }
    } else {
        const newObject1 = getObjectAt(objects, newX, newY, true);
        const newObject2 = getObjectAt(objects, newX + 1, newY, true);
        if (!newObject1 && !newObject2) {
            if (!test) {
                object.x = newX;
                object.y = newY;
            }
            return true;
        }
        if ((newObject1 && newObject1.type === '#') || (newObject2 && newObject2.type === '#')) return false;
        if (newObject1 === newObject2 && attemptToMoveHorizontallyDoubledBlocks(objects, newObject1, dx, dy, test)) {
            if (!test) {
                object.x = newX;
                object.y = newY;
            }
            return true;
        }
        if ((!newObject1 || attemptToMoveHorizontallyDoubledBlocks(objects, newObject1, dx, dy, true)) &&
            (!newObject2 || attemptToMoveHorizontallyDoubledBlocks(objects, newObject2, dx, dy, true))) {

            if (newObject1) attemptToMoveHorizontallyDoubledBlocks(objects, newObject1, dx, dy, test);
            if (newObject2) attemptToMoveHorizontallyDoubledBlocks(objects, newObject2, dx, dy, test);
            if (!test) {
                object.x = newX;
                object.y = newY;
            }
            return true;
        }
    }
    return false;
};

const star2 = () => {
    const { moves, objects, start } = readData(true, true);
    let { x, y } = start;

    for (const move of moves) {
        const { x: dx, y: dy } = directions.get(move);
        const newX = x + dx;
        const newY = y + dy;
        const object = getObjectAt(objects, newX, newY, true);
        if (!object) {
            x = newX;
            y = newY;
            continue;
        }
        if (object.type === '#') continue;
        if (object.type === 'O' && attemptToMoveHorizontallyDoubledBlocks(objects, object, dx, dy)) {
            x = newX;
            y = newY;
        }
    }

    return objects.filter(obj => obj.type === 'O').reduce((res, obj) => res + obj.y * 100 + obj.x, 0);
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