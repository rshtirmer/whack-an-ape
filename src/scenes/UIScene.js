// Whack an Ape - UI Scene (Responsive)
import Phaser from 'phaser';
import { GAME, COLORS, TRANSITION, JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    // Responsive Y positions
    const topY = GAME.IS_MOBILE ? 160 : 50;
    const comboY = GAME.IS_MOBILE ? 230 : 100;

    // Score panel (top left)
    this.scorePanel = this.add.container(30, topY);
    
    const scoreBg = this.add.rectangle(100, 0, 200, 50, 0x000000, 0.5);
    scoreBg.setStrokeStyle(2, 0xffd700);
    
    this.scoreText = this.add.text(100, 0, 'Score: 0', {
      fontSize: '28px',
      fontFamily: 'Impact, monospace',
      color: COLORS.UI_TEXT,
    }).setOrigin(0.5);
    
    this.scorePanel.add([scoreBg, this.scoreText]);

    // Timer panel (top right)
    this.timerPanel = this.add.container(GAME.WIDTH - 30, topY);
    
    const timerBg = this.add.rectangle(-100, 0, 180, 50, 0x000000, 0.5);
    timerBg.setStrokeStyle(2, 0x44aaff);
    
    this.timerText = this.add.text(-100, 0, `Time: ${GAME.GAME_DURATION}`, {
      fontSize: '28px',
      fontFamily: 'Impact, monospace',
      color: COLORS.UI_TEXT,
    }).setOrigin(0.5);
    
    this.timerPanel.add([timerBg, this.timerText]);
    this.timerBg = timerBg;

    // Combo display (center)
    this.comboContainer = this.add.container(GAME.WIDTH / 2, comboY);
    
    this.comboText = this.add.text(0, 0, '', {
      fontSize: '32px',
      fontFamily: 'Impact, monospace',
      color: COLORS.COMBO_TEXT,
      stroke: COLORS.UI_SHADOW,
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.comboText.setAlpha(0);
    
    this.comboContainer.add(this.comboText);
    this.comboY = comboY;

    this.setupEventListeners();
    eventBus.emit(Events.MUSIC_GAMEPLAY);
  }

  setupEventListeners() {
    this.onScoreChanged = ({ score, delta, x, y, isGolden }) => {
      this.scoreText.setText(`Score: ${score}`);
      
      this.tweens.add({
        targets: this.scorePanel,
        x: 35,
        duration: 50,
        yoyo: true,
        repeat: 1,
      });
      
      this.tweens.add({
        targets: this.scoreText,
        scaleX: TRANSITION.SCORE_POP_SCALE,
        scaleY: TRANSITION.SCORE_POP_SCALE,
        duration: TRANSITION.SCORE_POP_DURATION,
        yoyo: true,
        ease: 'Back.easeOut',
      });

      this.showScorePopup(x, y, delta, isGolden);
    };
    eventBus.on(Events.SCORE_CHANGED, this.onScoreChanged);

    this.onComboChanged = ({ combo }) => {
      if (combo >= 2) {
        const colorIndex = Math.min(combo - 2, JUICE.COMBO_COLORS.length - 1);
        const color = JUICE.COMBO_COLORS[colorIndex];
        
        this.comboText.setText(`🔥 ${combo}x COMBO! 🔥`);
        this.comboText.setColor(color);
        this.comboText.setAlpha(1);
        
        this.comboText.setScale(0.5);
        this.tweens.add({
          targets: this.comboText,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 150,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.tweens.add({
              targets: this.comboText,
              scaleX: 1,
              scaleY: 1,
              duration: 100,
            });
          }
        });
        
        if (combo >= 5) {
          this.emitComboParticles();
        }
      } else {
        this.tweens.add({
          targets: this.comboText,
          alpha: 0,
          scaleY: 0,
          duration: 200,
        });
      }
    };
    eventBus.on(Events.COMBO_CHANGED, this.onComboChanged);

    this.onTimeUpdate = ({ time }) => {
      this.timerText.setText(`Time: ${time}`);
    };
    eventBus.on(Events.TIME_UPDATE, this.onTimeUpdate);

    this.onTimeWarning = () => {
      this.timerText.setColor(COLORS.TIMER_WARNING);
      this.timerBg.setStrokeStyle(3, 0xff4444);
      
      this.tweens.add({
        targets: this.timerPanel,
        scaleX: JUICE.TIMER_PULSE_SCALE,
        scaleY: JUICE.TIMER_PULSE_SCALE,
        duration: 150,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
      
      this.timerBg.setFillStyle(0xff0000, 0.3);
      this.time.delayedCall(100, () => {
        this.timerBg.setFillStyle(0x000000, 0.5);
      });
    };
    eventBus.on(Events.TIME_WARNING, this.onTimeWarning);

    this.events.on('shutdown', () => {
      eventBus.off(Events.SCORE_CHANGED, this.onScoreChanged);
      eventBus.off(Events.COMBO_CHANGED, this.onComboChanged);
      eventBus.off(Events.TIME_UPDATE, this.onTimeUpdate);
      eventBus.off(Events.TIME_WARNING, this.onTimeWarning);
    });
  }

  showScorePopup(x, y, points, isGolden) {
    const color = isGolden ? '#ffd700' : '#ffffff';
    const fontSize = isGolden ? '40px' : '32px';
    const prefix = isGolden ? '✨ +' : '+';
    
    const popup = this.add.text(x, y, `${prefix}${points}`, {
      fontSize: fontSize,
      fontFamily: 'Impact, monospace',
      color: color,
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: y - 100,
      alpha: 0,
      scaleX: isGolden ? 1.8 : 1.3,
      scaleY: isGolden ? 1.8 : 1.3,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => popup.destroy(),
    });
    
    if (isGolden) {
      for (let i = 0; i < 5; i++) {
        this.time.delayedCall(i * 50, () => {
          const sparkle = this.add.star(
            x + Phaser.Math.Between(-25, 25),
            y - (i * 12),
            4, 3, 6,
            0xffd700
          );
          this.tweens.add({
            targets: sparkle,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            y: sparkle.y - 40,
            duration: 400,
            onComplete: () => sparkle.destroy(),
          });
        });
      }
    }
  }

  emitComboParticles() {
    const cx = GAME.WIDTH / 2;
    const cy = this.comboY;
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const particle = this.add.circle(cx, cy, 5, 0xff8800);
      
      this.tweens.add({
        targets: particle,
        x: cx + Math.cos(angle) * 80,
        y: cy + Math.sin(angle) * 50,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }
}
