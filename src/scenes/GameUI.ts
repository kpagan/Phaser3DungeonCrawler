import Phaser from 'phaser'

export default class GameUI extends Phaser.Scene {
    
    constructor() {
        super({ key: 'game-ui' });
    }

    create() {
        let hearts = this.add.group({
            classType: Phaser.GameObjects.Image            
        });

        hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        });
    }
}