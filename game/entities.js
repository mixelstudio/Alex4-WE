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
 * game entities
 */
 

/********************************************************************************/
/*																				*/
/*		main player   															*/
/*																				*/
/********************************************************************************/

var PlayerEntity = me.ObjectEntity.extend(
{	
	/* -----

		constructor
		
	------			*/
	init: function (x, y, settings)
	{
		settings.image = "alex4";
		settings.spritewidth = 64;
		
		// call the parent constructor
		this.parent(x, y ,settings);
		
		this.initialyvel = 18;
		
		// walking & jumping speed
		this.setVelocity(4, this.initialyvel);
		this.setMaxVelocity(8, this.initialyvel);

		// update the hit box size
		this.updateColRect(16,32, 4,60);
		
		// walking animatin
		this.renderable.addAnimation ("walk", [0,1,2,3,4,5]);
		// dead animatin
		this.renderable.addAnimation ("eat", [6,6]);
		// roll animatin
		this.renderable.addAnimation ("roll", [7,8,9,10]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
		
		// to know when we fall out of the game (is this correct? no !!)
		this.ylimit = me.game.currentLevel.height;
		
		// set a callback
		this.onTileBreak = function(){me.audio.play("crush", false);}
		
		// set the display around our position
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
		
		// to know if we are rolling
		this.isRolling = false;
		
		// always update
		this.alwaysUpdate = true;
	},
		
	/* -----

		update the player pos
		
	------			*/
	update : function ()
	{
		
		if (!this.alive)
		{
			this.vel.x = 0;
			// just update player position (if falling, etc...)
			this.updateMovement();
			var updated = (this.vel.y!=0)
			// update objet animation
			this.parent();
		}
		else
		{
			if (this.isRolling===false)
			{
				// reset x velocity
				this.vel.x = 0;
				// check key press
				if (me.input.isKeyPressed('left'))
				{
					this.doWalk(true);
				}
				else if (me.input.isKeyPressed('right'))
				{
					this.doWalk(false);
				}
				
				//console.log(this.vel.x);
			}
			
			if (me.input.isKeyPressed('jump'))
			{	
				if (this.doJump())
				{
					// jump sounds
					me.audio.play("jump", false);
				}
				// else means we were not allowed to jump
			}
			
			// check & update player movement
			this.updateMovement();
			// check if position changed
			var updated = (this.vel.x!=0 || this.vel.y!=0)
			
			// if x collision and rolling, restore walking animation
			if ((this.isRolling===true) && (this.vel.x==0))
					this.setWalk();

				
			// check for collision with sthg
			var res = me.game.collide(this);
		
			if (res)
			{
				//console.log(res.type);
				switch (res.type)
				{
					case me.game.ENEMY_OBJECT :
					{
						// make sure it's a top down touch
						if ((res.y>0) && this.falling)
						{
							// check if jump is (still) pressed
							if (me.input.keyStatus('jump'))
							{
								// higher the velocity when jumping on enemy
								this.setVelocity(4, 18);
								this.forceJump();
								me.audio.play("stomp", false);
								me.audio.play("jump", false);
								this.setVelocity(4, this.initialyvel);
							}
							else {
								this.halfJump();
							} 
						}
						else if (!this.renderable.flickering && !this.isRolling)
						{
							this.touch();
						}
					}
					break;
					
					case me.game.COLLECTABLE_OBJECT :
					{
						// change to eat animation, and switch to walk when finished
						if (!this.isRolling)
						  this.renderable.setCurrentAnimation("eat", "walk");
					}
					break;
					
					case "roll" :
					{
						// change to eat animation, and switch to walk when finished
						this.setRoll()
					}
					break;
					
					// we should not reach this !
					default : break;
				}
			}

				
			// update animation
			
			if (updated)
			{
				// check if we fall somewhere 
				if (this.pos.y > this.ylimit)
				{
					//console.log("i'm dead");
					this.die();
				}
			}
			
			if (updated || !this.renderable.isCurrentAnimation("walk"))
			{
				// update objet animation
				this.parent();
				
				updated = true;
			}
		}
		return updated;
	},

	/* -----

		make it roll
		
	------			*/
	setRoll : function ()
	{	
		me.audio.play("turn", false);
			
		this.canBreakTile = true;
		this.renderable.setCurrentAnimation("roll");
		this.isRolling = true;
		
		// walking & jumping speed
		this.setVelocity(4, 18);
		this.setMaxVelocity(8, 18);
		
		// speed up rolling speed
		this.vel.x = (this.vel.x<0) ? -7 : 7;


	},
	/* -----

		make it walk
		
	------			*/
	setWalk : function ()
	{	
		me.audio.play("impact", false);
		
		this.canBreakTile = false;
		this.renderable.setCurrentAnimation("walk");
		this.isRolling = false;
		
		// cancel current velocity
		this.vel.x = 0;
		
		// walking & jumping speed
		this.setVelocity(4, this.initialyvel);
	},


	/* -----

		do a jump of half the defined velocity
		
	------			*/
	halfJump : function ()
	{	
		// stomp!
		me.audio.play("stomp", false);
		// lower the velocity
		this.setVelocity(4, this.initialyvel/2);
		this.forceJump();
		this.setVelocity(4, this.initialyvel);
		this.setMaxVelocity(8, this.initialyvel);
	},
	
	/* -----

		manage "diyng"
		
	------			*/
	die : function ()
	{
		// so sad...
		this.alive = false;
		// flip the player vertically	
		this.flipY(true);
		// make it jump
		this.forceJump();
		
		// check how many life we have left
		me.game.HUD.updateItemValue("life", -1);
		
				
		// stop the current audio track
		me.audio.stopTrack();
		
		// ouch
		me.audio.play("die", false);

		// no life left
		if (me.game.HUD.getItemValue("life") == 0)
		{
			this.renderable.flicker(40,(function(){me.game.remove(this)}).bind(this));
			
			me.game.HUD.reset("energy");
			me.game.HUD.reset("eggs");
			// say on main stuff the game is over
			me.state.current().onGameOver();
			
		}
		else
		{
			// some transition music
			me.audio.play("Player_Dies");
			
			// flick & respawn :)
			this.renderable.flicker(40, (function() {
				// reset all
				//me.game.HUD.resetAll();
				me.game.HUD.reset("energy");
				me.game.HUD.reset("eggs");
				// reset gamestat
				me.gamestat.reset();
				// reload the current level
				me.levelDirector.reloadLevel();
				// some fadeout
				me.game.viewport.fadeOut("#DFEDD2", 250);
				// restart the music
				// play level song
				me.state.current().playLevelSong();
			}).bind(this));
		}	
	
	},
	/* -----

		manage "diyng"
		
	------			*/
	touch : function ()
	{
		me.game.HUD.updateItemValue("energy", -1);
		
		if (me.game.HUD.getItemValue("energy") == 0)
		{
			this.die();			
		}
		else
		{	
			// ouch
			me.audio.play("hurt", false);
			// flicker !
			this.renderable.flicker(me.sys.fps * 2);
			
		}
	}
});
/************************************************************************************/
/*																												*/
/*		an Generic Entity Enemy																			*/
/*																												*/
/************************************************************************************/

var GenericEnemyEntity = me.ObjectEntity.extend(
{	
	init: function(x, y, settings)
	{
		// call the parent constructor
		this.parent(x, y , settings);
		
		// run towards left by default
		this.walkLeft = true;

		// collision detection setup for this object
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
		
		// walking & jumping speed
		this.setVelocity(2, 16);
				
		// to know when we fall out of the game (is this correct?)
		this.ylimit = me.game.currentLevel.height;
		
		// to record the Time of Death
		this.ToD = 0;
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
	},
	
	// make him (try to) ressurect
	unDie : function ()
	{
		if (!this.alive)
		{
			now = me.timer.getTime() - this.ToD;
			if (now > 3000) // 5 sec ?
			{	
				this.type = me.game.ENEMY_OBJECT;
				this.renderable.setCurrentAnimation("walk");
				this.alive = true;
				return
			}
			/*
			if (now > 3000) // 3 sec ?
			{	
				// shake it baby
				this.pos.x += (now%200==0)?this.shakeX:-this.shakeX;
			}
			*/
			
		}
	},
	
		
	// collision notification
	onCollision : function (res, obj)
	{
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		if (this.alive)
		{
			// if touched by a rolling object, die !
			if (obj.isRolling)
			{
				this.die();
			}
			// make sure it's a top down touch
			else if ((res.y>0) && obj.falling)
			{
				// make it dead
				this.alive = false;
				// set dead animation
				this.renderable.setCurrentAnimation("dead");
				
				// record time of death
				this.ToD = me.timer.getTime();
				// dead sfx
				//me.audio.play("enemykill", false);
			}
		}
		else // dead, so we are collectable
		{
			// left right collision only to eat it
			this.type = me.game.COLLECTABLE_OBJECT;
			// miam miam
			me.audio.play("eat", false);
			// give some score
			me.game.HUD.updateItemValue("score", 50);


		}
		// call the parent function
		this.parent(res, obj);
	},

	/* -----

		manage "diyng"
		
	------			*/
	
	die : function ()
	{
		
		me.audio.play("kill", false);
		
		// make it dead
		this.alive = false;
		// flip the player vertically	
		this.flipY(true);
		// make it jump
		this.forceJump();
		// record time of death
		this.ToD = me.timer.getTime();
	
		// flicker until dead
		this.renderable.flicker(me.sys.fps, (function()	{
			if (!this.alive)
			{				
				// miam miam
				me.audio.play("eat", false);
				// give some score
				me.game.HUD.updateItemValue("score", 50);
			}
			// reset all
			//me.game.HUD.resetAll();
			me.game.remove(this);
		}).bind(this));
		
	}

});

/*********************************************************************************/
/*																				*/
/*		our enemies !!															*/
/*																				*/
/*********************************************************************************/
var Enemy1Entity = GenericEnemyEntity.extend(
{	
	// 1st type
	init: function (x, y, settings)
	{
	
		settings.image = "enemy1";
		settings.spritewidth = 64;
		
		// call the parent constructor
		this.parent(x, y , settings);
		
		// walking animatin
		//this.addAnimation ("walk", [0,1,2,3,4,5]);
		this.renderable.addAnimation ("walk", [0,4,1,2]);
		
		// dead animatin
		this.renderable.addAnimation ("dead", [6]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");
		
		// bounding box
		this.updateColRect(8,48, 4,60);

	},
		
	// manage the enemy movement
	update : function ()
	{		
		if (this.alive)
			// make him walk !
			this.doWalk(this.walkLeft);
		else
			this.vel.x = 0;
		
		// check & update movement
		this.updateMovement();
		
		if (this.alive) {
			// since we apply a x velocity at each update,
			// if vel.x == 0 mean we hit something
			this.walkLeft = (this.vel.x == 0)?!this.walkLeft:this.walkLeft;
		}
		
		// check if we fall somewhere 
		if (!this.pos.y > this.ylimit) {
			//console.log("i'm dead");
			me.game.remove(this);
		}
		
		if (!this.alive)
		   this.unDie();
		
		return this.parent();
	}
});
/*********************************************************************************/
/*																				*/
/*		our enemies !!															*/
/*																				*/
/*********************************************************************************/
var Enemy2Entity = GenericEnemyEntity.extend(
{	

	init :function (x, y, settings)
	{
	
		settings.image = "enemy2";
		settings.spritewidth = 64;
		
		// call the parent constructor
		this.parent(x, y , settings);
		
		this.startX = x;
		this.endX   = x + settings.width - 64; // size of sprite
				
		// make him start from the right
		this.pos.x = x + settings.width - 64;
		this.walkLeft = true;
	
		// bounding box
		this.updateColRect(8,48, 12,52);	
		
		// walking animatin
		this.renderable.addAnimation ("walk", [0,1,2,1,3]);
		// dead animatin
		this.renderable.addAnimation ("dead", [4]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");
	},
		
	// manage the enemy movement
	update : function ()
	{
		// do nothing if not visible
		if (!this.visible)
			return false;
		
		if (this.alive)
		{
			if (this.walkLeft && this.pos.x <= this.startX)
			{
				this.walkLeft = false;
			}
			else if (!this.walkLeft && this.pos.x >= this.endX)
			{
				this.walkLeft = true;
			}
			//console.log(this.walkLeft);
			this.doWalk(this.walkLeft);
		}
		else
		{	
			this.vel.x = 0;
		}
		
		// check & update movement
		this.updateMovement();
		// check if position changed
		var updated = (this.vel.x!=0 || this.vel.y!=0)
			
		
		// check if we fall somewhere 
		if (this.pos.y > this.ylimit)
		{
			//console.log("i'm dead");
			me.game.remove(this);
		}
		else if (updated)
		{
			// update the object animation
			this.parent();
		}
		
		if (!this.alive)
		 this.unDie();
		
		return updated;
	}

});
/************************************************************************************/
/*																												*/
/*		an BOSS Entity																						*/
/*																												*/
/************************************************************************************/
var Boss1Entity = me.ObjectEntity.extend(
{	
	init:function (x, y, settings)
	{
		settings.image = "boss1";
		settings.spritewidth = 128;
		
		// call the parent constructor
		this.parent(x, y , settings);
		
		// run towards left by default
		this.walkLeft = true;

		// collision detection setup for this object
		this.collidable = true;
		this.type = "boss1";
		
		// walking & jumping speed
		this.setVelocity(2, 6);
		
		// bounding box
		this.updateColRect(-1,0,28 ,100);
		
		this.energy = 4;
		
		this.alwaysUpdate = true;
		
		//this.audioPlaying = false;
	},
			
	// collision notification
	onCollision : function (res, obj)
	{
		// make sure it's a left/right touch and obj is rolling
		if (obj.isRolling && (((res.x < 0) && (this.walkLeft)) || ((res.x > 0) && (!this.walkLeft))))
		{
			// make the touching object going the other way
			// make it die... maybe !
			this.die();
		}
		else
		{
			// this if not nice...
			obj.die();
		}
		// call the parent function
		this.parent();
	},
	
	
	// collision notification
	die : function (res, obj)
	{
		this.energy--;
		//ouch!
		me.audio.play("hit", false);
		
		if (this.energy > 0)
		{	
			this.alive = true;
			this.renderable.flicker(me.sys.fps,this.undie.bind(this));
		}
		else
		{
			this.alive = false;
			this.flipY(true);
			this.forceJump();
			this.renderable.flicker(me.sys.fps/2,(function() {
				me.game.remove(this);
				me.state.change(me.state.READY, "a4_game_end");
			}).bind(this));
		}
	},
	
	// collision notification
	undie : function ()
	{
		this.alive = true;
	},

	
	// manage the enemy movement
	update : function ()
	{
		// reset velocity
		this.vel.x = 0;
		// make him walk !
		if (this.alive)
		{
			this.doWalk(this.walkLeft);
			
			/*
			if (!this.audioPlaying)
			{	
				console.log("roooor");
				me.audio.play("engine", false, this.engineAudio.bind(this));
				this.audioPlaying = true;
			}
			*/

		}	
			
		this.updateMovement();
			
		// since we apply a x velocity at each update,
		// if vel.x == 0 mean we hit something
		this.walkLeft = (this.vel.x == 0)?!this.walkLeft:this.walkLeft;
			
		if (this.vel.x!=0 || this.vel.y!=0)
		{
			// update the object animation
			this.parent();
		}
		return true;
	}

});
/************************************************************************************/
/*																												*/
/*		a Canon Entity																						*/
/*																												*/
/************************************************************************************/
var CanonEntity = me.ObjectEntity.extend(
{	
	init: function(x, y, settings)
	{
		//settings.width = 64;
		//settings.height = 64;
		
		// call the parent constructor
		this.parent(x, y , settings);
		// we just use it to detect contact, so never destroy it
		this.collidable = false;
		//this.visible = true;
		this.last = me.timer.getTime();
		
	},

	update : function ()
	{
		now = me.timer.getTime();
		if (now - this.last > 4000) // 3 sec ?
		{
			// do something when collected
			me.audio.play("crush", false);
			me.game.add(new BulletEntity(this.pos.x - 64, this.pos.y, true), this.z); // left
			me.game.add(new BulletEntity(this.pos.x + 64, this.pos.y, false), this.z); // right
			me.game.sort();
			this.last = now;
			return true;
		}
		return false;
	}
});

/************************************************************************************/
/*																												*/
/*		a Bullet entity, fired by the cannon														*/
/*																												*/
/************************************************************************************/
var BulletEntity = me.ObjectEntity.extend(
{	

	init: function(x, y, left)
	{
		settings = {};
		settings.image = "bullet";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		
		// collision detection setup for this object
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
		this.visible = true;
		
		// x & y vel
		this.setVelocity(8, 10);
		
		//this.walkLeft = direction;
		
		this.doWalk(left);
		
		// update function
		// since the parent call override the update fn
		// we declare it in the constructor
		this.update = function ()
		{
			// cancel the gravity
			this.vel.y -= this.gravity;
			
			// check & update movement
			this.updateMovement();
			
			// check if we hit a wall 
			if (this.vel.x == 0)
			{
				me.game.remove(this);
			}
			return (this.vel.x!=0 || this.vel.y!=0);
		};
	}
});	
/************************************************************************************/
/*																												*/
/*		a Spikee Entity																					*/
/*																												*/
/************************************************************************************/
var SpikeEntity = me.ObjectEntity.extend(
{
	init:function(x, y, settings)
	{
		// call the parent constructor
		this.parent(x, y , settings);
		// we just use it to detect contact, so never destroy it
		this.collidable = true;
		this.visible = true;
		this.type = me.game.ENEMY_OBJECT;
		
		if (settings.direction)
		{
			switch (settings.direction)
			{
				case "up" :
					// adjust bounding box size
					this.updateColRect(-1,0,32,32);
					break;
				
				case "left" :
					// adjust bounding box size
					this.updateColRect(32,32,-1,0);
					break;
				
				case "down" :
					// adjust bounding box size
					this.updateColRect(-1,0,0,32);
					break;
				
				case "right" :
					// adjust bounding box size
					this.updateColRect(0,32,-1,0);
					break;
					
				default : break;
			}
		}
	},
	
	// collision notification
	onCollision : function (res, obj)
	{
		// this if not nice...
		obj.die();
		// call the parent function
		this.parent();
	},
	
	// empty update
	update : function (){return false;}
	
});
/************************************************************************************/
/*																												*/
/*		a Roll Activator entity																			*/
/*																												*/
/************************************************************************************/
var RollBlockEntity = me.ObjectEntity.extend(
{
	init:function (x, y, settings)
	{
		settings.image = "roll";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		// custom type for this object
		this.type = "roll";
		// adjust bounding box size
		this.updateColRect(0,64,-8,64);
		// small adjustement
		this.pos.y -= 16;
		this.collidable = true;
	}
});


/************************************************************************************/
/*																												*/
/*		a Cherry entity																					*/
/*																												*/
/************************************************************************************/
var CherryEntity = me.CollectableEntity.extend(
{	
	init:function (x, y, settings)
	{
		settings.image = "cherry";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);

		// adjust bounding box size
		this.updateColRect(8,48,8,48);
		
	},
	
	onCollision : function ()
	{
		// do something when collected
		me.audio.play("cherry", false);
		// give some score
		me.game.HUD.updateItemValue("score", 10);
		// update game stats
		me.gamestat.updateValue("cherries", 1);
		// avoid any further collision
		this.collidable = false;
		// remove the object
		me.game.remove(this);
	}

});

/************************************************************************************/
/*																												*/
/*		a Heart entity																						*/
/*																												*/
/************************************************************************************/
var HeartEntity = me.CollectableEntity.extend(
{	
	init:function (x, y, settings)
	{
		settings.image = "heart";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		
		// adjust bounding box size
		this.updateColRect(8,48,8,48);
	},
	
	onCollision : function ()
	{
		// do something when collected
		me.audio.play("heart", false);
		// give some energy
		me.game.HUD.updateItemValue("energy", 1);
		// avoid any further collision
		this.collidable = false;
		// remove the object
		me.game.remove(this);

	}

});

/************************************************************************************/
/*																												*/
/*		a Heart entity																						*/
/*																												*/
/************************************************************************************/
var OneUpEntity = me.CollectableEntity.extend(
{	
	init: function(x, y, settings)
	{
		settings.image = "1up";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		
		// adjust bounding box size
		this.updateColRect(8,48,8,48);
	},
	
	onCollision : function ()
	{
		// do something when collected
		me.audio.play("xtralife", false);
		// give some energy
		me.game.HUD.updateItemValue("life", 1);
		// avoid any further collision
		this.collidable = false;
		// remove the object
		me.game.remove(this);

	}
});



/************************************************************************************/
/*																												*/
/*		a Star entity																						*/
/*																												*/
/************************************************************************************/
var StarEntity = me.CollectableEntity.extend(
{
	init: function(x, y, settings)
	{
		settings.image = "stars";
		settings.spritewidth = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		
		// adjust bounding box size
		this.updateColRect(8,48,8,48);
	},
	
	onCollision : function ()
	{
		// do something when collected
		me.audio.play("star", false);
		// give some score
		me.game.HUD.updateItemValue("score", 100);
			
		// add some game stats
		me.gamestat.updateValue("stars", 1);
		
		// avoid any further collision
		this.collidable = false;
		// remove the object
		me.game.remove(this);

	}
});


/************************************************************************************/
/*																												*/
/*		a next level entity																				*/
/*																												*/
/************************************************************************************/
var TMXLevelEntity = me.LevelEntity.extend(
{	
	init:function(x, y, settings)
	{
		settings.to = settings.nextlevel;
		this.parent(x, y ,settings);
		
		//console.log(settings);
		
		// update the hit box size
		this.updateColRect(20,24, 24,40);

	},
			
	onCollision : function() 
	{ 
		//console.log("switching to state READY");
		this.collidable = false;
		me.state.change(me.state.READY, this.nextlevel);
	}
});



/************************************************************************************/
/*																												*/
/*		HUD Object : Score																				*/
/*																												*/
/************************************************************************************/
var HUDScoreObject = me.HUD_Item.extend(
{	
	init:function(x, y)
	{
		this.parent(x, y);
		// create a font
		this.font = new me.BitmapFont("atascii_40px", 40);
				
	},
	
	draw : function (context, x, y)
	{
		//console.log(this.value, this.pos.x +x, this.pos.y+y);
		this.font.draw (context, this.value, this.pos.x+x, this.pos.y+y);
	}
});

/************************************************************************************/
/*																												*/
/*		HUD Object : Life																				*/
/*																												*/
/************************************************************************************/
var HUDLifeObject = me.HUD_Item.extend(
{	
	init:function(x, y)
	{
		this.parent(x, y, 2);
		// create a font
		this.font = new me.BitmapFont("atascii_40px", 40);
		this.font.set("left");
		this.lifeIcon = me.loader.getImage("hud_life");
	},
	
	draw : function (context, x, y)
	{
		context.drawImage(this.lifeIcon, this.pos.x+x, this.pos.y+y);	
		
		//console.log(this.value, this.pos.x +x, this.pos.y+y);
		this.font.draw (context, this.value, this.pos.x + x + this.lifeIcon.width, this.pos.y + y - 2);
	}
});
/************************************************************************************/
/*																												*/
/*		HUD Object : Eggs																					*/
/*																												*/
/************************************************************************************/
var HUDEggObject = me.HUD_Item.extend(
{	
	init:function(x, y)
	{
		this.parent(x, y);
		// create a font
		this.font = new me.BitmapFont("atascii_40px", 40);
		
		this.font.set("left");
		
		this.EggIcon = me.loader.getImage("hud_egg");
	},

	draw : function (context, x, y)
	{
		context.drawImage(this.EggIcon, this.pos.x+x, this.pos.y+y);	
		
		//console.log(this.value, this.pos.x +x, this.pos.y+y);
		this.font.draw (context, this.value, this.pos.x + x + this.EggIcon.width, this.pos.y + y - 2);
	}
});
/************************************************************************************/
/*																												*/
/*		HUD Object : Eggs																					*/
/*																												*/
/************************************************************************************/
var HUDEnergyObject = me.HUD_Item.extend(
{	
	init: function(x, y)
	{
		this.parent(x, y, 1);
		this.heartIcon = me.loader.getImage("hud_heart");
	},
		
				
	update : function (val)
	{
		// do nothing if 0 energy
		if (this.value+val <0)
		  return false;
		
		if (this.value+val <= 2) // 2
		{	
			// update energy level
			return this.parent(val);
		}
		else // don't add the new value but give some score
		{
			// give some score
			me.game.HUD.updateItemValue("score", 100);
		}
		return false;
	},

	

	draw : function (context, x, y)
	{
		var posx = this.pos.x+x;
		for (i=0; i< this.value;i++)
		{	
			context.drawImage(this.heartIcon, posx, this.pos.y+y);
			posx += this.heartIcon.width;
		}
	}
});
/************************************************************************************/
/*																												*/
/*		a let's go msg entity																			*/
/*																												*/
/************************************************************************************/
var LetsGoMessage = me.SpriteObject.extend(
{	
	init:function(x, y)
	{
		// call the parent constructor

		this.parent(x, y, me.loader.getImage("lets_go_msg"));
		
		this.floating = true;
		this.alwaysUpdate = true;
		
		//console.log(me.game.viewport.pos.x);
		this.pos.x = ((me.game.viewport.width - this.image.width)/2);
		this.pos.y = - this.image.height;
		
		// create a font for the level label
		this.font = new me.BitmapFont("atascii_32px", 32);
		this.font.set("left");
		this.leveltitle = me.game.currentLevel.label.toUpperCase();
		this.size = (this.font.measureText(me.video.getSystemContext(),this.leveltitle)).width;
		this.labelx = 0 - this.size;

		// add a tween for the let's go message message
		this.tween = new me.Tween(this.pos).to({y: 140}, 1500).onComplete(this.AnimStep.bind(this));
		this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
		
		// add an other one for the level title
		this.texttween = new me.Tween(this).to({labelx: ((me.game.viewport.width - this.size)/2)}, 750);
		
		this.tween.start();
		this.texttween.start();
	},
			
	AnimStep : function()
	{
		// tween out
		this.tween.easing(me.Tween.Easing.Circular.EaseOut);
		this.tween.to({y: me.game.currentLevel.height}, 1500).start();
		this.tween.onComplete((function(){
			me.game.remove(this);}
		).bind(this));
		// and text 
		this.texttween.to({labelx: me.game.viewport.width}, 500).start();
	},
	
	draw : function(context) 
	{
		this.parent(context);
		this.font.draw(context, this.leveltitle, this.labelx, 250);
	}

});
/************************************************************************************/
/*																												*/
/*		a Game Over Message entity																		*/
/*																												*/
/************************************************************************************/
var gameOverMessage = me.SpriteObject.extend(
{	
	init:function (x, y, callback)
	{
		
		// call the parent constructor
		this.parent(x, y, me.loader.getImage("gameover"));
		
		// center the sprite on the viewport
		this.pos.x = me.game.viewport.pos.x + ((me.game.viewport.width - this.image.width)/2);
		this.pos.y = 0 - this.image.height;
		
		this.callback = callback;
		
		this.tween = new me.Tween(this.pos).to({y: 200}, 3000).onComplete(callback);
		this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
		this.tween.start();
	}
});


/************************************************************************************/
/*																												*/
/*		a game end message																				*/
/*																												*/
/************************************************************************************/
var GameEndMessage = me.ObjectEntity.extend(
{	

	init:function(x, y, callback)
	{
		settings= {};
		settings.width = 64;
		settings.height = 64;
		// call the parent constructor
		this.parent(x, y , settings);
		// we just use it to detect contact, so never destroy it
		this.collidable = false;
		//this.visible = true;
		
		// y offset of the text box
		this.yoff = -270;
		// a tween to animate it
		this.tween = new me.Tween(this).to({yoff: 50}, 2000).onComplete(this.animDone.bind(this));
		this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
	
		// a flag
		this.animover = false;
		
		// a font to display stuff
		this.font = new me.BitmapFont("atascii_32px", 32);
		this.font.set("left");
		
		// bind a key
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		
		this.tween.start();
	},
	
	update:function()
	{
		if (this.animover && me.input.isKeyPressed('enter'))
		{
			// say on main stuff the game is over
			me.state.current().onGameEnd();
			// and switch to Credit Screen
			me.input.unbindKey(me.input.KEY.ENTER);
			me.game.disableHUD();
			me.state.change(me.state.CREDITS);
		}
		return true;
	},
	
	animDone : function()
	{
		this.animover = true;
	},
	

	draw : function(context)
	{
		// draw a box
		context.fillStyle = "rgba(12,69,0,0.5)";
		context.fillRect (85, this.yoff,		490, 240);
		context.fillRect (90, this.yoff+ 5, 480, 230);
								
		this.font.draw (context, "CONGRATULATIONS", 90, this.yoff + 10);
		this.font.draw (context, "WAS NOT SO HARD", 90, this.yoff + 50);
		this.font.draw (context, "I GUESS ?",		  90, this.yoff + 80);
		this.font.draw (context, "COME BACK FOR", 90, this.yoff + 120);
		this.font.draw (context, "MORE LEVEL SOON", 90, this.yoff + 150);
		if (this.animover == true)
		{
			this.font.draw (context, "PRESS <ENTER>", 130, this.yoff + 200);
		}
	}
});
