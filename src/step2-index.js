import { elements } from './View/elements.js';
import {
  handleCheckResult,
  handlePurchaseLotto,
  retryGame,
} from './service/GameService.js';
import { initPrizeBoard, closeResultModal } from './View/LottoView.js';

function bindEventListeners() {
  elements.purchaseLottoButton.addEventListener('click', handlePurchaseLotto);
  elements.checkResultButton.addEventListener('click', handleCheckResult);
  elements.resetButton.addEventListener('click', retryGame);
  elements.closeButton.addEventListener('click', closeResultModal);
  elements.firstNumber.addEventListener('input', handleNumberInput);
}
function bindEnterKeyDownListener() {
  [
    'first-number',
    'second-number',
    'third-number',
    'fourth-number',
    'fifth-number',
    'sixth-number',
    'bonus-number',
  ].forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setTimeout(handleCheckResult, 50);
    });
  });
  elements.userMoneyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handlePurchaseLotto();
  });
}

function handleNumberInput() {
  const input = this.value;

  const numbers = input
    .trim()
    .split(',')
    .map((num) => num.trim())
    .filter((num) => num !== '')
    .slice(0, 6);
  if (numbers.length !== 6) return;
  const ids = [
    'first-number',
    'second-number',
    'third-number',
    'fourth-number',
    'fifth-number',
    'sixth-number',
  ];

  ids.forEach((id, index) => {
    document.getElementById(id).value = numbers[index] || '';
  });
}

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
  bindEnterKeyDownListener();
}

document.addEventListener('DOMContentLoaded', initializeApp);
