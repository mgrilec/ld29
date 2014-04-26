var player = {
    moveSpeed: 80,
    moveDrag: 300,
    jumpSpeed: 120,
    jumpDrag: 10,
    mass: 200,
    
    create: function() {
        
        // create player
        player.group = game.add.group();
        player.sprite = game.add.sprite(10, -410, 'player', 0, player.group);
        player.sprite.scale = new Phaser.Point(2, 2);
        player.sprite.anchor.set(0.33, 1);
        player.sprite.animations.add('idle', [0, 1], 2, true);
        player.sprite.animations.add('walk', [2, 3], 8, true);
        player.sprite.animations.add('fly', [4, 5], 15, true);
        player.sprite.animations.play('idle');
        game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
        player.sprite.body.velocity.x = 180;
        player.sprite.body.setSize(6, 16, -2, 0);
        player.sprite.body.drag.set(player.moveDrag, player.jumpDrag);
        player.sprite.body.mass = player.mass;
        
        
    }
};