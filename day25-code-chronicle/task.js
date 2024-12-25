const fs = require('fs');

const readData = isReal => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8').trim().split('\n\n')
    const locks = [], pins = []

    data.forEach(b => {
        const block = b.split('\n')
        block[0] === '#####' ? locks.push(getHeights(block)) : block[6] === '#####' && pins.push(getHeights(block, true))
    })

    return {locks, pins}
}

const getHeights = (block, isKey = false) => {
    const heights = new Array(block[0].length).fill(0)
    const rowIter = isKey ? [...Array(block.length).keys()].reverse() : [...Array(block.length).keys()]

    for (let col = 0; col < block[0].length; col++) {
        for (let row of rowIter) {
            if (block[row][col] === '#') {
                heights[col]++
            } else if (isKey) {
                break
            }
        }
    }
    return heights.map(h => h - 1)
}

const isFit = (lock, pin) => lock.every((h, i) => h + pin[i] <= 5)

const star1 = () => {
    const {locks, pins} = readData(true)
    return locks.reduce((acc, lock) => acc + pins.filter(pin => isFit(lock, pin)).length, 0)
}

const main = () => {
    console.time('star1');
    console.log(`🎁: ${star1()}`);
    console.timeEnd('star1');
};

main();