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

let lottos = [];
let purchasePrice = 0;

const elements = {
  userMoneyInput: document.getElementById('userMoney'),
  purchaseLottoButton: document.getElementById('purchaseLotto'),
  lottosDiv: document.getElementById('lottos'),
  checkUserNumberDiv: document.getElementById('checkUserNumber'),
  checkResultButton: document.getElementById('checkResult'),
  resultModal: document.getElementById('resultModal'),
  resetButton: document.getElementById('resetGame'),
  lottoList: document.getElementById('lottoList'),
  revenueRateResult: document.getElementById('revenueRateResult'),
};

function initPrizeBoard() {
  const idMapping = {
    THREE_MATCH: 'threeMatchPrice',
    FOUR_MATCH: 'fourMatchPrice',
    FIVE_MATCH: 'fiveMatchPrice',
    FIVE_MATCH_WITH_BONUS: 'fiveMatchWithBonusPrice',
    SIX_MATCH: 'sixMatchPrice',
  };

  Object.entries(idMapping).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = lottoResults.prizeMoney[key].toLocaleString();
    }
  });
}

function resetInputs(ids) {
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
}

function updateWinCount(winCount) {
  const idMapping = {
    THREE_MATCH: 'threeMatchAmount',
    FOUR_MATCH: 'fourMatchAmount',
    FIVE_MATCH: 'fiveMatchAmount',
    FIVE_MATCH_WITH_BONUS: 'fiveMatchWithBonusAmount',
    SIX_MATCH: 'sixMatchAmount',
  };

  Object.entries(idMapping).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = `${winCount[key].toLocaleString()}개`;
    }
  });
}

function showLottoList(lottos) {
  resetLottoList();
  lottos.forEach((lotto) => {
    const li = document.createElement('li');
    li.textContent = lotto.numbers.join(', ');
    elements.lottoList.appendChild(li);
  });
}

function resetLottoList() {
  while (elements.lottoList.firstChild) {
    elements.lottoList.removeChild(elements.lottoList.firstChild);
  }
}

function showRevenueRate(revenueRate) {
  elements.revenueRateResult.textContent = `당신의 총 수익률은 ${revenueRate.toFixed(
    1,
  )}%입니다.`;
}

function retryGame() {
  purchasePrice = 0;
  lottos = [];
  resetInputs([
    'firstNumber',
    'secondNumber',
    'thirdNumber',
    'fourthNumber',
    'fifthNumber',
    'sixthNumber',
    'bonusNumber',
  ]);
  resetLottoList();
  updateWinCount({
    THREE_MATCH: 0,
    FOUR_MATCH: 0,
    FIVE_MATCH: 0,
    FIVE_MATCH_WITH_BONUS: 0,
    SIX_MATCH: 0,
  });
  elements.resultModal.classList.add('hidden');
  elements.checkUserNumberDiv.classList.add('hidden');
}

function handlePurchaseLotto() {
  const inputValue = elements.userMoneyInput.value.trim();
  try {
    const ticket = validateLottoPurchase(inputValue);
    purchasePrice = +inputValue;
    lottos = makeLotto(ticket, 'web');
    showLottoList(lottos);
    elements.lottosDiv.classList.remove('hidden');
    elements.checkUserNumberDiv.classList.remove('hidden');
    elements.userMoneyInput.value = '';
  } catch (error) {
    alert(error.message);
  }
}

function handleCheckResult() {
  try {
    const inputIds = [
      'firstNumber',
      'secondNumber',
      'thirdNumber',
      'fourthNumber',
      'fifthNumber',
      'sixthNumber',
    ];
    const userNumbers = inputIds.map((id) => document.getElementById(id).value);
    const bonusNumber = document.getElementById('bonusNumber').value;

    const userLotto = new Lotto(userNumbers);
    resetInputs([...inputIds, 'bonusNumber']);

    const parsedLotto = validateBonusNumber(userLotto, bonusNumber);
    const winCount = calculateWins(lottos, parsedLotto);
    const totalPrize = calculatePrize(winCount, lottoResults.prizeMoney);
    const revenueRate = calculateRevenueRate(totalPrize, purchasePrice);

    showRevenueRate(revenueRate);
    updateWinCount(winCount);
    elements.resultModal.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
}

function bindEventListeners() {
  elements.purchaseLottoButton.addEventListener('click', handlePurchaseLotto);
  elements.checkResultButton.addEventListener('click', handleCheckResult);
  elements.resetButton.addEventListener('click', retryGame);
}

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
}

document.addEventListener('DOMContentLoaded', initializeApp);
