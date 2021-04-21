import Phaser from 'phaser'

export default class Treasure extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame);
        this.play('chest-closed');
    }

    preload() {
    }

    create() {
    }

    update() {
    }

    open() {
        if (this.anims.currentAnim.key !== 'chest-closed') {
            return 0;
        }
        this.play('chest-open');
        return Phaser.Math.Between(50, 200);
    }

    static createChestAnims = (anims: Phaser.Animations.AnimationManager) => {
        anims.create({
            key: 'chest-open',
            frames: anims.generateFrameNames('treasure', { start: 0, end: 2, prefix: 'chest_empty_open_anim_f' }),
            frameRate: 5
        });

        anims.create({
            key: 'chest-closed',
            frames: [{key: 'treasure', frame: 'chest_empty_open_anim_f0'}],
        });

    }
}