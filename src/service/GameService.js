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
    resetInputs(['user-money']);
  } catch (error) {
    resetInputs(['user-money']);
    alert(error.message);
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
    // 음.. 조금 고민해 보고 리셋 할지 결정하자.
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

    elements.resultModal.showModal();
  } catch (error) {
    alert(error.message);
  }
}
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`로또 값 ${text}이 복사되었습니다.`);
  });
}
function bindClipboardCopyEvent() {
  const lottoNumbersElements = [...document.getElementsByClassName('lotto')];
  console.log(lottoNumbersElements);
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
}

export { handleCheckResult, handlePurchaseLotto, retryGame };
