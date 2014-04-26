var enemies = {
    group: null,
    
    preload: function() {
        
        // enemies
        game.load.spritesheet('bull', 'assets/bull.png', 16, 16);
        game.load.spritesheet('imp', 'assets/imp.png', 16, 16);
    },
    
    create: function() {
        enemies.group = game.add.group();
    },
    
    bull: function(x, y) {
        
    },
    
    imp: function(x, y) {
        
    }
}