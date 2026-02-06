// Whack an Ape - Background Music (Strudel)
// Mellow chiptune BGM patterns - longer, less repetitive
import { stack, note, s } from '@strudel/web';

// Menu Theme — chill, inviting
export function menuTheme() {
  return stack(
    // Melody — gentle and spacious
    note('g4 ~ ~ e4 ~ ~ c4 ~ ~ d4 ~ e4 ~ ~ ~ ~ g4 ~ ~ a4 ~ ~ g4 ~ ~ e4 ~ ~ ~ ~ ~ ~')
      .s('triangle')
      .gain(0.12)
      .lpf(2000)
      .decay(0.3)
      .sustain(0.1)
      .release(0.4)
      .room(0.3),
    // Warm pad — slow evolving chords
    note('<c3,e3,g3> ~ ~ ~ <a2,c3,e3> ~ ~ ~ <f2,a2,c3> ~ ~ ~ <g2,b2,d3> ~ ~ ~ <e2,g2,b2> ~ ~ ~ <f2,a2,c3> ~ ~ ~ <d2,f2,a2> ~ ~ ~ <g2,b2,d3> ~ ~ ~')
      .s('sine')
      .gain(0.08)
      .lpf(1000)
      .attack(0.4)
      .release(0.8)
      .room(0.4),
    // Bass — slow and steady
    note('c2 ~ ~ ~ ~ ~ g1 ~ ~ ~ ~ ~ a1 ~ ~ ~ ~ ~ f1 ~ ~ ~ ~ ~ e1 ~ ~ ~ ~ ~ g1 ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~ g1 ~ ~ ~ ~ ~')
      .s('triangle')
      .gain(0.14)
      .lpf(350)
  ).cpm(70).play();
}

// Gameplay Theme — groovy but chill, longer progression
export function gameplayBGM() {
  return stack(
    // Lead melody — relaxed, 32-step pattern
    note('e4 ~ g4 ~ ~ ~ a4 ~ ~ ~ g4 ~ ~ ~ e4 ~ c4 ~ e4 ~ ~ ~ g4 ~ ~ ~ e4 ~ ~ ~ d4 ~ ~ ~')
      .s('triangle')
      .gain(0.13)
      .lpf(2200)
      .decay(0.2)
      .sustain(0.15)
      .release(0.3)
      .room(0.2),
    // Counter melody — sparse accents
    note('~ ~ ~ ~ c5 ~ ~ ~ ~ ~ ~ ~ ~ ~ g4 ~ ~ ~ ~ ~ e5 ~ ~ ~ ~ ~ ~ ~ ~ ~ c5 ~')
      .s('square')
      .gain(0.06)
      .lpf(3000)
      .decay(0.15)
      .sustain(0),
    // Chord stabs — gentle rhythm
    note('<c3,e3> ~ ~ ~ ~ ~ <a2,c3> ~ ~ ~ ~ ~ <f2,a2> ~ ~ ~ ~ ~ <g2,b2> ~ ~ ~ ~ ~ <e2,g2> ~ ~ ~ ~ ~ <f2,a2> ~ ~ ~ ~ ~ <d2,f2> ~ ~ ~ ~ ~ <g2,b2> ~ ~ ~ ~ ~')
      .s('triangle')
      .gain(0.09)
      .lpf(1400)
      .attack(0.05)
      .decay(0.3)
      .sustain(0.1),
    // Bass — groovy but laid back
    note('c2 ~ ~ c2 ~ ~ g2 ~ ~ ~ g2 ~ a2 ~ ~ a2 ~ ~ g2 ~ ~ ~ g2 ~ f2 ~ ~ f2 ~ ~ e2 ~ ~ ~ e2 ~ g2 ~ ~ g2 ~ ~')
      .s('triangle')
      .gain(0.18)
      .lpf(450),
    // Light hi-hats — subtle groove
    s('~ hh ~ hh ~ hh ~ hh')
      .gain(0.12)
  ).cpm(105).play();
}

// Game Over Theme — reflective, not too sad
export function gameOverTheme() {
  return stack(
    // Melody — contemplative
    note('e4 ~ ~ ~ d4 ~ ~ ~ c4 ~ ~ ~ ~ ~ ~ ~ b3 ~ ~ ~ a3 ~ ~ ~ g3 ~ ~ ~ ~ ~ ~ ~ a3 ~ ~ ~ b3 ~ ~ ~ c4 ~ ~ ~ ~ ~ ~ ~')
      .s('sine')
      .gain(0.12)
      .lpf(1600)
      .decay(0.5)
      .sustain(0.15)
      .release(1.0)
      .room(0.5),
    // Pad — warm minor
    note('<a2,c3,e3> ~ ~ ~ ~ ~ ~ ~ <f2,a2,c3> ~ ~ ~ ~ ~ ~ ~ <g2,b2,d3> ~ ~ ~ ~ ~ ~ ~ <e2,g2,b2> ~ ~ ~ ~ ~ ~ ~')
      .s('sine')
      .gain(0.08)
      .lpf(900)
      .attack(0.6)
      .release(1.8)
      .room(0.6)
      .slow(2),
    // Bass — sparse
    note('a1 ~ ~ ~ ~ ~ ~ ~ f1 ~ ~ ~ ~ ~ ~ ~ g1 ~ ~ ~ ~ ~ ~ ~ e1 ~ ~ ~ ~ ~ ~ ~')
      .s('triangle')
      .gain(0.12)
      .lpf(280)
      .slow(2)
  ).cpm(55).play();
}
