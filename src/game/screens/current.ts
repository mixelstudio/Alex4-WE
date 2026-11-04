/**
 * Alex the Allegator 4 — Web Edition.
 * Port of "Alex the Allegator 4" (c) 2003 Johan Peitz / Free Lunch Design.
 * GPL-2.0-or-later, as is the original game — see `LICENSE`.
 */
import { level, state } from "melonjs";
import type { LevelMap, PlayScreen } from "./play";

/** the play screen, for the entities of a level (they only exist on it) */
export function playScreen() {
	return state.current() as PlayScreen;
}

/** the map of the level being played, with our custom properties */
export function currentMap() {
	return level.getCurrentLevel() as LevelMap;
}
