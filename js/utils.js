function getRandomNumber(max) {
  return Math.round(1 + (Math.random() * (max - 1)));
}

function getRandomData(amount) {
  const randomData = [];
  for (let i = 0; i < amount; i += 1) {
    randomData.push([getRandomNumber(10), getRandomNumber(10)]);
  }
  return randomData;
}

function getRandomColor() {
  return `rgb(
        ${getRandomNumber(255)},
        ${getRandomNumber(255)},
        ${getRandomNumber(255)})
    `;
}

export { getRandomData, getRandomNumber, getRandomColor };
