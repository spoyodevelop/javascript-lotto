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

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
  bindEnterKeyDownListener();
}

document.addEventListener('DOMContentLoaded', initializeApp);
