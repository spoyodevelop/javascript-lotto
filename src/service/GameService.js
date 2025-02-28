import Lotto from '../model/Lotto.js';
import gameState from '../state/state.js';
import { elements } from '../View/elements.js';
import validateBonusNumber from '../Validation/validateBonusNumber.js';
import {
  showLottoList,
  resetInputs,
  showRevenueRate,
  updateWinCount,
  resetLottoList,
  updatePurchaseUI,
  getUserNumbers,
  resetUI,
} from '../View/LottoView.js';
import showToast from '../View/ToastView.js';
import { INPUT_IDS } from '../settings/webSettings.js';
import { processLottoPurchase, calculateLottos } from '../domain/GameLogic.js';

function handlePurchaseLotto() {
  const inputValue = elements.userMoneyInput.value.trim();
  try {
    const ticket = processLottoPurchase(inputValue);
    showLottoList(gameState.lottos);
    updatePurchaseUI(ticket);
  } catch (error) {
    showToast(error.message);
    resetInputs(['user-money']);
  }
}

function handleCheckResult() {
  try {
    const { userNumbers, bonusNumber } = getUserNumbers();
    const userLotto = new Lotto(userNumbers);
    // 혹여나, 리셋하고 싶으시면, 이 주석을 풀기 바랍니다.
    // resetInputs([...inputIds, 'bonus-number']);
    const parsedLotto = validateBonusNumber(userLotto, bonusNumber);
    const { winCount, revenueRate } = calculateLottos(parsedLotto);
    showRevenueRate(revenueRate);
    updateWinCount(winCount);
    showToast('총 수익률을 계산하여 완료하였습니다.', 'success');
    elements.resultModal.showModal();
  } catch (error) {
    showToast(error.message);
  }
}
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`로또 값 ${text}이 클립보드에 복사되었습니다.`, 'success');
  });
}

function bindClipboardCopyEvent() {
  if (bindClipboardCopyEvent.isBound) return;
  bindClipboardCopyEvent.isBound = true;

  document.body.addEventListener('click', (event) => {
    const lottoElement = event.target.closest('.lotto');
    if (lottoElement) {
      copyTextToClipboard(lottoElement.children[1].textContent);
    }
  });
}
function retryGame() {
  gameState.resetGameState();
  resetInputs([...INPUT_IDS, 'bonus-number']);

  resetLottoList();
  updateWinCount({
    THREE_MATCH: 0,
    FOUR_MATCH: 0,
    FIVE_MATCH: 0,
    FIVE_MATCH_WITH_BONUS: 0,
    SIX_MATCH: 0,
  });
  resetUI();

  showToast('게임을 다시 하시겠습니까?', 'info');
}
function handleNumberInput(event) {
  const input = event.target.value;

  const numbers = input
    .trim()
    .split(',')
    .map((num) => num.trim())
    .filter((num) => num !== '')
    .slice(0, 6);
  if (numbers.length !== 6) return;
  console.log(numbers);
  INPUT_IDS.forEach((id, index) => {
    document.getElementById(id).value = numbers[index] || '';
  });
}

export {
  handleCheckResult,
  handlePurchaseLotto,
  retryGame,
  handleNumberInput,
  bindClipboardCopyEvent,
};
