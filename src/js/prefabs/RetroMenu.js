import Phaser from 'phaser';

import Fonts from '../Fonts';
import Properties from '../Properties';

class RetroMenu {
  constructor(game, items, options) {
    this.game = game;
    this.items = items;
    this.options = options;

    this.fonts = new Fonts(this.game);

    this.keys = game.input.keyboard.addKeys(Properties.leftPlayerKeys);

    const longestLabelCharacters = this.items
      .map(itemSet => itemSet.label)
      .reduce((longest, label) => {
        if(label.length > longest.length) {
          return label;
        }
        else {
          return longest;
        }
      }, '')
      .length;
    this.menuTop = this.options.menuTop || 360;
    const characterWidth = 24;
    const menuLeft = (this.game.width / 2) -
      (longestLabelCharacters * characterWidth / 2) + 20;
    this.menuItemSpacing = 50;
    const pointerLeft = menuLeft - this.menuItemSpacing;

    this.pointerIndex = 0;

    this.keyRepeatsPerMove = 10;

    // Render the menu item label images
    this.menuObjects = this.items
      .map((menuItem, i) => {
        const yPos = this.menuTop + (i * this.menuItemSpacing);
        const labelText = this.fonts.mainFontString(menuItem.label);
        const labelImage = this.game.add.image(menuLeft, yPos, labelText);
        labelImage.scale.set(Properties.scaleRatio);
        const valuePadding = longestLabelCharacters + 1;
        const valueXPos = menuLeft + (valuePadding * characterWidth);
        const valueText = this.fonts.mainFontString(menuItem.value);
        const valueImage = this.game.add.image(valueXPos, yPos, valueText);
        valueImage.scale.set(Properties.scaleRatio);
        return { labelText, labelImage, valueText, valueImage };
      });

    // Render the menu item pointer
    const pointerFont = this.fonts.mainFontString('>');
    const yPos = this.pointerY(this.pointerIndex);
    this.pointer = this.game.add.image(pointerLeft, yPos, pointerFont);
    this.pointer.scale.set(Properties.scaleRatio);

    this.itemSelected = false;
  }

  update() {
    // Only allow input if there is no selection or the freeze
    // after selecting option is off
    if (!this.itemSelected || !this.options.freezeAfterSelection) {
      if (this.keys.up.isDown &&
      (this.keys.up.repeats % this.keyRepeatsPerMove === 0)) {
        this.pointerIndex = Phaser.Math.clamp(this.pointerIndex - 1,
          0, this.items.length - 1);
        this.movePointer();
      }
      else if (this.keys.down.isDown &&
      (this.keys.down.repeats % this.keyRepeatsPerMove === 0)) {
        this.pointerIndex = Phaser.Math.clamp(this.pointerIndex + 1,
          0, this.items.length - 1);
        this.movePointer();
      }
      if (this.keys.action.isDown &&
      (this.keys.action.repeats % this.keyRepeatsPerMove === 0)) {
        // Set the pointer as having selected something and invoke
        // the menu item callback
        this.itemSelected = true;
        const value = this.items[this.pointerIndex].cb();

        // If a value was returned, update the value text
        if (value) {
          this.menuObjects[this.pointerIndex].valueText.setText(value);
        }
      }
    }
  }

  movePointer() {
    const yPos = this.pointerY(this.pointerIndex);
    this.pointer.y = yPos;
  }

  pointerY(i) {
    return this.menuTop + (i * this.menuItemSpacing);
  }

}

export default RetroMenu;
