import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', './tiles/0x72_DungeonTilesetII_v1.3_extruded.png');
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-01.json');

        this.load.atlas('faune', 'character/faune.png', 'character/faune.json');
        this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json');
        this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json');
        
        this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png');
        this.load.image('ui-heart-full', 'ui/ui_heart_full.png');

        this.load.image('knife', 'weapons/weapon_knife.png');
    }

    create() {
        this.scene.start('game');
    }
}