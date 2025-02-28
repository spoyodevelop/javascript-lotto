var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _Lotto_instances, lottoValidation_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const elements = {
  app: document.getElementById("app"),
  userMoneyInput: document.getElementById("user-money"),
  purchaseLottoButton: document.getElementById("purchase-lotto"),
  lottosDiv: document.getElementById("lottos"),
  checkUserNumberDiv: document.getElementById("check-user-number"),
  checkResultButton: document.getElementById("check-result"),
  resultModal: document.getElementById("result-modal"),
  resetButton: document.getElementById("reset-game"),
  lottoList: document.getElementById("lotto-list"),
  revenueRateResult: document.getElementById("revenue-rate-result"),
  purchaseAmount: document.getElementById("purchase-amount"),
  closeButton: document.getElementById("close-button"),
  generatedLottoNumbers: document.getElementById("generated-lotto-numbers"),
  firstNumber: document.getElementById("first-number")
};
const lottoGameSettings = {
  lottoSize: 6,
  lottoPrice: 1e3,
  minLottoNumber: 1,
  maxLottoNumber: 45
};
const lottoResults = {
  prizeMoney: {
    NO_MATCH: 0,
    THREE_MATCH: 5e3,
    FOUR_MATCH: 5e4,
    FIVE_MATCH: 15e5,
    FIVE_MATCH_WITH_BONUS: 3e7,
    SIX_MATCH: 2e9
  }
};
const ERROR_MESSAGE = Object.freeze({
  emptyInput: "[ERROR] 빈 문자는 입력할수 없어요. 다시 입력해주세요.",
  notANumber: "[ERROR] 문자는 입력할 수 없습니다. 다시 입력해주세요.",
  notInteger: "[ERROR] 정수가 아닌 수는 입력할 수 없습니다. 다시 입력해주세요.",
  notPositive: "[ERROR] 양수가 아닌 수는 입력할 수 없습니다. 다시 입력해주세요.",
  notSixNumbers: `[ERROR] 로또는 ${lottoGameSettings.lottoSize}개의 숫자로 이루어져야 합니다. 다시 입력해주세요.`,
  duplicatedNumbers: "[ERROR] 로또 번호는 중복될 수 없습니다. 다시 입력해주세요.",
  duplicatedBonusNumbers: "[ERROR] 보너스 번호는 중복될 수 없습니다. 다시 입력해주세요.",
  numberOutOfRange: `[ERROR] 로또 번호는 ${lottoGameSettings.minLottoNumber}-${lottoGameSettings.maxLottoNumber} 사이여야 합니다. 다시 입력해주세요.`,
  notANote: `[ERROR] 금액은 ${lottoGameSettings.lottoPrice.toLocaleString()} 단위로 입력하셔야 합니다. 다시 입력해주세요.`,
  notEnoughMoney: `[ERROR] 최소 금액은 ${lottoGameSettings.lottoPrice.toLocaleString()}원 입니다. 다시 입력해주세요.`,
  invalidCommand: "[ERROR] 유효하지 않은 입력입니다. y/n으로 입력해주세요."
});
function validateNumberInRange(numbers) {
  if (numbers.some(
    (number) => number < lottoGameSettings.minLottoNumber || number > lottoGameSettings.maxLottoNumber
  ))
    throw new Error(ERROR_MESSAGE.numberOutOfRange);
  return numbers;
}
function validateNumber(input) {
  return _isPositive(_isInteger(_isNumber(input)));
}
function _isNumber(input) {
  if (input.length === 0) throw new Error(ERROR_MESSAGE.emptyInput);
  if (Number.isNaN(Number(input))) throw new Error(ERROR_MESSAGE.notANumber);
  return Number(input);
}
function _isInteger(input) {
  if (!Number.isInteger(input)) throw new Error(ERROR_MESSAGE.notInteger);
  return input;
}
function _isPositive(input) {
  if (input <= 0) throw new Error(ERROR_MESSAGE.notPositive);
  return input;
}
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _numbers);
    const parsedNumbers = __privateMethod(this, _Lotto_instances, lottoValidation_fn).call(this, numbers);
    __privateSet(this, _numbers, parsedNumbers.sort((a, b) => a - b));
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
_Lotto_instances = new WeakSet();
lottoValidation_fn = function(numbers) {
  numbers.forEach((number) => validateNumber(number));
  if (numbers.length !== lottoGameSettings.lottoSize)
    throw new Error(ERROR_MESSAGE.notSixNumbers);
  if (numbers.length !== new Set(numbers).size)
    throw new Error(ERROR_MESSAGE.duplicatedNumbers);
  validateNumberInRange(numbers);
  return numbers.map((number) => Number(number));
};
const gameState = new class State {
  constructor() {
    this.purchasePrice = 0;
    this.lottos = [];
  }
  setPurchasePrice(price) {
    this.purchasePrice = price;
  }
  setLottos(lottos) {
    this.lottos = lottos;
  }
  resetGameState() {
    this.purchasePrice = 0;
    this.lottos = [];
  }
}();
function validateBonusNumber(lotto, bonusNumber) {
  validateNumber(bonusNumber);
  validateNumberInRange([bonusNumber]);
  if (lotto.numbers.includes(Number(bonusNumber)))
    throw new Error(ERROR_MESSAGE.duplicatedBonusNumbers);
  return { checkedLotto: lotto, checkedBonusNumber: Number(bonusNumber) };
}
function showToast(message, type = "error", duration = 3e3) {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  if (type == "error") message = message.replace("[ERROR]", "");
  toast.innerHTML = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
  toast.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });
}
const INPUT_IDS = [
  "first-number",
  "second-number",
  "third-number",
  "fourth-number",
  "fifth-number",
  "sixth-number"
];
const HIDDEN_CLASS = "hidden";
function initPrizeBoard() {
  const idMapping = {
    THREE_MATCH: "three-match-price",
    FOUR_MATCH: "four-match-price",
    FIVE_MATCH: "five-match-price",
    FIVE_MATCH_WITH_BONUS: "five-match-with-bonus-price",
    SIX_MATCH: "six-match-price"
  };
  Object.entries(idMapping).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = lottoResults.prizeMoney[key].toLocaleString();
    }
  });
}
function getUserNumbers() {
  const userNumbers = INPUT_IDS.map((id) => document.getElementById(id).value);
  const bonusNumber = document.getElementById("bonus-number").value;
  return { userNumbers, bonusNumber };
}
function resetInputs(ids) {
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
}
function showLottoList(lottos) {
  resetLottoList();
  const totalItems = lottos.length;
  const visibleItems = 100;
  let start = 0;
  function renderItems() {
    const fragment = document.createDocumentFragment();
    for (let i = start; i < Math.min(start + visibleItems, totalItems); i++) {
      const lotto = lottos[i];
      const li = document.createElement("li");
      li.classList.add("lotto");
      const img = document.createElement("img");
      img.src = "./ticket.png";
      img.alt = "Lotto Ticket";
      img.classList.add("lotto-ticket");
      const span = document.createElement("span");
      span.textContent = lotto.numbers.join(", ");
      span.classList.add("lotto-numbers");
      li.appendChild(img);
      li.appendChild(span);
      fragment.appendChild(li);
    }
    elements.lottoList.appendChild(fragment);
  }
  if (elements.lottoList.lottoScrollHandler) {
    elements.lottoList.removeEventListener(
      "scroll",
      elements.lottoList.lottoScrollHandler
    );
  }
  const lottoScrollHandler = () => {
    if (elements.lottoList.scrollTop + elements.lottoList.clientHeight >= elements.lottoList.scrollHeight) {
      start += visibleItems;
      if (start < totalItems) renderItems();
    }
  };
  elements.lottoList.lottoScrollHandler = lottoScrollHandler;
  elements.lottoList.addEventListener("scroll", lottoScrollHandler);
  renderItems();
}
function updateWinCount(winCount) {
  const idMapping = {
    THREE_MATCH: "three-match-amount",
    FOUR_MATCH: "four-match-amount",
    FIVE_MATCH: "five-match-amount",
    FIVE_MATCH_WITH_BONUS: "five-match-with-bonus-amount",
    SIX_MATCH: "six-match-amount"
  };
  Object.entries(idMapping).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = `${winCount[key].toLocaleString()}개`;
    }
  });
}
function resetLottoList() {
  elements.lottoList.scrollTop = 0;
  while (elements.lottoList.firstChild) {
    elements.lottoList.removeChild(elements.lottoList.firstChild);
  }
}
function showRevenueRate(revenueRate) {
  elements.revenueRateResult.textContent = `당신의 총 수익률은 ${revenueRate.toFixed(
    1
  )}%입니다.`;
}
function closeResultModal() {
  elements.resultModal.close();
}
function updatePurchaseUI(ticket) {
  showLottoList(gameState.lottos);
  elements.purchaseAmount.textContent = `총 ${ticket}개를 구매하였습니다.`;
  elements.lottosDiv.classList.remove(HIDDEN_CLASS);
  elements.checkUserNumberDiv.classList.remove(HIDDEN_CLASS);
  bindClipboardCopyEvent();
  showToast(`총 ${ticket}개를 구매하였습니다.`, "success");
  elements.purchaseLottoButton.disabled = true;
  elements.userMoneyInput.disabled = true;
  resetInputs(["user-money"]);
}
function resetUI() {
  elements.checkUserNumberDiv.classList.add(HIDDEN_CLASS);
  elements.lottosDiv.classList.add(HIDDEN_CLASS);
  elements.resultModal.close();
  elements.purchaseLottoButton.disabled = false;
  elements.userMoneyInput.disabled = false;
}
function validateLottoPurchase(input) {
  const money = validateNumber(input);
  if (money < lottoGameSettings.lottoPrice)
    throw new Error(ERROR_MESSAGE.notEnoughMoney);
  if (money % lottoGameSettings.lottoPrice !== 0)
    throw new Error(ERROR_MESSAGE.notANote);
  return money / lottoGameSettings.lottoPrice;
}
function createNumberArray(min, max) {
  return Array.from({ length: max - min + 1 }, (_, i) => i + min);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getUniqueRandomNumbers(numberRange, count) {
  const { min, max } = numberRange;
  const numbers = createNumberArray(min, max);
  const shuffled = shuffleArray(numbers);
  return shuffled.slice(0, count);
}
function makeLotto(purchaseAmount, target) {
  const lottos = [];
  for (let i = 0; i < purchaseAmount; i++) {
    const numberRange = {
      min: lottoGameSettings.minLottoNumber,
      max: lottoGameSettings.maxLottoNumber
    };
    const numbers = getUniqueRandomNumbers(
      numberRange,
      lottoGameSettings.lottoSize
    );
    const lotto = new Lotto(numbers);
    lottos.push(lotto);
  }
  return lottos;
}
function countMatchedNumbers(arrA, arrB) {
  return arrA.filter((number) => arrB.includes(number)).length;
}
function getWinCategory(matchedCount, isBonusMatched) {
  switch (matchedCount) {
    case 6:
      return "SIX_MATCH";
    case 5:
      return isBonusMatched ? "FIVE_MATCH_WITH_BONUS" : "FIVE_MATCH";
    case 4:
      return "FOUR_MATCH";
    case 3:
      return "THREE_MATCH";
    default:
      return "NO_MATCH";
  }
}
function calculateWins(lottos, parsedLotto) {
  const { checkedLotto, checkedBonusNumber } = parsedLotto;
  const winCount = {
    SIX_MATCH: 0,
    FIVE_MATCH_WITH_BONUS: 0,
    FIVE_MATCH: 0,
    FOUR_MATCH: 0,
    THREE_MATCH: 0,
    NO_MATCH: 0
  };
  lottos.forEach((lotto) => {
    const matchedCount = countMatchedNumbers(
      lotto.numbers,
      checkedLotto.numbers
    );
    const isBonusMatched = lotto.numbers.includes(checkedBonusNumber);
    const category = getWinCategory(matchedCount, isBonusMatched);
    winCount[category] += 1;
  });
  return winCount;
}
function calculatePrize(winCount, prizeMoney) {
  return Object.entries(winCount).reduce(
    (totalPrize, [prizeName, prizeCount]) => {
      return totalPrize + prizeMoney[prizeName] * prizeCount;
    },
    0
  );
}
function calculateRevenueRate(total, purchasePrice) {
  return total / Number(purchasePrice) * 100;
}
function processLottoPurchase(inputValue) {
  const ticket = validateLottoPurchase(inputValue);
  gameState.setPurchasePrice(+inputValue);
  gameState.setLottos(makeLotto(ticket));
  return ticket;
}
function calculateLottos(parsedLotto) {
  const winCount = calculateWins(gameState.lottos, parsedLotto);
  const totalPrize = calculatePrize(winCount, lottoResults.prizeMoney);
  const revenueRate = calculateRevenueRate(totalPrize, gameState.purchasePrice);
  return { winCount, revenueRate };
}
function handlePurchaseLotto() {
  const inputValue = elements.userMoneyInput.value.trim();
  try {
    const ticket = processLottoPurchase(inputValue);
    showLottoList(gameState.lottos);
    updatePurchaseUI(ticket);
  } catch (error) {
    showToast(error.message);
    resetInputs(["user-money"]);
  }
}
function handleCheckResult() {
  try {
    const { userNumbers, bonusNumber } = getUserNumbers();
    const userLotto = new Lotto(userNumbers);
    const parsedLotto = validateBonusNumber(userLotto, bonusNumber);
    const { winCount, revenueRate } = calculateLottos(parsedLotto);
    showRevenueRate(revenueRate);
    updateWinCount(winCount);
    showToast("총 수익률을 계산하여 완료하였습니다.", "success");
    elements.resultModal.showModal();
  } catch (error) {
    showToast(error.message);
  }
}
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`로또 값 ${text}이 클립보드에 복사되었습니다.`, "success");
  });
}
function bindClipboardCopyEvent() {
  document.body.addEventListener("click", (event) => {
    const lottoElement = event.target.closest(".lotto");
    if (lottoElement) {
      copyTextToClipboard(lottoElement.children[1].textContent);
    }
  });
}
function retryGame() {
  gameState.resetGameState();
  resetInputs([...INPUT_IDS, "bonus-number"]);
  resetLottoList();
  updateWinCount({
    THREE_MATCH: 0,
    FOUR_MATCH: 0,
    FIVE_MATCH: 0,
    FIVE_MATCH_WITH_BONUS: 0,
    SIX_MATCH: 0
  });
  resetUI();
  showToast("게임을 다시 하시겠습니까?", "info");
}
function handleNumberInput(event) {
  const input = event.target.value;
  const numbers = input.trim().split(",").map((num) => num.trim()).filter((num) => num !== "").slice(0, 6);
  if (numbers.length !== 6) return;
  console.log(numbers);
  INPUT_IDS.forEach((id, index) => {
    document.getElementById(id).value = numbers[index] || "";
  });
}
function bindEventListeners() {
  elements.app.addEventListener("click", function(event) {
    if (event.target.matches("#purchase-lotto")) handlePurchaseLotto();
    else if (event.target.matches("#check-result")) handleCheckResult();
    else if (event.target.matches("#reset-game")) retryGame();
    else if (event.target.matches("#close-button")) closeResultModal();
    else if (event.target.matches("#result-modal")) closeResultModal();
  });
  elements.app.addEventListener("input", function(event) {
    if (event.target.matches("#first-number")) handleNumberInput(event);
  });
}
function bindEnterKeyDownListener() {
  [...INPUT_IDS, "bonus-number"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") setTimeout(handleCheckResult, 50);
    });
  });
  elements.userMoneyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handlePurchaseLotto();
  });
}
function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
  bindEnterKeyDownListener();
}
document.addEventListener("DOMContentLoaded", initializeApp);
