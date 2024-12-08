const fs = require('fs');

const readData = () => {
    const lines = fs.readFileSync('./inputs/real.data', 'utf8').split('\n');
    const width = lines[0].length;
    const height = lines.length;

    const nodes = lines.flatMap((line, y) =>
        [...line].map((char, x) =>
            char !== '.' ? { node: char, x, y } : null
        ).filter(Boolean)
    ).sort((a, b) => a.node.localeCompare(b.node));

    return { width, height, nodes };
};

const isInBounds = (x, y, width, height) =>
    x >= 0 && x < width && y >= 0 && y < height;

const findNodes1 = (nodes, width, height) => {
    const points = new Set();

    const nodeGroups = Object.groupBy(nodes, node => node.node);

    for (const group of Object.values(nodeGroups)) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                const dx = group[j].x - group[i].x;
                const dy = group[j].y - group[i].y;
                const coords = [
                    [group[i].x - dx, group[i].y - dy],
                    [group[j].x + dx, group[j].y + dy]
                ];

                coords.forEach(([x, y]) => {
                    if (isInBounds(x, y, width, height)) {
                        points.add(`${x},${y}`);
                    }
                });
            }
        }
    }

    return points.size;
};

const findNodes2 = (nodes, width, height) => {
    const points = new Set();

    const nodeGroups = Object.groupBy(nodes, node => node.node);
    for (const group of Object.values(nodeGroups)) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                const dx = group[j].x - group[i].x;
                const dy = group[j].y - group[i].y;
                [
                    { x: group[i].x, y: group[i].y, step: -1 },
                    { x: group[j].x, y: group[j].y, step: 1 }
                ].forEach(({ x, y, step }) => {
                    while (isInBounds(x, y, width, height)) {
                        points.add(`${x},${y}`);
                        x += dx * step;
                        y += dy * step;
                    }
                });
            }
        }
    }

    return points.size;
};

const star1 = () => {
    const { width, height, nodes } = readData();
    return findNodes1(nodes, width, height);
};

const star2 = () => {
    const { width, height, nodes } = readData();
    return findNodes2(nodes, width, height);
};

const main = () => {
    console.time('star1');
    console.log(`⚝: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⚝⚝: ${star2()}`);
    console.timeEnd('star2');
};

main();