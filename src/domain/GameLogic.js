import validateLottoPurchase from '../Validation/validateLottoPurchase.js';
import gameState from '../state/state.js';
import makeLotto from '../service/LottoService.js';
import {
  calculatePrize,
  calculateWins,
  calculateRevenueRate,
} from '../service/CalculatorService.js';
import { lottoResults } from '../settings/systemSettings.js';

function processLottoPurchase(inputValue) {
  const ticket = validateLottoPurchase(inputValue);
  gameState.setPurchasePrice(+inputValue);
  gameState.setLottos(makeLotto(ticket, 'web'));
  return ticket;
}

function calculateLottos(parsedLotto) {
  const winCount = calculateWins(gameState.lottos, parsedLotto);
  const totalPrize = calculatePrize(winCount, lottoResults.prizeMoney);
  const revenueRate = calculateRevenueRate(totalPrize, gameState.purchasePrice);
  return { winCount, revenueRate };
}
export { calculateLottos, processLottoPurchase };
