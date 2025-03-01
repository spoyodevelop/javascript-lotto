const Toast = {
  showToast(message, type = 'error', duration = 3000) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
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
  },
};

export default Toast;
