/**
 * Alex the Allegator 4 — Web Edition.
 * Port of "Alex the Allegator 4" (c) 2003 Johan Peitz / Free Lunch Design.
 * GPL-2.0-or-later, as is the original game — see `LICENSE`.
 */
import { device } from "melonjs";
import { createGame } from "./game/createGame";

const app = await createGame();

// the fullscreen button, over the top right corner of the game, as on
// itch.io (the score is in the bottom right one). It sits in the game's frame, beside the game's container: the frame
// is what goes fullscreen, so the button comes along, and melonJS fits the
// game to the frame, the element around the canvas's own container.
// Where the browser has no fullscreen (iPhone Safari), the frame is
// "maximized" instead: it covers the browser window, as itch.io does there.
const frame = document.getElementById("game");
const button = document.getElementById("fullscreen");
if (frame && button) {
	let maximized = false;
	const isOn = () =>
		device.hasFullscreenSupport ? app.isFullscreen() : maximized;
	const refresh = () => {
		const on = isOn();
		const label = on ? "Exit full screen" : "Full screen";
		button.setAttribute("aria-pressed", String(on));
		button.setAttribute("aria-label", label);
		button.title = label;
		// fit the game to the frame's new size
		app.resize();
	};
	button.addEventListener("click", () => {
		if (!device.hasFullscreenSupport) {
			maximized = !maximized;
			frame.classList.toggle("maximized", maximized);
			refresh();
		} else if (app.isFullscreen()) {
			app.exitFullscreen();
		} else {
			app.requestFullscreen(frame);
		}
		// hand the keyboard back to the game, or Space (jump) would press
		// the button again
		button.blur();
	});
	// Escape or the browser's own control leave fullscreen too
	document.addEventListener("fullscreenchange", refresh);
	button.hidden = false;
}
