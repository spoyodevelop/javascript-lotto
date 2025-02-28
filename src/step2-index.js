import { elements } from './View/elements.js';
import {
  handleCheckResult,
  handlePurchaseLotto,
  handleNumberInput,
  retryGame,
} from './service/GameService.js';
import { initPrizeBoard, closeResultModal } from './View/LottoView.js';
import { INPUT_IDS } from './settings/webSettings.js';

function bindEventListeners() {
  elements.app.addEventListener('click', function (event) {
    if (event.target.matches('#purchase-lotto')) handlePurchaseLotto();
    else if (event.target.matches('#check-result')) handleCheckResult();
    else if (event.target.matches('#reset-game')) retryGame();
    else if (event.target.matches('#close-button')) closeResultModal();
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
