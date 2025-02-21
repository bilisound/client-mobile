/* eslint-disable no-bitwise */

// https://mrhso.github.io/IshisashiWebsite/BVwhodoneit/

const table = [..."FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"];
// JS 中 Number 的位运算只适用于 32 位整数，故用 BigInt
const base = BigInt(table.length);
const xor = 23442827791579n;
const rangeLeft = 1n;
const rangeRight = 2n ** 51n;

export const av2bv = (av: number | bigint | string) => {
    let num = av;
    if (typeof num === "string") {
        num = parseInt(num.replace(/^[Aa][Vv]/u, ""));
    }
    if (typeof num !== "bigint" && !Number.isInteger(num)) {
        return null;
    }
    num = BigInt(num);
    if (num < rangeLeft || num >= rangeRight) {
        return null;
    }

    num = (num + rangeRight) ^ xor;
    let result = [..."BV1000000000"];
    let i = 11;
    while (i > 2) {
        result[i] = table[Number(num % base)];
        num /= base;
        i -= 1;
    }

    [result[3], result[9]] = [result[9], result[3]];
    [result[4], result[7]] = [result[7], result[4]];

    return result.join("");
};

export const bv2av = (bv: string) => {
    let str = "";
    if (bv.length === 12) {
        str = bv;
    } else if (bv.length === 10) {
        str = `BV${bv}`;
        // 根据官方 API，BV 号开头的 BV1 其实可以省略
        // 不过单独省略个 B 又不行（
    } else if (bv.length === 9) {
        str = `BV1${bv}`;
    } else {
        return null;
    }
    if (!str.match(/^[Bb][Vv]1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}$/u)) {
        return null;
    }
    const str2 = [...str];

    [str2[3], str2[9]] = [str2[9], str2[3]];
    [str2[4], str2[7]] = [str2[7], str2[4]];

    let result = 0n;
    let i = 3;
    while (i < 12) {
        result *= base;
        result += BigInt(table.indexOf(str2[i]));
        i += 1;
    }

    if (result < rangeRight || result >= rangeRight * 2n) {
        return null;
    }

    result = (result - rangeRight) ^ xor;

    if (result < rangeLeft) {
        return null;
    }

    return `av${result}`;
};
