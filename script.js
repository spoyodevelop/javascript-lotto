import makeLotto from './src/service/LottoService.js';
import { getPurchasePrice } from './src/service/ParsingService.js';
import validateLottoPurchase from './src/Validation/validateLottoPurchase';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userInput');
  const button = document.getElementById('myButton');

  button.addEventListener('click', async () => {
    const inputValue = input.value.trim();
    try {
      const ticket = validateLottoPurchase(inputValue);
      alert(`총 ${ticket}개를 구매했습니다.`);
    } catch (error) {
      alert(error.message);
    }
  });
});
