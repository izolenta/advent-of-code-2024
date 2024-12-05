const fs = require('fs');

const readData = () => {
    const [orderData, seqData] = fs.readFileSync('./inputs/real.data', 'utf8').split('\n\n');
    const orderArr = orderData.split('\n').map(line => line.split('|').map(Number));
    const seqsArr = seqData.split('\n').map(line => line.split(',').map(Number));
    return {orderArr, seqsArr};
};

const findPage = (arr, startIndex, endIndex, page) => {
    const slice = arr.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
    return slice.includes(page);
};

const filterSequences = (seqsArr, orderArr, shouldMatchRules) => {
    return seqsArr.filter(seq => {
        return seq.every((current, index) => {
            return orderArr.every(([left, right]) => {
                if (current === left && findPage(seq, 0, index - 1, right)) return false;
                return !(current === right && findPage(seq, index + 1, seq.length - 1, left));
            });
        }) === shouldMatchRules;
    });
};

const sortSequence = (seq, orderArr) => {
    const result = [...seq];
    let swapped;
    do {
        swapped = false;
        orderArr.forEach(([left, right]) => {
            const leftIdx = result.indexOf(left);
            const rightIdx = result.indexOf(right);
            if (leftIdx >= 0 && rightIdx >= 0 && rightIdx < leftIdx) {
                [result[leftIdx], result[rightIdx]] = [result[rightIdx], result[leftIdx]];
                swapped = true;
            }
        });
    } while (swapped);
    return result;
};

const getMiddleSum = sequences => {
    return sequences.reduce((sum, seq) => {
        const middleIndex = Math.floor(seq.length / 2);
        return sum + seq[middleIndex];
    }, 0);
};

const star1 = () => {
    const {orderArr, seqsArr} = readData();
    const validSequences = filterSequences(seqsArr, orderArr, true);
    return getMiddleSum(validSequences);
}

const star2 = () => {
    const {orderArr, seqsArr} = readData();
    const invalidSequences = filterSequences(seqsArr, orderArr, false).map(seq => sortSequence(seq, orderArr));
    return getMiddleSum(invalidSequences);
}

const main = () => {
    console.time('star1');
    console.log(star1());
    console.timeEnd('star1');
    console.time('star2');
    console.log(star2());
    console.timeEnd('star2');
};

main();