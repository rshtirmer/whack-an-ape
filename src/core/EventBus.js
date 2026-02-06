// Whack an Ape - Event Bus
export const Events = {
  // Game lifecycle
  GAME_START: 'game:start',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  
  // Ape events
  APE_SPAWN: 'ape:spawn',
  APE_WHACKED: 'ape:whacked',
  APE_ESCAPED: 'ape:escaped',
  APE_HIDE: 'ape:hide',
  
  // Score & Combo
  SCORE_CHANGED: 'score:changed',
  COMBO_CHANGED: 'combo:changed',
  
  // Timer
  TIME_UPDATE: 'time:update',
  TIME_WARNING: 'time:warning',
  
  // Hammer
  HAMMER_SWING: 'hammer:swing',
  
  // Particles
  PARTICLES_EMIT: 'particles:emit',

  // Audio
  AUDIO_INIT: 'audio:init',
  MUSIC_MENU: 'music:menu',
  MUSIC_GAMEPLAY: 'music:gameplay',
  MUSIC_GAMEOVER: 'music:gameover',
  MUSIC_STOP: 'music:stop',
  SFX_WHACK: 'sfx:whack',
  SFX_MISS: 'sfx:miss',
  SFX_GOLDEN: 'sfx:golden',
};

class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event, callback) {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    return this;
  }

  emit(event, data) {
    if (!this.listeners[event]) return this;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`EventBus error in ${event}:`, err);
      }
    });
    return this;
  }

  removeAll() {
    this.listeners = {};
    return this;
  }
}

export const eventBus = new EventBus();
