class Fonts {

  constructor(game) {
    this.game = game;
    this.mainFontCharacters = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',

      // [ and ] are double quotes
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '[', ']', '\'',

      // @ is ED
      '@', ',', '.', '<', '>', '!', '?', ' '
    ].join('');
    this.bigFontCharacters = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '?', '!', '%'
    ].join('');
  }

  mainFontString(text) {
    const mainFont = this.game.add.retroFont('mainFont', 8, 8,
      this.mainFontCharacters, 13, 0, 0, 0, 0);
    mainFont.setText(text.toUpperCase(), true, 0, 3);
    return mainFont;
  }

  bigFontString(text) {
    const bigFont = this.game.add.retroFont('bigFont', 17, 17,
      this.bigFontCharacters, 13, 0, 0, 0, 0);
    bigFont.setText(text.toUpperCase(), true, 0, 3);
    return bigFont;
  }
}

export default Fonts;
