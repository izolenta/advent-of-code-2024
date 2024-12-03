const fs = require('fs');

const readData = () => fs.readFileSync('./inputs/real.data', 'utf8');

const analyze = (input) => {
    const regex = /mul\(\d{1,3},\d{1,3}\)/g;
    return input.match(regex).reduce((res, mul) => {
        const [a, b] = mul.slice(4, -1).split(',').map(Number);
        return res + a * b;
    }, 0);
}

const star1 = () => analyze(readData());

const star2 = () => {
    const input = readData();
    let mod = "", enabled = true, index = 0;
    while (index < input.length) {
        const next = input.indexOf(enabled ? "don't()" : "do()", index);
        if (next === -1) {
            if (enabled) mod += input.slice(index);
            break;
        }
        mod += enabled ? input.slice(index, next) : "";
        index = next + (enabled ? 7 : 4);
        enabled = !enabled;
    }
    return analyze(mod);
}

const main = () => {
    const watch1 = Date.now();
    console.log(star1());
    console.log(`${Date.now() - watch1}ms`);
    const watch2 = Date.now();
    console.log(star2());
    console.log(`${Date.now() - watch2}ms`);
}

main();