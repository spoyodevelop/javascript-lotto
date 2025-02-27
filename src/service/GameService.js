import Lotto from '../model/Lotto.js';
import gameState from '../state/state.js';
import { elements } from '../View/elements.js';
import { lottoResults } from '../settings/systemSettings.js';
import makeLotto from './LottoService.js';
import {
  calculatePrize,
  calculateRevenueRate,
  calculateWins,
} from './CalculatorService.js';
import validateLottoPurchase from '../Validation/validateLottoPurchase.js';
import validateBonusNumber from '../Validation/validateBonusNumber.js';
import {
  showLottoList,
  resetInputs,
  showRevenueRate,
  updateWinCount,
  resetLottoList,
} from '../View/LottoView.js';
import showToast from '../View/ToastView.js';

function handlePurchaseLotto() {
  const inputValue = elements.userMoneyInput.value.trim();
  try {
    const ticket = validateLottoPurchase(inputValue);
    gameState.setPurchasePrice(+inputValue);
    gameState.setLottos(makeLotto(ticket, 'web'));
    showLottoList(gameState.lottos);
    elements.purchaseAmount.textContent = `총 ${ticket}개를 구매하였습니다.`;
    elements.lottosDiv.classList.remove('hidden');
    elements.checkUserNumberDiv.classList.remove('hidden');
    bindClipboardCopyEvent();
    showToast(`총 ${ticket}개를 구매하였습니다.`, 'success');
    resetInputs(['user-money']);
  } catch (error) {
    showToast(error.message);
    resetInputs(['user-money']);
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
    // 혹여나, 리셋하고 싶으시면, 이 주석을 풀기 바랍니다.
    // resetInputs([...inputIds, 'bonus-number']);

    const parsedLotto = validateBonusNumber(userLotto, bonusNumber);
    const winCount = calculateWins(gameState.lottos, parsedLotto);
    const totalPrize = calculatePrize(winCount, lottoResults.prizeMoney);
    const revenueRate = calculateRevenueRate(
      totalPrize,
      gameState.purchasePrice,
    );

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
  const lottoNumbersElements = [...document.getElementsByClassName('lotto')];
  lottoNumbersElements.forEach((element) =>
    element.addEventListener('click', () => {
      copyTextToClipboard(element.children[1].textContent);
    }),
  );
}
function retryGame() {
  gameState.resetGameState();
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
  elements.checkUserNumberDiv.classList.add('hidden');
  elements.lottosDiv.classList.add('hidden');
  elements.resultModal.close();
  showToast('게임을 다시 하시겠습니까?', 'success');
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
export { handleCheckResult, handlePurchaseLotto, retryGame, handleNumberInput };
