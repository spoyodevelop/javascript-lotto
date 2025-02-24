import validateLottoPurchase from './Validation/validateLottoPurchase.js';
import Lotto from './model/Lotto.js';
import validateBonusNumber from './Validation/validateBonusNumber.js';
import {
  calculatePrize,
  calculateRevenueRate,
  calculateWins,
} from './service/CalculatorService';
import { lottoResults } from './settings/systemSettings.js';
import makeLotto from './service/LottoService';

let lottos = [];
let purchasePrice = 0;

const elements = {
  userMoneyInput: document.getElementById('user-money'),
  purchaseLottoButton: document.getElementById('purchase-lotto'),
  lottosDiv: document.getElementById('lottos'),
  checkUserNumberDiv: document.getElementById('check-user-number'),
  checkResultButton: document.getElementById('check-result'),
  resultModal: document.getElementById('result-modal'),
  resetButton: document.getElementById('reset-game'),
  lottoList: document.getElementById('lotto-list'),
  revenueRateResult: document.getElementById('revenue-rate-result'),
  purchaseAmount: document.getElementById('purchase-amount'),
};

function initPrizeBoard() {
  const idMapping = {
    THREE_MATCH: 'three-match-price',
    FOUR_MATCH: 'four-match-price',
    FIVE_MATCH: 'five-match-price',
    FIVE_MATCH_WITH_BONUS: 'five-match-with-bonus-price',
    SIX_MATCH: 'six-match-price',
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
    THREE_MATCH: 'three-match-amount',
    FOUR_MATCH: 'four-match-amount',
    FIVE_MATCH: 'five-match-amount',
    FIVE_MATCH_WITH_BONUS: 'five-match-with-bonus-amount',
    SIX_MATCH: 'six-match-amount',
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
    'first-number',
    'second-number',
    'third-number',
    'fourth-number',
    'fifth-number',
    'sixth-number',
    'bonus-number',
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
    elements.purchaseAmount.innerHTML = `총 ${ticket}개를 구매하였습니다.`;
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
      'first-number',
      'second-number',
      'third-number',
      'fourth-number',
      'fifth-number',
      'sixth-number',
    ];
    const userNumbers = inputIds.map((id) => document.getElementById(id).value);
    const bonusNumber = document.getElementById('bonus-number').value;

    const userLotto = new Lotto(userNumbers);
    resetInputs([...inputIds, 'bonus-number']);

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
