/* eslint-disable no-bitwise */

// https://mrhso.github.io/IshisashiWebsite/BVwhodoneit/
// 改写自 https://www.zhihu.com/question/381784377/answer/1099438784，并加上一些适当的处理
// 我这人虽然是写 JS 的，但是看 Python 不是问题

const table = [..."fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF"];
const s = [11, 10, 3, 8, 4, 6];
const xor = 177451812;
const add = 8728348608;

export const av2bv = (av: string | number) => {
    let num = NaN;
    if (typeof av === "number") {
        num = av;
    } else {
        num = parseInt(av.replace(/[^0-9]/gu, ""), 10);
    }
    if (Number.isNaN(num) || num <= 0) {
        // 网页版直接输出这个结果了
        return null;
    }

    num = (num ^ xor) + add;
    const result = [..."BV1  4 1 7  "];
    let i = 0;
    while (i < 6) {
        // 这里改写差点犯了运算符优先级的坑
        // 果然 Python 也不是特别熟练
        // 说起来 ** 按照传统语法应该写成 Math.pow()，但是我个人更喜欢 ** 一些
        result[s[i]] = table[Math.floor(num / 58 ** i) % 58];
        i += 1;
    }
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
    if (!str.match(/[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/gu)) {
        return null;
    }

    let result = 0;
    let i = 0;
    while (i < 6) {
        result += table.indexOf(str[s[i]]) * 58 ** i;
        i += 1;
    }
    return `av${(result - add) ^ xor}`;
};
