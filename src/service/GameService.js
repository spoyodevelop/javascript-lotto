import Lotto from '../model/Lotto.js';
import gameState from '../state/state.js';
import { elements } from '../View/elements.js';
import validateBonusNumber from '../Validation/validateBonusNumber.js';
import {
  resetInputs,
  showRevenueRate,
  updateWinCount,
  resetLottoList,
  updatePurchaseUI,
  getUserNumbers,
  resetUI,
} from '../View/LottoView.js';
import LottoList from '../components/LottoList/LottoList.js';
import Toast from '../components/Toast/Toast.js';
import { INPUT_IDS } from '../settings/webSettings.js';
import { processLottoPurchase, calculateLottos } from '../domain/GameLogic.js';

function handlePurchaseLotto() {
  const inputValue = elements.userMoneyInput.value.trim();
  try {
    const ticket = processLottoPurchase(inputValue);
    LottoList.showLottoList(gameState.lottos);
    updatePurchaseUI(ticket);
  } catch (error) {
    Toast.showToast(error.message);
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
    Toast.showToast('총 수익률을 계산하여 완료하였습니다.', 'success');
    setTimeout(() => {
      Toast.showToast(
        '다시 시도하기를 하면 게임을 다시 시작할수 있어요. 다시 해볼래요?',
        'info',
      );
    }, 3000);
    elements.resultModal.showModal();
  } catch (error) {
    Toast.showToast(error.message);
  }
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

  Toast.showToast('게임을 다시 시작했어요.', 'info');
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

  INPUT_IDS.forEach((id, index) => {
    document.getElementById(id).value = numbers[index] || '';
  });
}

export { handleCheckResult, handlePurchaseLotto, retryGame, handleNumberInput };
