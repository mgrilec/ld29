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
        
        enemies.startingImp = enemies.imp(750, 100);
        enemies.startingImp.body.velocity.x = -370;
        enemies.startingImp.body.velocity.y = -350;
    },
    
    render: function() {
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
        
        sprite.update = function() {
            
            // collision
            game.physics.arcade.collide(sprite, ground.ground);
            game.physics.arcade.collide(sprite, player.group);
        }
        
        return sprite;
    }
}