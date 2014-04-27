var enemies = {
    group: null,
    
    preload: function() {
        
        // enemies
        game.load.spritesheet('bull', 'assets/bull.png', 16, 16);
        game.load.spritesheet('imp', 'assets/imp.png', 16, 16);
        game.load.spritesheet('bat', 'assets/bat.png', 16, 16);
    },
    
    create: function() {
        enemies.group = game.add.group();
        
        
        map.onPlayerEnterLevel.push(function(i) {
            if (i == 1)
                return;
            
            var x = i % 2 == 0 ? 50 : 750;
            var y = map.levels.getHeight(i) - 50;
            if (i == 0) {
                x = 750;
                y = map.levels.getHeight(i + 1) - 50;
            }
            
            var imps = 1 + Math.floor(i / 5) + Math.round(game.rnd.frac() * i);
            imps = Math.min(imps, 20);
            for (var e = 0; e < imps; e++)
            {
                setTimeout(function() {
                    var imp = enemies.imp(x, y);
                    enemies.spawn(imp, i);
                }, game.rnd.frac() * 2000);
            }
            
            var bulls = Math.floor(i / 3) + Math.round(game.rnd.frac() * i / 3);
            for (var e = 0; e < bulls; e++)
            {
                setTimeout(function() {
                    var bull = enemies.bull(x, y);
                    enemies.spawn(bull, i);
                }, game.rnd.frac() * 3000);
            }
            
            var bats = Math.floor(i / 5) + Math.round(game.rnd.frac() * i / 5);
            for (var e = 0; e < bats; e++)
            {
                setTimeout(function() {
                    var bat = enemies.bat(x, y - 100);
                    enemies.spawn(bat, i);
                }, game.rnd.frac() * 5000);
            }
        });
    },
    
    update: function() {
        game.physics.arcade.collide(enemies.group, ground.ground);
        game.physics.arcade.collide(enemies.group, map.grounds);
    },
    
    render: function() {
        
    },
    
    spawn: function(e, l) {
        
        var vx = l % 2 == 0 ? 370 : -370;
        if (l == 0) {
            vx = -370;
        }

        e.body.velocity.x = vx + game.rnd.normal() * 10;
        e.body.velocity.y = -30 + game.rnd.normal() * 10;
    },
    
    bat: function(x, y) {
        var sprite = game.add.sprite(x, y, 'bat', 0, enemies.group);
        sprite.anchor.set(0.5, 1);
        sprite.scale.set(2);
        
        // animations
        sprite.animations.add('fly', [0, 1], 10, true);
        sprite.animations.add('die', [2, 3], 10, false);
        sprite.animations.play('fly');
        
        // physics
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.drag.set(300, 10);
        sprite.body.mass = 50;
        sprite.body.setSize(8, 10, 0, 0);
        sprite.body.allowGravity = false;
        
        // healthbar
        sprite.health = sprite.maxHealth = 20;
        sprite.healthbar = game.add.sprite(x, y - 20, 'healthbar');
        sprite.healthbar.anchor.set(0.5, 1);
        sprite.healthbar.scale.set(2);
        
        sprite.stunned = true;
        setTimeout(function() { sprite.stunned = false }, 500);
        sprite.dying = false;
        
        sprite.audio = {};
        sprite.audio.hit = game.add.audio('hit', 0.2, false);
        sprite.audio.die = game.add.audio('die', 0.2, false);
        
        sprite.lastAttack = 0;
        sprite.attackCooldown = 2;
        sprite.attackRange = 25;
        sprite.attack = function() {
            var elapsed = game.time.totalElapsedSeconds() - sprite.lastAttack;
            if (elapsed < sprite.attackCooldown) {
                return;
            }
            
            sprite.lastAttack = game.time.totalElapsedSeconds();
            if (player.sprite.x < sprite.x) {
                player.sprite.body.velocity.x = -200;
                sprite.body.velocity.x = 200;
            }
            else if (player.sprite.x > sprite.x) {
                player.sprite.body.velocity.x = 200;
                sprite.body.velocity.x = -200;
            }
            
            player.sprite.hit(5);
            sprite.hit();
        };
        
        sprite.update = function() {
            if (sprite.dying) {
                return;
            }
            
            if (player.sprite.x > sprite.x + 5)
                sprite.scale.x = 2;
            else if (player.sprite.x < sprite.x - 5)
                sprite.scale.x = -2;
            
            game.physics.arcade.moveToObject(sprite, player.sprite, 200);
                        
            // attack
            if (game.physics.arcade.distanceBetween(sprite, player.sprite) < sprite.attackRange) {
                sprite.attack();
            }
            
            // healthbar
            sprite.healthbar.x = sprite.x;
            sprite.healthbar.y = sprite.y - 30;
            sprite.healthbar.scale.x = (sprite.health / sprite.maxHealth) * 2;
            
            sprite.animations.play('fly');
        }
        
        sprite.hit = function() {
            sprite.stunned = true;
            setTimeout(function() { sprite.stunned = false; }, 300);
            sprite.audio.hit.play();
        }
        
        sprite.events.onKilled.add(function() {
            if (sprite.dying)
                return;
            
            sprite.audio.die.play();
            sprite.alive = true;
            sprite.exists = true;
            sprite.visible = true;
            sprite.dying = true;
            sprite.healthbar.kill();
            sprite.animations.play('die', 10, false, true);
        });
        
        return sprite;
    },
    
    bull: function(x, y) {
        var sprite = game.add.sprite(x, y, 'bull', 0, enemies.group);
        sprite.anchor.set(0.5, 1);
        sprite.scale.set(2);
        
        // animations
        sprite.animations.add('idle', [0, 1], 0.5);
        sprite.animations.add('walk', [2, 3], 10);
        sprite.animations.add('die', [4, 5, 6], 10);
        sprite.animations.play('idle');
        
        // physics
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.drag.set(300, 10);
        sprite.body.mass = 50;
        sprite.body.setSize(8, 10, 0, 0);
        
        // healthbar
        sprite.health = sprite.maxHealth = 30;
        sprite.healthbar = game.add.sprite(x, y - 30, 'healthbar');
        sprite.healthbar.anchor.set(0.5, 1);
        sprite.healthbar.scale.set(2);
        
        sprite.stunned = true;
        setTimeout(function() { sprite.stunned = false }, 500);
        sprite.dying = false;
        
        sprite.audio = {};
        sprite.audio.hit = game.add.audio('hit', 0.2, false);
        sprite.audio.die = game.add.audio('die', 0.2, false);
        
        sprite.lastAttack = 0;
        sprite.attackCooldown = 2;
        sprite.attackRange = 20;
        sprite.attack = function() {
            var elapsed = game.time.totalElapsedSeconds() - sprite.lastAttack;
            if (elapsed < sprite.attackCooldown) {
                return;
            }
            
            sprite.lastAttack = game.time.totalElapsedSeconds();
            if (player.sprite.x < sprite.x)
                player.sprite.body.velocity.x = -400;
            else if (player.sprite.x > sprite.x)
                player.sprite.body.velocity.x = 400;
            player.sprite.hit(5);
            sprite.hit();
            sprite.body.velocity.x = 0;
        };
        
        sprite.update = function() {
            if (sprite.dying) {
                return;
            }
                
            // move
            if (player.sprite.x < sprite.x - 10 && !sprite.stunned) {
                sprite.scale.x = -2;   
                sprite.body.acceleration.x = -140;
            }
            else if (player.sprite.x > sprite.x + 10 && !sprite.stunned) {
                sprite.scale.x = 2;
                sprite.body.acceleration.x = 140;
            }
            
            if (Math.abs(player.sprite.x - sprite.x) < 50 && sprite.body.touching.down && game.rnd.normal() > 0.98)
                sprite.body.velocity.y = -150;
            
            // attack
            if (Math.abs(player.sprite.x - sprite.x) < sprite.attackRange && Math.abs(player.sprite.y - sprite.y) < 8) {
                sprite.attack();
            }
            
            // healthbar
            sprite.healthbar.x = sprite.x;
            sprite.healthbar.y = sprite.y - 30;
            sprite.healthbar.scale.x = (sprite.health / sprite.maxHealth) * 2;
            
            // animation
            if (Math.abs(sprite.body.velocity.x) > 5 && sprite.body.touching.down)
                sprite.animations.play('walk');
            else if (sprite.body.touching.down)
                sprite.animations.play('idle');
        }
        
        sprite.hit = function() {
            sprite.stunned = true;
            setTimeout(function() { sprite.stunned = false; }, 300);
            sprite.audio.hit.play();
        }
        
        sprite.events.onKilled.add(function() {
            if (sprite.dying)
                return;
            
            sprite.audio.die.play();
            sprite.alive = true;
            sprite.exists = true;
            sprite.visible = true;
            sprite.dying = true;
            sprite.healthbar.kill();
            sprite.animations.play('die', 10, false, true);
        });
        
        return sprite;
    },
    
    imp: function(x, y) {
        var sprite = game.add.sprite(x, y, 'imp', 0, enemies.group);
        sprite.anchor.set(0.5, 1);
        sprite.scale.set(2);
        
        // animations
        sprite.animations.add('idle', [0, 1], 0.5);
        sprite.animations.add('walk', [2, 3], 10);
        sprite.animations.add('die', [4, 5, 6], 10);
        sprite.animations.play('idle');
        
        // physics
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.drag.set(300, 10);
        sprite.body.mass = 50;
        sprite.body.setSize(5, 10, 0, 0);
        
        // healthbar
        sprite.health = sprite.maxHealth = 20;
        sprite.healthbar = game.add.sprite(x, y - 20, 'healthbar');
        sprite.healthbar.anchor.set(0.5, 1);
        sprite.healthbar.scale.set(2);
        
        sprite.stunned = true;
        setTimeout(function() { sprite.stunned = false }, 500);
        sprite.dying = false;
        
        sprite.audio = {};
        sprite.audio.hit = game.add.audio('hit', 0.2, false);
        sprite.audio.die = game.add.audio('die', 0.2, false);
        
        sprite.lastAttack = 0;
        sprite.attackCooldown = 1;
        sprite.attackRange = 18;
        sprite.attack = function() {
            var elapsed = game.time.totalElapsedSeconds() - sprite.lastAttack;
            if (elapsed < sprite.attackCooldown) {
                return;
            }
            
            sprite.lastAttack = game.time.totalElapsedSeconds();
            if (player.sprite.x < sprite.x)
                player.sprite.body.velocity.x = -150;
            else if (player.sprite.x > sprite.x)
                player.sprite.body.velocity.x = 150;
            player.sprite.hit(1);
        };
        
        sprite.update = function() {
            if (sprite.dying) {
                return;
            }
                
            // move
            if (player.sprite.x < sprite.x - 10 && !sprite.stunned) {
                sprite.scale.x = -2;   
                sprite.body.velocity.x = -140;
            }
            else if (player.sprite.x > sprite.x + 10 && !sprite.stunned) {
                sprite.scale.x = 2;
                sprite.body.velocity.x = 140;
            }
            
            if (Math.abs(player.sprite.x - sprite.x) < 50 && sprite.body.touching.down && game.rnd.normal() > 0.98)
                sprite.body.velocity.y = -150;
            
            // attack
            if (Math.abs(player.sprite.x - sprite.x) < sprite.attackRange && Math.abs(player.sprite.y - sprite.y) < 8) {
                sprite.attack();
            }
            
            // healthbar
            sprite.healthbar.x = sprite.x;
            sprite.healthbar.y = sprite.y - 20;
            sprite.healthbar.scale.x = (sprite.health / sprite.maxHealth) * 2;
            
            // animation
            if (Math.abs(sprite.body.velocity.x) > 5 && sprite.body.touching.down)
                sprite.animations.play('walk');
            else if (sprite.body.touching.down)
                sprite.animations.play('idle');
        }
        
        sprite.hit = function() {
            sprite.stunned = true;
            setTimeout(function() { sprite.stunned = false; }, 300);
            sprite.audio.hit.play();
        }
        
        sprite.events.onKilled.add(function() {
            if (sprite.dying)
                return;
            
            sprite.audio.die.play();
            sprite.alive = true;
            sprite.exists = true;
            sprite.visible = true;
            sprite.dying = true;
            sprite.healthbar.kill();
            sprite.animations.play('die', 10, false, true);
        });
        
        return sprite;
    }
}