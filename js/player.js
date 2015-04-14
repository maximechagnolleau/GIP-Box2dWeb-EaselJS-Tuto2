(function(){

	/**
	 * Constructeur
	 * @param Stage stage : stage EaselJS
	 * @param Number x : position x du player
	 * @param Number y : position y du player
	 */
	Player = function(stage, x, y) {
		this.skin = null;	// Représentation graphique
		this.stage = stage;	// Stage EaselJS
		this.init(x, y);	// Initialiser le Player
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
			this.skin = sprite;
		},

		/**
		 * Passer en position immobile
		 */
		stand: function() {
			this.skin.gotoAndPlay('stand');
		},

		/**
		 * Se déplacer vers la droite
		 */
		moveRight: function() {
			this.skin.scaleX = 1;
			if (this.skin.currentAnimation != 'walk') {
				this.skin.gotoAndPlay('walk');
			}
			this.skin.x += 10;
		},

		/**
		 * Se déplacer vers la gauche
		 */
		moveLeft: function() {
			this.skin.scaleX = -1;
			if (this.skin.currentAnimation != 'walk') {
				this.skin.gotoAndPlay('walk');
			}
			this.skin.x -= 10;
		},

		/**
		 * Sauter
		 */
		jump: function() {
			this.skin.gotoAndPlay('jump');
			this.skin.y -= 10;
		},

		/**
		 * S'accroupir
		 */
		duck: function() {
			this.skin.gotoAndPlay('duck');
		}

	};

}());