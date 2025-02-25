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

// TODO, disable button when input is none.

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
}

document.addEventListener('DOMContentLoaded', initializeApp);
