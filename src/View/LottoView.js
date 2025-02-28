import { lottoResults } from '../settings/systemSettings.js';
import { elements } from './elements.js';
import gameState from '../state/state.js';
import { bindClipboardCopyEvent } from '../service/GameService.js';
import showToast from './ToastView.js';
import { HIDDEN_CLASS, INPUT_IDS } from '../settings/webSettings.js';
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
function showLottoList(lottos) {
  resetLottoList();

  const totalItems = lottos.length;
  const visibleItems = 100;
  let start = 0;

  function renderItems() {
    const fragment = document.createDocumentFragment();

    for (let i = start; i < Math.min(start + visibleItems, totalItems); i++) {
      const lotto = lottos[i];
      const li = document.createElement('li');
      li.classList.add('lotto');

      const img = document.createElement('img');
      img.src = './ticket.png';
      img.alt = 'Lotto Ticket';
      img.classList.add('lotto-ticket');

      const span = document.createElement('span');
      span.textContent = lotto.numbers.join(', ');
      span.classList.add('lotto-numbers');

      li.appendChild(img);
      li.appendChild(span);
      fragment.appendChild(li);
    }

    elements.lottoList.appendChild(fragment);
  }

  // 기존에 등록된 스크롤 이벤트 리스너가 있다면 제거합니다.
  if (elements.lottoList.lottoScrollHandler) {
    elements.lottoList.removeEventListener(
      'scroll',
      elements.lottoList.lottoScrollHandler,
    );
  }

  // 새로운 스크롤 이벤트 핸들러를 정의합니다.
  const lottoScrollHandler = () => {
    if (
      elements.lottoList.scrollTop + elements.lottoList.clientHeight >=
      elements.lottoList.scrollHeight
    ) {
      start += visibleItems;
      if (start < totalItems) renderItems();
    }
  };

  // 핸들러 참조를 저장해두면 이후 다시 호출 시 제거할 수 있습니다.
  elements.lottoList.lottoScrollHandler = lottoScrollHandler;
  elements.lottoList.addEventListener('scroll', lottoScrollHandler);

  renderItems();
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
  showLottoList(gameState.lottos);
  elements.purchaseAmount.textContent = `총 ${ticket}개를 구매하였습니다.`;
  elements.lottosDiv.classList.remove(HIDDEN_CLASS);
  elements.checkUserNumberDiv.classList.remove(HIDDEN_CLASS);
  bindClipboardCopyEvent();
  showToast(`총 ${ticket}개를 구매하였습니다.`, 'success');
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
}

export {
  initPrizeBoard,
  resetInputs,
  updateWinCount,
  showLottoList,
  resetLottoList,
  showRevenueRate,
  closeResultModal,
  updatePurchaseUI,
  getUserNumbers,
  resetUI,
};
