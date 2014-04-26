var map = {
    
    levels: {
        startingHeight: -50,
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
        }
    },
    
    preload: function() {
    
    },
    
    create: function() {
        
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