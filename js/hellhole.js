var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var background = {};
var ground = {};
var castle = {};


function preload() {
    
    // fonts
    game.load.bitmapFont('visitor10', 'assets/fonts/visitor10.png', 'assets/fonts/visitor10.fnt');
    game.load.bitmapFont('visitor32', 'assets/fonts/visitor32.png', 'assets/fonts/visitor32.fnt');
    game.load.bitmapFont('visitor16', 'assets/fonts/visitor16.png', 'assets/fonts/visitor16.fnt');
    
    // stuff
    game.load.image('castle', 'assets/castle.png');
    game.load.image('castle_tower', 'assets/castle_tower.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('hole', 'assets/hole.png');
    game.load.spritesheet('hell_sign', 'assets/hell_sign.png', 24, 32);
    game.load.image('rain', 'assets/rain.png');
    
    game.load.image('healthbar', 'assets/healthbar.png');
    
    player.preload();
    
    enemies.preload();
}

function create() {
    
    // setup world
    game.world.setBounds(0, -1000, 800, 10000);
    
    // setup physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.setBoundsToWorld();
    game.physics.arcade.gravity.y = 300;
    
    // create background
    background.create();
    
    // create ground
    ground.group = game.add.group();
    ground.sign = game.add.sprite(590, 5, 'hell_sign', 0, ground.group);
    ground.sign.animations.add('burn', [0, 1], 4, true);
    ground.sign.animations.play('burn');
    ground.sign.anchor.set(0.5, 1);
    ground.sign.scale.set(2);
    
    ground.ground = game.add.sprite(0, 0, 'ground', 0, ground.group);
    ground.ground.scale.set(600, 4);
    game.physics.enable(ground.ground, Phaser.Physics.ARCADE);
    ground.ground.body.immovable = true;
    ground.ground.body.moves = false;
    
    ground.hole = game.add.sprite(600, 0, 'hole', 0, ground.group);
    ground.hole.scale.set(2, 4);
    
    // create map
    map.create();
    
    // create player
    player.create();
    
    // create enemies
    enemies.create();
    
    // create castle
    castle.group = game.add.group();
    castle.tower = game.add.sprite(0, -400, 'castle_tower', 0, castle.group);
    castle.tower.anchor.y = 1;
    game.physics.enable(castle.tower, Phaser.Physics.ARCADE);
    castle.tower.body.moves = false;
    castle.tower.body.immovable = true;
    castle.tower.scale = new Phaser.Point(4, 4);
    castle.tower.body.setSize(11, 21, 0, 0);
    
    castle.main = game.add.sprite(0, 0, 'castle', 0, castle.group);
    castle.main.anchor.y = 1;
    game.physics.enable(castle.main, Phaser.Physics.ARCADE);
    castle.main.body.moves = false;
    castle.main.body.immovable = true;
    castle.main.scale = new Phaser.Point(4, 4);
    castle.main.body.setSize(43, 104, 0, 12);
    
    // setup stage
    game.stage.smoothed = false;
    game.stage.backgroundColor = '#FFFFFF';
    
    // setup camera
    game.camera.setSize(800, 600);
}

function update() {
    map.update();
    enemies.update();
}

function render() {
    map.render();
    enemies.render();
    player.render();
}