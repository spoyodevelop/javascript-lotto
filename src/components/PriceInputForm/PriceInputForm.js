import { processLottoPurchase } from '../../domain/GameLogic';
import { resetInputs } from '../../View/LottoView';
import showToast from '../../View/ToastView';
import { purchaseLottoButton, userMoneyInput } from './elements';

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
      showToast(error.message);
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
