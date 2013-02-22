/*!
 * 
 *   Alex the Allegator 4 - Web Edition
 *   an HTML5 remake of the classic "Alex the allegator 4" game.
 *   made using the melonJS game library
 *   http://www.melonjs.org
 *		
 *   Originally Created by Johan Peitz from Free Lunch Design.
 *   http://allegator.sourceforge.net/
 *   http://www.freelunchdesign.com/
 *
 **/
 
/**
 * game resources
 */

var g_resources= [	
	// images
	{name: "a4_tileset",		type:"image",	src: "data/level/a4_tileset.png"},
	{name: "alex4",				type:"image",	src: "data/sprites/alex4.png"},
	{name: "enemy1",			type:"image",	src: "data/sprites/enemy1.png"},
	{name: "enemy2",			type:"image",	src: "data/sprites/enemy2.png"},
	{name: "boss1",				type:"image",	src: "data/sprites/boss1.png"},
	{name: "bullet",			type:"image",	src: "data/sprites/bullet.png"},
	{name: "heart",				type:"image",	src: "data/sprites/heart.png"},
	{name: "stars",				type:"image",	src: "data/sprites/stars.png"},
	{name: "cherry",			type:"image",	src: "data/sprites/cherry.png"},
	{name: "1up",				type:"image",	src: "data/sprites/1up.png"},
	{name: "roll",				type:"image",	src: "data/sprites/roll.png"},
	{name: "layer1",			type:"image",	src: "data/background/layer1.png"},
	{name: "layer2",			type:"image",	src: "data/background/layer2.png"},
	{name: "layer3",			type:"image",	src: "data/background/layer3.png"},
	{name: "atascii_40px",		type:"image",	src: "data/hud/atascii_40px.png"},
	{name: "atascii_32px",		type:"image",	src: "data/hud/atascii_32px.png"},
	{name: "hud_life",			type:"image",	src: "data/hud/hud_life.png"},
	{name: "hud_egg",			type:"image",	src: "data/hud/hud_egg.png"},
	{name: "hud_heart",			type:"image",	src: "data/hud/hud_heart.png"},
	{name: "menu_title",		type:"image",	src: "data/hud/menu_title.png"},
	{name: "menu_arrow",		type:"image",	src: "data/hud/menu_arrow.png"},
	{name: "lets_go_msg",		type:"image",	src: "data/hud/lets_go_msg.png"},
	{name: "gameover",			type:"image",	src: "data/hud/gameover.png"},
	{name: "levelcomplete",		type:"image",	src: "data/hud/levelcomplete.png"},
	
	// audio SFX 
	{name: "startup",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "menu",				type: "audio", src: "data/audio/sfx/",	channel : 2},
	{name: "jump",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "cherry",			type: "audio", src: "data/audio/sfx/",	channel : 2},
	{name: "xtralife",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "heart",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "star",				type: "audio", src: "data/audio/sfx/",	channel : 2},
	{name: "eat",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "stomp",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "hurt",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "die",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	//{name: "engine",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "turn",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "impact",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "point",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "crush",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "hit",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "kill",				type: "audio", src: "data/audio/sfx/",	channel : 2},
	
	/*
	{name: "spit",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "energy",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "shoot",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "pause",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "engine",			type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "ship",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	{name: "alex",				type: "audio", src: "data/audio/sfx/",	channel : 1},
	*/
	
	
	// audio Tracks
	{name: "Menu_Song",			type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Level_Start",		type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Level_Song",		type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Boss_Start",		type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Boss_Song",			type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Game_Over",			type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Level_Done",		type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Player_Dies",		type: "audio", src: "data/audio/music/",	channel : 1},
	
	/*
	{name: "Intro_Song",		type: "audio", src: "data/audio/music/",	channel : 1},
	{name: "Outro_Song",		type: "audio", src: "data/audio/music/",	channel : 1},
	*/
															
	// TMX maps
	{name: "a4_level1",		 type: "tmx",  src: "data/level/a4_level1.tmx"},
	{name: "a4_level2",		 type: "tmx",  src: "data/level/a4_level2.tmx"},
	{name: "a4_level3",		 type: "tmx",  src: "data/level/a4_level3.tmx"},
	{name: "a4_level4",		 type: "tmx",  src: "data/level/a4_level4.tmx"},
	{name: "a4_level5",		 type: "tmx",  src: "data/level/a4_level5.tmx"},
	{name: "a4_level6",		 type: "tmx",  src: "data/level/a4_level6.tmx"},
	{name: "a4_game_end",	 type: "tmx",  src: "data/level/a4_game_end.tmx"},
	
];