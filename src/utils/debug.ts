import Phase from 'phaser'

const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {

    // debug to verify that tiles marked as colliding do collide
    const debugGraphics = scene.add.graphics().setAlpha(0.75);
    layer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

}

export {
    debugDraw
}