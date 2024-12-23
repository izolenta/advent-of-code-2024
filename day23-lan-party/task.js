const fs = require('fs');

const readData = isReal => {
    const map = new Map();
    fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8')
        .trim().split('\n')
        .forEach(line => {
            const [a, b] = line.split('-');
            map.set(a, [...(map.get(a) || []), b]);
            map.set(b, [...(map.get(b) || []), a]);
        });
    return map;
};

const paths = new Set();

const findThreeCircularlyConnected = (initial, current, map, path = []) => {
    if (path.length === 4) {
        current === initial && paths.add(path.slice(0, 3).sort().join('-'));
        return;
    }
    map.get(current).forEach(next =>
        findThreeCircularlyConnected(initial, next, map, [...path, next])
    );
};

const findCliques = (data, current, remaining, path, cliques) => {
    if (!remaining.size && !path.size) {
        cliques.push(new Set(current));
        return;
    }

    Array.from(remaining).forEach(node => {
        const neighbors = new Set(data.get(node));
        findCliques(
            data,
            new Set([...current, node]),
            new Set([...remaining].filter(n => neighbors.has(n))),
            new Set([...path].filter(n => neighbors.has(n))),
            cliques
        );
        remaining.delete(node);
        path.add(node);
    });
};

const star1 = () => {
    const map = readData(true);
    [...map.keys()].forEach(node =>
        findThreeCircularlyConnected(node, node, map, [node])
    );
    return [...paths].filter(path => path.includes('-t') || path.startsWith('t')).length;
};

const star2 = () => {
    const data = readData(true);
    const cliques = [];
    findCliques(data, new Set(), new Set(data.keys()), new Set(), cliques);
    return [...cliques.sort((a, b) => b.size - a.size)[0]].sort().join(',');
};

const main = () => {
    console.time('star1');
    console.log(`🎅: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`🎅🎅: ${star2()}`);
    console.timeEnd('star2');
};

main();