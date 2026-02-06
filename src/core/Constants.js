// Whack an Ape - Constants

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
  || (window.innerWidth <= 768);

// Responsive dimensions
export const GAME = {
  // Desktop: Landscape (1280x720), Mobile: Portrait (720x1280)
  WIDTH: isMobile ? 720 : 1280,
  HEIGHT: isMobile ? 1280 : 720,
  IS_MOBILE: isMobile,
  GRAVITY: 0,
  GAME_DURATION: 30,
};

// Grid adjusts based on orientation
export const GRID = isMobile ? {
  // Portrait (mobile): 3x3 vertical layout
  COLS: 3,
  ROWS: 3,
  HOLE_SIZE: 120,
  HOLE_SPACING_X: 220,
  HOLE_SPACING_Y: 220,
  OFFSET_X: 140,
  OFFSET_Y: 480,
} : {
  // Landscape (desktop): 3x3 horizontal layout
  COLS: 3,
  ROWS: 3,
  HOLE_SIZE: 120,
  HOLE_SPACING_X: 280,
  HOLE_SPACING_Y: 180,
  OFFSET_X: 360,  // Center horizontally in 1280
  OFFSET_Y: 280,  // Center vertically in 720
};

export const APE = {
  POP_UP_DURATION: 200,
  STAY_DURATION_MIN: 800,
  STAY_DURATION_MAX: 2000,
  POP_DOWN_DURATION: 150,
  SPAWN_INTERVAL_MIN: 400,
  SPAWN_INTERVAL_MAX: 1200,
  MAX_ACTIVE: 3,
  POINTS_NORMAL: 10,
  POINTS_GOLDEN: 50,
  GOLDEN_CHANCE: 0.1,
};

export const HAMMER = {
  SWING_DURATION: 100,
  SWING_ANGLE: 45,
};

export const COLORS = {
  SKY: 0x2d5a27,
  GRASS: 0x3d7a37,
  HOLE_DARK: 0x1a1a1a,
  HOLE_LIGHT: 0x333333,
  HOLE_RIM: 0x654321,
  APE_SKIN: 0xd4a574,
  APE_SKIN_DARK: 0xb8956a,
  APE_FUR: 0x8b4513,
  APE_EYES: 0xffffff,
  APE_PUPILS: 0x000000,
  APE_MOUTH: 0x2d1810,
  APE_GOLDEN: 0xffd700,
  APE_GOLDEN_DARK: 0xdaa520,
  UI_TEXT: '#ffffff',
  UI_SHADOW: '#000000',
  MENU_BG: 0x1a1a2e,
  GAMEOVER_BG: 0x1a1a2e,
  BUTTON: 0x8b4513,
  BUTTON_HOVER: 0xa0522d,
  TIMER_WARNING: '#ff4444',
  SCORE_POP: '#ffff00',
  COMBO_TEXT: '#ff8800',
};

export const TRANSITION = {
  FADE_DURATION: 400,
  SCORE_POP_SCALE: 1.5,
  SCORE_POP_DURATION: 150,
  SHAKE_INTENSITY: 5,
  SHAKE_DURATION: 50,
};

export const PARTICLES = {
  WHACK_COUNT: 12,
  WHACK_SPEED: 120,
  GOLDEN_COUNT: 20,
  GOLDEN_SPEED: 180,
};

export const JUICE = {
  COMBO_COLORS: ['#ffffff', '#ffff00', '#ff8800', '#ff4444', '#ff00ff'],
  TIMER_PULSE_SCALE: 1.3,
  BUTTON_HOVER_SCALE: 1.08,
  BUTTON_PRESS_SCALE: 0.95,
};
