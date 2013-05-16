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

var jsApp	= 
{	
	// Alex version
	version : "1.6",
	
	objRef  : null,
	
	levelid : 0,
	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		// initialize the video
		if (!me.video.init('jsapp', 640, 480)) {
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}
		
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}
						
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		//me.audio.disable();
	
		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all ressources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.MENU, new TitleScreen());
		// set the Credits Screen Object
		me.state.set(me.state.CREDITS, new CreditsScreen());
		// set the Settings Screen Object
		me.state.set(me.state.SETTINGS, new SettingsScreen());
		// set the "Ready/LevelComplete" Screen Object
		me.state.set(me.state.READY, new LevelCompleteScreen());
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// set a global fading transition for the screen
		me.state.transition("fade", "#DFEDD2", 250);
		
		// disable transition for the READY STATE
		me.state.setTransition(me.state.READY, false);
			
		// add our customs entity in the entity pool
		me.entityPool.add("playerspawnpoint", PlayerEntity);
		me.entityPool.add("cherryentity", CherryEntity);
		me.entityPool.add("heartentity", HeartEntity);
		me.entityPool.add("starentity", StarEntity);
		me.entityPool.add("1upentity", OneUpEntity);
		me.entityPool.add("rollblockentity", RollBlockEntity);
		me.entityPool.add("enemy1entity", Enemy1Entity);
		me.entityPool.add("enemy2entity", Enemy2Entity);
		me.entityPool.add("boss1entity", Boss1Entity);
		me.entityPool.add("canonentity", CanonEntity);
		me.entityPool.add("spikeentity", SpikeEntity);
		me.entityPool.add("lets_go_msg", LetsGoMessage);
		me.entityPool.add("game_end_msg", GameEndMessage);
		me.entityPool.add("tmxlevelentity", TMXLevelEntity);
		
		
		// add some game stats
		me.gamestat.add("stars",	 0);
		me.gamestat.add("cherries",  0);
		
		
		// startup sounds
		me.audio.play("startup", false);
		
      // just define a function that display pause
      me.state.onPause = function ()
      {
         // get the current context
         var context = me.video.getScreenContext();
         //draw a black transparent square
         context.fillStyle = "rgba(0, 0, 0, 0.8)";
		 context.fillRect(0, (me.video.getHeight()/2) - 30, me.video.getWidth(), 60);
         
         // create a font
         var font = new me.BitmapFont("atascii_40px", 40);
         font.set("left");
         // a draw "pause" ! 
         var measure = font.measureText("P A U S E");
         font.draw (context, "P A U S E", (me.video.getWidth()/2) - (measure.width/2) , (me.video.getHeight()/2) - (measure.height/2));

      };
      
      // change to the menu screen
	  me.state.change(me.state.MENU);
		
	}
}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
	
    // stuff to reset on state change
	onResetEvent: function(levelId)
	{	
      
		// load a level
		me.levelDirector.loadLevel(levelId || "a4_level1");
		
		// store the current levelid (this is a map property)
		jsApp.levelid = levelId ? me.game.currentLevel.levelid : 0;
		
		// if no parameter is passed it means it's new game
		if (!levelId)
		{
			// add a default HUD to the game mngr
			me.game.addHUD(0, 440, 640, 40, "rgb(12,69,0)");
		
			// add a new HUD item 
			me.game.HUD.addItem("life",	  new HUDLifeObject		(4,	4));
			me.game.HUD.addItem("energy", new HUDEnergyObject	(180, 4));
			me.game.HUD.addItem("eggs",	  new HUDEggObject		(310, 4));
			me.game.HUD.addItem("score",  new HUDScoreObject	(640, 2));
			
			/*
			try 
			{
				//inform  we start a new game
				tapjs.play()
			} 
			catch(e){};
			*/
		}
			
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,		"left");
		me.input.bindKey(me.input.KEY.RIGHT,	"right");
		me.input.bindKey(me.input.KEY.X,		"jump", true);
		
		me.gamestat.reset();

		
		//me.game.sort();

		// play level song
		this.playLevelSong();
		
	},
	
	/* ---
	
		 bouh
		
		---										*/
	onGameOver: function()
	{
		this.onGameEnd();
		
		me.game.add(new gameOverMessage(0,0, function(){me.game.disableHUD();me.state.change(me.state.MENU)}),999);
		me.game.sort();
		
		// stop current song
		me.audio.stopTrack();
		// play the game over
		me.audio.play("Game_Over");
	},
	
	/* ---
	
		 bouh !
		
		---										*/
	playLevelSong: function()
	{
		// a nice switch could be nice ...
		
		// check for the level kind
		if (me.levelDirector.getCurrentLevelId() == "a4_level6")
		{
			// boss song
			me.audio.play("Boss_Start", false, function(){me.audio.playTrack("Boss_Song");});
		}
		else if (me.levelDirector.getCurrentLevelId() == "a4_game_end")
		{
			// outro level song
			me.audio.play("Level_Start", false, function(){me.audio.playTrack("Level_Song");});
		}
		else
		{
			// level song
			me.audio.play("Level_Start", false, function(){me.audio.playTrack("Level_Song");});
		}

		
	},

	
	/* ---
	
		 bouh
		
		---										*/
	onGameEnd: function()
	{
		/*
		try 
		{
			//save our score
		
			tapjsHighScores.save(me.game.HUD.getItemValue("score"), "Level "+me.game.currentLevel.levelid, "yes");
		} 
		catch(e){};
		*/
	},
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.X);
		
		// stop menu song
		me.audio.stopTrack("Level_Song");
	}

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
