var player = {
    moveSpeed: 120,
    extraSpeed: 80,
    jumpSpeed: 140,
    stunned: false,
    
    attack: {
        inAttack: false,
        last: 0,
        cooldown: 0.4,
        range: 30,
        damage: 10,
    },
    
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
        player.sprite.animations.add('attack', [6, 7], 30, true);
        player.sprite.animations.play('idle');
        
        // physics
        game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
        player.sprite.body.velocity.x = 180;
        player.sprite.body.setSize(6, 16, 0, 0);
        player.sprite.body.drag.set(300, 10);
        player.sprite.body.mass = 200;
        player.sprite.body.collideWorldBounds = true;
        
        // healthbar
        player.maxHealth = player.sprite.health = 100;
        
        
        player.sprite.attack = function() {
            
            // check cooldown
            var elapsed = game.time.totalElapsedSeconds() - player.attack.last;
            if (elapsed < player.attack.cooldown) {
                return;
            }
            
            player.attack.inAttack = true;
            player.attack.last = game.time.totalElapsedSeconds();
            player.sprite.animations.play('attack');
            setTimeout(function() { player.attack.inAttack = false; }, 100);
            
            
            // find closest enemy
            var closest;
            enemies.group.forEach(function(enemy) {
                var toEnemy = new Phaser.Point(enemy.x - player.sprite.x, enemy.y - player.sprite.y);
                var distance = game.physics.arcade.distanceBetween(enemy, player.sprite);
                
                
                if (toEnemy.x < 0 && player.sprite.scale.x < 0 && toEnemy.x > -player.attack.range && Math.abs(toEnemy.y) < 8) {
                    enemy.damage(player.attack.damage);
                    enemy.hit();
                    enemy.body.velocity.x = -200;
                }
                else if (toEnemy.x > 0 && player.sprite.scale.x > 0 && toEnemy.x < player.attack.range && Math.abs(toEnemy.y) < 8) {
                    enemy.damage(player.attack.damage);
                    enemy.hit();
                    enemy.body.velocity.x = 200;
                }
                
                    
            });
        }
        
        // update
        player.sprite.update = function() {
            
            // camera follow player
            game.camera.focusOn(player.sprite);
            game.camera.x = 0;
    
            // collision
            game.physics.arcade.collide(player.group, castle.group);
            game.physics.arcade.collide(player.group, ground.ground);
            game.physics.arcade.collide(player.group, enemies.group, player.sprite.onEnemyCollision);
            game.physics.arcade.collide(player.group, map.grounds);
            
            // controls
            var cursors = game.input.keyboard.createCursorKeys();
            if (cursors.left.isDown) {
                player.sprite.scale.x = -2;
                if (!player.stunned)
                    player.sprite.body.velocity.x = -player.moveSpeed;
            }
            else if (cursors.right.isDown) {
                player.sprite.scale.x = 2;
                if (!player.stunned)
                    player.sprite.body.velocity.x = player.moveSpeed;
            }
            
            if (cursors.up.isDown && player.sprite.body.touching.down && !player.stunned)
                player.sprite.body.velocity.y = -player.jumpSpeed;
            
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                player.sprite.attack();
            }
            
            // animation
            if (Math.abs(player.sprite.body.velocity.x) > 5 && player.sprite.body.touching.down && !player.attack.inAttack)
                player.sprite.animations.play('walk');
            else if (player.sprite.body.touching.none && !player.attack.inAttack)
                player.sprite.animations.play('fly');
            else if (player.sprite.body.touching.down && !player.attack.inAttack)
                player.sprite.animations.play('idle');

        };
        
        player.sprite.hit = function() {
            player.stunned = true;
            setTimeout(function() { player.stunned = false; }, 100);
        }
            
        player.sprite.onEnemyCollision = function(p, e) {
            var angle = game.physics.arcade.angleBetween(p, e);
            player.sprite.body.velocity.x = -Math.cos(angle) * 100;
            player.sprite.body.velocity.y = -Math.sin(angle) * 50;
            player.sprite.hit();            
        };
        
    },
    
    render: function() {
        
    },
};