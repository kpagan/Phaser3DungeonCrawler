import Phaser from 'phaser'
import { sceneEvents } from '../events/EventCenter'
import { EventsConstants } from '../events/EventsConstants'

export default class GameUI extends Phaser.Scene {

    private hearts: Phaser.GameObjects.Group;

    constructor() {
        super({ key: 'game-ui' });
    }

    create() {
        this.add.image(6, 26, 'treasure', 'coin_anim_f0');
        let coinsLabel = this.add.text(12, 20, '0', {
            fontSize: '14'
        });

        
        sceneEvents.on(EventsConstants.PLAYER_COINS_CHANGE, coins => {
            coinsLabel.text = coins.toString();
        });

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        });

        sceneEvents.on(EventsConstants.PLAYER_HEALTH_CHANGE, this.handlePlayerHealthChanged, this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(EventsConstants.PLAYER_HEALTH_CHANGE, this.handlePlayerHealthChanged, this);
            sceneEvents.off(EventsConstants.PLAYER_COINS_CHANGE);
        });
    }

    private handlePlayerHealthChanged(health: number) {
        this.hearts.children.each((gameObject, index) => {
            let heart = gameObject as Phaser.GameObjects.Image;
            if (index < health) {
                heart.setTexture('ui-heart-full');
            } else {
                heart.setTexture('ui-heart-empty');
            }

        });
    }
}