import { HIDDEN_CLASS } from '../../settings/webSettings';
import showToast from '../../View/ToastView';
import { lottoList, lottosDiv, purchaseAmount } from './elements';

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`로또 값 ${text}이 클립보드에 복사되었습니다.`, 'success');
  });
}

function bindClipboardCopyEvent() {
  if (bindClipboardCopyEvent.isBound) return;
  bindClipboardCopyEvent.isBound = true;

  document.body.addEventListener('click', (event) => {
    const lottoElement = event.target.closest('.lotto');
    if (lottoElement) {
      copyTextToClipboard(lottoElement.children[1].textContent);
    }
  });
}

const LottoList = {
  showLottoList: (lottos) => {
    LottoList.reset();

    lottosDiv.classList.remove(HIDDEN_CLASS);

    const totalItems = lottos.length;
    const visibleItems = 100;
    let start = 0;

    function renderItems() {
      const fragment = document.createDocumentFragment();

      for (let i = start; i < Math.min(start + visibleItems, totalItems); i++) {
        const lotto = lottos[i];
        const li = document.createElement('li');
        li.classList.add('lotto');

        const img = document.createElement('img');
        img.src = './ticket.png';
        img.alt = 'Lotto Ticket';
        img.classList.add('lotto-ticket');

        const span = document.createElement('span');
        span.textContent = lotto.numbers.join(', ');
        span.classList.add('lotto-numbers');

        li.appendChild(img);
        li.appendChild(span);
        fragment.appendChild(li);
      }

      lottoList.appendChild(fragment);
    }

    // 기존에 등록된 스크롤 이벤트 리스너가 있다면 제거합니다.
    if (lottoList.lottoScrollHandler) {
      lottoList.removeEventListener('scroll', lottoList.lottoScrollHandler);
    }

    // 새로운 스크롤 이벤트 핸들러를 정의합니다.
    const lottoScrollHandler = () => {
      if (
        lottoList.scrollTop + lottoList.clientHeight <
        lottoList.scrollHeight
      ) {
        return;
      }

      start += visibleItems;

      if (start < totalItems) {
        renderItems();
      }
    };

    // 핸들러 참조를 저장해두면 이후 다시 호출 시 제거할 수 있습니다.
    lottoList.lottoScrollHandler = lottoScrollHandler;
    lottoList.addEventListener('scroll', lottoScrollHandler);

    renderItems();
    bindClipboardCopyEvent();
  },
  reset: () => {
    lottoList.scrollTop = 0;
    while (lottoList.firstChild) {
      lottoList.removeChild(lottoList.firstChild);
    }
    lottosDiv.classList.add(HIDDEN_CLASS);
  },
  updatePurchaseUI(ticket) {
    purchaseAmount.textContent = `총 ${ticket}개를 구매하였습니다.`;
    showToast(`총 ${ticket}개를 구매하였습니다.`, 'success');
  },
};

export default LottoList;
