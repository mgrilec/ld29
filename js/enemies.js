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
            setTimeout(function() {
                var imp = enemies.imp(750, 100);
                imp.body.velocity.x = -370;
                imp.body.velocity.y = -350;
            }, 300);
            
            setTimeout(function() {
                var imp = enemies.imp(750, 100);
                imp.body.velocity.x = -370;
                imp.body.velocity.y = -350;
            }, 500);
            
            setTimeout(function() {
                var imp = enemies.imp(750, 100);
                imp.body.velocity.x = -370;
                imp.body.velocity.y = -350;
            }, 600);
        });
    },
    
    update: function() {
        game.physics.arcade.collide(enemies.group, ground.ground);
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
        sprite.animations.play('idle');
        
        // physics
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.drag.set(300, 10);
        sprite.body.mass = 50;
        sprite.body.setSize(5, 10, 0, 0);
        
        // healthbar
        sprite.health = sprite.maxHealth = 50;
        sprite.healthbar = game.add.sprite(x, y - 20, 'healtbar');
        sprite.healthbar.anchor.set(0.5, 1);
        sprite.healthbar.scale.set(2);
        
        sprite.update = function() {
            // move
            if (player.sprite.x < sprite.x - 5) {
                sprite.scale.x = -2;   
                if (sprite.body.touching.down)
                    sprite.body.velocity.x = -70;
            }
            else if (player.sprite.x > sprite.x + 5) {
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
        
        return sprite;
    }
}