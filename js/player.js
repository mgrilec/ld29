var player = {
    moveSpeed: 120,
    extraSpeed: 80,
    jumpSpeed: 140,
    stunned: false,
    block: 0.25,
    
    audio: {},
    attack: {
        inAttack: false,
        last: 0,
        cooldown: 0.4,
        range: 30,
        damage: 10,
    },
    
    breath: {
        last: 0,
        cooldown: 3,
        range: 140,
        damage: 15,
    },
    
    force: {
        last: 0,
        cooldown: 5,
        range: 300,
        damage: 5,
    },
    
    preload: function() {
        // player
        game.load.spritesheet('player', 'assets/knight.png', 16, 16);
        game.load.image('breath', 'assets/breath.png');
        game.load.image('force', 'assets/force.png');
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
        player.maxHealth = player.sprite.health = 150;
        
        player.audio.hit = game.add.audio('hit2', 0.3, false);
        player.audio.jump = game.add.audio('jump', 0.2, false);
        player.audio.block = game.add.audio('block', 0.3, false);
        
        
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
            
            
            // hit enemies in range
            enemies.group.forEach(function(enemy) {
                if (!enemy.alive)
                    return;
                
                var toEnemy = new Phaser.Point(enemy.x - player.sprite.x, enemy.y - player.sprite.y);        
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
        };
        
        player.sprite.breath = function() {
            
            // check cooldown
            var elapsed = game.time.totalElapsedSeconds() - player.breath.last;
            if (elapsed < player.breath.cooldown) {
                return;
            }
            
            player.breath.last = game.time.totalElapsedSeconds();
            
            // spawn breath
            var breath = game.add.sprite(player.sprite.x + player.sprite.scale.x * 40, player.sprite.y - 32, 'breath');
            breath.anchor.set(0.5, 0.5);
            breath.scale.x = -player.sprite.scale.x * 2;
            breath.scale.y = player.sprite.scale.y * 2;
            breath.update = function() {
                breath.alpha -= 0.01;
                if (breath.alpha < 0)
                    breath.kill();
            };
            
            // hit enemies in range
            enemies.group.forEach(function(enemy) {
                if (!enemy.alive)
                    return;
                
                var toEnemy = new Phaser.Point(enemy.x - player.sprite.x, enemy.y - player.sprite.y);
                if (toEnemy.x < 0 && player.sprite.scale.x < 0 && toEnemy.x > -player.breath.range && Math.abs(toEnemy.y) < 64) {
                    enemy.damage(player.breath.damage);
                    enemy.hit();
                }
                else if (toEnemy.x > 0 && player.sprite.scale.x > 0 && toEnemy.x < player.breath.range && Math.abs(toEnemy.y) < 64) {
                    enemy.damage(player.breath.damage);
                    enemy.hit();
                }
            });
        };
        
        player.sprite.force = function() {
            
            // check cooldown
            var elapsed = game.time.totalElapsedSeconds() - player.force.last;
            if (elapsed < player.force.cooldown) {
                return;
            }
            
            player.force.last = game.time.totalElapsedSeconds();
            
            // spawn force
            var force = game.add.sprite(player.sprite.x, player.sprite.y - 16, 'force');
            force.anchor.set(0.5, 0.5);
            force.scale.set(8, 8);
            force.update = function() {
                force.alpha -= 0.005;
                if (force.alpha < 0)
                    force.kill();
            };
            
            // hit enemies in range
            enemies.group.forEach(function(enemy) {
                if (!enemy.alive)
                    return;
                
                var angle = game.physics.arcade.angleBetween(player.sprite, enemy);
                if (game.physics.arcade.distanceBetween(player.sprite, enemy) < player.force.range) {
                    // push enemy
                    enemy.body.velocity.x = Math.cos(angle) * 1000;
                    enemy.body.velocity.y = Math.sin(angle) * 600;
                    
                    // hit enemy
                    enemy.damage(player.force.damage);
                    enemy.hit();
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
            
            if (cursors.up.isDown && player.sprite.body.touching.down && !player.stunned) {
                player.sprite.body.velocity.y = -player.jumpSpeed;
                player.audio.jump.play();
            }
            
            if (game.input.keyboard.justPressed(Phaser.Keyboard.Q)) {
                player.sprite.attack();
            }
            
            if (game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
                player.sprite.breath();
            }
            
            if (game.input.keyboard.justPressed(Phaser.Keyboard.E)) {
                player.sprite.force();
            }
            
            // animation
            if (Math.abs(player.sprite.body.velocity.x) > 5 && player.sprite.body.touching.down && !player.attack.inAttack)
                player.sprite.animations.play('walk');
            else if (player.sprite.body.touching.none && !player.attack.inAttack)
                player.sprite.animations.play('fly');
            else if (player.sprite.body.touching.down && !player.attack.inAttack)
                player.sprite.animations.play('idle');

        };
        
        player.sprite.events.onKilled.add(function() {
            game.add.bitmapText(200, 200, 'visitor32', 'You died!', 64).fixedToCamera = true;;
            setTimeout(function() { location.reload() }, 3000);
        });
        
        player.sprite.hit = function(dmg) {
            player.stunned = true;
            setTimeout(function() { player.stunned = false; }, 200);
            
            if (dmg > 0)
            {
                if (game.rnd.frac() > player.block) {
                    player.sprite.damage(dmg);
                    player.audio.hit.play();
                }
                else
                    player.audio.block.play();
            }
        }
            
        player.sprite.onEnemyCollision = function(p, e) {
            var angle = game.physics.arcade.angleBetween(p, e);
            player.sprite.body.velocity.x = -Math.cos(angle) * 200;
            player.sprite.body.velocity.y = -Math.sin(angle) * 50;
            player.sprite.hit(0);            
        };
        
    },
    
    render: function() {
        
    },
};