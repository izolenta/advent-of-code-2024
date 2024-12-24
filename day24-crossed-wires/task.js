const fs = require('fs');
const {number, print, corr} = require("mathjs");

const readData = isReal => {
    const data = fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8')
        .trim().split('\n\n')
    const wires = data[0].split('\n').map(line => line.split(': ').map(item => item.trim()));
    const operations = data[1].split('\n').map(line => parseOperation(line));
    return {wires, operations};
};

const parseOperation = (operation) => {
    const [left, result] = operation.split(' -> ');
    const [operand1, operator, operand2] = left.split(' ');
    return [operand1, operator, operand2, result];
};

function process(wires, operations) {
    const wireMap = new Map();
    for (const [name, value] of wires) {
        wireMap.set(name, value);
    }
    let pending = [...operations];
    while (pending.length > 0) {
        let somethingDone = false;
        const stillPending = [];
        for (const [operand1, operator, operand2, result] of pending) {
            if (wireMap.has(operand1) && wireMap.has(operand2)) {
                somethingDone = true;
                const wire1 = wireMap.get(operand1);
                const wire2 = wireMap.get(operand2);
                let value;
                switch (operator) {
                    case 'AND':
                        value = wire1 & wire2;
                        break;
                    case 'OR':
                        value = wire1 | wire2;
                        break;
                    case 'XOR':
                        value = wire1 ^ wire2;
                        break;
                }
                wireMap.set(result, value);
            } else {
                stillPending.push([operand1, operator, operand2, result]);
            }
        }
        if (!somethingDone) {
            return -1;
        }
        pending = stillPending;
    }
    const zWires = [];
    for (const [name, val] of wireMap.entries()) {
        if (name.startsWith('z')) {
            zWires.push([name, val]);
        }
    }
    zWires.sort((a, b) => a[0].localeCompare(b[0]));
    const binaryString = zWires.map(([_, val]) => val).reverse().join('');
    return parseInt(binaryString, 2);
}

const star1 = () => {
    const {wires,operations} = readData(true);
    return process(wires, operations);
};

const xyNode = /^[xy]\d{2}$/;
const zNode = /^z\d{2}$/;

const star2 = () => {
    const {wires, operations} = readData(true);
    const answers = operations.filter(o =>
        (o[1] === 'XOR' && !xyNode.test(o[0]) && !xyNode.test(o[2]) && !o[0].includes('00') && !zNode.test(o[3])) ||
        (o[1] !== 'XOR' && zNode.test(o[3]) && o[3] !== 'z45')
    ).map(o => o[3]);

    for (let i = 0; i < 45; i++) {
        const inStr = i.toString().padStart(2, '0');
        const op = operations.find(o => o[1] === 'XOR' && (o[0].includes(inStr) && o[2].includes(inStr)));

        if (op && !operations.find(o2 =>
                o2[1] === 'XOR' &&
                (o2[0] === op[3] || o2[2] === op[3]) &&
                o2[3].startsWith('z')) &&
            inStr !== '00' &&
            !answers.includes('z' + inStr)
        ) {
            answers.push(op[3]);
            const zIndex = 'z' + op[0].slice(1);
            const corrExit = operations.find(o => o[1] === 'XOR' && o[3] === zIndex);

            if (corrExit) {
                if (operations.some(o => o[3] === corrExit[0] && o[1] === 'AND')) {
                    answers.push(corrExit[0]);
                }
                if (operations.some(o => o[3] === corrExit[2] && o[1] === 'AND')) {
                    answers.push(corrExit[2]);
                }
            }
        }
    }

    return answers.sort().join(',');
}

const main = () => {
    console.time('star1');
    console.log(`🎁: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`🎁🎁: ${star2()}`);
    console.timeEnd('star2');
};

main();