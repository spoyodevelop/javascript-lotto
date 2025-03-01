import { processLottoPurchase } from '../../domain/GameLogic.js';
import { resetInputs } from '../../View/LottoView.js';
import { purchaseLottoButton, userMoneyInput } from './elements.js';

import Toast from '../Toast/Toast.js';

const PriceInputForm = {
  init: ({ onPriceSubmit }) => {
    purchaseLottoButton.addEventListener('click', PriceInputForm.submitPrice);
    PriceInputForm.onPriceSubmit = onPriceSubmit;
  },
  submitPrice: () => {
    const inputValue = userMoneyInput.value.trim();

    try {
      const ticket = processLottoPurchase(inputValue);
      purchaseLottoButton.disabled = true;
      userMoneyInput.disabled = true;
      PriceInputForm.reset();

      PriceInputForm.onPriceSubmit(ticket);
    } catch (error) {
      Toast.showToast(error.message);
      PriceInputForm.reset();
    }
  },
  reset: () => {
    resetInputs(['user-money']);
    purchaseLottoButton.disabled = false;
    userMoneyInput.disabled = false;
  },
  onPriceSubmit: () => {
    console.log('onPriceSubmit 이 설정되지 않았습니다.');
  },
};

export default PriceInputForm;
