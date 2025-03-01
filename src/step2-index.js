import { elements } from './View/elements.js';
import {
  handleCheckResult,
  handlePurchaseLotto,
  handleNumberInput,
} from './service/GameService.js';
import { initPrizeBoard, closeResultModal } from './View/LottoView.js';
import { INPUT_IDS } from './settings/webSettings.js';
import PriceInputForm from './components/PriceInputForm/PriceInputForm.js';
import LottoList from './components/LottoList/LottoList.js';
import gameState from './state/state.js';
import WinningNumbersInputForm from './components/WinningNumbersInputForm/WinningNumbersInputForm.js';
import Toast from './components/Toast/Toast.js';
import GameResultDialog from './components/GameResultDialog/GameResultDialog.js';

function bindEventListeners() {
  PriceInputForm.init({
    onPriceSubmit: (ticket) => {
      try {
        LottoList.showLottoList(gameState.lottos);
        LottoList.updatePurchaseUI(ticket);
      } catch (error) {
        Toast.showToast(error.message);
        PriceInputForm.reset();
      }

      WinningNumbersInputForm.show();
    },
  });

  WinningNumbersInputForm.init({
    onCheckResult: (winCount, revenueRate) => {
      GameResultDialog.show();
      GameResultDialog.showRevenueRate(revenueRate);
      GameResultDialog.updateWinCount(winCount);

      Toast.showToast('총 수익률을 계산하여 완료하였습니다.', 'success');
      setTimeout(() => {
        Toast.showToast(
          '다시 시도하기를 하면 게임을 다시 시작할수 있어요. 다시 해볼래요?',
          'info',
        );
      }, 3000);
    },
  });

  GameResultDialog.init({
    onRetryGame: () => {
      PriceInputForm.reset();
      LottoList.reset();
      WinningNumbersInputForm.reset();
      GameResultDialog.reset();

      WinningNumbersInputForm.hide();
      GameResultDialog.hide();

      Toast.showToast('게임을 다시 시작했어요.', 'info');
    },
  });

  elements.app.addEventListener('click', function (event) {
    if (event.target.matches('#close-button')) closeResultModal();
    else if (event.target.matches('#result-modal')) closeResultModal();
  });

  elements.app.addEventListener('input', function (event) {
    if (event.target.matches('#first-number')) handleNumberInput(event);
  });
}

function bindEnterKeyDownListener() {
  [...INPUT_IDS, 'bonus-number'].forEach((id) => {
    // 음..
    // 일단, enter를 누르면 handleCheckResult를 불러옵니다.
    // 그런데, enter를 누르자 마자 dialog가 popup이 되고,
    // 그리고 '다시 시도하기' 버튼에 focus가 되있는 것이 동시에 눌려
    // 그냥 enter를 누르면 두개 동시에 실행이 되버립니다.
    // form등을 쓰면 해결이 되겠지만
    // 지금 사용용도로는 꼭 적절치는 않다고 생각되어,
    // 50ms 이후에 handleCheckResult를 실행되게끔 만들었습니다.

    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setTimeout(handleCheckResult, 50);
    });
  });
  elements.userMoneyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handlePurchaseLotto();
  });
}

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
  bindEnterKeyDownListener();
}

document.addEventListener('DOMContentLoaded', initializeApp);
