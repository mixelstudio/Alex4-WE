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
 * game screens
 */


/*---------------------------------------------------------------------

	A title screen

  ---------------------------------------------------------------------	*/

var TitleScreen = me.ScreenObject.extend(
{
	init : function()
	{
		this.parent(true);
		
		// title screen image
		this.title = null;
		
		this.font			 =  null;
		this.scrollerfont  =  null;
		
		this.arrow = null;
		this.tween = null;
		
		this.menuItems = [];
		this.selectedItem = 0;
		
		this.scroller = "GUIDE ALEX TO THE EXIT OF EACH LEVEL , USING ARROWS TO MOVE , X TO JUMP ON ENEMIES AND PICK UP STARS AND CHERRIES ON THE WAY     ";
		this.scrollerpos = 600;
	},
	/* ---
		reset function
	   ----*/
	
	onResetEvent : function()
	{

		if (this.title == null)
		{
			// init stuff if not yet done
			this.title = me.loader.getImage("menu_title");
			// font to display the menu items
			this.font = new me.BitmapFont("atascii_40px", 40);
			this.font.set("left");
			
			// set the scroller
			this.scrollerfont = new me.BitmapFont("atascii_32px", 32);
			this.scrollerfont.set("left");
			
			// the selection arrow
			this.arrow = new me.SpriteObject(80, 225, me.loader.getImage("menu_arrow"));
		
			// define the menu items
			this.menuItems[0] = new me.Vector2d(0, 210); // 230
			this.menuItems[1] = new me.Vector2d(0, 270); // 290
			this.menuItems[2] = new me.Vector2d(0, 330); // 345
			this.menuItems[3] = new me.Vector2d(0, 390); // 345
			
			// default item
			this.selectedItem = 0;
		}
      
      // reset to default value
      this.scrollerpos = 640;
		
		// a tween to animate the arrow
		this.scrollertween = new me.Tween(this).to({scrollerpos: -4000 }, 20000).onComplete(this.scrollover.bind(this)).start();

		// a tween to animate the arrow
		this.tween = new me.Tween(this.arrow.pos).to({x: 90 }, 400).onComplete(this.tweenbw.bind(this)).start();

		// set the arrow corresponding to the choosen menu
		this.arrow.pos.y = this.menuItems[this.selectedItem].y;
		
		// add a parallax background
		me.game.add(new me.ImageLayer("layer1", 0,0, "layer1", 1, 1));
		me.game.add(new me.ImageLayer("layer2", 0,0, "layer2", 2, 2));
		me.game.add(new me.ImageLayer("layer3", 0,0, "layer3", 3, 3));
		
		// add the arrow
		me.game.add(this.arrow,10);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.UP,		"up", true);
		me.input.bindKey(me.input.KEY.DOWN,		"down", true);
		me.input.bindKey(me.input.KEY.ENTER,	"enter", true);
		me.input.bindKey(me.input.KEY.X,			"enter", true);
		
		// play menu song
		me.audio.playTrack("Menu_Song");
	},
	
	
	// some callback for the tween objects
	tweenbw : function(){this.tween.to({x: 80 }, 400).onComplete(this.tweenff.bind(this)).start();},
	tweenff : function(){this.tween.to({x: 90 }, 400).onComplete(this.tweenbw.bind(this)).start();},
	scrollover : function()
	{
		// reset to default value
		this.scrollerpos = 640;
		this.scrollertween.to({scrollerpos: -4000 }, 20000).onComplete(this.scrollover.bind(this)).start();
	},
		
	/*---
		
		update function
		 ---*/
		
	update : function()
	{
	
		// up key pressed ?
		if (me.input.isKeyPressed('up'))
		{
			if (this.selectedItem > 0)
				this.selectedItem--;
			
			// set the arrow corresponding to the choosen menu
			this.arrow.pos.y = this.menuItems[this.selectedItem].y;
			
			// point sounds
			me.audio.play("menu", false);
			
			return true;
		}
		
		// down key pressed ?
		if (me.input.isKeyPressed('down'))
		{
			if (this.selectedItem < this.menuItems.length - 1)
				this.selectedItem++;
				
			// set the arrow corresponding to the choosen menu
			this.arrow.pos.y = this.menuItems[this.selectedItem].y;
			
			// point sounds
			me.audio.play("menu", false);
			return true;
		}
		
		// enter pressed ?
		if (me.input.isKeyPressed('enter'))
		{
			// point sounds
			me.audio.play("menu", false);
			
			if (this.selectedItem == 0)
			  me.state.change(me.state.PLAY);
			/*
			if (this.selectedItem == 1)
			  me.state.change(me.state.SCORE);
			*/
			if (this.selectedItem == 2)
			  me.state.change(me.state.SETTINGS);
			
			if (this.selectedItem == 3)
			  me.state.change(me.state.CREDITS);
			
			return true;

		}
		return false;
	},

	
	/*---
	
		the manu drawing function
	  ---*/
	
	draw : function(context)
	{
		context.drawImage(this.title, (context.canvas.width  - this.title.width) / 2, 80);
		
		this.font.draw (context, "START GAME",	 140, 215);
		this.font.draw (context, "HIGH SCORES", 140, 275);
		this.font.draw (context, "SETTINGS",    140, 335);
		this.font.draw (context, "CREDITS",     140, 395);
		this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 450);
	},
	
	/*---
	
		the manu drawing function
	  ---*/
	
	onDestroyEvent : function()
	{
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.DOWN);
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.X);
		
		// stop menu song
		me.audio.stopTrack("Menu_Song");
      
      //just in case
      this.scrollertween.stop();
   },

});

