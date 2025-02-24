import makeLotto from './src/service/LottoService.js';
import validateLottoPurchase from './src/Validation/validateLottoPurchase';
import Lotto from './src/model/Lotto.js';
import validateBonusNumber from './src/Validation/validateBonusNumber.js';
let lottos;

document.addEventListener('DOMContentLoaded', () => {
  const userMoneyInput = document.getElementById('userMoney');
  const purchaseLottoButton = document.getElementById('purchaseLotto');
  const lottosDiv = document.getElementById('lottos');
  const checkUserNumberDiv = document.getElementById('checkUserNumber');
  const checkResultButton = document.getElementById('checkResult');

  purchaseLottoButton.addEventListener('click', () => {
    const inputValue = userMoneyInput.value.trim();
    try {
      const ticket = validateLottoPurchase(inputValue);
      lottos = makeLotto(ticket, 'web');
      showLottoList(lottos);
      lottosDiv.classList.remove('hidden');
      checkUserNumberDiv.classList.remove('hidden');
      userMoneyInput.value = '';
    } catch (error) {
      alert(error.message);
    }
  });
  checkResultButton.addEventListener('click', () => {
    const firstNumber = document.getElementById('firstNumber').value;
    const secondNumber = document.getElementById('secondNumber').value;
    const thirdNumber = document.getElementById('thirdNumber').value;
    const fourthNumber = document.getElementById('fourthNumber').value;
    const fifthNumber = document.getElementById('fifthNumber').value;
    const sixthNumber = document.getElementById('sixthNumber').value;
    const bonusNumber = document.getElementById('bonusNumber').value;
    try {
      const userLotto = new Lotto([
        firstNumber,
        secondNumber,
        thirdNumber,
        fourthNumber,
        fifthNumber,
        sixthNumber,
      ]);
      const { checkedlotto, checkedBonusNumber } = validateBonusNumber(
        userLotto,
        bonusNumber,
      );
    } catch (error) {
      alert(error.message);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
});
function showLottoList(lottos) {
  const lottoList = document.getElementById('lottoList');

  while (lottoList.firstChild) {
    lottoList.removeChild(lottoList.firstChild);
  }

  lottos.forEach((lotto) => {
    console.log(lotto.numbers);
    const li = document.createElement('li');
    li.textContent = lotto.numbers.join(', ');
    lottoList.appendChild(li);
  });
}
