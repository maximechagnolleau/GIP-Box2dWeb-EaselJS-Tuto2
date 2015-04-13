(function() {

	// EaselJS
	var Ticker = createjs.Ticker;
	var gipCanvas;				//  canvas easeljs
	var stage;					// stage easeljs
	
	// Box2d Web
	var box2dCanvas; // canvas box2d
	var box2dUtils; // classe utilitaire box2d
	var context; 	// contexte 2d
	var SCALE = 30; // échelle
	var world;		// world box2d
	var canvasWidth, canvasHeight;	// dimensions du canvas

	// Initialisation
	$(document).ready(function() {
		init();
	});

	this.init = function() {
		prepareStage();		// préparer l'environnement graphique
		prepareBox2d();		// préparer l'environnement physique

		startTicker(30);	// lancer le ticker
	};

	// Préparer l'environnement graphique
	this.prepareStage = function() {
		// récupérer le canvas GIP
		gipCanvas = $('#gipCanvas').get(0);
		// créer le Stage
		stage = new createjs.Stage(gipCanvas);
		// Classe utilitaire EaselJS
		easelJsUtils = new EaselJsUtils(stage);
	};

	// Préparer l'environnement physique
	this.prepareBox2d = function() {
		box2dCanvas = $('#box2dCanvas').get(0);
		canvasWidth = parseInt(box2dCanvas.width);
		canvasHeight = parseInt(box2dCanvas.height);
		canvasPosition = $(box2dCanvas).position();
		context = box2dCanvas.getContext('2d');
		box2dUtils = new Box2dUtils(SCALE);
		world = box2dUtils.createWorld(context); // box2DWorld
		setWorldBounds(); // définir les limites de l'environnement
	};

	// Créer les limites de l'environnement
	this.setWorldBounds = function() {
		// Créer le "sol" et le "plafond" de notre environnement physique
		ground = box2dUtils.createBox(world, 400, canvasHeight - 10, 400, 10, null, true, 'ground');
		ceiling = box2dUtils.createBox(world, 400, -5, 400, 1, null, true, 'ceiling');
		
		// Créer les "murs" de notre environnement physique
		leftWall = box2dUtils.createBox(world, -5, canvasHeight, 1, canvasHeight, null, true, 'leftWall');
		leftWall = box2dUtils.createBox(world, canvasWidth + 5, canvasHeight, 1, canvasHeight, null, true, 'leftWall');
	};

	// Démarrer le ticker
	this.startTicker = function(fps) {
		Ticker.setFPS(fps);
		Ticker.addEventListener("tick", tick);
	};

	// Mise à jour de l'environnement
	this.tick = function() {
		// box2d
		world.Step(1 / 15,  10, 10);
		world.DrawDebugData();
		world.ClearForces();
		
		// easelJS
		stage.update();
	}

}());