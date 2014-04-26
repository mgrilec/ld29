var player = {
    moveSpeed: 80,
    jumpSpeed: 120,
    
    preload: function() {
        // player
        game.load.spritesheet('player', 'assets/knight.png', 16, 16);
    },
    
    create: function() {
        
        // create player
        player.group = game.add.group();
        player.sprite = game.add.sprite(10, -410, 'player', 0, player.group);
        player.sprite.scale.set(2);
        player.sprite.anchor.set(0.33, 1);
        player.sprite.animations.add('idle', [0, 1], 1.2, true);
        player.sprite.animations.add('walk', [2, 3], 8, true);
        player.sprite.animations.add('fly', [4, 5], 15, true);
        player.sprite.animations.play('idle');
        
        // physics
        game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
        player.sprite.body.velocity.x = 180;
        player.sprite.body.setSize(6, 16, -2, 0);
        player.sprite.body.drag.set(300, 10);
        player.sprite.body.mass = 200;
        player.sprite.body.collideWorldBounds = true;
        
        // update
        player.sprite.update = function() {
            
            // camera follow player
            game.camera.focusOn(player.sprite);
            game.camera.x = 0;
    
            // collision
            game.physics.arcade.collide(player.group, castle.group);
            game.physics.arcade.collide(player.group, ground.ground);
            
            // controls
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

            // animation
            if (Math.abs(player.sprite.body.velocity.x) > 5 && player.sprite.body.touching.down)
                player.sprite.animations.play('walk');
            else if (player.sprite.body.touching.none)
                player.sprite.animations.play('fly');
            else if (player.sprite.body.touching.down)
                player.sprite.animations.play('idle');

            
        }
    },
    
    render: function() {
        game.debug.body(player.sprite);
    },
};