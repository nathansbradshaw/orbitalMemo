export const safeParseInt = (num: string) => {
    const newNum = parseInt(num);
    if (newNum === NaN) {
        return
    }
    return newNum;
}