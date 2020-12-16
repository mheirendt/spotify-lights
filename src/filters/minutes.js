export default function (ms) {

    if (ms === undefined || ms === null || typeof ms !== 'number') return '';
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(
        totalSeconds % 60
    ).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    });

    return `${minutes}:${seconds}`;
}