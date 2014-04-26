var enemies = {
    group: null,
    startingImp: null,
    
    preload: function() {
        
        // enemies
        game.load.spritesheet('bull', 'assets/bull.png', 16, 16);
        game.load.spritesheet('imp', 'assets/imp.png', 16, 16);
    },
    
    create: function() {
        enemies.group = game.add.group();
        
        
        map.onPlayerEnterLevel.push(function(i) {
            setTimeout(function() {
                enemies.startingImp = enemies.imp(750, 100);
                enemies.startingImp.body.velocity.x = -370;
                enemies.startingImp.body.velocity.y = -350;
            }, 500);
        });
    },
    
    update: function() {
        game.physics.arcade.collide(enemies.group, ground.ground);
    },
    
    render: function() {
        if (enemies.startingImp)
            game.debug.body(enemies.startingImp);
    },
    
    bull: function(x, y) {
        
    },
    
    imp: function(x, y) {
        var sprite = game.add.sprite(x, y, 'imp', 0, enemies.group);
        sprite.anchor.set(0.5, 1);
        sprite.scale.set(2);
        
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.drag.set(300, 10);
        sprite.body.mass = 50;
        sprite.body.setSize(6, 12, 3, 0);
        
        sprite.update = function() {
            // move
            if (player.sprite.x < sprite.x && sprite.body.touching.down) {
                sprite.scale.x = -2;   
                sprite.body.velocity.x = -60;
            }
            else if (player.sprite.x > sprite.x && sprite.body.touching.down) {
                sprite.scale.x = 2;
                sprite.body.velocity.x = 60;
            }
        }
        
        return sprite;
    }
}