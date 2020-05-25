function getRandomNumber(max) {
    return Math.round(1 + (Math.random() * (max - 1)));
}
function getRandomData(amount) {
    var randomData = [];
    for (var i = 0; i < amount; i += 1) {
        randomData.push([getRandomNumber(10), getRandomNumber(10)]);
    }
    return randomData;
}
function getRandomColor() {
    return "rgb(\n        " + getRandomNumber(255) + ",\n        " + getRandomNumber(255) + ",\n        " + getRandomNumber(255) + ")\n    ";
}
export { getRandomData, getRandomNumber, getRandomColor };
