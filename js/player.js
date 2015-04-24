(function(){

	var STAND = 0;
	var DUCK = 1;

	/**
	 * Constructeur
	 * @param Stage stage : stage EaselJS
	 * @param Number x : position x du player
	 * @param Number y : position y du player
	 */
	Player = function(world, stage, scale, x, y) {
		this.world = world;
		this.stage = stage;	// Stage EaselJS
		this.scale = scale;
		this.body = null;
		this.skin = null;	// Représentation graphique
		this.init(x, y);	// Initialiser le Player
		this.currentState = STAND;
		this.jumpContacts = 0;
	};

	/**
	 * Prototype
	 */
	Player.prototype = {
		
		/**
		 * Dessiner le Player
		 * @param Number x : position x du joueur
		 * @param Number y : position y du joueur
		 */
		init: function(x, y) {
			this.body = this.createPhysics(x, y);
			this.skin = this.createGraphics(x, y);

		},

		createPhysics:  function(x, y) {
			
			// Créer le body
			var bodyDef = new Box2D.Dynamics.b2BodyDef();
			// Affecter la position à l'élément Body
			bodyDef.position.x = x / this.scale;
			bodyDef.position.y = y / this.scale;
			bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			var playerBody = this.world.CreateBody(bodyDef);
			playerBody.SetSleepingAllowed(false);
			playerBody.SetFixedRotation(true);

			// Associer les fixtures
			this.pieds = playerBody.CreateFixture(this.getPieds());
			this.tete = playerBody.CreateFixture(this.getTete(false));
			this.corps = playerBody.CreateFixture(this.getCorps(false));
			
			return playerBody;
		},

		createGraphics: function(x, y) {
			// Préparer les données de la Spritesheet
			var data = {
				// image | spritesheet
				images: ["sprites/player.png"],
				// définition des frames
				frames: [
				    // x, y, width, height, imageIndex, regX, regY
					[365, 98, 69, 71, 0, 69/2, 71], // duck
					[0, 196, 66, 92, 0, 66/2, 92], // front
					[438, 0, 69, 92, 0, 69/2, 92], // hurt
					[438, 93, 67, 89, 0, 67/2, 89], // jump
					[67, 196, 66, 92, 0, 69/2, 92], // stand
					[0, 0, 72, 92, 0, 69/2, 92], // walk1
					[73, 0, 72, 92, 0, 69/2, 92], // walk2
					[146, 0, 72, 91, 0, 69/2, 91], // walk3
					[0, 98, 72, 92, 0, 69/2, 92], // walk4
					[73, 98, 72, 93, 0, 69/2, 93], // walk5
					[146, 98, 72, 95, 0, 69/2, 95], // walk6
					[219, 0, 72, 96, 0, 69/2, 96], // walk7
					[292, 0, 72, 97, 0, 69/2, 97], // walk8
					[219, 98, 72, 97, 0, 69/2, 97], // walk9
					[365, 0, 72, 96, 0, 69/2, 96], // walk10
					[292, 98, 72, 95, 0, 69/2, 95], // walk11
				],
				// définition des animations
				animations: {
					// start, end, next
					duck: [0,0,"walk"],
					front: [1,1,"walk"],
					hurt: [2,2,"walk"],
					jump: [3,3,"jump"],
					stand: [4,4,"stand"],
					walk: [5,15,"walk"]
				}
			};
			// Instancier la SpriteSheet
			var spriteSheet = new createjs.SpriteSheet(data);
			
			// Instancier le Sprite
			var sprite = new createjs.Sprite(spriteSheet, 'stand');
			// Positionner l'image dans le canvas
			sprite.x = x;
			sprite.y = y;
			// Ajouter le Sprite au Stage
			this.stage.addChild(sprite);
			// Assigner le sprite à la propriété skin
			return sprite;
		},

		getTete: function(duck) {
			var teteDef = new Box2D.Dynamics.b2FixtureDef();
			teteDef.userData = 'player';
			teteDef.density = 2;
			teteDef.restitution = 0.2;
			teteDef.friction = 0;
			teteDef.shape = new Box2D.Collision.Shapes.b2CircleShape(31 / this.scale);
			if (duck) {
				teteDef.shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, -30 / 1.4 / this.scale));
			} else {
				teteDef.shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, -60 / 1.4 / this.scale));
			}
			return teteDef;
		},

		getCorps: function(duck) {
			var corpsDef = new Box2D.Dynamics.b2FixtureDef();
			corpsDef.userData = 'player';
			corpsDef.density = 2;
			corpsDef.restitution = 0.2;
			corpsDef.friction = 0;
			corpsDef.shape = new  Box2D.Collision.Shapes.b2PolygonShape();
			if (duck) {
				corpsDef.shape.SetAsBox(30 / this.scale, 14 / this.scale);
			} else {
				corpsDef.shape.SetAsOrientedBox(30 / this.scale, 14 / this.scale, 
					new Box2D.Common.Math.b2Vec2(0, -18 / 1.4 / this.scale),	// position par rapport au centre du body
					0										// angle d'orientation
				);
			} 

			return corpsDef;
		},

		getPieds: function() {
			var piedsDef = new Box2D.Dynamics.b2FixtureDef();
			piedsDef.userData = 'footPlayer';
			piedsDef.friction = 6;
			piedsDef.shape = new  Box2D.Collision.Shapes.b2PolygonShape();
			piedsDef.shape.SetAsBox(20 / this.scale, 14 / this.scale);
			return piedsDef;
		},

		update: function() {
			// Redéfinir l'orientation
			this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			// Repositionner l'objet
			this.skin.x = this.body.GetPosition().x * this.scale;
			this.skin.y = this.body.GetPosition().y * this.scale + 14;
		},

		/**
		 * Passer en position immobile
		 */
		stand: function() {
			this.unduck();
			if (this.jumpContacts > 0) {
				this.skin.gotoAndPlay('stand');
			}
			this.currentState = STAND;
		},

		/**
		 * Se déplacer vers la droite
		 */
		moveRight: function() {
			this.unduck();
			this.skin.scaleX = 1;
			if (this.skin.currentAnimation != 'walk' && this.jumpContacts > 0) {
				this.skin.gotoAndPlay('walk');
			}
			//this.skin.x += 10;
			var vel = this.body.GetLinearVelocity();
			vel.x = 140 / this.scale;
		},

		/**
		 * Se déplacer vers la gauche
		 */
		moveLeft: function() {
			this.unduck();
			this.skin.scaleX = -1;
			if (this.skin.currentAnimation != 'walk' && this.jumpContacts > 0) {
				this.skin.gotoAndPlay('walk');
			}
			//this.skin.x -= 10;
			var vel = this.body.GetLinearVelocity();
			vel.x = -140 / this.scale;
		},

		/**
		 * Sauter
		 */
		jump: function() {
			this.skin.gotoAndPlay('jump');
			// effectuer le saut si les "pieds" du joueur sont en contact avec une plate-forme
			if (this.jumpContacts > 0) {
				// Appliquer une impulsion vers le haut
				this.body.ApplyImpulse(
					new Box2D.Common.Math.b2Vec2(0, -50),							// vecteur
	                this.body.GetWorldCenter());	// point d'application de l'impulsion
			}
		},

		/**
		 * S'accroupir
		 */
		duck: function() {
			if (DUCK != this.currentState) {
				// détruire les fixtures actuelles
				var oldTete = this.tete;
				var oldCorps = this.corps;

				// appliquer les fixtures DUCK
				this.tete = this.body.CreateFixture(this.getTete(true));
				this.corps = this.body.CreateFixture(this.getCorps(true));

				this.body.DestroyFixture(oldTete);
				this.body.DestroyFixture(oldCorps);
			}
			this.skin.gotoAndPlay('duck');
			this.currentState = DUCK;
		},

		unduck: function() {
			if (DUCK != this.currentState) {
				// détruire les fixtures actuelles
				var oldTete = this.tete;
				var oldCorps = this.corps;
				// appliquer les fixtures DUCK
				this.tete = this.body.CreateFixture(this.getTete(false));
				this.corps = this.body.CreateFixture(this.getCorps(false));

				this.body.DestroyFixture(oldTete);
				this.body.DestroyFixture(oldCorps);
			}
		}

	};

}());