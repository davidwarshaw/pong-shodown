import Phaser from 'phaser';

// Character Select
import characterSelectScreen from '../../images/misc/character_select.png';
import characterSelectFrame from
  '../../images/spritesheet/character_select_frame.png';

// World Map
import worldMap from '../../images/misc/world_map.png';

// Portraits
import greyPortrait from '../../images/portraits/grey.png';
import whitePortrait from '../../images/portraits/white.png';
import blackPortrait from '../../images/portraits/black.png';
import bluePortrait from '../../images/portraits/blue.png';
import greenPortrait from '../../images/portraits/green.png';
import redPortrait from '../../images/portraits/red.png';
import yellowPortrait from '../../images/portraits/yellow.png';
import purplePortrait from '../../images/portraits/purple.png';
import pinkPortrait from '../../images/portraits/pink.png';
import violetPortrait from '../../images/portraits/violet.png';
import coverPortrait from '../../images/portraits/cover.png';

// Backgrounds
import tidalBasinDay from '../../images/backgrounds/tidal_basin_day.png';
import tidalBasinNight from '../../images/backgrounds/tidal_basin_night.png';
import goldenGate from '../../images/backgrounds/golden_gate.png';
import grotto from '../../images/backgrounds/grotto.png';
import hokkaido from '../../images/backgrounds/hokkaido.png';
import monumentValley from '../../images/backgrounds/monument_valley.png';
import noh from '../../images/backgrounds/noh.png';
import sunnyvale from '../../images/backgrounds/sunnyvale.png';
import versailles from '../../images/backgrounds/versailles.png';
import court from '../../images/backgrounds/court.png';

// Paddles
import greyPaddle from '../../images/spritesheet/paddles/grey.png';
import whitePaddle from '../../images/spritesheet/paddles/white.png';
import blackPaddle from '../../images/spritesheet/paddles/black.png';
import bluePaddle from '../../images/spritesheet/paddles/blue.png';
import greenPaddle from '../../images/spritesheet/paddles/green.png';
import redPaddle from '../../images/spritesheet/paddles/red.png';
import yellowPaddle from '../../images/spritesheet/paddles/yellow.png';
import purplePaddle from '../../images/spritesheet/paddles/purple.png';
import pinkPaddle from '../../images/spritesheet/paddles/pink.png';
import violetPaddle from '../../images/spritesheet/paddles/violet.png';
import smallGreyPaddle from '../../images/spritesheet/paddles/small_grey.png';
import smallMaroonPaddle from
  '../../images/spritesheet/paddles/small_maroon.png';
import paddleFlashWhite from
  '../../images/spritesheet/paddles/paddle_flash_white.png';
import paddleFlashBlack from
  '../../images/spritesheet/paddles/paddle_flash_black.png';
import paddleFlashRed from
  '../../images/spritesheet/paddles/paddle_flash_red.png';

// Projectiles
import star from '../../images/spritesheet/projectiles/star.png';
import rapier from '../../images/spritesheet/projectiles/rapier.png';
import fireball from '../../images/spritesheet/projectiles/fireball.png';
import chain from '../../images/spritesheet/projectiles/chain.png';
import fan from '../../images/spritesheet/projectiles/fan.png';
import gas from '../../images/spritesheet/projectiles/gas.png';
import smoke from '../../images/spritesheet/projectiles/smoke.png';

// The Ball
import ball from '../../images/spritesheet/ball.png';
import bomb from '../../images/spritesheet/bomb.png';
import onigiri from '../../images/spritesheet/onigiri.png';

// Info
import healthFrame from '../../images/spritesheet/health_frame.png';
import healthBar from '../../images/spritesheet/health_bar.png';
import arrowUp from '../../images/spritesheet/arrow_up.png';

// Speech Box
import speechBox from '../../images/spritesheet/speech_box.png';

//import vs from '../../images/spritesheet/vs_white.png';
import vs from '../../images/spritesheet/big_vs_white.png';
import win from '../../images/spritesheet/big_win.png';

// Fonts
import mainFont from '../../fonts/main_font_white.png';
import bigFont from '../../fonts/big_font_white.png';

// Logo and Splash Screen
import logo from '../../images/misc/logo.png';
import petal from '../../images/misc/petal.png';
import keys from '../../images/misc/keys.png';
import keysHint from '../../images/misc/keys_hint.png';
import splashBackground from '../../images/misc/splash_background.png';

// import mainFont from '../../fonts/main_font.png';
// import bigFont from '../../fonts/big_font.png';

class PreloaderState extends Phaser.State {
  init() {
  }

