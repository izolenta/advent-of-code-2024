const fs = require('fs');

const readData = isReal => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8')
        .trim().split('\n\n')
    const towels = data[0].split(', ')
    const designs = data[1].split('\n')
    return {towels, designs};
};

const countPatternCombinations = (towels, design, cache = new Map()) => {
    const cached = cache.get(design);
    if (cached !== undefined) return cached;
    if (!design.length) return 1;

    const count = towels.reduce((sum, towel) =>
        design.startsWith(towel) ? sum + countPatternCombinations(towels, design.slice(towel.length), cache) : sum, 0);

    cache.set(design, count);
    return count;
};

const star1 = () => {
    const {towels, designs} = readData(true);
    return designs.reduce((sum, design) =>
        countPatternCombinations(towels, design) > 0 ? sum + 1 : sum, 0);
};

const star2 = () => {
    const {towels, designs} = readData(true);
    return designs.reduce((sum, design) =>
        sum + countPatternCombinations(towels, design), 0);
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