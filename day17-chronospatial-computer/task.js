const fs = require('fs');

const readData = isReal => {
    const file = isReal ? './inputs/real.data' : './inputs/test.data';
    const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
    const [a, b, c] = lines.slice(0, 3).map(line => BigInt(line.split(': ')[1]));
    const program = lines[4].split(': ')[1].split(',').map(BigInt);
    return { a, b, c, program };
};

const getOperand = (mode, a, b, c) => {
    if (mode <= 3n) return mode;
    if (mode === 4n) return a;
    if (mode === 5n) return b;
    if (mode === 6n) return c;
    throw new Error('Invalid mode');
};

const runProgram = (program, a, b, c, checkOutput = false) => {
    let index = 0;
    let res = [];
    let outputIndex = 0;

    while (index < program.length) {
        const opcode = program[index];
        const op1 = program[index + 1];
        const operand = getOperand(op1, a, b, c);

        switch (opcode) {
            case 0n:
                a = a / (2n ** operand);
                break;
            case 1n:
                b = b ^ op1;
                break;
            case 2n:
                b = operand % 8n;
                break;
            case 3n:
                if (a !== 0n) {
                    index = Number(op1);
                    continue;
                }
                break;
            case 4n:
                b = b ^ c;
                break;
            case 5n:
                const out = operand % 8n;
                if (checkOutput && program[outputIndex] !== out) return [];
                res.push(out);
                outputIndex++;
                break;
            case 6n:
                b = a / (2n ** operand);
                break;
            case 7n:
                c = a / (2n ** operand);
                break;
        }
        index += 2;
    }

    if (checkOutput && outputIndex !== program.length) return [];
    return res;
};

const star1 = () => {
    const { a, b, c, program } = readData(true);
    return runProgram(program, a, b, c).map(Number).join(',');
};

// how I did it - manual narrowing work, finding bit patterns and bruteforce on a reduced set. Will work only with my output
const star2 = () => {
    const arr = [100762n, 102145n, 102153n, 35226n, 36609n, 36617n, 62217n, 67739n];
    const mask = ~(2n ** 19n - 1n);
    const { a: bigint, b, c, program } = readData(true);
    let index = 108999475200000n & mask;

    while (index < 290814749800000n) {
        for (const next of arr) {
            if (runProgram(program, index + next, b, c, true).length > 0) {
                return index + next;
            }
        }
        index += 524288n;
        if (index % 52428800000n === 0n) console.log(index);
    }
};

const star2results = []

const checkRecursiveProgram = (program, index=0, number = 0n) => {
    for (let j = 0n; j < 8n; j++) {
        const res = runProgram(program, j+number, 0, 0);
        let found = true;
        for (let i=0; i<res.length; i++) {
            if (res[res.length-1-i] !== program[program.length -1 -i]) {
                found = false
                break
            }
        }
        if (found) {
            if (res.length === program.length) {
                star2results.push(j+number);
                return;
            }
            checkRecursiveProgram(program, index+1, (j+number)*8n);
        }
    }
}

// how to do correctly
const star22 = () => {
    const { a: bigint, b, c, program } = readData(true);
    checkRecursiveProgram(program, 0);
    star2results.sort();
    return star2results[0];
}

const main = () => {
    console.time('star1');
    console.log(`🎄: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`🎄🎄: ${star2()}`);
    console.log(`🎄🎄: ${star22()}`);
    console.timeEnd('star2');
};

main();