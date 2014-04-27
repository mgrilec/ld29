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
        map.boxes = game.add.group();
        
        for (var i = 1; i < 12; i++) {
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
            
            var floor = game.add.bitmapText(i % 2 == 0 ? 100 : 700, ground.y - 100, 'visitor16', (i - 1).toString());
            
            var box = game.add.sprite(i % 2 == 0 ? 30: 740, ground.y, 'box', 0, map.boxes);
            game.physics.enable(box, Phaser.Physics.ARCADE);
            box.body.moves = false;
            box.body.immovable = true;
            
            var fires = game.rnd.integerInRange(3, 10);
            for (var f = 0; f < fires; f++) {
                var fire = game.add.sprite(150 + game.rnd.frac() * 500, map.levels.getHeight(i), 'fire');
                fire.animations.add('burn', [0, 1], 10, true);
                fire.animations.play('burn');
                fire.anchor.set(0.5, 1);
                fire.scale.set(game.rnd.normal() > 0 ? 2 + game.rnd.normal() : -2 + game.rnd.normal()  , 1.5 + game.rnd.frac() * 2);
            }
        };
            
        
    },
    
    update: function() {
        // check on enter level
        var level = map.levels.getLevel(player.sprite.y + 100);
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