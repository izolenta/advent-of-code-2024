const fs = require('fs');

const readData = (isReal) => {
    const {file, width, height} = isReal
        ? {file: './inputs/real.data', width: 101, height: 103}
        : {file: './inputs/test.data', width: 11, height: 7};
    const data = fs.readFileSync(file, 'utf8').trim().split('\n');
    const bots = [];
    const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;

    data.forEach(record => {
        const match = record.match(regex);
        bots.push({
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            dx: parseInt(match[3]),
            dy: parseInt(match[4])
        });
    });
    return { bots, width, height };
}


const star1 = () => {
    const {bots,width,height} = readData(true);
    const res = [0,0,0,0];
    const midX = width>>1, midY = height>>1;
    for (const bot of bots) {
        bot.x = ((bot.x + bot.dx*100) % width + width) % width;
        bot.y = ((bot.y + bot.dy*100) % height + height) % height;
        if (bot.x < midX && bot.y < midY) res[0]++;
        else if (bot.x > midX && bot.y < midY) res[1]++;
        else if (bot.x < midX && bot.y > midY) res[2]++;
        else if (bot.x > midX && bot.y > midY) res[3]++;
    }
    return res[0]*res[1]*res[2]*res[3];
}

const star2 = () => {
    const {bots,width,height} = readData(true);
    let steps = 0;
    while (true) {
        bots.forEach(bot => {
            bot.x = ((bot.x + bot.dx) % width + width) % width;
            bot.y = ((bot.y + bot.dy) % height + height) % height;
        });
        ++steps;
        if (bots.some(bot => {
            const y = bot.y;
            return Array(5).fill(0).every((_,i) =>
                bots.some(b => b.x === bot.x && b.y === y-i) &&
                bots.some(b => b.x === bot.x && b.y === y+i)
            );
        })) break;
    }
    return steps;
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