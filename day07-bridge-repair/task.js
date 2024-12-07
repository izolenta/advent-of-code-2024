const fs = require('fs');

const readData = () =>
    fs.readFileSync('./inputs/real.data', 'utf8')
        .split('\n')
        .map(line => {
            const [target, numbers] = line.split(':');
            return {
                target: parseInt(target),
                numbers: numbers.trim().split(' ').map(Number)
            };
        });

const generateOperators = (length, includeConcat = false) => {
    const operators = includeConcat ? ['*', '+', '|'] : ['*', '+'];
    const combinations = [];

    const backtrack = (current = []) => {
        if (current.length === length) {
            combinations.push(current.join(''));
            return;
        }
        operators.forEach(op => backtrack([...current, op]));
    };

    backtrack();
    return combinations;
};

const evaluate = (numbers, operators) => {
    let result = numbers[0];

    for (let i = 0; i < operators.length; i++) {
        const nextNum = numbers[i + 1];
        switch (operators[i]) {
            case '*':
                result *= nextNum;
                break;
            case '+':
                result += nextNum;
                break;
            case '|':
                result = parseInt(`${result}${nextNum}`);
                break;
        }
    }

    return result;
};

const solve = (includeConcat = false) => {
    const data = readData();
    return data.reduce((sum, { target, numbers }) => {
        const operatorSets = generateOperators(numbers.length - 1, includeConcat);
        const found = operatorSets.some(ops => evaluate(numbers, ops) === target);
        return found ? sum + target : sum;
    }, 0);
}

const star1 = () => solve();
const star2 = () => solve(true);

const main = () => {
    console.time('star1');
    console.log(`⭐: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`⭐⭐: ${star2()}`);
    console.timeEnd('star2');
};

main();