var background = {
    create: function() {
        
        // background helper
        var backgroundSprite = function(x, y, width, height, color) {
            var data = game.add.bitmapData(1, 1);
            data.context.fillStyle = Phaser.Color.getWebRGB(color);
            data.context.fillRect(0, 0, 1, 1);

            var sprite = game.add.sprite(x, y, data, 0, background.group);
            sprite.scale.x = width;
            sprite.scale.y = height;
            return sprite;
        }

        // create background
        background.group = game.add.group();
        background.sky = backgroundSprite(0, -1000, game.world.width, 1000, 0xFFB5E0FF);
        background.underground = backgroundSprite(0, 0, game.world.width, 500, 0xFF7C614F);
        background.hell = backgroundSprite(0, 500, game.world.width, 5000, 0xFF823939);
        background.introText = game.add.bitmapText(380, -500, 'visitor32', 'Hellhole', 64, background.group);
        background.creditText = game.add.bitmapText(520, -450, 'visitor10', 'by Mihael Grilec', 20, background.group);
        
        background.tutorialText = []
        background.tutorialText[0] = game.add.bitmapText(60, -460, 'visitor16', 'arrow left\narrow right\narrow up', 16, background.group);
        background.tutorialText[1] = game.add.bitmapText(500, -100, 'visitor16', 'attack - Q', 16, background.group);

        // create rain
        background.rain = game.add.emitter(320, -450, 50);
        background.rain.width = 70;
        background.rain.makeParticles('rain');
        background.rain.minParticleScale = 3.5;
        background.rain.maxParticleScale = 4;
        background.rain.minRotation = background.rain.maxRotation = 0;
        background.rain.setYSpeed(100, 200);
        background.rain.setXSpeed(-5, 5);
        background.rain.setAlpha(1, 0, 1000);
        background.rain.start(false, 1000, 100, 0);

        // create cloud
        background.cloud = game.add.sprite(260, -500, 'cloud', 0, background.group);
        background.cloud.scale.set(4);
        game.add.tween(background.cloud).to( { y: -504 }, 2000, Phaser.Easing.Exponential.None, true, 0, Number.MAX_VALUE, true);
    },
    
}