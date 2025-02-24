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

function prizeBoardInit() {
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
        element.innerHTML = lottoResults.prizeMoney[key].toLocaleString();
      }
    });
  });
}
prizeBoardInit();

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
    const resultModal = document.getElementById('resultModal');
    try {
      const userLotto = new Lotto([
        firstNumber,
        secondNumber,
        thirdNumber,
        fourthNumber,
        fifthNumber,
        sixthNumber,
      ]);
      resetInputValue('firstNumber');
      resetInputValue('secondNumber');
      resetInputValue('thirdNumber');
      resetInputValue('fourthNumber');
      resetInputValue('fifthNumber');
      resetInputValue('sixthNumber');
      resetInputValue('bonusNumber');
      const parsedLotto = validateBonusNumber(userLotto, bonusNumber);

      const winCount = calculateWins(lottos, parsedLotto);
      const total = calculatePrize(winCount, lottoResults.prizeMoney);
      const revenueRate = calculateRevenueRate(total, purchasePrice);

      showRevenueRate(revenueRate);
      showWinCount(winCount);
      resultModal.classList.remove('hidden');
    } catch (error) {
      alert(error.message);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const resetButton = document.getElementById('resetGame');
  resetButton.addEventListener('click', () => {
    retryGame();
  });
});
function showRevenueRate(revenueRate) {
  const revenueRateResult = document.getElementById('revenueRateResult');
  revenueRateResult.innerHTML = `당신의 총 수익률은 ${revenueRate.toFixed(
    1,
  )}%입니다.`;
}

function showWinCount(winCount) {
  const idMapping = {
    THREE_MATCH: 'threeMatchAmount',
    FOUR_MATCH: 'fourMatchAmount',
    FIVE_MATCH: 'fiveMatchAmount',
    FIVE_MATCH_WITH_BONUS: 'fiveMatchWithBonusAmount',
    SIX_MATCH: 'sixMatchAmount',
  };

  Object.entries(idMapping).forEach(([key, id]) => {
    const element = document.getElementById(id);

    if (element) {
      element.innerHTML = winCount[key].toLocaleString();
    }
  });
}
function resetInputValue(number) {
  document.getElementById(number).value = '';
}
function resetWinCount() {
  const idMapping = {
    THREE_MATCH: 'threeMatchAmount',
    FOUR_MATCH: 'fourMatchAmount',
    FIVE_MATCH: 'fiveMatchAmount',
    FIVE_MATCH_WITH_BONUS: 'fiveMatchWithBonusAmount',
    SIX_MATCH: 'sixMatchAmount',
  };

  Object.entries(idMapping).forEach(([key, id]) => {
    const element = document.getElementById(id);

    if (element) {
      element.innerHTML = 'n개';
    }
  });
}
function resetLottoList(lottoList) {
  while (lottoList.firstChild) {
    lottoList.removeChild(lottoList.firstChild);
  }
}

function showLottoList(lottos) {
  const lottoList = document.getElementById('lottoList');
  resetLottoList(lottoList);

  lottos.forEach((lotto) => {
    const li = document.createElement('li');
    li.textContent = lotto.numbers.join(', ');
    lottoList.appendChild(li);
  });
}
function retryGame() {
  // 1.
  purchasePrice = 0;
  lottos = [];
  //2.
  const lottoList = document.getElementById('lottoList');
  resetInputValue('firstNumber');
  resetInputValue('secondNumber');
  resetInputValue('thirdNumber');
  resetInputValue('fourthNumber');
  resetInputValue('fifthNumber');
  resetInputValue('sixthNumber');
  resetInputValue('bonusNumber');
  resetLottoList(lottoList);
  resetWinCount();
  const resultModal = document.getElementById('resultModal');
  resultModal.classList.add('hidden');
  const checkUserNumberDiv = document.getElementById('checkUserNumber');
  checkUserNumberDiv.classList.add('hidden');
}
