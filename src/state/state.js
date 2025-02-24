export default new (class State {
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
})();
