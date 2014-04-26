var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var castle;
var castleTower;
var player;
var background;

function preload() {
    game.load.spritesheet('player', 'assets/knight.png', 16, 16);
    game.load.image('castle', 'assets/castle.png');
    game.load.image('castle_tower', 'assets/castle_tower.png');
}

function create() {
    
    // setup world
    game.world.setBounds(0, -1000, 300, 10000);
    
    // setup physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 100;
    
    // background helper
    var backgroundSprite = function(x, y, width, height, color) {
        var data = game.add.bitmapData(1, 1);
        data.context.fillStyle = Phaser.Color.getWebRGB(color);
        data.context.fillRect(0, 0, 1, 1);
        
        var sprite = game.add.sprite(x, y, data, 0, background);
        sprite.scale.x = width;
        sprite.scale.y = height;
        return sprite;
    }
    
    // create background group
    background = game.add.group();
    var sky = backgroundSprite(0, -1000, 800, 1000, 0xFFB5E0FF);
    var ground = backgroundSprite(0, 0, 800, 2, 0xFF1E1A17);
    var underground = backgroundSprite(0, 2, 800, 10000, 0xFF7C614F);
    
    // create player
    player = game.add.group();
    player.sprite = game.add.sprite(50, -450, 'player', 0, player);
    player.sprite.scale = new Phaser.Point(2, 2);
    player.sprite.animations.add('idle', [0, 1], 2, true);
    player.sprite.animations.add('walk', [2, 3], 10, true);
    player.sprite.animations.play('idle');
    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    
    // create castle
    castleTower = game.add.sprite(0, -400, 'castle_tower');
    castleTower.anchor.y = 1;
    game.physics.enable(castleTower, Phaser.Physics.ARCADE);
    castleTower.body.moves = false;
    castleTower.body.immovable = true;
    castleTower.scale = new Phaser.Point(4, 4);
    castleTower.body.setSize(11, 21, 0, 0);
    
    castle = game.add.sprite(0, 0, 'castle');
    castle.anchor.y = 1;
    game.physics.enable(castle, Phaser.Physics.ARCADE);
    castle.body.moves = false;
    castle.body.immovable = true;
    castle.scale = new Phaser.Point(4, 4);
    castle.body.setSize(43, 104, 0, 12);
    
    
    // setup stage
    game.stage.smoothed = false;
    game.stage.backgroundColor = '#FFFFFF';
    
    // setup camera
    game.camera.setSize(800, 600);
}

function update() {
    
    // camera follow player
    game.camera.focusOn(player.sprite);
    game.camera.x = 0;
    
    // collide player
    game.physics.arcade.collide(player, castle);
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player.sprite, 32, 128);
    game.debug.body(player);
}