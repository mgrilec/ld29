var enemies = {
    group: null,
    
    preload: function() {
        
        // enemies
        game.load.spritesheet('bull', 'assets/bull.png', 16, 16);
        game.load.spritesheet('imp', 'assets/imp.png', 16, 16);
    },
    
    create: function() {
        enemies.group = game.add.group();
        
        
        map.onPlayerEnterLevel.push(function(i) {
            if (i == 1)
                return;
            
            var x = i % 2 == 0 ? 50 : 750;
            var y = map.levels.getHeight(i) - 50;
            var vx = i % 2 == 0 ? 370 : -370;
            if (i == 0) {
                x = 750;
                y = map.levels.getHeight(i + 1) - 50;
                vx = -370;
            }
            
            var imp = enemies.imp(x, y);
            imp.body.velocity.x = vx;
            imp.body.velocity.y = -30;
        });
    },
    
    update: function() {
        game.physics.arcade.collide(enemies.group, ground.ground);
        game.physics.arcade.collide(enemies.group, map.grounds);
    },
    
    render: function() {
        
    },
    
    bull: function(x, y) {
        
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
        sprite.health = sprite.maxHealth = 50;
        sprite.healthbar = game.add.sprite(x, y - 20, 'healthbar');
        sprite.healthbar.anchor.set(0.5, 1);
        sprite.healthbar.scale.set(2);
        
        sprite.stunned = false;
        sprite.dying = false;
        
        sprite.update = function() {
            if (sprite.dying) {
                return;
            }
                
            // move
            if (player.sprite.x < sprite.x - 5 && !sprite.stunned) {
                sprite.scale.x = -2;   
                if (sprite.body.touching.down)
                    sprite.body.velocity.x = -70;
            }
            else if (player.sprite.x > sprite.x + 5 && !sprite.stunned) {
                sprite.scale.x = 2;
                if (sprite.body.touching.down)
                    sprite.body.velocity.x = 70;
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
        }
        
        sprite.events.onKilled.add(function() {
            if (sprite.dying)
                return;
            
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