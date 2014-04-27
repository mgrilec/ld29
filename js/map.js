var map = {
    
    levels: {
        startingHeight: -180,
        height: 200,
        getHeight: function(i) {
            return map.levels.startingHeight + i*map.levels.height;
        },
        lastLevel: -1,
        getLevel: function(y) {
            if (y < map.levels.startingHeight)
                return -1;
            
            y-=map.levels.startingHeight;
            return Math.floor(y / map.levels.height);
        },
        
        
    },
        
    preload: function() {
    
    },
    
    create: function() {
        map.grounds = game.add.group();
        map.holes = game.add.group();
        
        for (var i = 1; i < 49; i++) {
            if (i == 1)
                continue;
            
            var x = i % 2 == 0 ? 100 : 0;
            var ground = game.add.sprite(x, map.levels.getHeight(i), 'ground', 0, map.grounds);
            ground.scale.set(700, 4);
            game.physics.enable(ground, Phaser.Physics.ARCADE);
            ground.body.moves = false;
            ground.body.immovable = true;
            
            var hole = game.add.sprite(i % 2 == 0 ? 100 : 700, ground.y, 'hole', 0, map.holes);
            hole.scale.set(i % 2 == 0 ? -2 : 2 , 4);
            
        };
            
        
    },
    
    update: function() {
        // check on enter level
        var level = map.levels.getLevel(player.sprite.y);
        if (level > map.levels.lastLevel) {
            map.levels.lastLevel = level;
            map.onPlayerEnterLevel.forEach(function(f) {
                f(level);
            });
        }
    },
    
    render: function() {
        
        
    },
    
    onPlayerEnterLevel: [],
}