  preload() {

    // Character select
    this.load.image('characterSelectScreen', characterSelectScreen, 400, 200);
    this.load.spritesheet('characterSelectFrame', characterSelectFrame, 36, 36);

    // World Map
    this.load.image('worldMap', worldMap, 400, 200);

    // Portraits
    this.load.image('greyPortrait', greyPortrait, 32, 32);
    this.load.image('whitePortrait', whitePortrait, 32, 32);
    this.load.image('blackPortrait', blackPortrait, 32, 32);
    this.load.image('bluePortrait', bluePortrait, 32, 32);
    this.load.image('greenPortrait', greenPortrait, 32, 32);
    this.load.image('redPortrait', redPortrait, 32, 32);
    this.load.image('yellowPortrait', yellowPortrait, 32, 32);
    this.load.image('purplePortrait', purplePortrait, 32, 32);
    this.load.image('pinkPortrait', pinkPortrait, 32, 32);
    this.load.image('violetPortrait', violetPortrait, 32, 32);
    this.load.image('coverPortrait', coverPortrait, 32, 32);

    // Backgrounds
    const bgWidth = 400;
    const bgHeight = 400;
    this.load.image('tidalBasinDay', tidalBasinDay, bgWidth, bgHeight);
    this.load.image('tidalBasinNight', tidalBasinNight, bgWidth, bgHeight);
    this.load.image('goldenGate', goldenGate, bgWidth, bgHeight);
    this.load.image('grotto', grotto, bgWidth, bgHeight);
    this.load.image('hokkaido', hokkaido, bgWidth, bgHeight);
    this.load.image('monumentValley', monumentValley, bgWidth, bgHeight);
    this.load.image('noh', noh, bgWidth, bgHeight);
    this.load.image('sunnyvale', sunnyvale, bgWidth, bgHeight);
    this.load.image('versailles', versailles, bgWidth, bgHeight);
    this.load.image('court', court, bgWidth, bgHeight);

    // Balls and Bombs
    this.load.spritesheet('ball', ball, 16, 16);
    this.load.spritesheet('bomb', bomb, 32, 32);
    this.load.spritesheet('onigiri', onigiri, 16, 16);

    // Paddles
    const paddleWidth = 16;
    const paddleHeight = 48;
    this.load.spritesheet('greyPaddle', greyPaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('whitePaddle', whitePaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('blackPaddle', blackPaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('bluePaddle', bluePaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('greenPaddle', greenPaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('redPaddle', redPaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('yellowPaddle', yellowPaddle,
      paddleWidth, paddleHeight);
    this.load.spritesheet('purplePaddle', purplePaddle,
      paddleWidth, paddleHeight);

    // These paddles are sized differently
    this.load.spritesheet('pinkPaddle', pinkPaddle,
      paddleWidth + 8, paddleHeight + 8);
    this.load.spritesheet('violetPaddle', violetPaddle,
      paddleWidth - 4, paddleHeight - 8);
    this.load.spritesheet('smallGreyPaddle', smallGreyPaddle,
      32, 16);
    this.load.spritesheet('smallMaroonPaddle', smallMaroonPaddle,
      16, 8);

    // The paddle flash colors
    this.load.image('paddleFlashWhite', paddleFlashWhite);
    this.load.image('paddleFlashBlack', paddleFlashBlack);
    this.load.image('paddleFlashRed', paddleFlashRed);

    // Projectiles
    this.load.spritesheet('star', star, 16, 16);
    this.load.spritesheet('rapier', rapier, 32, 8);
    this.load.spritesheet('fireball', fireball, 32, 32);
    this.load.spritesheet('chain', chain, 128, 32);
    this.load.spritesheet('fan', fan, 32, 32);
    this.load.spritesheet('gas', gas, 32, 32);
    this.load.spritesheet('smoke', smoke, 32, 32);

    this.load.spritesheet('healthFrame', healthFrame, 160, 8);
    this.load.spritesheet('healthBar', healthBar, 160, 8);
    this.load.spritesheet('arrowUp', arrowUp, 8, 8);
    this.load.spritesheet('vs', vs, 24, 24);
    this.load.spritesheet('win', win, 16, 16);

    this.load.spritesheet('speechBox', speechBox, 216, 72);

    this.load.image('mainFont', mainFont);
    this.load.image('bigFont', bigFont);

    this.load.image('logo', logo);
    this.load.spritesheet('petal', petal, 16, 16);
    this.load.image('keys', keys);
    this.load.image('keysHint', keysHint);
    this.load.image('splashBackground', splashBackground);
  }

  create() {
    this.state.start('SplashState');
  }
}

export default PreloaderState;
