import { resetButton, resultModal, revenueRateResult } from './elements';
import gameState from '../../state/state';

const GameResultDialog = {
  init: ({ onRetryGame }) => {
    resetButton.addEventListener('click', GameResultDialog.retryGame);
    GameResultDialog.onRetryGame = onRetryGame;
  },
  show: () => {
    resultModal.showModal();
  },
  hide: () => {
    resultModal.close();
  },
  retryGame: () => {
    gameState.resetGameState();
    GameResultDialog.onRetryGame();
  },
  showRevenueRate: (revenueRate) => {
    revenueRateResult.textContent = `당신의 총 수익률은 ${revenueRate.toFixed(
      1,
    )}%입니다.`;
  },
  updateWinCount: (winCount) => {
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
  },
  reset: () => {
    GameResultDialog.updateWinCount({
      THREE_MATCH: 0,
      FOUR_MATCH: 0,
      FIVE_MATCH: 0,
      FIVE_MATCH_WITH_BONUS: 0,
      SIX_MATCH: 0,
    });
  },
};

export default GameResultDialog;