/*---------------------------------------------------------------------

	A credit screen

  ---------------------------------------------------------------------	*/

CreditsScreen = me.ScreenObject.extend(
{
	init : function()
	{
		this.parent(true); // next state
	
		// title screen image
		this.title = null;
		this.font  = null;
		
		this.floating = true;
	},
	
		
	
	/* ---
		reset function
	   ----*/
	
	onResetEvent : function()
	{
		if (this.title == null)
		{
			// init stuff if not yet done
			this.title = me.loader.getImage("menu_title");
			// font to display the menu items
			this.font = new me.BitmapFont("atascii_32px", 32);
			this.font.set("left");
		}
		
		me.game.add(new me.ImageLayer("layer1", 0,0, "layer1", 1, 1));
		me.game.add(new me.ImageLayer("layer2", 0,0, "layer2", 2, 2));
		me.game.add(new me.ImageLayer("layer3", 0,0, "layer3", 3, 3));
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.ENTER,	"enter", true);
		me.input.bindKey(me.input.KEY.X,		"enter", true);
		me.input.bindKey(me.input.KEY.ESC,		"enter", true);
		
		// play menu song
		me.audio.playTrack("Menu_Song");
	},
	
	
	/*---
		
		update function
		 ---*/
		
	update : function()
	{
	
		// enter pressed ?
		if (me.input.isKeyPressed('enter'))
		{
			// point sounds
			me.audio.play("menu", false);
			// switch back to menu
			me.state.change(me.state.MENU);
		}
		
		// change the viewport pos to scroll the background :)
		me.game.viewport.pos.x+=1;
		
		return true;
	},

	/*---
	
		the manu drawing function
	  ---*/
	
	draw : function(context)
	{
		context.drawImage(this.title, (context.canvas.width  - this.title.width) / 2, 80);
		
		this.font.draw (context, jsApp.version,			525,  170);
		
		this.font.draw (context, ">HTML5 REMAKE<",		50,  220);
		this.font.draw (context, "O.BIOT / MELONJS",		100, 250);

		
		this.font.draw (context, ">ORIGINAL GAME<",		50,  310);
		this.font.draw (context, "DESIGN CODE GFX :",	50,  350);
		this.font.draw (context, "JOHAN PEITZ",			100, 380);
		this.font.draw (context, "MUSIC SFX :",			50,  410);
		this.font.draw (context, "ANDERS SVENSSON",		100, 440);
	},
	
	/*---
	
		the manu drawing function
	  ---*/
	
	onDestroyEvent : function()
	{
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.X);
		me.input.unbindKey(me.input.KEY.ESC);
		
		// play menu song
		me.audio.playTrack("Menu_Song");
	},

	

});
/*---------------------------------------------------------------------

	A credit screen

  ---------------------------------------------------------------------	*/

