import { lottoResults } from '../settings/systemSettings.js';
import { elements } from './elements.js';

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

export {
  initPrizeBoard,
  resetInputs,
  updateWinCount,
  showLottoList,
  resetLottoList,
  showRevenueRate,
  closeResultModal,
};
