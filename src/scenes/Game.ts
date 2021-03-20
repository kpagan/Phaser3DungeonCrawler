import Phaser from 'phaser'
import { debugDraw } from '../utils/debug'
import Lizard from '../sprites/Lizard'
import Faune from '../sprites/Faune'
import { sceneEvents } from '../events/EventCenter'
import { EventsConstants } from '../events/EventsConstants'

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Faune;

    constructor() {
        super('game');
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.scene.run('game-ui');
        Lizard.createLizardAnims(this.anims);
        Faune.createCharacterAnims(this.anims);

        let map = this.make.tilemap({ key: 'dungeon' });
        let tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2);

        // the name of the layerID must match the layer that was createdin Tiled.
        // In the dungeon-01.json file this name is the /layers[]/name field
        // createStaticLayer was replaced by createLayer in Phaser 3.50
        map.createLayer('ground', tileset);
        let wallsLayer = map.createLayer('walls', tileset);
        // put the walls above anything else
        wallsLayer.setDepth(10);

        wallsLayer.setCollisionByProperty({ collides: true });

        // debugDraw(wallsLayer, this);

        this.faune = this.add.faune(400, 250, 'faune')

        this.cameras.main.startFollow(this.faune, true);

        let lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (item: Phaser.GameObjects.GameObject) => {
                let lizItem = item as Lizard;
                lizItem.body.onCollide = true;
            }
        })

        lizards.get(350, 100, 'lizard');

        this.physics.add.collider(this.faune, wallsLayer);
        this.physics.add.collider(lizards, wallsLayer);
        this.physics.add.collider(lizards, this.faune, this.handlePlayerLizardCollision, undefined, this);

    }

    private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        let lizard = obj2 as Lizard;

        let dx = this.faune.x - lizard.x;
        let dy = this.faune.y - lizard.y;

        let dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.faune.handleDamage(dir);

        sceneEvents.emit(EventsConstants.PLAYER_HEALTH_CHANGE, this.faune.health);
    }

    update(t: number, dt: number) {

        if (this.faune) {
            this.faune.update(this.cursors);
        }
    }


}
