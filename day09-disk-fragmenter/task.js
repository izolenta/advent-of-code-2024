const fs = require('fs');

const readData = () => fs.readFileSync('./inputs/real.data', 'utf8').trim();

const findFreeSpace = (arr, len, index) => {
    const freeSpaceIndex = arr.findIndex(item => item.id === -1 && item.len >= len);
    return freeSpaceIndex < index ? freeSpaceIndex : -1;
}

const star1 = () => {
    const line = readData();
    const arr = [];
    const numbers = line.split('').map(Number);

    for (let i = 0; i < numbers.length; i++) {
        arr.push(...Array(numbers[i]).fill(i % 2 ? -1 : i >> 1));
    }

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        while (left < arr.length && arr[left] !== -1) left++;
        while (right >= 0 && arr[right] === -1) right--;
        if (left < right) {
            arr[left] = arr[right];
            arr[right] = -1;
        }
    }

    return arr.reduce((sum, val, idx) => val !== -1 ? sum + val * idx : sum, 0);
};

const star2 = () => {
    const line = readData();
    const arr = [];
    const numbers = line.split('').map(Number);

    for (let i = 0; i < numbers.length; i++) {
        arr.push({
            id: i % 2 ? -1 : i >> 1,
            len: numbers[i],
            processed: false
        });
    }

    for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i].id === -1) continue;

        const moveIndex = findFreeSpace(arr, arr[i].len, i);
        if (moveIndex >= 0) {
            arr[i].processed = true;

            if (arr[moveIndex].len === arr[i].len) {
                arr[moveIndex].id = arr[i].id;
            } else {
                const spaceLen = arr[moveIndex].len - arr[i].len;
                arr[moveIndex].len = arr[i].len;
                arr[moveIndex].id = arr[i].id;
                arr.splice(moveIndex + 1, 0, { id: -1, len: spaceLen });
                i++;
            }
        }
    }

    const resArr = arr.flatMap(({ id, len, processed }) =>
        Array(len).fill(id !== -1 && !processed ? id : -1)
    );

    return resArr.reduce((sum, val, idx) => val !== -1 ? sum + val * idx : sum, 0);
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