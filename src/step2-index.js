import { elements } from './View/elements.js';
import {
  handleCheckResult,
  handlePurchaseLotto,
  retryGame,
} from './service/GameService.js';
import { initPrizeBoard, closeResultModal } from './View/LottoView.js';

function bindEventListeners() {
  elements.purchaseLottoButton.addEventListener('click', handlePurchaseLotto);
  elements.checkResultButton.addEventListener('click', handleCheckResult);
  elements.resetButton.addEventListener('click', retryGame);
  elements.closeButton.addEventListener('click', closeResultModal);
  elements.firstNumber.addEventListener('input', handleNumberInput);
}
function bindEnterKeyDownListener() {
  [
    'first-number',
    'second-number',
    'third-number',
    'fourth-number',
    'fifth-number',
    'sixth-number',
    'bonus-number',
  ].forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setTimeout(handleCheckResult, 50);
    });
  });
  elements.userMoneyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handlePurchaseLotto();
  });
}

function handleNumberInput() {
  const input = this.value;

  const numbers = input
    .trim()
    .split(',')
    .map((num) => num.trim())
    .filter((num) => num !== '')
    .slice(0, 6);
  if (numbers.length !== 6) return;
  const ids = [
    'first-number',
    'second-number',
    'third-number',
    'fourth-number',
    'fifth-number',
    'sixth-number',
  ];

  ids.forEach((id, index) => {
    document.getElementById(id).value = numbers[index] || '';
  });
}

// CSS 스타일 추가
const toastStyle = `
  .toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .toast {
    padding: 12px 20px;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(0);
  }
  .toast.error { background-color: #d9534f; }
  .toast.warning { background-color: #f0ad4e; }
  .toast.info { background-color: #5bc0de; }
  .toast.success { background-color: #5cb85c; }
`;

// 스타일 추가
const styleTag = document.createElement('style');
styleTag.innerHTML = toastStyle;
document.head.appendChild(styleTag);

// 토스트 컨테이너 생성 (최초 1회)
let toastContainer = document.querySelector('.toast-container');
if (!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

// 토스트 팝업 함수
export function showToast(message, type = 'error', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  if (type == 'error') message = message.replace('[ERROR]', '');

  toast.innerHTML = message;

  toastContainer.appendChild(toast);

  // 애니메이션 적용
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // 자동 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // 클릭 시 즉시 제거
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
}

function initializeApp() {
  initPrizeBoard();
  bindEventListeners();
  bindEnterKeyDownListener();
}

document.addEventListener('DOMContentLoaded', initializeApp);
