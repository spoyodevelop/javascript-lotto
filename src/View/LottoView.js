import { lottoResults } from '../settings/systemSettings.js';
import { elements } from './elements.js';
import gameState from '../state/state.js';

import Toast from '../components/Toast/Toast.js';
import { HIDDEN_CLASS, INPUT_IDS } from '../settings/webSettings.js';
import LottoList from '../components/LottoList/LottoList.js';
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
function getUserNumbers() {
  const userNumbers = INPUT_IDS.map((id) => document.getElementById(id).value);
  const bonusNumber = document.getElementById('bonus-number').value;
  return { userNumbers, bonusNumber };
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

function resetLottoList() {
  elements.lottoList.scrollTop = 0;
  while (elements.lottoList.firstChild) {
    elements.lottoList.removeChild(elements.lottoList.firstChild);
  }
}

function showRevenueRate(revenueRate) {
  elements.revenueRateResult.textContent = `당신의 총 수익률은 ${revenueRate.toFixed(
    1,
  )}%입니다.`;
}

function closeResultModal() {
  elements.resultModal.close();
}

function updatePurchaseUI(ticket) {
  LottoList.showLottoList(gameState.lottos);
  elements.purchaseAmount.textContent = `총 ${ticket}개를 구매하였습니다.`;
  elements.lottosDiv.classList.remove(HIDDEN_CLASS);
  elements.checkUserNumberDiv.classList.remove(HIDDEN_CLASS);
  LottoList.bindClipboardCopyEvent();
  Toast.showToast(`총 ${ticket}개를 구매하였습니다.`, 'success');
  elements.purchaseLottoButton.disabled = true;
  elements.userMoneyInput.disabled = true;
  resetInputs(['user-money']);
}
function resetUI() {
  elements.checkUserNumberDiv.classList.add(HIDDEN_CLASS);
  elements.lottosDiv.classList.add(HIDDEN_CLASS);
  elements.resultModal.close();
  elements.purchaseLottoButton.disabled = false;
  elements.userMoneyInput.disabled = false;
  Toast.resetToast();
}

export {
  initPrizeBoard,
  resetInputs,
  updateWinCount,
  resetLottoList,
  showRevenueRate,
  closeResultModal,
  updatePurchaseUI,
  getUserNumbers,
  resetUI,
};
