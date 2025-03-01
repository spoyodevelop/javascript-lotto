import { calculateLottos } from '../../domain/GameLogic';
import Lotto from '../../model/Lotto';
import { HIDDEN_CLASS, INPUT_IDS } from '../../settings/webSettings';
import validateBonusNumber from '../../Validation/validateBonusNumber';
import { resetInputs } from '../../View/LottoView';
import { checkResultButton, checkUserNumberDiv } from './elements';
import Toast from '../Toast/Toast.js';

function getUserNumbers() {
  const userNumbers = INPUT_IDS.map((id) => document.getElementById(id).value);
  const bonusNumber = document.getElementById('bonus-number').value;
  return { userNumbers, bonusNumber };
}

const WinningNumbersInputForm = {
  init: ({ onCheckResult }) => {
    checkResultButton.addEventListener(
      'click',
      WinningNumbersInputForm.checkResult,
    );
    WinningNumbersInputForm.onCheckResult = onCheckResult;
  },
  show: () => {
    checkUserNumberDiv.classList.remove(HIDDEN_CLASS);
  },
  hide: () => {
    checkUserNumberDiv.classList.add(HIDDEN_CLASS);
  },
  reset: () => {
    resetInputs([...INPUT_IDS, 'bonus-number']);
  },
  checkResult: () => {
    try {
      const { userNumbers, bonusNumber } = getUserNumbers();
      const userLotto = new Lotto(userNumbers);
      const parsedLotto = validateBonusNumber(userLotto, bonusNumber);
      const { winCount, revenueRate } = calculateLottos(parsedLotto);

      WinningNumbersInputForm.onCheckResult(winCount, revenueRate);
    } catch (error) {
      Toast.showToast(error.message, 'error');
    }
  },
  onCheckResult: () => {
    console.log('onCheckResult 이 설정되지 않았습니다.');
  },
};

export default WinningNumbersInputForm;
