class Characters {

  constructor() {
    this.scenes = {
      'Grey Paddle': {
        location: {
          name: 'Washington DC',
          x: 90,
          y: -13.5
        },
        speech: {
          default: 'Impostor! It is your\ndestiny to die at\nmy hand.',
          'White Paddle': 'Be at peace White Paddle.\n' +
            'You will die as you\nlived.',
          'Black Paddle': 'Has destiny called you to\nface me?\nSo be it.'
        }
      },
      'White Paddle': {
        location: {
          name: 'Sunnyvale',
          x: 100,
          y: -13.5
        },
        speech: {
          default: 'Your color is gaudy,\nusurper!\nDie!',
          'White Paddle': 'Is it you?\nMy former nemesis?\n' +
            'Just like old times!',
          'Black Paddle': 'Go back behind the scenes\nwhere you belong, you\n' +
            'shadow of a paddle.'
        }
      },
      'Black Paddle': {
        location: {
          name: 'Tokyo',
          x: 36,
          y: -16
        },
        speech: {
          default: '...',
          'White Paddle': '!!!',
          'Black Paddle': '???'
        }
      },
      'Blue Paddle': {
        location: {
          name: 'San Francisco Bay',
          x: 100.5,
          y: -13
        },
        speech: {
          default: 'Evildoers are no match for me.\nFace justice!',
          'White Paddle': 'So you\'re behind all\nthis. Face justice!',
          'Black Paddle': 'I face only the unjust.\n' +
            'Wait, have these duels\nbeen fair?'
        }
      },
      'Green Paddle': {
        location: {
          name: 'Onigami Grotto',
          x: 37,
          y: -16
        },
        speech: {
          default: 'Hee, hee, hee\nI\'ll drag you down into\n' +
            'the muck.',
          'White Paddle': 'Why, you\'re more evil than I!\n' +
            'Still, there\'s only room\n' +
            'for one of us.',
          'Black Paddle': 'A fellow shadow dweller.\n' +
            'Nothing personal of\ncourse.'
        }
      },
      'Red Paddle': {
        location: {
          name: 'Washington DC',
          x: 90,
          y: -13.5
        },
        speech: {
          default: 'My skill is unmatched.\nCan you defeat me?\n' +
            'I think not!',
          'White Paddle': 'Finally,\na true test of my skill.\nEn garde!',
          'Black Paddle': 'Do you believe yourself\nskilled enough to\n' +
            'challenge me?\nVery well.'
        }
      },
      'Yellow Paddle': {
        location: {
          name: 'Tokyo',
          x: 36,
          y: -16
        },
        speech: {
          default: 'Out of the way, nobody.\n' +
            'Make way for the star\n' +
            'of the show.',
          'White Paddle': 'It\'s long past your\nretirement. Let me usher\n' +
            'you from the stage.',
          'Black Paddle': 'So, you\'ve finally turned on me!'
        }
      },
      'Purple Paddle': {
        location: {
          name: 'Versaille',
          x: 69.5,
          y: -11
        },
        speech: {
          default: 'Another gaudy pretender\n' +
            'to the throne.\n' +
            'Bow before me, peasant!',
          'White Paddle': 'It\'s time for you to\nabdicate the throne and\n' +
            'pass it to me.',
          'Black Paddle': 'It\'s so hard to find\ngood help these days.'
        }
      },
      'Pink Paddle': {
        location: {
          name: 'Monument Valley',
          x: 99,
          y: -13.5
        },
        speech: {
          default: 'Why, you\'re nothing but\n' +
            'a snack!\n' +
            'I\'ll eat you up and\n' +
            'have room for dinner!',
          'White Paddle': 'You don\'t have the\nweight you once had.\n' +
            'Why don\'t I step in.',
          'Black Paddle': 'I didn\'t see you there.\nAnd now I\'ll put\n' +
            'you out of the way'
        }
      },
      'Violet Paddle': {
        location: {
          name: 'Hokkaido',
          x: 35,
          y: -12
        },
        speech: {
          default: 'All those who defile\nnature forfeit their\n' +
            'lives!',
          'White Paddle': 'You\'re the one who\nstarted all this, so you\n' +
            'must be the one to\nfinish it.',
          'Black Paddle': 'I bear you no ill will,\nbut if you oppose me,\n' +
            'you must die.'
        }
      }
    },
    this.characterPortraits = [
      [
        { name: 'Red Paddle',
          portraitImage: 'redPortrait', bigPortraitImage: 'redPaddle' },
        { name: 'Purple Paddle',
          portraitImage: 'purplePortrait', bigPortraitImage: 'purplePaddle' },
        { name: 'Green Paddle',
          portraitImage: 'greenPortrait', bigPortraitImage: 'greenPaddle' },
        { name: 'Blue Paddle',
          portraitImage: 'bluePortrait', bigPortraitImage: 'bluePaddle' },
        { name: 'Grey Paddle',
          portraitImage: 'greyPortrait', bigPortraitImage: 'greyPaddle' }
      ],
      [
        { name: 'White Paddle', boss: true,
          portraitImage: 'whitePortrait', bigPortraitImage: 'whitePaddle' },
        { name: 'Pink Paddle',
          portraitImage: 'pinkPortrait', bigPortraitImage: 'pinkPaddle' },
        { name: 'Yellow Paddle',
          portraitImage: 'yellowPortrait', bigPortraitImage: 'yellowPaddle' },
        { name: 'Violet Paddle',
          portraitImage: 'violetPortrait', bigPortraitImage: 'violetPaddle' },
        { name: 'Black Paddle', special: true,
          portraitImage: 'blackPortrait', bigPortraitImage: 'blackPaddle' }
      ]
    ];
    this.characters = {
      'Grey Paddle': {
        sprite: 'greyPaddle',
        background: 'tidalBasinNight',
        speed: 10,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'star',
          speed: 1000,
          rotate: true,
          rotationSpeed: 300,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 10,
          damagesGoal: false,
          goalDamage: 5,
          animationFps: 15
        },
        moves: [
          {
            name: 'Reppu',
            commands: ['left', 'right', 'button'],
            type: 'projectile',
            screenThirdHint: 'middle'
          },
          {
            name: 'Otoshi',
            commands: ['up', 'down', 'up', 'button'],
            type: 'teleport'
          }
        ]
      },
      'White Paddle': {
        boss: true,
        sprite: 'whitePaddle',
        background: 'sunnyvale',
        secondBackground: 'court',
        speed: 12,
        health: 100,
        ballDamage: 15,
        projectile: {
          sprite: 'ball',
          speed: 550,
          rotate: true,
          rotationSpeed: 50,
          collideWorldBounds: true,
          collidesWithBall: false,
          damagesOpponent: true,
          opponentDamage: 10,
          damagesGoal: true,
          goalDamage: 10,
          animationFps: 15
        },
        moves: [
          {
            name: 'White Ball',
            commands: ['left', 'down-left', 'down-right', 'right',
              'button'],
            type: 'projectile',
            speed: 800,
            screenThirdHint: 'middle'
          },
          {
            name: 'Blue Ball',
            commands: ['left', 'down-left', 'down', 'button'],
            type: 'projectile',
            rotation: 2 * Math.PI * (7 / 8),
            screenThirdHint: 'top'
          },
          {
            name: 'Green Ball',
            commands: ['left', 'up-left', 'up', 'button'],
            type: 'projectile',
            rotation: 2 * Math.PI * (1 / 8),
            screenThirdHint: 'bottom'
          },
          {
            name: 'Passthru',
            commands: ['down', 'up', 'down', 'button'],
            type: 'teleport'
          }
        ]
      },
      'Black Paddle': {
        special: true,
        sprite: 'blackPaddle',
        background: 'noh',
        speed: 11,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'fan',
          speed: 900,
          rotate: true,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: false,
          opponentDamage: 15,
          damagesGoal: true,
          goalDamage: 20,
          animationFps: 15
        },
        moves: [
          {
            name: 'Nesnug',
            commands: ['right', 'down-right', 'down-left', 'left', 'button'],
            type: 'projectile',
            screenThirdHint: 'middle'
          },
          {
            name: 'Ihsoto',
            commands: ['down', 'up', 'down', 'button'],
            type: 'teleport'
          }
        ]
      },
      'Blue Paddle': {
        sprite: 'bluePaddle',
        background: 'goldenGate',
        speed: 10,
        health: 100,
        ballDamage: 10,
        sidekick: {
          sprite: 'smallGreyPaddle',
          speed: 15
        },
        projectile: {
          sprite: 'star',
          speed: 1000,
          rotate: true,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 20,
          damagesGoal: true,
          goalDamage: 5,
          animationFps: 15
        },
        moves: [
          {
            name: 'Rush',
            commands: ['down', 'down-left', 'left', 'button'],
            type: 'charge',
            time: 400,
            x: 700,
            y: 0,
            screenThirdHint: 'middle'
          },
          {
            name: 'Oh-toe-she',
            commands: ['up', 'down', 'up', 'button'],
            type: 'teleport'
          }
        ]
      },
      'Green Paddle': {
        sprite: 'greenPaddle',
        background: 'grotto',
        speed: 12,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'gas',
          speed: 900,
          rotate: false,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: false,
          damagesOpponent: true,
          opponentDamage: 15,
          damagesGoal: false,
          goalDamage: 5,
          animationFps: 8
        },
        moves: [
          {
            name: 'Dokukumo',
            commands: ['right', 'left', 'button'],
            type: 'projectile',
            screenThirdHint: 'middle'
          }
        ]
      },
      'Red Paddle': {
        sprite: 'redPaddle',
        background: 'tidalBasinDay',
        speed: 10,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'fireball',
          speed: 700,
          rotate: false,
          rotationSpeed: 100,
          collideWorldBounds: true,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 20,
          damagesGoal: false,
          goalDamage: 5,
          animationFps: 15
        },
        moves: [
          {
            name: 'Zan',
            commands: ['left', 'right', 'button'],
            type: 'projectile',
            speed: 800,
            rotation: 0,
            screenThirdHint: 'middle'
          },
          {
            name: 'Tenha',
            commands: ['down', 'down-right', 'right', 'button'],
            type: 'projectile',
            speed: 700,
            rotation: 2 * Math.PI * (15 / 16),
            screenThirdHint: 'top'
          },
          {
            name: 'Seiou',
            commands: ['up', 'up-right', 'right', 'button'],
            type: 'projectile',
            speed: 700,
            rotation: 2 * Math.PI * (1 / 16),
            screenThirdHint: 'bottom'
          }
        ]
      },
      'Yellow Paddle': {
        sprite: 'yellowPaddle',
        preSpecial: true,
        background: 'noh',
        speed: 10,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'fan',
          speed: 800,
          rotate: true,
          rotationSpeed: 50,
          collideWorldBounds: true,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 10,
          damagesGoal: true,
          goalDamage: 10,
          animationFps: 15
        },
        moves: [
          {
            name: 'Gunsen',
            commands: ['left', 'down-left', 'down-right', 'right', 'button'],
            type: 'projectile',
            screenThirdHint: 'middle'
          }
        ]
      },
      'Purple Paddle': {
        sprite: 'purplePaddle',
        background: 'versailles',
        speed: 10,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'rapier',
          speed: 800,
          rotate: false,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 15,
          damagesGoal: false,
          goalDamage: 5,
          animationFps: 5
        },
        moves: [
          {
            name: 'Allez',
            commands: ['left', 'up', 'right', 'button'],
            type: 'projectile',
            speed: 800,
            rotation: 0,
            screenThirdHint: 'middle'
          },
          {
            name: 'Tierce',
            commands: ['left', 'up-left', 'up', 'button'],
            type: 'projectile',
            speed: 700,
            rotation: 2 * Math.PI * (31 / 32),
            screenThirdHint: 'top'
          },
          {
            name: 'Seconde',
            commands: ['left', 'down-left', 'down', 'button'],
            type: 'projectile',
            speed: 700,
            rotation: 2 * Math.PI * (1 / 32),
            screenThirdHint: 'bottom'
          }
        ]
      },
      'Pink Paddle': {
        sprite: 'pinkPaddle',
        background: 'monumentValley',
        speed: 8,
        health: 100,
        ballDamage: 10,
        projectile: {
          sprite: 'chain',
          speed: 600,
          rotate: false,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 30,
          damagesGoal: false,
          goalDamage: 5,
          animationFps: 15
        },
        moves: [
          {
            name: 'Fat Chain',
            commands: ['left', 'right', 'left', 'right', 'button'],
            type: 'projectile',
            screenThirdHint: 'middle'
          }
        ]
      },
      'Violet Paddle': {
        sprite: 'violetPaddle',
        background: 'hokkaido',
        speed: 12,
        health: 100,
        ballDamage: 10,
        sidekick: {
          sprite: 'smallMaroonPaddle',
          speed: 20
        },
        projectile: {
          sprite: 'star',
          speed: 1000,
          rotate: true,
          rotationSpeed: 100,
          collideWorldBounds: false,
          collidesWithBall: true,
          damagesOpponent: true,
          opponentDamage: 20,
          damagesGoal: true,
          goalDamage: 5,
          animationFps: 15
        },
        moves: [
          {
            name: 'Totsunyuu',
            commands: ['up', 'up-left', 'left', 'button'],
            type: 'charge',
            time: 400,
            x: 900,
            y: 300,
            screenThirdHint: 'bottom'
          },
          {
            name: 'Yakushin',
            commands: ['down', 'down-left', 'left', 'button'],
            type: 'charge',
            time: 400,
            x: 900,
            y: -300,
            screenThirdHint: 'top'
          }
        ]
      }
    };
  }

  getByName(name, left) {
    // Deep copy character
    const characterDirection = JSON.parse(JSON.stringify(
      this.characters[name]));
    characterDirection.name = name;

    // If the character is on the right, reverse move directions
    if (!left) {
      characterDirection.moves = characterDirection.moves.map(move => {
        const reversedMove = move;
        const reversedCommands = move.commands
          .map(command => command
            .replace((/right/), 'placeholder')
            .replace((/left/), 'right')
            .replace((/placeholder/), 'left'));
        reversedMove.commands = reversedCommands;
        return reversedMove;
      });
    }

    return characterDirection;
  }

  getPortraitByName(name) {
    return this.characterPortraits
      .flatten()
      .filter(portrait => portrait.name === name)[0];
  }

  getEndBossPortrait() {
    return this.characterPortraits
      .flatten()
      .filter(portrait => portrait.boss)[0];
  }

  getSpecialPortrait() {
    return this.characterPortraits
      .flatten()
      .filter(portrait => portrait.special)[0];
  }

  getEndBoss() {
    return Object.entries(this.characters)
      .filter(character => character[1].boss)[0];
  }

  getSpecial() {
    return Object.entries(this.characters)
      .filter(character => character[1].special)[0];
  }
}

export default Characters;