SettingsScreen = me.ScreenObject.extend(
{
	init : function()
	{
	
		this.parent(true); // next state
		
		// title screen image
		this.title = null;
		this.font  = null;
		this.arrow = null;
		this.tween = null;
	},
	
	
	/* ---
		reset function
	   ----*/
	
	onResetEvent : function()
	{
		//console.log("title screen reset");
			
		if (this.title == null)
		{
			// init stuff if not yet done
			this.title = me.loader.getImage("menu_title");
			// font to display the menu items
			this.font = new me.BitmapFont("atascii_32px", 32);
			this.font.set("left");
			
			// the selection arrow
			this.arrow = new me.SpriteObject(80, 345, me.loader.getImage("menu_arrow"));
			
		}
		
		// a tween to animate the arrow
		this.tween = new me.Tween(this.arrow.pos).to({x: 90 }, 400).onComplete(this.tweenbw.bind(this)).start();

		// add the parallax background
		me.game.add(new me.ImageLayer("layer1", 0,0, "layer1", 1, 1));
		me.game.add(new me.ImageLayer("layer2", 0,0, "layer2", 2, 2));
		me.game.add(new me.ImageLayer("layer3", 0,0, "layer3", 3, 3));
				
		// add the arrow
		me.game.add(this.arrow,10);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.ENTER,	"enter", true);
		me.input.bindKey(me.input.KEY.X,		"enter", true);
		me.input.bindKey(me.input.KEY.ESC,		"exit", true);
	},
	
	// callback for the tween objects
	tweenbw : function()
	{
		this.tween.to({x: 80 }, 400).onComplete(this.tweenff.bind(this)).start();
	},
	
	tweenff : function()
	{
		this.tween.to({x: 90 }, 400).onComplete(this.tweenbw.bind(this)).start();
	},

	
	/*---
		
		update function
		 ---*/
		
	update : function()
	{
		// exit pressed
		if (me.input.isKeyPressed('exit'))
		{
			// point sounds
			me.audio.play("menu", false);
			// switch back to menu
			me.state.change(me.state.MENU);
		}

		// enter pressed ?
		if (me.input.isKeyPressed('enter'))
		{
			// we only have one option now
			// to toggle sound on/off
			// so just do that
			if (me.audio.isAudioEnable())
			{
					me.audio.disable();
			}
			else
			{
				me.audio.enable();
				// point sounds
				me.audio.play("menu", false);
			}
		}
		return true;
	},

	
	/*---
	
		the manu drawing function
	  ---*/
	
	draw : function(context)
	{
		context.drawImage(this.title, (context.canvas.width  - this.title.width) / 2, 80);
		this.font.draw (context, "SETTINGS ", 50,  250);
		audiostr = me.audio.isAudioEnable()?"ON":"OFF";
		this.font.draw (context, "AUDIO : " + audiostr,	 150,  350);
	},
	
	/*---
	
		the manu drawing function
	  ---*/
	
	onDestroyEvent: function()
	{
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.X);
		me.input.unbindKey(me.input.KEY.ESC);
	}

});


/*---------------------------------------------------------------------

	A level complete screen
	
  ---------------------------------------------------------------------	*/

