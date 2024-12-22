const fs = require('fs');

const MOD = BigInt(16777216);

const readData = isReal => {
    return fs.readFileSync(isReal ? './inputs/real.data' : './inputs/test.data', 'utf8')
        .trim().split('\n').map(x => BigInt(x));
};

const convert = secret => {
    let x = (secret * BigInt(64)) % MOD;
    secret = secret ^ x;
    secret = secret % MOD;

    x = secret / BigInt(32);
    secret = secret ^ x;
    secret = secret % MOD;

    x = (secret * BigInt(2048)) % MOD;
    secret = secret ^ x;
    secret = secret % MOD;
    return secret;
}

function findIndex(arr, subarr) {
    const len = subarr.length;

    outer: for (let i = 0; i <= arr.length - len; i++) {
        for (let j = 0; j < len; j++) {
            if (arr[i + j] !== subarr[j]) continue outer;
        }
        return i;
    }

    return -1;
}

const star1 = () => {
    const data = readData(true);
    let d2 = [...data];
    let d3 = [];
    for (let i = 0; i < 2000; i++) {
        d3 = [];
        for (let next of d2) {
            d3.push(convert(next));
        }
        d2 = [...d3];
    }
    return d3.reduce((acc, cur) => acc + cur, BigInt(0));
};

const star2 = () => {
    const data = readData(true);
    const priceChanges = [];
    const prices = [];
    let patterns = [];
    for (let i = 0; i < data.length; i++) {
        const tempChanges = []
        const tempPrices = [];
        let next = data[i];
        for (let j=0; j<2000; j++) {
            let newNext = convert(next);
            const dLast = next % 10n;
            const dNew = newNext % 10n;
            const diff = dNew - dLast;
            next = newNext;
            tempPrices.push(Number(dNew));
            tempChanges.push(Number(diff));
        }
        priceChanges.push(tempChanges);
        prices.push(tempPrices);
    }
    let set = new Set();
    for (let next of priceChanges) {
        for (let i = 0; i < next.length - 4; i++) {
            set.add(`${next[i]},${next[i+1]},${next[i+2]},${next[i+3]}`);
        }
    }
    for (let next of set) {
        patterns.push(next.split(',').map(Number));
    }
    let max = 0;
    let patt = '';
    for (let [nump, pat] of patterns.entries()) {
        let price = 0;
        if (nump % 100 === 0) console.log(`${nump} of ${patterns.length}`);
        for (let [index, temp] of priceChanges.entries()) {
            let pos = findIndex(temp, pat);
            if (pos === -1) continue;
            let ack = prices[index][pos+3]
            price += parseInt(ack);
        }
        if (max < price) {
            max = price;
            patt = pat;
        }
    }
    console.log(max)
    return max;
};

function star2Optimized() {
    const data = readData(true);
    const numBuyers = data.length;

    const priceChanges = [];
    const prices = [];

    for (let i = 0; i < numBuyers; i++) {
        let secret = data[i];
        const tempChanges = [];
        const tempPrices = [];

        for (let j = 0; j < 2000; j++) {
            const newSecret = convert(secret);
            const oldPrice = Number(secret % 10n);
            const newPrice = Number(newSecret % 10n);
            tempPrices.push(newPrice);

            const diff = newPrice - oldPrice;
            tempChanges.push(diff);

            secret = newSecret;
        }
        priceChanges.push(tempChanges);
        prices.push(tempPrices);
    }

    const buyerMaps = [];
    for (let b = 0; b < numBuyers; b++) {
        const changes = priceChanges[b];
        const firstOccMap = new Map();

        for (let i = 0; i < changes.length - 3; i++) {
            const key = `${changes[i]},${changes[i+1]},${changes[i+2]},${changes[i+3]}`;
            if (!firstOccMap.has(key)) {
                firstOccMap.set(key, i);
            }
        }
        buyerMaps.push(firstOccMap);
    }

    const patSet = new Set();
    for (let b = 0; b < numBuyers; b++) {
        const changes = priceChanges[b];
        for (let i = 0; i < changes.length - 3; i++) {
            const key = `${changes[i]},${changes[i+1]},${changes[i+2]},${changes[i+3]}`;
            patSet.add(key);
        }
    }

    const patternList = [...patSet];

    let max = 0;
    let bestPat = '';

    for (let pIndex = 0; pIndex < patternList.length; pIndex++) {
        const patt = patternList[pIndex];

        if (pIndex % 1000 === 0) {
            console.log(`${pIndex} of ${patternList.length}`);
        }

        let price = 0;

        for (let b = 0; b < numBuyers; b++) {
            const pos = buyerMaps[b].get(patt);
            if (pos !== undefined) {
                price += prices[b][pos + 3];
            }
        }

        if (price > max) {
            max = price;
            bestPat = patt;
        }
    }

    console.log('Bananas:', max);
    console.log('Pattern:', bestPat);
    return max;
}

const main = () => {
    console.time('star1');
    console.log(`🎅: ${star1()}`);
    console.timeEnd('star1');
    console.time('star2');
    console.log(`🎅🎅: ${star2Optimized()}`);
    console.timeEnd('star2');
};

main();