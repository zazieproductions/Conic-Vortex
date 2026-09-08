/**
 * Occult sprite set used by the 3D scene and the giant blend-mode sigils.
 *
 * Kept as transparent SVG modules so Vite emits base-aware, hashed asset URLs
 * (robust on local dev *and* on GitHub-Pages sub-path deployments) and so the
 * billboards/sigils composite without opaque boxes.
 */
import eyeUrl from './eye.svg';
import goatUrl from './goat.svg';
import sunUrl from './sun.svg';

export const eyeSprite = eyeUrl;
export const goatSprite = goatUrl;
export const sunSprite = sunUrl;

/** Every sprite, for the Three.js billboard scatter. */
export const SPRITE_URLS: string[] = [eyeUrl, goatUrl, sunUrl];
