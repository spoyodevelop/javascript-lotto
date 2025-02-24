document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userInput');
  const button = document.getElementById('myButton');

  button.addEventListener('click', () => {
    const inputValue = input.value.trim(); // 입력값 가져오기
  });
});
