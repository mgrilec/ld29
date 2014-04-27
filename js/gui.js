var gui = {
        
    preload: function() {
    },
    
    create: function() {
            gui.healthbar = game.add.sprite(795, 5, 'healthbar');
            gui.healthbar.alpha = 0.8;
            gui.healthbar.fixedToCamera = true;
            gui.healthbar.anchor.set(1, 0);
            gui.healthbar.scale.set(32, 8);
            gui.healthbar.update = function() {
                gui.healthbar.scale.set(player.sprite.health / player.maxHealth * 32, 8);
                gui.healthbar.bringToTop();
            }
            
            gui.health = game.add.bitmapText(700, 25, 'visitor16', "HP: " + player.sprite.health + " / " + player.maxHealth, 16);
            gui.health.fixedToCamera = true;
            gui.health.update = function() {
                gui.health.text = "HP: " + player.sprite.health + "/" + player.maxHealth;
            };
        
            gui.breath = game.add.sprite(760, 45, 'breath');
            gui.breath.fixedToCamera = true;
            gui.breath.update = function() {
                var elapsed = game.time.totalElapsedSeconds() - player.breath.last;
                gui.breath.visible = elapsed > player.breath.cooldown
            };
        
            gui.force = game.add.sprite(720, 45, 'force');
            gui.force.fixedToCamera = true;
            gui.force.update = function() {
                var elapsed = game.time.totalElapsedSeconds() - player.force.last;
                gui.force.visible = elapsed > player.force.cooldown
            };
    },
    
    update: function() {
    },
    
    render: function() {
    },
}