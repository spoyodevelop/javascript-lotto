import makeLotto from './src/service/LottoService.js';

import validateLottoPurchase from './src/Validation/validateLottoPurchase';

let lottos;

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userInput');
  const button = document.getElementById('myButton');

  button.addEventListener('click', async () => {
    const inputValue = input.value.trim();
    try {
      const ticket = validateLottoPurchase(inputValue);
      lottos = makeLotto(ticket, 'web');

      showLottoList(lottos);
    } catch (error) {
      alert(error.message);
    }
  });
});

function showLottoList(lottos) {
  const lottoList = document.getElementById('lottoList');

  while (lottoList.firstChild) {
    lottoList.removeChild(lottoList.firstChild);
  }

  lottos.forEach((lotto) => {
    console.log(lotto.numbers);
    const li = document.createElement('li');

    li.textContent = lotto.numbers.join(', ');
    lottoList.appendChild(li);
  });
}
