import Phaser from 'phaser'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune;
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {

    private healthState: HealthState = HealthState.IDLE;
    private damageTime: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.anims.play('faune-idle-down');

    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        if (!cursors) {
            return;
        }

        let speed = 100;

        if (cursors.left.isDown) {
            this.anims.play('faune-run-side', true);
            this.setVelocity(-speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if (cursors.right.isDown) {
            this.anims.play('faune-run-side', true);
            this.setVelocity(speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (cursors.up.isDown) {
            this.anims.play('faune-run-up', true);
            this.setVelocity(0, -speed);
        } else if (cursors.down.isDown) {
            this.anims.play('faune-run-down', true);
            this.setVelocity(0, speed);
        } else {
            let parts = this.anims.currentAnim.key.split('-');
            parts[1] = 'idle';
            this.setVelocity(0, 0);
            this.anims.play(parts.join('-'));
        }
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        this.setVelocity(dir.x, dir.y);
        this.setTint(0xff0000);
        this.healthState = HealthState.DAMAGE;
        this.damageTime = 0;
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        
        switch (this.healthState) {
            case HealthState.IDLE:
                break;
            case HealthState.DAMAGE:
                this.damageTime += dt;
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                }
                break;


        }
    }

    static createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
        anims.create({
            key: 'faune-idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3' }]
        });

        anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3' }]
        });

        anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3' }]
        });

        anims.create({
            key: 'faune-run-down',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-' }),
            repeat: -1,
            frameRate: 15
        });

        anims.create({
            key: 'faune-run-up',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-' }),
            repeat: -1,
            frameRate: 15
        });

        anims.create({
            key: 'faune-run-side',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-' }),
            repeat: -1,
            frameRate: 15
        });
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    let sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.7);
    sprite.setOrigin(0.5, 0.4);
    return sprite;
})