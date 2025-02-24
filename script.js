import makeLotto from './src/service/LottoService.js';
import validateLottoPurchase from './src/Validation/validateLottoPurchase.js';
import Lotto from './src/model/Lotto.js';
import validateBonusNumber from './src/Validation/validateBonusNumber.js';
import {
  calculatePrize,
  calculateRevenueRate,
  calculateWins,
} from './src/service/CalculatorService';
import { lottoResults } from './src/settings/systemSettings.js';

let lottos;
let purchasePrice = 0;

document.addEventListener('DOMContentLoaded', () => {
  const idMapping = {
    THREE_MATCH: 'threeMatchPrice',
    FOUR_MATCH: 'fourMatchPrice',
    FIVE_MATCH: 'fiveMatchPrice',
    FIVE_MATCH_WITH_BONUS: 'fiveMatchWithBonusPrice',
    SIX_MATCH: 'sixMatchPrice',
  };

  Object.entries(idMapping).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = lottoResults.prizeMoney[key].toLocaleString(); // 천 단위 콤마 추가
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const userMoneyInput = document.getElementById('userMoney');
  const purchaseLottoButton = document.getElementById('purchaseLotto');
  const lottosDiv = document.getElementById('lottos');
  const checkUserNumberDiv = document.getElementById('checkUserNumber');
  const checkResultButton = document.getElementById('checkResult');

  purchaseLottoButton.addEventListener('click', () => {
    const inputValue = userMoneyInput.value.trim();

    try {
      const ticket = validateLottoPurchase(inputValue);
      purchasePrice = +inputValue;
      lottos = makeLotto(ticket, 'web');
      showLottoList(lottos);

      lottosDiv.classList.remove('hidden');
      checkUserNumberDiv.classList.remove('hidden');
      userMoneyInput.value = '';
    } catch (error) {
      alert(error.message);
    }
  });
  checkResultButton.addEventListener('click', () => {
    const firstNumber = document.getElementById('firstNumber').value;
    const secondNumber = document.getElementById('secondNumber').value;
    const thirdNumber = document.getElementById('thirdNumber').value;
    const fourthNumber = document.getElementById('fourthNumber').value;
    const fifthNumber = document.getElementById('fifthNumber').value;
    const sixthNumber = document.getElementById('sixthNumber').value;
    const bonusNumber = document.getElementById('bonusNumber').value;
    try {
      const userLotto = new Lotto([
        firstNumber,
        secondNumber,
        thirdNumber,
        fourthNumber,
        fifthNumber,
        sixthNumber,
      ]);
      const parsedLotto = validateBonusNumber(userLotto, bonusNumber);

      const winCount = calculateWins(lottos, parsedLotto);
      const total = calculatePrize(winCount, lottoResults.prizeMoney);
      const revenueRate = calculateRevenueRate(total, purchasePrice);

      calculatePrize();
      calculateRevenueRate();
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
