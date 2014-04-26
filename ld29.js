var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var background = {};
var ground = {};
var castle = {};
var cloud;
var player = {
    moveSpeed: 80,
    moveDrag: 300,
    jumpSpeed: 120,
    jumpDrag: 10,
    mass: 200,
};



function preload() {
    game.load.spritesheet('player', 'assets/knight.png', 16, 16);
    game.load.image('castle', 'assets/castle.png');
    game.load.image('castle_tower', 'assets/castle_tower.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('hole', 'assets/hole.png');
    game.load.image('hell_sign', 'assets/hell_sign.png');
}

function create() {
    
    // setup world
    game.world.setBounds(0, -1000, 300, 10000);
    
    // setup physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;
    
    // background helper
    var backgroundSprite = function(x, y, width, height, color) {
        var data = game.add.bitmapData(1, 1);
        data.context.fillStyle = Phaser.Color.getWebRGB(color);
        data.context.fillRect(0, 0, 1, 1);
        
        var sprite = game.add.sprite(x, y, data, 0, background.group);
        sprite.scale.x = width;
        sprite.scale.y = height;
        return sprite;
    }
    
    // create background group
    background.group = game.add.group();
    background.sky = backgroundSprite(0, -1000, 800, 1000, 0xFFB5E0FF);
    background.underground = backgroundSprite(0, 0, 800, 10000, 0xFF7C614F);
    
    // create ground
    ground.group = game.add.group();
    ground.sign = game.add.sprite(590, 5, 'hell_sign', 0, ground.group);
    ground.sign.anchor.set(0.5, 1);
    ground.sign.scale.set(2);
    
    ground.ground = game.add.sprite(0, 0, 'ground', 0, ground.group);
    ground.ground.scale.set(600, 4);
    game.physics.enable(ground.ground, Phaser.Physics.ARCADE);
    ground.ground.body.immovable = true;
    ground.ground.body.moves = false;
    
    ground.hole = game.add.sprite(600, 0, 'hole', 0, ground.group);
    ground.hole.scale.set(4);
    
    // create player
    player.group = game.add.group();
    player.sprite = game.add.sprite(70, -450, 'player', 0, player.group);
    player.sprite.scale = new Phaser.Point(2, 2);
    player.sprite.anchor.set(0.33, 1);
    player.sprite.animations.add('idle', [0, 1], 2, true);
    player.sprite.animations.add('walk', [2, 3], 8, true);
    player.sprite.animations.add('fly', [4, 5], 15, true);
    player.sprite.animations.play('idle');
    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.setSize(6, 16, -2, 0);
    player.sprite.body.drag.set(player.moveDrag, player.jumpDrag);
    player.sprite.body.mass = player.mass;
    
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
    
    // create cloud
    cloud = game.add.sprite(500, -500, 'cloud');
    cloud.alpha = 0.9;
    cloud.scale = new Phaser.Point(4, 4);
    game.add.tween(cloud).to( { y: -508 }, 2000, Phaser.Easing.Exponential.None, true, 0, Number.MAX_VALUE, true);
    
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
    game.physics.arcade.collide(player.group, castle.group);
    game.physics.arcade.collide(player.group, ground.ground);
    
    controls();
    animation();
}

function controls() {
    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
        player.sprite.body.velocity.x = -player.moveSpeed;
        player.sprite.scale.x = -2;
    }
    else if (cursors.right.isDown) {
        player.sprite.body.velocity.x = player.moveSpeed;
        player.sprite.scale.x = 2;
    }
    
    if (cursors.up.isDown && player.sprite.body.touching.down) {
        player.sprite.body.velocity.y -= player.jumpSpeed;
    }
}

function animation() {
    if (Math.abs(player.sprite.body.velocity.x) > 5 && player.sprite.body.touching.down)
        player.sprite.animations.play('walk');
    else if (player.sprite.body.touching.none)
        player.sprite.animations.play('fly');
    else if (player.sprite.body.touching.down)
        player.sprite.animations.play('idle');
}

function render() {
}