var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var colors = {
    red: 0xFFD74B4B, 
    light: 0xFF475F77, 
    dark: 0xFF354B5E, 
    gray: 0xFF5B5B5B,
    white: 0xFFFFFFFF,
    background: 0xFFDCDDD8,
};

function preload() {
    
    
}

function create() {
    game.stage.backgroundColor = '#DCDDD8';
    
    // palette
    var paletteBitmap = game.add.bitmapData(16*Object.keys(colors).length, 16);
    Object.keys(colors).forEach(function(key, i) {
        paletteBitmap.context.fillStyle = Phaser.Color.getWebRGB(colors[key]);
        paletteBitmap.context.fillRect(16 * i, 0, 16, 16);
    });
    var palette = game.add.sprite(0, 0, paletteBitmap);
}

function update() {
    
}

function render() {
    
}