LevelCompleteScreen  = me.ScreenObject.extend(
{
	init : function()
	{
		this.parent(true); // next state
		
		// title screen image
		this.title = null;
		
		this.font  =  null;
		
		this.levelId = null;
		
		// point to be added to global scores
		this.levelpoint = 0;
		this.livespoint = 0;
		this.starspoint = 0;
		this.cherriespoint = 0;
		
		this.postitle = 0;
		
		this.tween = null;
		
		this.background = null;
		
		this.scoreadded = false;
	},

	
	/* ---
		reset function
	   ----*/
	
	onResetEvent : function(levelId)
	{
		this.levelId = levelId;
		
		if (this.font == null)
		{
			// init stuff if not yet done
			this.title = me.loader.getImage("levelcomplete");
			// font to display the menu items
			this.font = new me.BitmapFont("atascii_32px", 32);
		}
	
		// clear some flag
		this.scoreadded = false;
		
		this.tweenfinished = false;
		
		this.scorestate = 0;
		
		// adjust the title pos outside of the screen
		this.postitle = 0 - this.title.height ;
		
		// create a new tween effect
		this.tween = new me.Tween(this).to({postitle: 0}, 750).onComplete(this.tweencb.bind(this));
		this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
		
		// create a new canvas 
		this.background = me.video.applyRGBFilter(me.video.getScreenCanvas(), "brightness", 0.7);
		
		// point to be added to global scores
		this.levelpoint = jsApp.levelid * 100;
		this.livespoint = me.game.HUD.getItemValue("life") * 100;
		this.starspoint = me.gamestat.getItemValue("stars") * 100;
		this.cherriespoint = me.gamestat.getItemValue("cherries") * 100;

		me.input.bindKey(me.input.KEY.ENTER,	"enter");
		me.input.bindKey(me.input.KEY.X,		"enter");
		
		// play the game over
		me.audio.play("Level_Done");
		
		// start the tween
		this.tween.start();
	},
	
	/*---
		
		add score animation function
	  ---*/
		
	tweencb : function()
	{
		this.tweenfinished = true;
	},
	
	/*---
		
		add score animation function
	  ---*/
		
	addscore : function()
	{
		if (!this.scoreadded)
		{
			switch (this.scorestate)
			{
				
				case 0 :
					me.audio.play("point");
					me.game.HUD.updateItemValue("score", this.levelpoint);
					break;
				
				case 1 :
					this.levelpoint = 0;
					break;
				
				case 2 :
					me.game.HUD.updateItemValue("score", this.livespoint);
					break;
				
				case 3 :
					this.livespoint = 0;
					break;

				case 4 :
					me.game.HUD.updateItemValue("score", this.starspoint);
					break;
				
				case 5 :
					this.starspoint = 0;
					break;
				
				case 6 :
					me.game.HUD.updateItemValue("score", this.cherriespoint);
					break;
				
				case 7 :
					this.cherriespoint = 0;
					break;
				
				case 8 :
					this.scoreadded = true;
					break;
					
				default : break;
			}
			this.scorestate++;
		}
	},

	/*---
		
		update function
		 ---*/
		
	update : function()
	{
		// add score
		if (this.tweenfinished && !this.scoreadded)
			this.addscore();
		// test keypress and switch to next level once done
		if (me.input.isKeyPressed('enter') && this.scoreadded)
		{
				me.state.change(me.state.PLAY, this.levelId);
		}
		return true;
	},
	
	
	/*---
	
		the manu drawing function
	  ---*/
	
	draw : function(context)
	{
		// draw the background
		context.drawImage(this.background.canvas, 0, 0);
		
		// draw the level complete title
		context.drawImage(this.title, (context.canvas.width  - this.title.width) / 2, this.postitle);
		
		/* draw the 4 caterogies title, left align */
		this.font.set("left");
		this.font.draw (context, "LEVEL",    4,	200);
		this.font.draw (context, "LIFES",	 4,	260);
		this.font.draw (context, "STARS",	 4,	320);
		this.font.draw (context, "CHERRIES", 4,   380);
		
		/* draw the current value */
		this.font.set("right");
		this.font.draw (context, me.game.currentLevel.levelid,			336, 200);
		this.font.draw (context, me.game.HUD.getItemValue("life"),		336, 260);
		this.font.draw (context, me.gamestat.getItemValue("stars"),		336, 320);
		this.font.draw (context, me.gamestat.getItemValue("cherries"), 336, 380);
		
		/* draw the calucl */
		this.font.set("right");
		this.font.draw (context, "X100=", 496, 200);
		this.font.draw (context, "X100=", 496, 260);
		this.font.draw (context, "X100=", 496, 320);
		this.font.draw (context, "X100=", 496, 380);
		
		/* draw the result */
		this.font.set("right");
		this.font.draw (context, this.levelpoint,		640, 200);
		this.font.draw (context, this.livespoint,		640, 260);
		this.font.draw (context, this.starspoint,		640, 320);
		this.font.draw (context, this.cherriespoint, 640, 380);
	
	},
	
	/*---
	
		the manu drawing function
	  ---*/
	
	onDestroyEvent : function()
	{
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.X);
		
		this.tween.stop();
	}

});
