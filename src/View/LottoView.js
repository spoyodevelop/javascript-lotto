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
  lottos.forEach((lotto) => {
    const li = document.createElement('li');
    li.classList.add('lotto');

    // 이미지 요소 추가
    const img = document.createElement('img');
    img.src = '../../ticket.png'; // 로또 공 이미지
    img.alt = 'Lotto Ticket';
    img.classList.add('lotto-ticket'); // 스타일 적용 가능

    // 숫자 텍스트 추가
    const span = document.createElement('span');
    span.textContent = lotto.numbers.join(', ');
    span.classList.add('lotto-numbers');

    // li 요소에 이미지와 숫자 추가
    li.appendChild(img);
    li.appendChild(span);
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
